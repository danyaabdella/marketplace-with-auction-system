import Product from "@/models/Product";
import { connectToDB } from "@/libs/functions";

export async function GET(req) {
    await connectToDB();

    const url = new URL(req.url);
    const radius = url.searchParams.get("radius") || 20000; // Default radius to 20 km if not provided
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

    // Apply filters based on query parameters
    if (phrase) {
        filter.$or = [
            { productName: { $regex: phrase, $options: "i" } },
            { description: { $regex: phrase, $options: "i" } }
        ];
    }
    if (categoryId) filter["category.categoryId"] = categoryId;
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
    if (minAvgReview || maxAvgReview) {
        filter.averageRating = {};
        if (minAvgReview) filter.averageRating.$gte = parseFloat(minAvgReview);
        if (maxAvgReview) filter.averageRating.$lte = parseFloat(maxAvgReview);
    }

    let aggregationSteps = [];

    // Apply average rating calculation if needed
    if (minAvgReview || maxAvgReview) {
        aggregationSteps.push({
            $addFields: {
                averageRating: { $avg: "$review.rating" } // Calculate average rating
            }
        });
    }

    // Apply filters without location-based check
    aggregationSteps.push({ $match: filter });

    // Apply location-based filtering at the end if center is provided
    if (center) {
        const [lat, lng] = center.split("-").map(coord => parseFloat(coord));
        if (!isNaN(lat) && !isNaN(lng)) {
            aggregationSteps.push({
                $geoNear: {
                    near: { type: "Point", coordinates: [lng, lat] },
                    distanceField: "distance",
                    maxDistance: parseInt(radius), // Apply radius
                    spherical: true,
                    query: {} // No additional filters here, as they are already applied
                }
            });
        }
    }

    // Execute the aggregation pipeline
    const products = await Product.aggregate(aggregationSteps);

    return new Response(JSON.stringify({ products }), { status: 200 });
}