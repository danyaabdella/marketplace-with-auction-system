"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import toast from "react-hot-toast"

// Sample data - replace with your actual data fetching
const product = {
  id: "iphone-12",
  name: "Apple iPhone 12, 64GB",
  price: 799.99,
  description: `The product is refurbished, fully functional, and in excellent condition. Backed by the 90-day E-Shop Renewed Guarantee...`,
  rating: 4.5,
  reviews: 128,
  category: "Phone",
  brand: "Apple",
  images: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eh6YfJOCbsZaWuD6ivmxVF7xstsvpf.png",
    "/placeholder.svg",
    "/placeholder.svg",
  ],
  colors: ["blue", "red", "black"],
  reviews: [
    {
      id: 1,
      user: {
        name: "Chaoo Charles",
        avatar: "/placeholder.svg",
      },
      rating: 4,
      comment: "good enough. i like the camera and casing. the delivery was fast too.",
      date: "10 days ago",
    },
    // Add more reviews
  ],
}

export default function ProductPage({ params }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast.success("Added to cart")
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden border">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative aspect-square w-20 rounded-lg border overflow-hidden ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-bold mt-2">${product.price}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-muted-foreground">
              {product.rating} ({product.reviews.length} reviews)
            </span>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div>
            <h3 className="font-medium mb-2">Color</h3>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`h-8 w-8 rounded-full ${
                    selectedColor === color ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Reviews</h3>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Image
                      src={review.user.avatar || "/placeholder.svg"}
                      alt={review.user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(review.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

