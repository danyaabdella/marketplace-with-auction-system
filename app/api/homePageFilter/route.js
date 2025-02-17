import Product from "@/models/Product";
import { connectToDB } from "@/libs/functions";

export async function GET(req) {
    await connectToDB();

    const url = new URL(req.url);
    const type = url.searchParams.get("type"); // Determines which products to fetch
    const center = url.searchParams.get("center"); // Expected format: "lat-lng"
    const radius = 20000; 

    let filter = {
        isBanned: { $ne: true },
        isDeleted: { $ne: true }
    };

    let sort = {};
    let limit = 10;
    let aggregationSteps = [];

    // Apply product type filters
    switch (type) {
        case "bestSellers":
            sort = { soldQuantity: -1 };
            break;
        case "latestProducts":
            sort = { createdAt: -1 };
            break;
        case "topRated":
            filter["review.rating"] = { $gte: 4 };
            sort = { "review.rating": -1 };
            break;
        default:
            return new Response(JSON.stringify({ error: "Invalid type parameter" }), { status: 400 });
    }

    // Apply location-based filtering if center and radius are provided
    if (center) {
        console.log("Center: ", center)
        const [lat, lng] = center.split("-").map(coord => parseFloat(coord));
        if (!isNaN(lat) && !isNaN(lng)) {
            aggregationSteps.push({
                $geoNear: {
                    near: { type: "Point", coordinates: [lng, lat] },
                    distanceField: "distance",
                    maxDistance: parseInt(radius), // Use the default 20 km radius if no radius is provided
                    spherical: true,
                    query: filter
                }
            });
        }
    } else {
        aggregationSteps.push({ $match: filter });
    }

    // Apply sorting based on product type
    aggregationSteps.push({ $sort: sort }, { $limit: limit });

    const products = await Product.aggregate(aggregationSteps);
    return new Response(JSON.stringify({ products }), { status: 200 });
}
