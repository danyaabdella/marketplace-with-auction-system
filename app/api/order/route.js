import { NextResponse } from "next/server";

import { userInfo } from "@/libs/functions";
import Order from "@/models/Order";

export async function POST(req) {
    try {
        const sessionUser = await userInfo(); // Get logged-in user details
        const body = await req.json(); // Parse request body

        if (!sessionUser) {
            return NextResponse.json({ error: "Unauthorized: User not found" }, { status: 401 });
        }
        // Check if user is banned or deleted
        if (sessionUser.isBanned || sessionUser.isDeleted) {
            return NextResponse.json({ error: "Your account is either banned or deleted, and you cannot place an order." }, { status: 400 });
        }

        // Extract customer details from request, fallback to session user if missing
        const customerDetail = body.customerDetail || {
            customerId: sessionUser._id, // Use correct session ID
            customerName: sessionUser.fullName, // Use correct session name
            phoneNumber: sessionUser.phoneNumber,
            customerEmail: sessionUser.email,
            address: {
                state: sessionUser.stateName,
                city: sessionUser.cityName
            }
        };

        // Ensure required fields exist
        if (!customerDetail.customerId || !customerDetail.customerName || !customerDetail.phoneNumber || !customerDetail.customerEmail || !customerDetail.address.state || !customerDetail.address.city) {
            return NextResponse.json({ error: "Customer details are incomplete" }, { status: 400 });
        }

        // Create new order
        const newOrder = new Order({
            customerDetail,
            merchantDetail: body.merchantDetail, // Assuming it's passed from client
            products: body.products,
            totalPrice: body.totalPrice,
            status: body.status || "Pending",
            transactionRef: body.transactionRef,
            orderDate: new Date()
        });

        // Save to database
        await newOrder.save();

        return NextResponse.json({ message: "Order created successfully", order: newOrder }, { status: 201 });

    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const sessionUser = await userInfo();
        const body = await req.json();

        if (!sessionUser) {
            return NextResponse.json({ error: "Unauthorized: User not found" }, { status: 401 });
        }

        // Check if user is banned or deleted
        if (sessionUser.isBanned || sessionUser.isDeleted) {
            return NextResponse.json({ error: "Your account is either banned or deleted, and you cannot update an order." }, { status: 400 });
        }

        const { _id, customerDetail, status } = body;

        if (!_id) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        // Fetch the order
        const order = await Order.findById(_id);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Customer Role - Allow updating customer details & specific statuses
        if (sessionUser.role === "customer") {
            if (order.customerDetail.customerId.toString() !== sessionUser._id.toString()) {
                return NextResponse.json({ error: "Unauthorized: You can only update your own orders" }, { status: 403 });
            }

            // Allowed status updates
            const allowedCustomerStatuses = ["Paid", "Received", "Pending Refund"];
            if (status && !allowedCustomerStatuses.includes(status)) {
                return NextResponse.json({ error: `Invalid status update. Allowed: ${allowedCustomerStatuses.join(", ")}` }, { status: 400 });
            }

            // Handle customerDetail update, retain previous value if not provided
            if (customerDetail) {
                order.customerDetail = {
                    ...order.customerDetail,
                    customerName: customerDetail.customerName || order.customerDetail.customerName,
                    phoneNumber: customerDetail.phoneNumber || order.customerDetail.phoneNumber,
                    customerEmail: customerDetail.customerEmail || order.customerDetail.customerEmail,
                    address: {
                        state: customerDetail.address?.state || order.customerDetail.address.state,
                        city: customerDetail.address?.city || order.customerDetail.address.city,
                    }
                };
            }

            // Update status if provided
            if (status) {
                order.status = status;
            }
        }

        // Merchant Role - Allow updates based on the relationship with customer/merchant
        else if (sessionUser.role === "merchant") {
            if (order.customerDetail.customerId.toString() === sessionUser._id.toString()) {
                // If the merchant ID matches the customer ID, allow updating like a customer
                // Allow updating customer details & specific statuses
                const allowedMerchantStatuses = ["Paid", "Received", "Pending Refund"];
                if (status && !allowedMerchantStatuses.includes(status)) {
                    return NextResponse.json({ error: `Invalid status update. Allowed: ${allowedMerchantStatuses.join(", ")}` }, { status: 400 });
                }

                // Handle customerDetail update
                if (customerDetail) {
                    order.customerDetail = {
                        ...order.customerDetail,
                        customerName: customerDetail.customerName || order.customerDetail.customerName,
                        phoneNumber: customerDetail.phoneNumber || order.customerDetail.phoneNumber,
                        customerEmail: customerDetail.customerEmail || order.customerDetail.customerEmail,
                        address: {
                            state: customerDetail.address?.state || order.customerDetail.address.state,
                            city: customerDetail.address?.city || order.customerDetail.address.city,
                        }
                    };
                }

                // Update status if provided
                if (status) {
                    order.status = status;
                }
            } else if (order.merchantDetail.merchantId.toString() === sessionUser._id.toString()) {
                // If the merchant ID matches the merchant detail, allow only status update to 'Dispatched'
                if (status !== "Dispatched") {
                    return NextResponse.json({ error: 'Merchants can only update status to "Dispatched"' }, { status: 400 });
                }
                order.status = "Dispatched";
            } else {
                return NextResponse.json({ error: "Unauthorized: You cannot update this order" }, { status: 403 });
            }
        }

        // Save the updated order
        await order.save();

        return NextResponse.json({ message: "Order updated successfully", order }, { status: 200 });

    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


