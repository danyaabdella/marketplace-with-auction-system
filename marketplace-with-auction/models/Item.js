import mongoose from "mongoose";
import User from "./User";

const itemSchema = new mongoose.Schema({
    id: string,
    itemCategory: string,
    itemName: string,
    price: float,
    quantity: Number,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    images: [{ type: string}],
    reviews:[{
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        comment: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        createdDate: { type: Date, default: Date.now }
    }]
})
const Item = mongoose.model.Item || mongoose.models('Item',itemSchema);
export default Item;