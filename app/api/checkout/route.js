import { userInfo } from "@/libs/functions";

const RETURN_URL = "http://localhost:3000/order/checking";
const CHAPA_SECRET_KEY = "CHASECK_TEST-s6oBbGS04bRkcXLT7P6x2do2EKcCXfJ6";

export async function POST(req) {
  try {
    // Parse request body
    const body = await req.json();
    const { amount, tx_ref } = body;

    // Validate required fields
    if (!amount || !tx_ref) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Fetch user information
    const user = await userInfo();

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not authenticated" }),
        { status: 401 }
      );
    }

    let email = user?.email ? user.email.toLowerCase() : null;

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error("Invalid or missing email:", email);
      return new Response(
        JSON.stringify({ message: "Invalid email format" }),
        { status: 400 }
      );
    }

    // Extract first name, last name, and phone number from user data
    const fullName = user.fullName.trim().split(" ");
    const first_name = fullName[0] || "Unknown";
    const last_name = fullName.slice(1).join(" ") || "Unknown";
    const phone_number = user.phoneNumber || "";

    if (!phone_number) {
      return new Response(
        JSON.stringify({ message: "User phone number is missing" }),
        { status: 400 }
      );
    }

    // Construct request body
    const requestBody = {
      amount,
      currency: "ETB",
      email,
      first_name,
      last_name,
      phone_number,
      tx_ref,
      callback_url: "https://yourdomain.com/api/callback", // Replace with actual callback URL
      return_url: RETURN_URL,
      customization: {
        title: "Order Payment",
        description: "Pay for your selected items",
      },
    };

    console.log("Chapa Request Body:", JSON.stringify(requestBody, null, 2));

    // Chapa API request
    const chapaResponse = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!chapaResponse.ok) {
      const errorDetails = await chapaResponse.text();
      console.error("Chapa API Error:", errorDetails);
      return new Response(
        JSON.stringify({ message: "Chapa API error", details: errorDetails }),
        { status: 400 }
      );
    }

    const data = await chapaResponse.json();
    console.log("Chapa Response Data:", data);

    if (data.status === "success") {
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
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
