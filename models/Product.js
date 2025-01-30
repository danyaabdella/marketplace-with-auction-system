import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    merchantDetail: [
        {
            merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            merchantName: { type: String, required: true } 
        }
    ],
    productName: { type: String, required: true },
    category: [
        {
            categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
            categoryName: { type: String }
        }
    ],
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    productLocation: { type: Object },
    review: [
        {
            customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            comment: { type: String, required: true },
            rating: { type: Number, min: 1, max: 5, required: true },
            createdDate: { type: Date, default: Date.now }
        }
    ],
    delivery: { type: String, enum: ['Standard', 'Express'], required: true },
    deliveryPrice: { type: Number, required: true }
});

const Product =  mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
