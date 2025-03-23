"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { ProductSlider } from "@/components/product-slider"

const deliveryTypes = ["FLAT", "PERPIECE", "PERKG", "FREE"]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minReview: "",
    maxReview: "",
    deliveryTypes: [],
    minDeliveryPrice: "",
    maxDeliveryPrice: "",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    // Simulate fetching products based on filters
    const fetchProducts = async () => {
      // Replace with actual API call
      const data = Array.from({ length: 12 }, (_, i) => ({
        id: `prod-${i}`,
        name: "Product Name",
        description: "Product description goes here",
        price: 199.99,
        originalPrice: 299.99,
        rating: 4.5,
        soldCount: 415,
        image: "/placeholder.svg",
      }))
      setProducts(data)
    }

    fetchProducts()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-6">
      {/* Search Form */}
        <div className="mb-8">
          <form className="flex gap-4 max-w-2xl w-full mx-auto">
            <Input type="search" placeholder="Search products..." className="flex-1" />
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Product Slider */}
        <div className="mb-8">
          <ProductSlider />
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="w-full lg:w-64">
          {/* Toggle Filters Button (Mobile Only) */}
          <Button
            className="w-full lg:hidden mb-4"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          {/* Filters Panel */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <h3 className="font-medium">Price Range</h3>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Rating Range */}
              <div className="space-y-2">
                <h3 className="font-medium">Rating</h3>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max="5"
                    value={filters.minReview}
                    onChange={(e) => setFilters({ ...filters, minReview: e.target.value })}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    min="0"
                    max="5"
                    value={filters.maxReview}
                    onChange={(e) => setFilters({ ...filters, maxReview: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Delivery Types */}
              <div className="space-y-2">
                <h3 className="font-medium">Delivery Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {deliveryTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filters.deliveryTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          setFilters({
                            ...filters,
                            deliveryTypes: checked
                              ? [...filters.deliveryTypes, type]
                              : filters.deliveryTypes.filter((t) => t !== type),
                          })
                        }}
                      />
                      <label htmlFor={type} className="text-sm">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Price */}
              <div className="space-y-2">
                <h3 className="font-medium">Delivery Price</h3>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minDeliveryPrice}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minDeliveryPrice: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxDeliveryPrice}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxDeliveryPrice: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2 col-span-2 lg:col-span-1">
                <h3 className="font-medium">Date Range</h3>
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full"
                  />
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Apply Filters Button */}
              <Button className="col-span-2 lg:col-span-1">Apply Filters</Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}