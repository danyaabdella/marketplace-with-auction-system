"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FilterBar } from "../filterBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/libs/utils";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { AddEditProductForm } from "./addEditProductForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

// Mock data (unchanged)
const products = [
  {
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
    description: "Original Polaroid camera from the 1970s in excellent condition.",
    images: ["/placeholder.svg"],
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
        comment: "Great vintage camera!",
        rating: 5,
        createdDate: "2023-12-10T10:30:00Z",
      },
    ],
    createdAt: "2023-11-15T09:00:00Z",
  },
  {
    id: "2",
    merchantDetail: {
      merchantId: "user123",
      merchantName: "Vintage Treasures",
      merchantEmail: "vintage@example.com",
    },
    productName: "Antique Wooden Desk",
    category: {
      categoryId: "cat2",
      categoryName: "Furniture",
    },
    price: 350.0,
    quantity: 2,
    soldQuantity: 12,
    description: "Beautiful oak desk from the early 20th century.",
    images: ["/placeholder.svg"],
    variant: ["Oak", "Mahogany"],
    size: [],
    brand: "Hand Made",
    location: {
      type: "Point",
      coordinates: [40.7128, -74.006],
    },
    delivery: "PERPIECE",
    deliveryPrice: 50.0,
    status: "Low Stock",
    review: [],
    createdAt: "2023-10-20T14:30:00Z",
  },
  {
    id: "3",
    merchantDetail: {
      merchantId: "user123",
      merchantName: "Vintage Treasures",
      merchantEmail: "vintage@example.com",
    },
    productName: "Limited Edition Vinyl",
    category: {
      categoryId: "cat3",
      categoryName: "Music",
    },
    price: 75.0,
    quantity: 15,
    soldQuantity: 5,
    description: "Rare first pressing of a classic album, still sealed.",
    images: ["/placeholder.svg"],
    variant: [],
    size: [],
    brand: "Columbia Records",
    location: {
      type: "Point",
      coordinates: [40.7128, -74.006],
    },
    delivery: "FLAT",
    deliveryPrice: 5.0,
    status: "In Stock",
    review: [],
    createdAt: "2023-12-01T11:15:00Z",
  },
  {
    id: "4",
    merchantDetail: {
      merchantId: "user123",
      merchantName: "Vintage Treasures",
      merchantEmail: "vintage@example.com",
    },
    productName: "Art Deco Lamp",
    category: {
      categoryId: "cat4",
      categoryName: "Home Decor",
    },
    price: 220.0,
    quantity: 0,
    soldQuantity: 7,
    description: "Original Art Deco lamp with stained glass shade.",
    images: ["/placeholder.svg"],
    variant: ["Green", "Blue"],
    size: [],
    brand: "Hand Made",
    location: {
      type: "Point",
      coordinates: [40.7128, -74.006],
    },
    delivery: "FLAT",
    deliveryPrice: 15.0,
    status: "Out of Stock",
    review: [],
    createdAt: "2023-09-15T16:45:00Z",
  },
];

export function MerchantProducts() {
  const router = useRouter();
  const { toast } = useToast();
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Ensure sorting logic is deterministic
  const sortedProducts = React.useMemo(() => {
    if (!sortColumn) return products;
    return [...products].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleProductClick = (product) => {
    router.push(`/dashboard/products/${product.id}`);
  };

  const handleAddProduct = () => {
    setIsAddProductOpen(true);
  };

  const handleEditProduct = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  const handleDeleteProduct = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: "Product deleted",
      description: `${selectedProduct.productName} has been deleted successfully.`,
    });
    setIsDeleteDialogOpen(false);
  };

  const getProductStatus = (product) => {
    if (product.quantity <= 0) return "Out of Stock";
    if (product.quantity <= 2) return "Low Stock";
    return "In Stock";
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    // Implement filter logic here
  };
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "banned" && product.status === "Banned") ||
      (filter === "out-of-stock" && product.quantity === 0) ||
      (filter === "available" && product.quantity > 0);
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { value: "all", label: "All Products" },
    { value: "banned", label: "Banned Products" },
    { value: "out-of-stock", label: "Out of Stock" },
    { value: "available", label: "Available Products" },
  ];

  return (
    <div className="container p-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Products</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your products and inventory</p>
      </div>
       <FilterBar
        placeholder="Search products..."
        filters={filters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      <div className="rounded-xl border bg-card p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-end ">
          <Button className="gradient-bg border-0 w-full md:w-auto" onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
        <div className="w-full overflow-x-auto">
        <Table className="min-w-[600px] w-full">
          <TableHeader>
            <TableRow>
              <TableHead  >Product</TableHead>
              <TableHead className="cursor-pointer" OnClick={() => handleSort("category")}>
                Category
              </TableHead>
              <TableHead className="cursor-pointer" OnClick={() => handleSort("status")}>
                Status
              </TableHead>
              <TableHead className="cursor-pointer" OnClick={() => handleSort("price")}>
                Price
              </TableHead>
              <TableHead className="cursor-pointer" OnClick={() => handleSort("quantity")}>
                Available
              </TableHead>
              <TableHead className="cursor-pointer" OnClick={() => handleSort("soldQuantity")}>
                Sold
              </TableHead>
              <TableHead className="">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow
                key={product.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleProductClick(product)}
              >
                <TableCell>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.productName}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                    <span className=" text-sm sm:text-base">{product.productName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm">{product.category.categoryName}</TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs text-right sm:text-sm font-medium",
                      getProductStatus(product) === "In Stock" && "bg-success/10 text-success",
                      getProductStatus(product) === "Low Stock" && "bg-warning/10 text-warning",
                      getProductStatus(product) === "Out of Stock" && "bg-destructive/10 text-destructive",
                    )}
                  >
                    {getProductStatus(product)}
                  </div>
                </TableCell>
                <TableCell className="text-sm sm:text-base">${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-center text-sm sm:text-base">{product.quantity}</TableCell>
                <TableCell className=" text-center text-sm sm:text-base">{product.soldQuantity}</TableCell>
                <TableCell className="text-sm sm:text-base">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => handleEditProduct(product, e)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => handleDeleteProduct(product, e)}
                      >
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

        {/* Add Product Form Dialog */}
        <AddEditProductForm open={isAddProductOpen} onOpenChange={setIsAddProductOpen} product={null} mode="add" />

        {/* Edit Product Form Dialog */}
        {selectedProduct && (
          <AddEditProductForm
            open={isEditProductOpen}
            onOpenChange={setIsEditProductOpen}
            product={selectedProduct}
            mode="edit"
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the product "{selectedProduct?.productName}"
                and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}