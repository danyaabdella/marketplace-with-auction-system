import mongoose from 'mongoose'


const orderSchema = new mongoose.Schema({
    customerDetail: [
        {
            customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            customerName: { type: String, required: true },
            phoneNumber: { type: Number, required: true },
            address: { type: String, required: true }
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
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Completed', 'Cancelled'], required: true },
    orderDate: { type: Date, default: Date.now }
});
const Order = mongoose.models.Order || mongoose.models('Order', orderSchema);
export default Order;
