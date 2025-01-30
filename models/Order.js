import mongoose from 'mongoose'


const orderSchema = new mongoose.Schema({
    customerDetail: [
        {
            customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            customerName: { type: String, required: true },
            phoneNumber: { type: Number, required: true },
            cityName: { type: String, required: true }
        }
    ],
    merchantDetail: [
        {
            merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            merchantName: { type: String, required: true }
        }
    ],
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    kebelaAddress: { type: String, required: true},
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Completed', 'Refunding'], required: true },
    orderDate: { type: Date, default: Date.now }
});
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
