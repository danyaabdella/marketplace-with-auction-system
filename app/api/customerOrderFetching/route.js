export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionUser = await userInfo();
        
        if (!sessionUser) {
            return new Response(JSON.stringify({ success: false, message: "Unauthorized: User not found" }), { status: 401 });
        }
        
        let filter = { "customerDetail.customerId": sessionUser._id };
        
        // Apply optional filters
        const status = searchParams.get('status');
        const delivery = searchParams.get('delivery');
        const phoneNumber = searchParams.get('phoneNumber');
        const customerEmail = searchParams.get('customerEmail');
        const state = searchParams.get('state');
        const city = searchParams.get('city');
        const orderDate = searchParams.get('orderDate');
        const merchantId = searchParams.get('merchantId');
        const merchantName = searchParams.get('merchantName');
        const merchantEmail = searchParams.get('merchantEmail');
        const merchantPhoneNumber = searchParams.get('merchantPhoneNumber');
        const totalPrice = searchParams.get('totalPrice');
        
        if (status) filter.status = status;
        if (delivery) filter["products.delivery"] = delivery;
        if (phoneNumber) filter["customerDetail.phoneNumber"] = phoneNumber;
        if (customerEmail) filter["customerDetail.customerEmail"] = customerEmail;
        if (state) filter["customerDetail.address.state"] = state;
        if (city) filter["customerDetail.address.city"] = city;
        if (orderDate) filter.orderDate = new Date(orderDate);
        if (merchantId) filter["merchantDetail.merchantId"] = merchantId;
        if (merchantName) filter["merchantDetail.merchantName"] = merchantName;
        if (merchantEmail) filter["merchantDetail.merchantEmail"] = merchantEmail;
        if (merchantPhoneNumber) filter["merchantDetail.phoneNumber"] = merchantPhoneNumber;
        if (totalPrice) filter.totalPrice = Number(totalPrice);
        
        const orders = await Order.find(filter);
        
        return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
    }
}
