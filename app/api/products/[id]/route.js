import { NextResponse } from "next/server"
import Product from "@/models/Product"
import { connectToDB } from "@/libs/functions"

export async function GET(request, { params }) {
  const { id } = params
  
  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    )
  }

  await connectToDB()

  try {
    const product = await Product.findById(id)
      .populate('category.categoryId', 'name')
      .select('-isBanned -isDeleted')
      .lean()

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}