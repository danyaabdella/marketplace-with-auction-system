import Product from "@/models/Product";
import { connectToDB } from "@/libs/functions";

export async function GET(req) {
    await connectToDB();

    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const center = url.searchParams.get("center");
    const radius = parseInt(url.searchParams.get("radius")) || 10000; // Default to 10KM

    let filter = {
        isBanned: { $ne: true },
        isDeleted: { $ne: true }
    };

    let sort = {};
    let limit = 10;
    let aggregationSteps = [];

    switch (type) {
        case "bestSellers":
            sort = { soldQuantity: -1 };
            aggregationSteps.push({ $match: filter }, { $sort: sort }, { $limit: limit });
            break;

        case "latestProducts":
            sort = { createdAt: -1 };
            aggregationSteps.push({ $match: filter }, { $sort: sort }, { $limit: limit });
            break;

        case "topRated":
            aggregationSteps.push(
                { $match: filter },
                { $unwind: "$review" },
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
                        totalReviews: { $sum: 1 }
                    }
                },
                { $match: { totalReviews: { $gte: 1 }, averageRating: { $gte: 4 } } },
                { $sort: { averageRating: -1 } },
                { $limit: limit }
            );
            break;

        default:
            return new Response(JSON.stringify({ error: "Invalid type parameter" }), { status: 400 });
    }

    if (center) {
        const coords = center.split("-");
        const lat = parseFloat(coords[0]);
        const lng = parseFloat(coords[1]);
    
        aggregationSteps.unshift(  // Use unshift to add to the beginning
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [lng, lat] },
                    query: filter,
                    includeLocs: "location",
                    distanceField: "distance",
                    maxDistance: radius,
                    spherical: true
                }
            }
        );
    }

    aggregationSteps.push({ $sort: { createdAt: -1 } });

    const products = await Product.aggregate(aggregationSteps);
    return new Response(JSON.stringify({ products }), { status: 200 });
}
