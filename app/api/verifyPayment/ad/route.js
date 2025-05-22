import { NextResponse } from "next/server";
import Advertisement from "@/models/Advertisement";
import { connectToDB } from "@/libs/functions";

export async function GET(req) {
  await connectToDB();

  const chapaKey = process.env.CHAPA_SECRET_KEY;
  if (!chapaKey) {
    console.error("Chapa secret key missing");
    return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const tx_ref = searchParams.get("tx_ref");
    const adId = searchParams.get("adId");

    console.log("VerifyPayment request params:", { tx_ref, adId });

    if (!tx_ref || !adId) {
      return NextResponse.json({ message: "Missing tx_ref or adId" }, { status: 400 });
    }

    // Verify advertisement exists
    const advertisement = await Advertisement.findById(adId);
    if (!advertisement) {
      console.error("Advertisement not found:", adId);
      return NextResponse.json({ message: "Advertisement not found" }, { status: 404 });
    }

    // Check if payment is already processed
    if (advertisement.paymentStatus !== "PENDING") {
      console.log("Payment already processed:", {
        adId,
        paymentStatus: advertisement.paymentStatus,
      });
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/products?status=${
          advertisement.paymentStatus === "PAID" ? "success" : "failed"
        }`
      );
    }

    // Verify payment with Chapa
    const chapaResponse = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${chapaKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await chapaResponse.json();
    console.log("Chapa verify response:", {
      status: chapaResponse.status,
      ok: chapaResponse.ok,
      data,
    });

    if (!chapaResponse.ok || data.status !== "success") {
      console.error("Chapa verification failed:", {
        status: chapaResponse.status,
        message: data.message || "Unknown error",
      });
      await Advertisement.findByIdAndUpdate(adId, {
        paymentStatus: "FAILED",
        rejectionReason: { reason: "Payment verification failed", description: data.message || "Unknown error" },
      });
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/products?status=failed`
      );
    }

    // Payment verified successfully
    await Advertisement.findByIdAndUpdate(adId, {
      paymentStatus: "PAID",
      approvalStatus: "PENDING", // Still pending admin approval
      tx_ref,
    });

    console.log("Payment verified successfully:", { adId, tx_ref });

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/products?status=success`
    );
  } catch (error) {
    console.error("VerifyPayment error:", error);
    if (adId) {
      await Advertisement.findByIdAndUpdate(adId, {
        paymentStatus: "FAILED",
        rejectionReason: { reason: "Server error", description: error.message },
      });
    }
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}