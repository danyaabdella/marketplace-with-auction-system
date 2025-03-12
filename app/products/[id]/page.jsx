"use client"

import { useEffect } from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Minus, Plus, ShoppingCart, Heart, ChevronDown, ChevronUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCart } from "@/components/cart-provider"
// import { useToast } from "@/components/ui/use-toast"

// Demo data based on schema
const demoProduct = {
  merchantDetail: {
    merchantId: "1",
    merchantName: "Tech Store",
    merchantEmail: "store@example.com",
  },
  productName: "Apple iPhone 15 Pro Max",
  category: {
    categoryId: "1",
    categoryName: "Smartphones",
  },
  price: 1299.99,
  quantity: 50,
  soldQuantity: 125,
  description: "The latest iPhone with revolutionary features...",
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ],
  variant: ["Space Black", "Natural Titanium", "White Titanium", "Blue Titanium"],
  size: ["128GB", "256GB", "512GB", "1TB"],
  brand: "Apple",
  review: [
    {
      customerId: "1",
      comment: "Amazing product, worth every penny!",
      rating: 5,
      createdDate: new Date(),
    },
  ],
  delivery: "FLAT",
  deliveryPrice: 10,
}

export default function ProductDetail({ params }) {
  const [product, setProduct] = useState(demoProduct)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isZoomed, setIsZoomed] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [showReviewDialog, setShowReviewDialog] = useState(false)

  const imageRef = useRef(null)
  const zoomRef = useRef(null)

  const { addToCart } = useCart()
  // const { toast } = useToast()

  useEffect(() => {
    // Replace with actual API call
    // const fetchProduct = async () => {
    //   const response = await fetch(`/api/products/${params.id}`)
    //   const data = await response.json()
    //   setProduct(data)
    // }
    // fetchProduct()
  }, [])

  const handleMouseMove = (e) => {
    if (!imageRef.current || !zoomRef.current) return

    const { left, top, width, height } = imageRef.current.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    // Update zoom window position
    setZoomPosition({ x: x * 100, y: y * 100 })

    // Position the zoomed image
    const zoomWidth = zoomRef.current.offsetWidth
    const zoomHeight = zoomRef.current.offsetHeight
    const translateX = Math.max(0, Math.min(x * width * 2 - zoomWidth / 2, width * 2 - zoomWidth))
    const translateY = Math.max(0, Math.min(y * height * 2 - zoomHeight / 2, height * 2 - zoomHeight))

    zoomRef.current.style.transform = `translate(${-translateX}px, ${-translateY}px)`
  }

  const handleAddToCart = () => {
    if (product.variant?.length && !selectedVariant) {
      // toast({
      //   title: "Please select a variant",
      //   variant: "destructive",
      // })
      return
    }

    if (product.size?.length && !selectedSize) {
    //   toast({
    //     title: "Please select a size",
    //     variant: "destructive",
    //   })
      return
    }

    addToCart({
      ...product,
      selectedVariant,
      selectedSize,
      quantity,
    })

    // toast({
    //   title: "Added to cart",
    //   description: `${product.productName} has been added to your cart`,
    // })
  }

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) {
      // toast({
      //   title: "Error",
      //   description: "Please write a review comment",
      //   variant: "destructive",
      // })
      return
    }

    try {
      // Replace with actual API call
      // await fetch(`/api/products/${params.id}/reviews`, {
      //   method: 'POST',
      //   body: JSON.stringify(newReview),
      // })

      setProduct((prev) => ({
        ...prev,
        review: [
          ...prev.review,
          {
            ...newReview,
            customerId: "user-1",
            createdDate: new Date(),
          },
        ],
      }))

      setShowReviewDialog(false)
      setNewReview({ rating: 5, comment: "" })

      // toast({
      //   title: "Review submitted",
      //   description: "Thank you for your review!",
      // })
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to submit review",
      //   variant: "destructive",
      // })
    }
  }

  const averageRating = product.review.reduce((acc, curr) => acc + curr.rating, 0) / product.review.length

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image Gallery with Enhanced Zoom */}
        <div className="space-y-4">
          <div
            ref={imageRef}
            className="relative aspect-square overflow-hidden rounded-lg border"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.productName}
              fill
              className="object-cover"
            />
            {isZoomed && (
              <div
                className="absolute left-0 top-0 h-full w-full overflow-hidden bg-white"
                style={{
                  clipPath: `circle(80px at ${zoomPosition.x}% ${zoomPosition.y}%)`,
                }}
              >
                <div ref={zoomRef} className="absolute left-0 top-0 h-[200%] w-[200%]">
                  <Image
                    src={product.images[selectedImage] || "/placeholder.svg"}
                    alt={product.productName}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4 overflow-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative aspect-square w-20 shrink-0 rounded-lg border overflow-hidden ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.productName} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.productName}</h1>
            <p className="text-2xl font-bold mt-2">${product.price.toFixed(2)}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(averageRating) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-muted-foreground">
              {averageRating.toFixed(1)} ({product.review.length} reviews)
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{product.soldQuantity} sold</span>
          </div>

          <div>
            <div className="prose max-w-none">
              <p className={showFullDescription ? "" : "line-clamp-3"}>{product.description}</p>
            </div>
            {product.description.length > 150 && (
              <Button
                variant="ghost"
                className="mt-2 flex items-center gap-2"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? (
                  <>
                    Show Less
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show More
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>

        <div className="flex gap-4">
        {product.variant?.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Variant</h3>
              <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {product.variant.map((variant) => (
                    <SelectItem key={variant} value={variant}>
                      {variant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {product.size?.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.size.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

          <div>
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">{product.quantity} available</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="font-medium">{product.delivery}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Price</span>
              <span className="font-medium">${product.deliveryPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Seller</span>
              <span className="font-medium">{product.merchantDetail.merchantName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
            <DialogTrigger asChild>
              <Button>Write a Review</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      size="sm"
                      className="p-0 hover:bg-transparent"
                      onClick={() => setNewReview((prev) => ({ ...prev, rating: i + 1 }))}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          i < newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </Button>
                  ))}
                </div>
                <Textarea
                  placeholder="Write your review here..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                />
                <Button onClick={handleSubmitReview}>Submit Review</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {product.review.map((review, index) => (
            <div key={index} className="border-b pb-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.createdDate).toLocaleDateString()}
                </span>
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}