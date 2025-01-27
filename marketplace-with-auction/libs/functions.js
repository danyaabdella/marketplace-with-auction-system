import mongoose from "mongoose";
import Product from "@/models/Product";
import User from "@models/User";

 let isConnected = false;
// Middleware to check if the user is a verified merchant
export const isVerifiedMerchant = async (req, res, next) => {
    const userId = req.user.id; // Assuming user ID is available in req.user
    const user = await User.findById(userId);
    if (!user || !user.isVerified || user.role !== 'merchant') {
        return res.status(403).json({ message: 'Access denied. User is not a verified merchant.' });
    }
    next();
};

export async function connectToDataBase() {
    if (isConnected) {
      console.log("Using existing database connection");
      return;
    }
  
    try {
      await mongoose.connect(process.env.MONGO_URL);
  
      isConnected = true;
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Failed to connect to the database");
    }
  }
export const createProduct = async (req, res) => {
    const productData = req.body;
    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json(newProduct);
};

// GET: Fetch all products
export const fetchProducts = async (req, res) => {
    const products = await Product.find({ isDeleted: false });
    res.status(200).json(products);
};

// PUT: Update a product by ID
export const updateProduct = async (req, res) => {
    const { id } = req.query;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
};

// DELETE: Delete a product by ID
export const deleteProduct = async (req, res) => {
    const { id } = req.query;
    const deletedProduct = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
};
