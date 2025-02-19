export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionUser = await userInfo();
        
        if (!sessionUser) {
            return new Response(JSON.stringify({ success: false, message: "Unauthorized: User not found" }), { status: 401 });
        }
        
        let filter = {};
        const myOrders = searchParams.get('myOrders');
        
        if (myOrders) {
            // If "myOrders" is present, treat it the same as a customer order
            filter["customerDetail.customerId"] = sessionUser._id;
        } else {
            // Otherwise, filter orders where the merchant is selling
            filter["merchantDetail.merchantId"] = sessionUser._id;
        }
        
        // Apply optional filters
        const status = searchParams.get('status');
        const delivery = searchParams.get('delivery');
        const phoneNumber = searchParams.get('phoneNumber');
        const customerEmail = searchParams.get('customerEmail');
        const state = searchParams.get('state');
        const city = searchParams.get('city');
        const customerId = searchParams.get('customerId');
        const totalPrice = searchParams.get('totalPrice');
        const orderDate = searchParams.get('orderDate');
        
        if (status) filter.status = status;
        if (delivery) filter["products.delivery"] = delivery;
        if (phoneNumber) filter["customerDetail.phoneNumber"] = phoneNumber;
        if (customerEmail) filter["customerDetail.customerEmail"] = customerEmail;
        if (state) filter["customerDetail.address.state"] = state;
        if (city) filter["customerDetail.address.city"] = city;
        if (customerId) filter["customerDetail.customerId"] = customerId;
        if (totalPrice) filter.totalPrice = Number(totalPrice);
        if (orderDate) filter.orderDate = new Date(orderDate);
        
        const orders = await Order.find(filter);
        
        return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
    }
}
