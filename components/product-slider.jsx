"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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
      <div className="container mx-auto max-w-screen-lg px-4 relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="min-w-full flex justify-center px-2"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full">
                  <div className="flex flex-col">
                    <div className="w-full">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover"
                      />
                    </div>
                    <div className="p-4 md:p-6 flex flex-col justify-center">
                      <h3 className="text-lg md:text-xl font-bold mb-2">{product.title}</h3>
                      <p className="text-gray-600 text-sm md:text-base mb-4">{product.description}</p>
                      <p className="text-2xl font-bold mb-4">${product.price}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button className="text-sm md:text-base">Buy Now</Button>
                        <Button variant="outline" className="text-sm md:text-base">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left & Right Navigation */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/70"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/70"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all ${
                index === currentSlide ? "bg-primary w-4 sm:w-5" : "bg-gray-300"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
