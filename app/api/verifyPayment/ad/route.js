import { NextResponse } from "next/server";
import Advertisement from "@/models/Advertisement";
import { connectToDB } from "@/libs/functions";
import mongoose from "mongoose";

export async function GET(req) {
  await connectToDB();

  const chapaKey = process.env.CHAPA_SECRET_KEY;
  if (!chapaKey) {
    console.error("Chapa secret key missing");
    return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
  }

  let adId;
  try {
    const { searchParams } = new URL(req.url);
    const tx_ref = searchParams.get("tx_ref");
    adId = searchParams.get("adId");

    console.log("VerifyPayment request params:", { tx_ref, adId });

    if (!tx_ref || !adId) {
      return NextResponse.json({ message: "Missing tx_ref or adId" }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(adId)) {
      return NextResponse.json({ message: "Invalid adId format" }, { status: 400 });
    }

    const advertisement = await Advertisement.findById(adId);
    if (!advertisement) {
      console.error("Advertisement not found:", adId);
      return NextResponse.json({ message: "Advertisement not found" }, { status: 404 });
    }

    if (advertisement.paymentStatus !== "PENDING") {
      return NextResponse.json(
        {
          message: "Payment already processed",
          status: advertisement.paymentStatus === "PAID" ? "success" : "failed",
        },
        { status: 200 }
      );
    }

    const chapaResponse = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${chapaKey}`,
        "Content-Type": "application/json",
      },
    });

    const contentType = chapaResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Chapa response is not JSON:", {
        status: chapaResponse.status,
        headers: Object.fromEntries(chapaResponse.headers.entries()),
      });
      throw new Error("Unexpected response format from Chapa");
    }

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
        rejectionReason: {
          reason: "Payment verification failed",
          description: data.message || "Unknown error",
        },
      });
      return NextResponse.json(
        { message: "Payment verification failed", status: "failed" },
        { status: 400 }
      );
    }

    await Advertisement.findByIdAndUpdate(adId, {
      paymentStatus: "PAID",
      approvalStatus: "PENDING",
      tx_ref,
    });

    console.log("Payment verified successfully:", { adId, tx_ref });

    return NextResponse.json(
      { message: "Payment verified successfully", status: "success" },
      { status: 200 }
    );
  } catch (error) {
    console.error("VerifyPayment error:", error.message, error.stack);
    if (adId && mongoose.isValidObjectId(adId)) {
      await Advertisement.findByIdAndUpdate(adId, {
        paymentStatus: "FAILED",
        rejectionReason: { reason: "Server error", description: error.message },
      });
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message, status: "error" },
      { status: 500 }
    );
  }
}