import mongoose from "mongoose";
const DELIVERY_RULE_ENUM = ["flat", "per item", "weight"];

const productSchema = new mongoose.Schema({
    merchantDetail: [
        {
            merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            merchantName: { type: String, required: true },
            merchantEmail:{ 
                unique: true, 
                required: true, 
                type: String, 
                validate: { 
                    validator: (v) => /^\S+@\S+\.\S+$/.test(v), 
                    message: props => props.value + ' is not a valid email!' 
                } 
            },
        }
    ],
    productName: { type: String, required: true },
    category: [
        {
            categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
            categoryName: { type: String, required: true }
        }
    ],
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    banned: { type: Boolean, default: false },
    bannedBy: { type: String, default: null },
    review: [
        {
            customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            comment: { type: String, required: true },
            rating: { type: Number, min: 1, max: 5, required: true },
            createdDate: { type: Date, default: Date.now }
        }
    ],
    deliveryRule: { type: String, enum: DELIVERY_RULE_ENUM, required: true },
    deliveryPrice: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false }, 
    trashDate: { 
      type: Date, 
      default: null, 
      expires: 30 * 24 * 60 * 60, 
    },
    location: { 
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
      },
},
    { timestamps: true }
);

// Index for geospatial queries (for location-based searches)
productSchema.index({ location: "2dsphere" });
const Product =  mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
