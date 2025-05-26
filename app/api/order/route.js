import { NextResponse } from "next/server";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { connectToDB } from "@/libs/functions";

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Parse request body
    const body = await req.json();
    const { userId, merchantId, products = [], auction, transactionRef, total, status, paymentStatus, chapaRef, location } = body;

    // Validate userId and fetch user
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const sessionUser = await User.findById(userId);
    if (
      !sessionUser ||
      sessionUser.isBanned ||
      sessionUser.isDeleted ||
      !sessionUser.isEmailVerified
    ) {
      return NextResponse.json({ error: "Unauthorized or invalid user" }, { status: 401 });
    }

    // Build customerDetail, filling missing fields from User schema
    const customerDetail = {
      customerId: sessionUser._id.toString(),
      customerName: body.customerDetail?.customerName || sessionUser.fullName,
      phoneNumber: body.customerDetail?.phoneNumber || sessionUser.phoneNumber || "",
      customerEmail: body.customerDetail?.customerEmail || sessionUser.email,
      address: {
        state: body.customerDetail?.stateName || sessionUser.stateName || "",
        city: body.customerDetail?.cityName || sessionUser.cityName || "",
      },
    };

    // Validate customerDetail (allow empty strings for non-required fields)
    if (
      !customerDetail.customerId ||
      !customerDetail.customerName ||
      !customerDetail.customerEmail
    ) {
      return NextResponse.json(
        { error: "Critical customer details (ID, name, or email) are missing" },
        { status: 400 }
      );
    }

    // Validate products or auction
    if (products.length === 0 && !auction) {
      return NextResponse.json(
        { error: "Order must contain either products or an auction" },
        { status: 400 }
      );
    }

    // Validate and update product quantities
    for (const orderProduct of products) {
      const { productId, quantity } = orderProduct;
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${productId} not found` },
          { status: 404 }
        );
      }

      if (product.quantity < quantity) {
        return NextResponse.json(
          { error: `Insufficient quantity for product: ${product.productName}` },
          { status: 400 }
        );
      }

      product.quantity -= quantity;
      product.soldQuantity += quantity;
      await product.save();
    }

    // Validate transaction reference
    if (!transactionRef) {
      return NextResponse.json(
        { error: "Transaction reference is required" },
        { status: 400 }
      );
    }

    // Validate location coordinates
    const orderLocation = {
      type: "Point",
      coordinates: location?.coordinates || [],
    };
    if (!orderLocation.coordinates.length) {
      return NextResponse.json(
        { error: "Location coordinates are required" },
        { status: 400 }
      );
    }

    // Fetch and validate merchant details
    if (!merchantId) {
      return NextResponse.json({ error: "Merchant ID is required" }, { status: 400 });
    }

    const merchantUser = await User.findById("68323a2e41ede2167f7c03e2");

    const merchantDetail = {
      merchantId: merchantUser._id.toString(),
      merchantName: merchantUser.fullName,
      merchantEmail: merchantUser.email,
      phoneNumber: merchantUser.phoneNumber || "",
      account_name: merchantUser.account_name || "",
      account_number: merchantUser.account_number || "",
      bank_code: merchantUser.bank_code || "",
    };

    // Validate merchantDetail (required fields for merchants)
    if (
      !merchantDetail.merchantId ||
      !merchantDetail.merchantName ||
      !merchantDetail.merchantEmail ||
      !merchantDetail.account_name ||
      !merchantDetail.account_number ||
      !merchantDetail.bank_code
    ) {
      return NextResponse.json(
        { error: "Critical merchant details are missing" },
        { status: 400 }
      );
    }

    // Build auction object if provided
    const auctionData = auction
      ? {
          auctionId: auction.auctionId,
          delivery: auction.delivery,
          deliveryPrice: auction.deliveryPrice,
        }
      : null;

    // Create new order
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
      auction: auctionData,
      totalPrice: total || 0,
      status: status || "Pending",
      paymentStatus: paymentStatus || "Pending",
      transactionRef,
      chapaRef: paymentStatus === "Paid" ? chapaRef : undefined,
      location: orderLocation,
    });

    await newOrder.save();

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error.message, error.stack);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
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
