"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample featured products - replace with API data
const featuredProducts = [
  {
    id: 1,
    title: "New iPhone 15 Pro",
    description: "Experience the latest in mobile technology",
    image: "/placeholder.svg",
    price: 999.99,
  },
  {
    id: 2,
    title: "MacBook Pro M2",
    description: "Powerful performance for professionals",
    image: "/placeholder.svg",
    price: 1499.99,
  },
  {
    id: 3,
    title: "Sony WH-1000XM5",
    description: "Premium noise-cancelling headphones",
    image: "/placeholder.svg",
    price: 399.99,
  },
  {
    id: 4,
    title: "Samsung QLED 4K TV",
    description: "Immersive viewing experience",
    image: "/placeholder.svg",
    price: 1299.99,
  },
  {
    id: 5,
    title: "iPad Air",
    description: "Versatility in a lightweight design",
    image: "/placeholder.svg",
    price: 599.99,
  },
]

export function ProductSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)
  }

  return (
    <div className="relative overflow-hidden bg-gray-100 py-8">
      <div className="container relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {featuredProducts.map((product) => (
            <div key={product.id} className="min-w-full flex justify-center px-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="p-8 md:w-1/2 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-3xl font-bold mb-6">${product.price}</p>
                    <div className="flex gap-4">
                      <Button>Buy Now</Button>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentSlide ? "bg-primary w-4" : "bg-gray-300"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}