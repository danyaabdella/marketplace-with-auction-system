"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Demo data based on schema
const demoCategories = [
  {
    id: "1",
    name: "Electronics",
    description: "Latest gadgets and electronic devices",
    createdBy: "Admin",
    productCount: 150,
  },
  {
    id: "2",
    name: "Fashion",
    description: "Trendy clothing and accessories",
    createdBy: "Admin",
    productCount: 300,
  },
  // Add more categories...
].concat(
  Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 3}`,
    name: `Category ${i + 3}`,
    description: "Category description goes here",
    createdBy: "Admin",
    productCount: Math.floor(Math.random() * 500),
  })),
)

export default function CategoriesPage() {
  const [categories, setCategories] = useState(demoCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    // Replace with actual API call
    // const fetchCategories = async () => {
    //   const response = await fetch('/api/categories')
    //   const data = await response.json()
    //   setCategories(data)
    // }
    // fetchCategories()
  }, [])

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE)
  const displayedCategories = filteredCategories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  return (
    <div className="container py-8 mt-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Categories</h1>
        <form onSubmit={handleSearch} className="max-w-md">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right

-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedCategories.map((category) => (
          <Card
            key={category.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/products?category=${category.id}`)}
          >
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{category.productCount} products</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

