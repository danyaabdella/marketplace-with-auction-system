import { userInfo } from '@/libs/functions';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function PUT(req) {
    try {
        // Retrieve the session user
        const sessionUser = await userInfo(req);
        const body = await req.json();

        if (!sessionUser) {
            return NextResponse.json({ error: "Unauthorized: User not found" }, { status: 401 });
        }

        if (sessionUser.isBanned || sessionUser.isDeleted) {
            return NextResponse.json({ error: "Your account is either banned or deleted, and you cannot update an order." }, { status: 400 });
        }

        const { _id, reason } = body;

        if (!_id) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        const order = await Order.findById(_id);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Update the payment status to "Pending Refund" only if the customer is making the request
        if (order.customerDetail.customerId.toString() === sessionUser._id.toString()) {
            order.paymentStatus = "Pending Refund";
            order.refundReason = reason;
        } else {
            return NextResponse.json({ error: "You are not authorized to request a refund for this order." }, { status: 403 });
        }

        // Save the updated order
        await order.save();

        return NextResponse.json({ message: "Your refund is being processed. Please wait until it is approved by the admin.", order }, { status: 200 });

    } catch (error) {
        console.error("Error updating payment status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
