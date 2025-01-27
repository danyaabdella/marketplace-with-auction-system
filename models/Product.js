import mongoose, { Schema } from "mongoose";

const DELIVERY_RULE_ENUM = ["flat", "per item", "weight"];

const ReviewSchema = new Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    createdDate: { type: Date, default: Date.now },
    user: {
      name: { type: String },
      email: { type: String },
      image: { type: String },
    },
  },
  { timestamps: true }
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    sellerEmail: { type: String, required: true },
    banned: { type: Boolean, default: false },
    bannedBy: { type: String, default: null },
    deliveryPrice: { type: Number, required: true },
    deliveryRule: { type: String, enum: DELIVERY_RULE_ENUM, required: true },
    images: { type: [String], default: [] },
    reviews: [ReviewSchema],
    isDeleted: { type: Boolean, default: false }, 
    trashDate: { 
      type: Date, 
      default: null, 
      expires: 30 * 60 * 60 * 60, // Automatically delete after 30 days
    },
    location: { 
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }
    },
  },
  { timestamps: true }
);

// Index for geospatial queries (for location-based searches)
ProductSchema.index({ location: "2dsphere" });

// Create the Product model
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

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
            categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
            categoryName: { type: String, required: true }
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
>>>>>>> f68e91ea46010dbc916d322a59641660eeee627c:marketplace-with-auction/models/Product.js
export default Product;
