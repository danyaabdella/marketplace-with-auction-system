
import { connectToDB } from "@/libs/functions"
import Product from "@/models/Product"

export async function GET(req) {
  await connectToDB()

  const url = new URL(req.url)
  const limit = parseInt(url.searchParams.get("limit")) || 1000 // Default to 1000 products

  // Base filter to exclude banned or deleted products
  const filter = {
    isBanned: { $ne: true },
    isDeleted: { $ne: true },
  }

  try {
    // Fetch products without additional filters, up to the limit
    const products = await Product.find(filter).limit(limit).lean()
    const total = await Product.countDocuments(filter)

    return new Response(
      JSON.stringify({ products, total }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error fetching products:", error)
    return new Response(
      JSON.stringify({ error: "Failed to fetch products" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}