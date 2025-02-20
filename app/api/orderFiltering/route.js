import { userInfo } from "@/libs/functions";
import Order from "@/models/Order";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionUser = await userInfo();

        if (!sessionUser) {
            return new Response(JSON.stringify({ success: false, message: "Unauthorized: User not found" }), { status: 401 });
        }

        // Initialize filter object
        let filter = {};

        // Determine the role of the user
        const userRole = sessionUser.role;

        // Apply filtering based on role and parameters
        const myOrders = searchParams.get('myOrders');

        // If the user is a merchant
        if (userRole === 'merchant') {
            if (myOrders) {
                // If "myOrders" is appended, filter by customerId (to get orders made by this merchant's customers)
                filter["customerDetail.customerId"] = sessionUser._id;
            } else {
                // If no "myOrders" flag, filter by merchantId (to get orders where this merchant is selling)
                filter["merchantDetail.merchantId"] = sessionUser._id;
            }
        }
        // If the user is a customer
        else if (userRole === 'customer') {
            // If the user is a customer, always filter by customerId
            filter["customerDetail.customerId"] = sessionUser._id;
        }

        // Apply other optional filters
        const status = searchParams.get('status');
        const delivery = searchParams.get('delivery');
        const phoneNumber = searchParams.get('phoneNumber');
        const customerEmail = searchParams.get('customerEmail');
        const state = searchParams.get('state');
        const city = searchParams.get('city');
        const customerId = searchParams.get('customerId');
        const totalPrice = searchParams.get('totalPrice');
        const orderDate = searchParams.get('orderDate');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const merchantName = searchParams.get('merchantName');
        const merchantEmail = searchParams.get('merchantEmail');

        // Apply status filter
        if (status) filter.status = status;

        // Apply merchant filtering based on merchant info (ID, name, email)
        if (merchantName) filter["merchantDetail.merchantName"] = merchantName;
        if (merchantEmail) filter["merchantDetail.merchantEmail"] = merchantEmail;

        // Apply price filter (minPrice, maxPrice)
        if (minPrice) filter.totalPrice = { $gte: Number(minPrice) };
        if (maxPrice) {
            filter.totalPrice = filter.totalPrice || {};
            filter.totalPrice.$lte = Number(maxPrice);
        }

        // Apply date range filter (startDate, endDate)
        if (startDate || endDate) {
            filter.orderDate = {};
            if (startDate) filter.orderDate.$gte = new Date(startDate);
            if (endDate) filter.orderDate.$lte = new Date(endDate);
        }

        // Apply other filters like delivery, phone number, customer email, etc.
        if (delivery) filter["products.delivery"] = delivery;
        if (phoneNumber) filter["customerDetail.phoneNumber"] = phoneNumber;
        if (customerEmail) filter["customerDetail.customerEmail"] = customerEmail;
        if (state) filter["customerDetail.address.state"] = state;
        if (city) filter["customerDetail.address.city"] = city;
        if (customerId) filter["customerDetail.customerId"] = customerId; // Filter by customer ID if needed
        if (orderDate) filter.orderDate = new Date(orderDate);

        console.log("Filters: ", filter);
        // Fetch orders based on the filter
        const orders = await Order.find(filter);
        console.log("Orders: ", orders);

        return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
    }
}