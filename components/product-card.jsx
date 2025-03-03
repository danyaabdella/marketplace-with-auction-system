"use client"

import { useState } from "react"
import { ShoppingCart, Heart } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
// import { useToast } from "@/components/ui/use-toast"

export function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false)
  // const { toast } = useToast()

  const toggleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      // Replace with actual API call
      // await fetch(`/api/wishlist/${product.id}`, {
      //   method: isFavorite ? 'DELETE' : 'POST',
      // })
      
      setIsFavorite(!isFavorite)
      // toast({
      //   title: isFavorite ? "Removed from wishlist" : "Added to wishlist",
      //   description: isFavorite 
      //     ? "The item has been removed from your wishlist"
      //     : "The item has been added to your wishlist",
      // })
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to update wishlist",
      //   variant: "destructive",
      // })
    }
  }

  return (
    <div className="group relative rounded-lg border p-4 hover:shadow-lg">
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-6 top-6 z-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
        onClick={toggleFavorite}
      >
        <Heart 
          className={`h-5 w-5 transition-colors ${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
          }`} 
        />
      </Button>
      
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden rounded-lg">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="font-medium line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} | {product.soldCount} sold
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
              {product.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            <Button
              size="icon"
              className="rounded-full h-10 w-10 hover:bg-primary/90 " 
              onClick={(e) => {
                e.preventDefault()
                // Add to cart logic here
              }}
            >
              <ShoppingCart className="h-5 w-5 text-primary-foreground" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  )
}
