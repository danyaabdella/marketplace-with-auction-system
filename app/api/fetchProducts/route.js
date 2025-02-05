import Product from "@/models/Product";
import { connectToDB } from "@/libs/functions";

export async function GET(req, res) {
    await connectToDB();

    const url = new URL(req.url);
    const radius = 50000;
    const phrase = url.searchParams.get("phrase");
    const bestSellers = url.searchParams.get("bestSeller");
    const latestProducts = url.searchParams.get("latestProduct");
    const popularProducts = url.searchParams.get("popularProduct");
    const center = url.searchParams.get("center");
    const topRated = url.searchParams.get("topRated");
    const categoryId = url.searchParams.get("categoryId");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    // const minQuantity = url.searchParams.get("minQuantity");
    // const maxQuantity = url.searchParams.get("maxQuantity");
    // const minSoldQuantity = url.searchParams.get("minSoldQuantity");
    // const maxSoldQuantity = url.searchParams.get("maxSoldQuantity");
    // const minAvgReview = url.searchParams.get("minAvgReview");
    // const maxAvgReview = url.searchParams.get("maxAvgReview");
    const delivery = url.searchParams.get("delivery");
    const minDeliveryPrice = url.searchParams.get("minDeliveryPrice");
    const maxDeliveryPrice = url.searchParams.get("maxDeliveryPrice");
    const startDate = url.searchParams.get("startDate");
    // const endDate = url.searchParams.get("endDate");

    // Basic filter to ensure products are not banned and not deleted
    let filter = {
        isBanned: { $ne: true },
        isDeleted: { $ne: true }
    };

    // Apply filters based on other parameters
    if (phrase) {
        filter.productName = { $regex: '.*' + phrase + '.*', $options: 'i' };
        filter.description = { $regex: '.*' + phrase + '.*', $options: 'i' };
    }
    if (categoryId) {
        filter['category.categoryId'] = categoryId;
    }
    if (minPrice) {
        filter.price = { $gte: minPrice };
    }
    if (maxPrice) {
        filter.price = { ...filter.price, $lte: maxPrice };
    }
    // if (minQuantity) {
    //     filter.quantity = { $gte: minQuantity };
    // }
    // if (maxQuantity) {
    //     filter.quantity = { ...filter.quantity, $lte: maxQuantity };
    // }
    // if (minSoldQuantity) {
    //     filter.soldQuantity = { $gte: minSoldQuantity };
    // }
    // if (maxSoldQuantity) {
    //     filter.soldQuantity = { ...filter.soldQuantity, $lte: maxSoldQuantity };
    // }
    // if (minAvgReview) {
    //     filter['review.rating'] = { $gte: minAvgReview };
    // }
    // if (maxAvgReview) {
    //     filter['review.rating'] = { ...filter['review.rating'], $lte: maxAvgReview };
    // }
    if (delivery) {
        filter.delivery = delivery;
    }
    if (minDeliveryPrice) {
        filter.deliveryPrice = { $gte: minDeliveryPrice };
    }
    if (maxDeliveryPrice) {
        filter.deliveryPrice = { ...filter.deliveryPrice, $lte: maxDeliveryPrice };
    }
    if (startDate) {
        filter.createdAt = { $gte: new Date(startDate) };
    }
    // if (endDate) {
    //     filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
    // }

// Apply geospatial filter for radius and center
let aggregationSteps = [];
if (radius && center) {
    console.log("Received radius and center:", radius, center);

    const coords = center.split('-');
    if (coords.length !== 2) {
        console.error("Invalid center format. Expected 'lat-lng' but got:", center);
    }

    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);

    if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid latitude or longitude:", lat, lng);
    } else {
        console.log("Parsed latitude and longitude:", lat, lng);

        aggregationSteps.push({
            $geoNear: {
                near: { type: 'Point', coordinates: [lng, lat] },
                query: filter,
                includeLocs: 'location',
                distanceField: 'distance',
                maxDistance: parseInt(radius),
                spherical: true,
            }
        });

        console.log("Geo filter applied with:", aggregationSteps);
    }
}

// Check if aggregationSteps are correctly applied before executing the query
console.log("Final aggregation pipeline:", JSON.stringify(aggregationSteps, null, 2));


    // Fetch Best Seller (Top 10 products with highest sold quantity)
    if (bestSellers) {
        aggregationSteps.push(
            { $sort: { soldQuantity: -1 } },
            { $limit: 10 }
        );
        const bestSellerProducts = await Product.aggregate(aggregationSteps.length > 0 ? aggregationSteps : [{ $match: filter }]);
        return new Response(JSON.stringify({ bestSellerProducts }), { status: 200 });
    }

    // Fetch Latest Products (Top 10 latest products)
    if (latestProducts) {
        aggregationSteps.push(
            { $sort: { createdAt: -1 } },
            { $limit: 10 }
        );
        const latestProductsList = await Product.aggregate(aggregationSteps.length > 0 ? aggregationSteps : [{ $match: filter }]);
        return new Response(JSON.stringify({ latestProductsList }), { status: 200 });
    }

    // Fetch Top Rated Products (Products with average rating above 4)
    if (topRated) {
        aggregationSteps.push(
            { $match: { 'review.rating': { $gte: 4 } } },
            { $limit: 10 }
        );
        const topRatedProducts = await Product.aggregate(aggregationSteps.length > 0 ? aggregationSteps : [{ $match: filter }]);
        return new Response(JSON.stringify({ topRatedProducts }), { status: 200 });
    }

    // Fetch Popular Products (currently not implemented)
    if (popularProducts) {
        return new Response(JSON.stringify({ popularProducts: [] }), { status: 200 });
    }

    // If no specific category is selected, return all products
    const products = await Product.find(filter);
    return new Response(JSON.stringify({ products }), { status: 200 });
}
