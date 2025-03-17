import { v4 as uuidv4 } from 'uuid';  // Import uuid
import { checkSession, userInfo } from "@/libs/functions";

const CHAPA_SECRET_KEY = "CHASECK_TEST-s6oBbGS04bRkcXLT7P6x2do2EKcCXfJ6";

export async function POST(req) {
  try {
    const chapaKey = process.env.CHAPA_SECRET_KEY;
    const body = await req.json();
    const { amount, orderData } = body;

    const tx_ref = `tx_${uuidv4().split('-')[0]}`;
    
    if (!amount || !tx_ref) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const user = await userInfo();
    if (!user) {
      return new Response(JSON.stringify({ message: "User not authenticated" }), { status: 401 });
    }

    let email = user?.email ? user.email.toLowerCase() : null;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error("Invalid email:", email);
      return new Response(JSON.stringify({ message: "Invalid email format" }), { status: 400 });
    }

    const fullName = user.fullName.trim().split(" ");
    const first_name = fullName[0] || "Unknown";
    const last_name = fullName.slice(1).join(" ") || "Unknown";
    const phone_number = user.phoneNumber || "";

    if (!phone_number) {
      return new Response(JSON.stringify({ message: "User phone number is missing" }), { status: 400 });
    }

    const requestBody = {
      amount,
      currency: "ETB",
      email,
      first_name,
      last_name,
      phone_number,
      tx_ref,
      callback_url: "https://yourdomain.com/api/callback",
      return_url: `http://localhost:3000/order?${tx_ref}`,
      customization: {
        title: "Order Payment",
        description: "Pay for your selected items",
      },
    };

    const chapaResponse = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chapaKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!chapaResponse.ok) {
      const errorDetails = await chapaResponse.text();
      return new Response(JSON.stringify({ message: "Chapa API error", details: errorDetails }), { status: 400 });
    }

    const data = await chapaResponse.json();

    if (data.status === "success") {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"; 
    
      // Create order request
      const orderResponse = await fetch(`${baseUrl}/api/order`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}` // Pass the session token
        },
        body: JSON.stringify({ 
          ...orderData, 
          transactionRef: tx_ref, 
          totalPrice: amount,
          userId: user._id // Pass the user ID
        }),
      });
    
      if (!orderResponse.ok) {
        const orderError = await orderResponse.text();
        return new Response(
          JSON.stringify({ message: "Order creation failed", details: orderError }),
          { status: 400 }
        );
      }
    
      return new Response(
        JSON.stringify({ checkout_url: data.data.checkout_url }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: data.message }),
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
  }
}
