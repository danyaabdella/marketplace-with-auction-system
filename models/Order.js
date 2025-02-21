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
        merchantRefernce: { type: String, required: false },
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
        }
    ],
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
    orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
