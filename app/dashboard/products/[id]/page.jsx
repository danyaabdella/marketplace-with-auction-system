"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Truck, Star, Edit } from "lucide-react"
import { AddEditProductForm } from "@/components/dashboard/addEditProductForm"

// Mock product data based on the MongoDB schema
const productData = {
  id: "1",
  merchantDetail: {
    merchantId: "user123",
    merchantName: "Vintage Treasures",
    merchantEmail: "vintage@example.com",
  },
  productName: "Vintage Polaroid Camera",
  category: {
    categoryId: "cat1",
    categoryName: "Electronics",
  },
  price: 120.0,
  quantity: 5,
  soldQuantity: 8,
  description:
    "Original Polaroid camera from the 1970s in excellent condition. This rare piece comes with its original leather case and user manual. The camera has been tested and is in perfect working condition, producing the classic Polaroid look that photographers love. The lens is clear with no fungus or haze, and all mechanical parts operate smoothly.",
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  variant: ["Black", "Brown"],
  size: [],
  brand: "Polaroid",
  location: {
    type: "Point",
    coordinates: [40.7128, -74.006],
  },
  delivery: "FLAT",
  deliveryPrice: 10.0,
  status: "In Stock",
  review: [
    {
      customerId: "cust1",
      customerName: "John Doe",
      comment: "Great vintage camera! Works perfectly and arrived in excellent condition.",
      rating: 5,
      createdDate: "2023-12-10T10:30:00Z",
    },
    {
      customerId: "cust2",
      customerName: "Sarah Smith",
      comment: "Beautiful camera, exactly as described. Fast shipping too!",
      rating: 4,
      createdDate: "2023-12-05T14:20:00Z",
    },
  ],
  createdAt: "2023-11-15T09:00:00Z",
}

export default function ProductDetailPage({ params }) {
  const router = useRouter()
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)

  // Prepare data for pie chart
  const inventoryData = [
    { name: "Sold", value: productData.soldQuantity },
    { name: "Available", value: productData.quantity },
  ]

  const COLORS = ["#8884d8", "#82ca9d"]

  const getDeliveryLabel = (type) => {
    switch (type) {
      case "FLAT":
        return "Flat Rate"
      case "PERPIECE":
        return "Per Piece"
      case "PERKG":
        return "Per Kilogram"
      case "FREE":
        return "Free Delivery"
      default:
        return type
    }
  }

  const calculateAverageRating = () => {
    if (!productData.review || productData.review.length === 0) return 0
    const sum = productData.review.reduce((acc, review) => acc + review.rating, 0)
    return (sum / productData.review.length).toFixed(1)
  }

  return (
    <div className="container p-6">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">{productData.productName}</h1>
          <Button className="mt-2 sm:mt-0 gradient-bg border-0" onClick={() => setIsEditProductOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Images and Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Main Image */}
                <div className="relative aspect-square overflow-hidden rounded-lg border">
                  <Image
                    src={productData.images[0] || "/placeholder.svg"}
                    alt={productData.productName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">{productData.productName}</h2>
                    <p className="text-muted-foreground">{productData.category.categoryName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-2xl font-bold">${productData.price.toFixed(2)}</p>
                    <div className="flex items-center">
                      <Badge variant={productData.quantity > 0 ? "success" : "destructive"}>
                        {productData.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                      <span className="ml-2 text-sm text-muted-foreground">{productData.quantity} available</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium">Brand</p>
                    <p className="text-muted-foreground">{productData.brand}</p>
                  </div>

                  {productData.variant.length > 0 && (
                    <div className="space-y-1">
                      <p className="font-medium">Variants</p>
                      <div className="flex flex-wrap gap-2">
                        {productData.variant.map((variant, index) => (
                          <Badge key={index} variant="outline">
                            {variant}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {productData.size.length > 0 && (
                    <div className="space-y-1">
                      <p className="font-medium">Sizes</p>
                      <div className="flex flex-wrap gap-2">
                        {productData.size.map((size, index) => (
                          <Badge key={index} variant="outline">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="font-medium">Delivery</p>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {getDeliveryLabel(productData.delivery)}
                        {productData.delivery !== "FREE" && ` - $${productData.deliveryPrice.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium">Location</p>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {productData.location.coordinates[0]}, {productData.location.coordinates[1]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Images */}
              {productData.images.length > 1 && (
                <div className="mt-6 grid grid-cols-4 gap-2">
                  {productData.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${productData.productName} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{productData.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                {productData.review.length > 0
                  ? `${productData.review.length} reviews with an average rating of ${calculateAverageRating()} stars`
                  : "No reviews yet"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {productData.review.length > 0 ? (
                <div className="space-y-4">
                  {productData.review.map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{review.customerName}</p>
                          <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="mt-2 text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">No reviews yet for this product.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sales Analytics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Sold vs. Available Inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {inventoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} units`, null]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sold</p>
                  <p className="text-2xl font-bold">{productData.soldQuantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold">{productData.quantity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Revenue</span>
                  <span className="font-medium">${(productData.price * productData.soldQuantity).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Rating</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">{calculateAverageRating()}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listed Date</span>
                  <span className="font-medium">{new Date(productData.createdAt).toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Merchant</span>
                  <span className="font-medium">{productData.merchantDetail.merchantName}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Product Form Dialog */}
      <AddEditProductForm
        open={isEditProductOpen}
        onOpenChange={setIsEditProductOpen}
        product={productData}
        mode="edit"
      />
    </div>
  )
}

