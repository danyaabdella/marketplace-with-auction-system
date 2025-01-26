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

export default Product;
