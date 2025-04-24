import { connectToDB } from "@/libs/functions"
import Product from "@/models/Product"

export async function GET(req) {
  await connectToDB()

  const url = new URL(req.url)
  const limit = parseInt(url.searchParams.get("limit")) || 1000
  const lat = parseFloat(url.searchParams.get("lat"))
  const lng = parseFloat(url.searchParams.get("lng"))

  console.log("Fetching products with params:", { lat, lng, limit })

  // Base filter to exclude banned or deleted products
  const filter = {
    isBanned: { $ne: true },
    isDeleted: { $ne: true },
  }

  try {
    let products;
    let total;

    // If location is provided, use geoNear for distance-based sorting
    if (lat && lng) {
      console.log("Using location-based sorting")
      
      // First, let's check if we have any products with valid coordinates
      const productsWithCoords = await Product.find({
        ...filter,
        'location.coordinates': { $exists: true, $ne: null }
      }).select('location.coordinates').lean();
      
      console.log(`Found ${productsWithCoords.length} products with coordinates`)
      console.log("Sample coordinates:", productsWithCoords.slice(0, 3).map(p => p.location.coordinates))

      const aggregationPipeline = [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [lng, lat]
            },
            distanceField: "distance",
            spherical: true,
            maxDistance: 100000, // Increased to 100km
            query: filter
          }
        },
        {
          $sort: { distance: 1 } // Sort by distance ascending (nearest first)
        },
        {
          $limit: limit
        }
      ];

      console.log("Aggregation pipeline:", JSON.stringify(aggregationPipeline, null, 2))
      products = await Product.aggregate(aggregationPipeline);
      console.log("Found products with location:", products.length)
      
      // If no products found with location, fall back to regular find
      if (products.length === 0) {
        console.log("No products found with location, falling back to regular find")
        products = await Product.find(filter)
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();
      }
    } else {
      console.log("Using default sorting")
      // If no location, use regular find with default sort
      products = await Product.find(filter)
        .sort({ createdAt: -1 }) // Sort by creation date (newest first)
        .limit(limit)
        .lean();
      console.log("Found products without location:", products.length)
    }

    total = await Product.countDocuments(filter);

    return new Response(
      JSON.stringify({ 
        products, 
        total,
        message: `Found ${products.length} products${lat && lng ? ' sorted by distance' : ''}`
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error fetching products:", error)
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch products",
        details: error.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}