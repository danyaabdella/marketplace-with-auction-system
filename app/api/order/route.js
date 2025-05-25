import { NextResponse } from "next/server";

import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { userInfo } from "@/libs/functions";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, merchantId } = body;

    const sessionUser = await User.findById(userId);
    if (
      !sessionUser ||
      sessionUser.isBanned ||
      sessionUser.isDeleted ||
      !sessionUser.isEmailVerified
    ) {
      return new Response(
        JSON.stringify({ error: "Unauthorized or invalid user." }),
        { status: 401 }
      );
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

    if (
      !customerDetail.customerId ||
      !customerDetail.customerName ||
      !customerDetail.phoneNumber ||
      !customerDetail.customerEmail ||
      !customerDetail.address.state ||
      !customerDetail.address.city
    ) {
      return new Response(
        JSON.stringify({ error: "Customer details are incomplete" }),
        { status: 400 }
      );
    }

    const products = body.products || [];
    if (products.length === 0 && !body.auction) {
      return new Response(
        JSON.stringify({
          error: "Order must contain either products or an auction",
        }),
        { status: 400 }
      );
    }

    for (const orderProduct of products) {
      const { productId, quantity } = orderProduct;
      const product = await Product.findById(productId);
      if (!product) {
        return new Response(
          JSON.stringify({ error: `Product with ID ${productId} not found` }),
          { status: 404 }
        );
      }

      if (product.quantity < quantity) {
        return new Response(
          JSON.stringify({
            error: `Insufficient quantity for product: ${product.productName}`,
          }),
          { status: 400 }
        );
      }

      product.quantity -= quantity;
      product.soldQuantity += quantity;
      await product.save();
    }

    if (!body.transactionRef) {
      return new Response(
        JSON.stringify({ error: "Transaction reference is required" }),
        { status: 400 }
      );
    }

    const location = {
      type: "Point",
      coordinates: body.location?.coordinates || [],
    };

    if (!location.coordinates.length) {
      return new Response(
        JSON.stringify({ error: "Location coordinates are required" }),
        { status: 400 }
      );
    }

    const merchantUser = await User.findById("68323a2e41ede2167f7c03e2");
    if (!merchantUser) {
      return new Response(JSON.stringify({ error: "Merchant not found" }), {
        status: 404,
      });
    }

    const merchantDetail = {
      merchantId: merchantUser._id,
      merchantName: merchantUser.fullName,
      merchantEmail: merchantUser.email,
      phoneNumber: merchantUser.phoneNumber,
      account_name: merchantUser.account_name,
      account_number: merchantUser.account_number,
      bank_code: merchantUser.bank_code,
    };

    const auction = body.auction
      ? {
          auctionId: body.auction.auctionId,
          delivery: body.auction.delivery,
          deliveryPrice: body.auction.deliveryPrice,
        }
      : null;

    const newOrder = new Order({
      customerDetail,
      merchantDetail,
      products: products.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        quantity: p.quantity,
        price: p.price,
        delivery: p.deliveryType,
        deliveryPrice: p.deliveryPrice,
        categoryName: p.categoryName,
      })),
      auction,
      totalPrice: body.total || 0,
      status: body.status || "Pending",
      paymentStatus: body.paymentStatus || "Pending",
      transactionRef: body.transactionRef,
      chapaRef: body.paymentStatus === "Paid" ? body.chapaRef : undefined,
      location,
    });

    await newOrder.save();

    return new Response(
      JSON.stringify({
        message: "Order created successfully",
        order: newOrder,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const sessionUser = await userInfo(req);
    const body = await req.json();

    if (!sessionUser) {
      return NextResponse.json(
        { error: "Unauthorized: User not found" },
        { status: 401 }
      );
    }

    // Check if user is banned, deleted, or email not verified
    if (sessionUser.isBanned) {
      return NextResponse.json(
        { error: "Your account is banned, and you cannot update an order." },
        { status: 400 }
      );
    }

    if (sessionUser.isDeleted) {
      return NextResponse.json(
        { error: "Your account is deleted, and you cannot update an order." },
        { status: 400 }
      );
    }

    if (!sessionUser.isEmailVerified) {
      return NextResponse.json(
        {
          error: "Your email is not verified, and you cannot update an order.",
        },
        { status: 400 }
      );
    }

    const { _id, customerDetail, status, paymentStatus, chapaRef } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch the order
    const order = await Order.findById(_id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update chapaRef if provided
    if (chapaRef) {
      order.chapaRef = chapaRef;
    }

    // Function to handle customer-like updates (used for both customers and merchants acting as customers)
    const handleCustomerUpdates = () => {
      if (
        order.customerDetail.customerId.toString() !==
        sessionUser._id.toString()
      ) {
        return NextResponse.json(
          { error: "Unauthorized: You can only update your own orders" },
          { status: 403 }
        );
      }

      // Prevent updates if order is dispatched
      if (customerDetail && order.status === "Dispatched") {
        return NextResponse.json(
          { error: "Order already Dispatched. Please contact the Merchant." },
          { status: 400 }
        );
      }

      // Allowed status updates
      if (status === "Received") {
        order.status = "Received";
      }

      if (paymentStatus === "Paid") {
        order.paymentStatus = "Paid";
      }

      if (status && !allowedCustomerStatuses.includes(status)) {
        return NextResponse.json(
          {
            error: `Invalid status update. Allowed: ${allowedCustomerStatuses.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }

      // Handle customerDetail update
      if (customerDetail && order.status === "Pending") {
        order.customerDetail = {
          ...order.customerDetail,
          customerName:
            customerDetail.customerName || order.customerDetail.customerName,
          phoneNumber:
            customerDetail.phoneNumber || order.customerDetail.phoneNumber,
          customerEmail:
            customerDetail.customerEmail || order.customerDetail.customerEmail,
          address: {
            state:
              customerDetail.address?.state ||
              order.customerDetail.address.state,
            city:
              customerDetail.address?.city || order.customerDetail.address.city,
          },
        };
      }

      return null;
    };

    // Customer Role - Allow updating customer details & specific statuses
    const allowedCustomerStatuses = ["Received"];

    if (sessionUser.role === "customer") {
      const errorResponse = handleCustomerUpdates();
      if (errorResponse) return errorResponse;
    }

    // Merchant Role - Allow updates based on the relationship with customer/merchant
    else if (sessionUser.role === "merchant") {
      if (
        order.customerDetail.customerId.toString() ===
        sessionUser._id.toString()
      ) {
        // If the merchant ID matches the customer ID, allow updating like a customer
        const errorResponse = handleCustomerUpdates();
        if (errorResponse) return errorResponse;
      } else if (
        order.merchantDetail.merchantId.toString() ===
        sessionUser._id.toString()
      ) {
        // If the merchant ID matches the merchant detail, allow only status update to 'Dispatched'
        if (status !== "Dispatched") {
          return NextResponse.json(
            { error: 'Merchants can only update status to "Dispatched"' },
            { status: 400 }
          );
        }
        order.status = "Dispatched";
      } else {
        return NextResponse.json(
          { error: "Unauthorized: You cannot update this order" },
          { status: 403 }
        );
      }
    }

    // Save the updated order
    await order.save();

    return NextResponse.json(
      { message: "Order updated successfully", order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const sessionUser = await userInfo();
    const body = await req.json();
    const { _id } = body;

    if (!sessionUser) {
      return NextResponse.json(
        { error: "Unauthorized: User not found" },
        { status: 401 }
      );
    }

    if (!_id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(_id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (
      order.customerDetail.customerId.toString() !== sessionUser._id.toString()
    ) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own orders" },
        { status: 403 }
      );
    }

    // Restore product quantities
    for (const orderProduct of order.products) {
      const product = await Product.findById(orderProduct.productId);
      if (product) {
        product.quantity += orderProduct.quantity;
        product.soldQuantity -= orderProduct.quantity;
        await product.save();
      }
    }

    await Order.deleteOne({ _id });

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
