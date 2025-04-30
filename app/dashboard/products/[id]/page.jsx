"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Truck, Star, Edit, Tag, Megaphone } from "lucide-react"
import { AddEditProductForm } from "@/components/dashboard/addEditProductForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"

export default function ProductDetailPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false)
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [offerPrice, setOfferPrice] = useState("")
  const [offerEndDate, setOfferEndDate] = useState("")
  const [isHomeAd, setIsHomeAd] = useState(false)
  const [adPrice, setAdPrice] = useState("")
  const [adStartDate, setAdStartDate] = useState("")
  const [adEndDate, setAdEndDate] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch product")
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, toast])

  const handleOfferSubmit = async () => {
    try {
      // Ensure the date is properly formatted in ISO string
      const formattedDate = new Date(offerEndDate).toISOString()

      const response = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offer: {
            price: parseFloat(offerPrice),
            offerEndDate: formattedDate,
          },
        }),
      })

      if (!response.ok) throw new Error("Failed to update offer")

      const updatedProduct = await response.json()
      setProduct(updatedProduct)
      setIsOfferDialogOpen(false)
      toast({
        title: "Success",
        description: "Offer has been set successfully",
      })
    } catch (error) {
      console.error("Error setting offer:", error)
      toast({
        title: "Error",
        description: "Failed to set offer",
        variant: "destructive",
      })
    }
  }

  const handleRemoveOffer = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offer: {
            price: null,
            offerEndDate: null,
          },
        }),
      })

      if (!response.ok) throw new Error("Failed to remove offer")

      const updatedProduct = await response.json()
      setProduct(updatedProduct)
      toast({
        title: "Success",
        description: "Offer has been removed successfully",
      })
    } catch (error) {
      console.error("Error removing offer:", error)
      toast({
        title: "Error",
        description: "Failed to remove offer",
        variant: "destructive",
      })
    }
  }

  const handleCreateAd = async () => {
    try {
      const response = await fetch('/api/advertisement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product,
          merchantDetail: product.merchantDetail,
          startsAt: new Date(adStartDate).toISOString(),
          endsAt: new Date(adEndDate).toISOString(),
          adPrice: parseFloat(adPrice),
          adRegion: product.location.coordinates.join('-'),
          isHome: isHomeAd,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create advertisement');
      }

      toast({
        title: "Success",
        description: "Advertisement created successfully",
      });
      setIsAdDialogOpen(false);
    } catch (error) {
      console.error("Error creating advertisement:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button onClick={() => router.push("/dashboard/products")} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  // Prepare data for pie chart
  const inventoryData = [
    { name: "Sold", value: product.soldQuantity },
    { name: "Available", value: product.quantity },
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
    if (!product.review || product.review.length === 0) return 0
    const sum = product.review.reduce((acc, review) => acc + review.rating, 0)
    return (sum / product.review.length).toFixed(1)
  }

  const currentPrice = product.offer?.price && new Date(product.offer.offerEndDate) > new Date()
    ? product.offer.price
    : product.price

  return (
    <div className="container p-6">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={() => router.push('/dashboard/products')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">{product.productName}</h1>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button className="gradient-bg border-0" onClick={() => setIsEditProductOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
            <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Megaphone className="mr-2 h-4 w-4" />
                  Make it Ad
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Advertisement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="adPrice">Advertisement Price</Label>
                    <Input
                      id="adPrice"
                      type="number"
                      value={adPrice}
                      onChange={(e) => setAdPrice(e.target.value)}
                      placeholder="Enter advertisement price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adStartDate">Start Date</Label>
                    <Input
                      id="adStartDate"
                      type="datetime-local"
                      value={adStartDate}
                      onChange={(e) => setAdStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adEndDate">End Date</Label>
                    <Input
                      id="adEndDate"
                      type="datetime-local"
                      value={adEndDate}
                      onChange={(e) => setAdEndDate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isHomeAd"
                      checked={isHomeAd}
                      onCheckedChange={(checked) => setIsHomeAd(checked)}
                    />
                    <Label htmlFor="isHomeAd">Show on Homepage</Label>
                  </div>
                  <Button onClick={handleCreateAd} className="w-full">
                    Create Advertisement
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {product.offer?.price ? (
              <Button variant="outline" onClick={handleRemoveOffer}>
                <Tag className="mr-2 h-4 w-4" />
                Remove Offer
              </Button>
            ) : (
              <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Tag className="mr-2 h-4 w-4" />
                    Provide Offer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Product Offer</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="offerPrice">Offer Price</Label>
                      <Input
                        id="offerPrice"
                        type="number"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        placeholder="Enter offer price"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="offerEndDate">Offer End Date</Label>
                      <Input
                        id="offerEndDate"
                        type="datetime-local"
                        value={offerEndDate}
                        onChange={(e) => setOfferEndDate(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleOfferSubmit} className="w-full">
                      Set Offer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
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
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.productName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">{product.productName}</h2>
                    <p className="text-muted-foreground">{product.category.categoryName}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">${currentPrice.toFixed(2)}</p>
                      {product.offer?.price && new Date(product.offer.offerEndDate) > new Date() && (
                        <Badge variant="destructive" className="text-sm">
                          Offer: ${product.price.toFixed(2)} → ${product.offer.price.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Badge variant={product.quantity > 0 ? "success" : "destructive"}>
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                      <span className="ml-2 text-sm text-muted-foreground">{product.quantity} available</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium">Brand</p>
                    <p className="text-muted-foreground">{product.brand}</p>
                  </div>

                  {product.variant.length > 0 && (
                    <div className="space-y-1">
                      <p className="font-medium">Variants</p>
                      <div className="flex flex-wrap gap-2">
                        {product.variant.map((variant, index) => (
                          <Badge key={index} variant="outline">
                            {variant}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.size.length > 0 && (
                    <div className="space-y-1">
                      <p className="font-medium">Sizes</p>
                      <div className="flex flex-wrap gap-2">
                        {product.size.map((size, index) => (
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
                        {getDeliveryLabel(product.delivery)}
                        {product.delivery !== "FREE" && ` - $${product.deliveryPrice.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium">Location</p>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {product.location.coordinates[0]}, {product.location.coordinates[1]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Images */}
              {product.images.length > 1 && (
                <div className="mt-6 grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.productName} - Image ${index + 1}`}
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
                <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                {product.review.length > 0
                  ? `${product.review.length} reviews with an average rating of ${calculateAverageRating()} stars`
                  : "No reviews yet"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {product.review.length > 0 ? (
                <div className="space-y-4">
                  {product.review.map((review, index) => (
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
                  <p className="text-2xl font-bold">{product.soldQuantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold">{product.quantity}</p>
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
                  <span className="font-medium">${(product.price * product.soldQuantity).toFixed(2)}</span>
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
                  <span className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Merchant</span>
                  <span className="font-medium">{product.merchantDetail.merchantName}</span>
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
        product={product}
        mode="edit"
      />
    </div>
  )
}

