import { NextResponse } from "next/server";

import Order from "@/models/Order";
import { userInfo } from "@/libs/functions";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body; // Extract the user ID
    const sessionUser = await User.findById(userId);
    console.log("Body: ", body);
    console.log("User: ", sessionUser);

    if (!sessionUser) {
      return new Response(JSON.stringify({ error: "Unauthorized: User not found" }), { status: 401 });
    }

    if (sessionUser.isBanned || sessionUser.isDeleted) {
      return new Response(JSON.stringify({ error: "Your account is either banned or deleted, and you cannot place an order." }), { status: 400 });
    }

    const customerDetail = body.customerDetail || {
      customerId: sessionUser._id,
      customerName: sessionUser.fullName,
      phoneNumber: sessionUser.phoneNumber,
      customerEmail: sessionUser.email,
      address: {
        state: sessionUser.stateName,
        city: sessionUser.cityName,
      },
    };

    if (!customerDetail.customerId || !customerDetail.customerName || !customerDetail.phoneNumber || !customerDetail.customerEmail || !customerDetail.address.state || !customerDetail.address.city) {
      return new Response(JSON.stringify({ error: "Customer details are incomplete" }), { status: 400 });
    }

    const newOrder = new Order({
      customerDetail,
      merchantDetail: body.merchantDetail,
      products: body.products,
      totalPrice: body.totalPrice,
      status: body.status || "Pending",
      paymentStatus: body.paymentStatus || "Pending",
      transactionRef: body.transactionRef,
      orderDate: new Date(),
    });

    await newOrder.save();

    return new Response(JSON.stringify({ message: "Order created successfully", order: newOrder }), { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
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

        const { _id, customerDetail, status, paymentStatus } = body;

        if (!_id) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        // Fetch the order
        const order = await Order.findById(_id);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Function to handle customer-like updates (used for both customers and merchants acting as customers)
        const handleCustomerUpdates = () => {
            if (order.customerDetail.customerId.toString() !== sessionUser._id.toString()) {
                return NextResponse.json({ error: "Unauthorized: You can only update your own orders" }, { status: 403 });
            }

            // Prevent updates if order is dispatched
            if (customerDetail && order.status === "Dispatched") {
                return NextResponse.json({ error: "Order already Dispatched. Please contact the Merchant." }, { status: 400 });
            }

            // Allowed status updates
            if (status === "Received") {
                order.status = "Received";
            }

            if (paymentStatus === "Paid") {
                order.paymentStatus = "Paid";
            }

            if (status && !allowedCustomerStatuses.includes(status)) {
                return NextResponse.json({ error: `Invalid status update. Allowed: ${allowedCustomerStatuses.join(", ")}` }, { status: 400 });
            }

            // Handle customerDetail update
            if (customerDetail && order.status === "Pending") {
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

            return null; // No error, proceed with updates
        };

        // Customer Role - Allow updating customer details & specific statuses
        const allowedCustomerStatuses = ['Received'];

        if (sessionUser.role === "customer") {
            const errorResponse = handleCustomerUpdates();
            if (errorResponse) return errorResponse;
        }

        // Merchant Role - Allow updates based on the relationship with customer/merchant
        else if (sessionUser.role === "merchant") {
            if (order.customerDetail.customerId.toString() === sessionUser._id.toString()) {
                // If the merchant ID matches the customer ID, allow updating like a customer
                const errorResponse = handleCustomerUpdates();
                if (errorResponse) return errorResponse;
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

// export async function PUT(req) {
//     try {
//         const sessionUser = await userInfo();
//         const body = await req.json();

//         if (!sessionUser) {
//             return NextResponse.json({ error: "Unauthorized: User not found" }, { status: 401 });
//         }

//         if (sessionUser.isBanned || sessionUser.isDeleted) {
//             return NextResponse.json({ error: "Your account is either banned or deleted, and you cannot update an order." }, { status: 400 });
//         }

//         const { _id, customerDetail, status, paymentStatus } = body;

//         if (!_id) {
//             return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
//         }

//         const order = await Order.findById(_id);

//         if (!order) {
//             return NextResponse.json({ error: "Order not found" }, { status: 404 });
//         }

//         if (sessionUser.role === "customer" || (sessionUser.role === "merchant" && order.customerDetail.customerId.toString() === sessionUser._id.toString())) {
//             if (customerDetail) {
//                 order.customerDetail = {
//                     ...order.customerDetail,
//                     customerName: customerDetail.customerName || order.customerDetail.customerName,
//                     phoneNumber: customerDetail.phoneNumber || order.customerDetail.phoneNumber,
//                     customerEmail: customerDetail.customerEmail || order.customerDetail.customerEmail,
//                     address: {
//                         state: customerDetail.address?.state || order.customerDetail.address.state,
//                         city: customerDetail.address?.city || order.customerDetail.address.city,
//                     }
//                 };
//             }

//             if (status === "Received") {
//                 order.status = "Received";
//             }

//             if (paymentStatus === "Paid") {
//                 order.paymentStatus = "Paid";
//             }
//         } else if (sessionUser.role === "merchant" && order.merchantDetail.merchantId.toString() === sessionUser._id.toString()) {
//             if (status === "Dispatched") {
//                 order.status = "Dispatched";
//             } else {
//                 return NextResponse.json({ error: "Merchants can only update status to 'Dispatched'" }, { status: 400 });
//             }
//         } else {
//             return NextResponse.json({ error: "Unauthorized: You cannot update this order" }, { status: 403 });
//         }

//         await order.save();

//         return NextResponse.json({ message: "Order updated successfully", order }, { status: 200 });
//     } catch (error) {
//         console.error("Error updating order:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }


