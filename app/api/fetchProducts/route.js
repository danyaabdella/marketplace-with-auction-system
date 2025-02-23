import mongoose from "mongoose";

import Product from "@/models/Product";
import { connectToDB } from "@/libs/functions";

export async function GET(req) {
    await connectToDB();

    const url = new URL(req.url);
    const radius = 20000; // Default: 20km
    const phrase = url.searchParams.get("phrase");
    const center = url.searchParams.get("center"); // Expected format: "lat-lng"
    const categoryId = url.searchParams.get("categoryId");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const delivery = url.searchParams.get("delivery");
    const minDeliveryPrice = url.searchParams.get("minDeliveryPrice");
    const maxDeliveryPrice = url.searchParams.get("maxDeliveryPrice");
    const startDate = url.searchParams.get("startDate");
    const productName = url.searchParams.get("productName");
    const maxQuantity = url.searchParams.get("maxQuantity");
    const minSoldQuantity = url.searchParams.get("minSoldQuantity");
    const maxSoldQuantity = url.searchParams.get("maxSoldQuantity");
    const minAvgReview = url.searchParams.get("minAvgReview");
    const maxAvgReview = url.searchParams.get("maxAvgReview");

    let filter = {
        isBanned: { $ne: true },
        isDeleted: { $ne: true }
    };

    if (phrase) {
        const words = phrase.split(" "); // Split phrase into words
        filter.$or = words.flatMap(word => [
            { productName: { $regex: word, $options: "i" } },
            { description: { $regex: word, $options: "i" } },
            { "category.categoryName": { $regex: word, $options: "i" } },
            { "merchantDetail.merchantName": { $regex: word, $options: "i" } },
            { delivery: { $regex: word, $options: "i" } } // ✅ Now includes delivery
        ]);
    }    

    if (categoryId) filter["category.categoryId"] = new mongoose.Types.ObjectId(categoryId);
    console.log("Category ID: ", categoryId);
    if (minPrice) filter.price = { $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (delivery) filter.delivery = delivery;
    if (minDeliveryPrice) filter.deliveryPrice = { $gte: parseFloat(minDeliveryPrice) };
    if (maxDeliveryPrice) filter.deliveryPrice = { ...filter.deliveryPrice, $lte: parseFloat(maxDeliveryPrice) };
    if (startDate) filter.createdAt = { $gte: new Date(startDate) };
    if (productName) filter.productName = { $regex: productName, $options: "i" };
    if (maxQuantity) filter.quantity = { $lte: parseInt(maxQuantity) };
    if (minSoldQuantity) filter.soldQuantity = { $gte: parseInt(minSoldQuantity) };
    if (maxSoldQuantity) filter.soldQuantity = { ...filter.soldQuantity, $lte: parseInt(maxSoldQuantity) };

    let aggregationSteps = [];

    if (center) {
        const coords = center.split("-");
        const lat = parseFloat(coords[0]);
        const lng = parseFloat(coords[1]);

        aggregationSteps.push({
            $geoNear: {
                near: { type: "Point", coordinates: [lng, lat] },
                query: filter,
                distanceField: "distance",
                maxDistance: radius,
                spherical: true
            }
        });
    }

    if (minAvgReview || maxAvgReview) {
        aggregationSteps.push(
            { $unwind: { path: "$review", preserveNullAndEmptyArrays: true } }, // Ensure products with no reviews are included
            {
                $group: {
                    _id: "$_id",
                    productName: { $first: "$productName" },
                    merchantDetail: { $first: "$merchantDetail" },
                    category: { $first: "$category" },
                    price: { $first: "$price" },
                    quantity: { $first: "$quantity" },
                    description: { $first: "$description" },
                    images: { $first: "$images" },
                    location: { $first: "$location" },
                    delivery: { $first: "$delivery" },
                    deliveryPrice: { $first: "$deliveryPrice" },
                    soldQuantity: { $first: "$soldQuantity" },
                    createdAt: { $first: "$createdAt" },
                    averageRating: { $avg: "$review.rating" }, // Calculate the average rating
                    totalReviews: { $sum: { $cond: [{ $ifNull: ["$review.rating", false] }, 1, 0] } } // Count reviews properly
                }
            },
            { $match: { totalReviews: { $gte: 1 } } }, // Ensure only products with reviews are considered
            {
                $match: {
                    ...(minAvgReview ? { averageRating: { $gte: parseFloat(minAvgReview) } } : {}),
                    ...(maxAvgReview ? { averageRating: { $lte: parseFloat(maxAvgReview) } } : {})
                }
            }
        );
    }
    

    aggregationSteps.push({ $match: filter });
    aggregationSteps.push({ $sort: { createdAt: -1 } });

    const products = await Product.aggregate(aggregationSteps);

    return new Response(JSON.stringify({ products }), { status: 200 });
}
