import { connectToDB } from '@/libs/functions';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY; // Store your Chapa secret key in environment variables

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const tx_ref = searchParams.get('tx_ref');

        // Validate the transaction reference
        if (!tx_ref) {
            return NextResponse.json({ message: "Transaction reference (tx_ref) is required" }, { status: 400 });
        }

        // Make a request to Chapa's Verify Transaction endpoint
        const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        // Handle Chapa's response
        if (result.status === "success") {
            await connectToDB();
            const order = await Order.findOne({ transactionRef: tx_ref });
            order.paymentStatus = "Paid";
            await order.save();
            console.log("order: ", order);
            return NextResponse.json({ message: "Payment details", data: result.data }, { status: 200 });
        } else {
            return NextResponse.json({ message: result.message, status: "failed", data: null }, { status: 404 });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}