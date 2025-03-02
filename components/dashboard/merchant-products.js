"use client"

import { cn } from "@/libs/utils"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"

const products = [
  {
    id: "1",
    name: "Vintage Polaroid Camera",
    status: "In Stock",
    inventory: 5,
    price: 120.0,
    sales: 8,
    image: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Antique Wooden Desk",
    status: "Low Stock",
    inventory: 2,
    price: 350.0,
    sales: 12,
    image: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Limited Edition Vinyl",
    status: "In Stock",
    inventory: 15,
    price: 75.0,
    sales: 5,
    image: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Art Deco Lamp",
    status: "Out of Stock",
    inventory: 0,
    price: 220.0,
    sales: 7,
    image: "/placeholder.svg",
  },
]

export function MerchantProducts() {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between p-6">
        <div>
          <h3 className="text-xl font-semibold">Products</h3>
          <p className="text-sm text-muted-foreground">Manage your products and inventory</p>
        </div>
        <Button className="gradient-bg border-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
              Status
            </TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort("inventory")}>
              Inventory
            </TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort("price")}>
              Price
            </TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort("sales")}>
              Sales
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover"
                  />
                  <span className="font-medium">{product.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    product.status === "In Stock" && "bg-success/10 text-success",
                    product.status === "Low Stock" && "bg-warning/10 text-warning",
                    product.status === "Out of Stock" && "bg-destructive/10 text-destructive",
                  )}
                >
                  {product.status}
                </div>
              </TableCell>
              <TableCell className="text-right">{product.inventory}</TableCell>
              <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">{product.sales}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Product
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
