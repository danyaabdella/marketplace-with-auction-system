// app/api/contact-info/route.ts

import { NextResponse } from "next/server";
import { ContactInfo } from "@/models/About";
import { connectToDB } from "@/libs/functions";



// GET: Fetch the latest contact info
export async function GET() {
  try {
    await connectToDB();

    const contact = await ContactInfo.findOne().sort({ createdAt: -1 });

    if (!contact) {
      return NextResponse.json({ success: false, error: "No contact info found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch contact info" }, { status: 500 });
  }
}
