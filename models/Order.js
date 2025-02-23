import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerDetail: {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        customerName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        customerEmail: { type: String, required: true },
        address: {
            state: { type: String, required: true },
            city: { type: String, required: true }
        }       
    },
    merchantDetail: {
        merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        merchantName: { type: String, required: true },
        merchantEmail: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        account_name: { type: String, required: true },
        account_number: { type: String, required: true },
        merchantRefernce: { type: String, required: false, default: null },
        bank_code: { type: String, required: true },
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            productName: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            delivery: { type: String, enum: ['FLAT', 'PERPIECS', 'PERKG', 'FREE'], required: true },
            deliveryPrice: { type: Number, required: true }
        },
    ],
    auction: {
        auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        delivery: { type: String, enum: ['PAID', 'FREE'], required: true },
        deliveryPrice: { type: Number, required: true }
    },
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Dispatched', 'Received'], 
        default: 'Pending' 
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Paid To Merchant', 'Pending Refund', 'Refunded'], 
        default: 'Pending' 
    },
    transactionRef: { type: String, required: true }, 
    orderDate: { type: Date, default: Date.now },
    refundReason: { type: String, required: false }
});

// Custom validation to ensure mutual exclusivity
orderSchema.path('products').validate(function (value) {
    if (value.length > 0 && this.auction) {
        return false; // Cannot have both products and auction
    }
    return true;
}, 'Order cannot have both products and auction at the same time.');

orderSchema.path('auction').validate(function (value) {
    if (value && this.products.length > 0) {
        return false; // Cannot have both products and auction
    }
    return true;
}, 'Order cannot have both products and auction at the same time.');

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
