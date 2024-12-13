import mongoose from 'mongoose'
import Item from './Item'

const orderSchema = new mongoose.Schema({
    id: string,
    customerId: { type:string, required: true},
    sellerId: { type:string, required: true},
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: Item},
    totalPrice: float,
    status: {type:string, enum: [shipping, recieved]}

});
const Order = mongoose.models.Order || mongoose.models('Order', orderSchema);
export default Order;
