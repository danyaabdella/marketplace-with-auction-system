import mongoose from "mongoose";
import Product from "@/models/Product";
import { connectToDB } from "@/libs/functions";

export async function GET(req) {
  await connectToDB();

  const url = new URL(req.url);
  const radius = 20000; // 20 KM
  const phrase = url.searchParams.get("phrase");
  const center = url.searchParams.get("center"); // Expected format: "lat-lng"
  const categoryId = url.searchParams.get("categoryId");
  const minPrice = url.searchParams.get("minPrice");
  const maxPrice = url.searchParams.get("maxPrice");
  const delivery = url.searchParams.get("delivery");
  const minDeliveryPrice = url.searchParams.get("minDeliveryPrice");
  const maxDeliveryPrice = url.searchParams.get("maxDeliveryPrice");
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");
  const productName = url.searchParams.get("productName");
  const maxQuantity = url.searchParams.get("maxQuantity");
  const minSoldQuantity = url.searchParams.get("minSoldQuantity");
  const maxSoldQuantity = url.searchParams.get("maxSoldQuantity");
  const minAvgReview = url.searchParams.get("minAvgReview");
  const maxAvgReview = url.searchParams.get("maxAvgReview");
  const page = parseInt(url.searchParams.get("page")) || 1;
  const limit = parseInt(url.searchParams.get("limit")) || 30;
  const skip = (page - 1) * limit;

  let filter = {
    isBanned: { $ne: true },
    isDeleted: { $ne: true },
  };

  // Add text search for phrase
  if (phrase) {
    filter.$text = { $search: phrase };
  }

  if (categoryId) filter["category.categoryId"] = new mongoose.Types.ObjectId(categoryId);
  if (minPrice) filter.price = { $gte: parseFloat(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
  if (delivery) filter.delivery = { $in: delivery.split(",") };
  if (minDeliveryPrice) filter.deliveryPrice = { $gte: parseFloat(minDeliveryPrice) };
  if (maxDeliveryPrice) filter.deliveryPrice = { ...filter.deliveryPrice, $lte: parseFloat(maxDeliveryPrice) };
  if (startDate) filter.createdAt = { $gte: new Date(startDate) };
  if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
  if (productName) filter.productName = { $regex: productName, $options: "i" };
  if (maxQuantity) filter.quantity = { $lte: parseInt(maxQuantity) };
  if (minSoldQuantity) filter.soldQuantity = { $gte: parseInt(minSoldQuantity) };
  if (maxSoldQuantity) filter.soldQuantity = { ...filter.soldQuantity, $lte: parseInt(maxSoldQuantity) };

  let aggregationSteps = [];

  if (center) {
    const coords = center.split("-");
    const lat = 25.7617; // Latitude from the product's location
    const lng = 80.1918; // Longitude from the product's location
    console.log("Center: ", center);

    aggregationSteps.push({
      $geoNear: {
        near: { type: "Point", coordinates: [lng, lat] },
        distanceField: "distance",
        maxDistance: radius,
        spherical: true,
        query: filter,
      },
    });
} else {
    aggregationSteps.push({ $match: filter });
}


  if (minAvgReview || maxAvgReview) {
    aggregationSteps.push(
      { $unwind: { path: "$review", preserveNullAndEmptyArrays: true } },
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
          averageRating: { $avg: "$review.rating" },
          totalReviews: { $sum: { $cond: [{ $ifNull: ["$review.rating", false] }, 1, 0] } },
        },
      },
      { $match: { totalReviews: { $gte: 1 } } },
      {
        $match: {
          ...(minAvgReview ? { averageRating: { $gte: parseFloat(minAvgReview) } } : {}),
          ...(maxAvgReview ? { averageRating: { $lte: parseFloat(maxAvgReview) } } : {}),
        },
      }
    );
  }

  // Add pagination and sorting
  aggregationSteps.push(
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: phrase ? { score: { $meta: "textScore" } } : { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
      },
    }
  );

  const result = await Product.aggregate(aggregationSteps);
  const products = result[0].data;
  const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
  console.log("Total data: ", result, products, total)

  return new Response(JSON.stringify({ products, total, page, limit }), { status: 200 });
}