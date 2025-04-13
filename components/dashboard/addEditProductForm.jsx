
"use client"

import React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { X, Plus, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  productName: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  categoryId: z.string().min(1, { message: "Please select a category." }),
  price: z.string().min(1, { message: "Price is required." }),
  quantity: z.string().min(1, { message: "Quantity is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  brand: z.string().optional(),
  delivery: z.enum(["FLAT", "PERPIECE", "PERKG", "FREE"]),
  deliveryPrice: z.string(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

export function AddEditProductForm({ open, onOpenChange, product, mode }) {
  const { toast } = useToast()
  const [variants, setVariants] = useState([])
  const [newVariant, setNewVariant] = useState("")
  const [sizes, setSizes] = useState([])
  const [newSize, setNewSize] = useState("")
  const [images, setImages] = useState([])
  const [categories, setCategories] = useState([])
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      categoryId: "",
      price: "",
      quantity: "",
      description: "",
      brand: "Hand Made",
      delivery: "FLAT",
      deliveryPrice: "0",
      latitude: "",
      longitude: "",
    },
  })
  

  // Initialize form with product data when editing
  useEffect(() => {
    if (mode === "edit" && product) {
      const initialValues = {
        productName: product.productName,
        categoryId: product.category.categoryId,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        description: product.description,
        brand: product.brand,
        delivery: product.delivery,
        deliveryPrice: product.delivery === "FREE" ? "0" : product.deliveryPrice.toString(),
        latitude: product.location?.coordinates[1]?.toString() || "",
        longitude: product.location?.coordinates[0]?.toString() || "",
      };
  
      form.reset(initialValues);
      setVariants(product.variant || []);
      setSizes(product.size || []);
      setImages(product.images || []);
    
    } else {
      form.reset({
        productName: "",
        categoryId: "",
        price: "",
        quantity: "",
        description: "",
        brand: "Hand Made",
        delivery: "FLAT",
        deliveryPrice: "0",
        latitude: "",
        longitude: "",
      })
      setVariants([])
      setSizes([])
      setImages([])
    }
  }, [form, mode, product])
  const { formState } = form
  const isDirty = formState.isDirty

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error.message)
      }
    }
    fetchCategories()
  }, [])

  // ... (keep all your existing handler functions unchanged)

  const handleAddVariant = () => {
    if (newVariant && !variants.includes(newVariant)) {
      setVariants([...variants, newVariant])
      setNewVariant("")
    }
  }

  const handleRemoveVariant = (variant) => {
    setVariants(variants.filter((v) => v !== variant))
  }

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize])
      setNewSize("")
    }
  }

  const handleRemoveSize = (size) => {
    setSizes(sizes.filter((s) => s !== size))
  }

  const handleImageUpload = (e) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    }
  }

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // Handle form submission
  // const onSubmit = async (values) => {
  //   // Find the selected category to get its name
  //   const selectedCategory = categories.find((cat) => cat._id === values.categoryId);
  //   if (!selectedCategory) {
  //     toast({
  //       title: "Error",
  //       description: "Selected category not found.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
  
  //   // Construct productData with explicit fields to match the schema
  //   const productData = {
  //     productName: values.productName,
  //     category: {
  //       categoryId: values.categoryId,
  //       categoryName: selectedCategory.name,
  //     },
  //     price: Number(values.price), // Convert string to number
  //     quantity: Number(values.quantity), // Convert string to number
  //     description: values.description,
  //     brand: values.brand || "Hand Made",
  //     delivery: values.delivery,
  //     deliveryPrice: Number(values.deliveryPrice), // Convert string to number
  //     variant: variants,
  //     size: sizes,
  //     images: images, // Note: Images should be URLs, addressed below
  //     location: {
  //       type: "Point",
  //       coordinates: [Number.parseFloat(values.longitude || "0"), Number.parseFloat(values.latitude || "0")],
  //     },
  //   };
  
  //   try {
  //     const response = await fetch(
  //       mode === "add" ? "/api/product" : `/api/product/${product.id}`,
  //       {
  //         method: mode === "add" ? "POST" : "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(productData),
  //       }
  //     );
  
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       toast({
  //         title: mode === "add" ? "Product added" : "Product updated",
  //         description: `${values.productName} has been ${mode === "add" ? "added" : "updated"} successfully.`,
  //       });
  //       onOpenChange(false);
  //     } else {
  //       toast({
  //         title: "Error",
  //         description: data.message || "Something went wrong. Please try again.",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     toast({
  //       title: "Error",
  //       description: "Something went wrong. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };
  // Enhanced form submission
  const onSubmit = async (values) => {
    try {
      const selectedCategory = categories.find((cat) => cat._id === values.categoryId);
      if (!selectedCategory) {
        throw new Error("Selected category not found");
      }

      const productData = {
        productName: values.productName,
        category: {
          categoryId: values.categoryId,
          categoryName: selectedCategory.name,
        },
        price: Number(values.price),
        quantity: Number(values.quantity),
        description: values.description,
        brand: values.brand,
        delivery: values.delivery,
        deliveryPrice: values.delivery === "FREE" ? 0 : Number(values.deliveryPrice),
        variant: variants,
        size: sizes,
        images: images,
        location: {
          type: "Point",
          coordinates: [
            Number(values.longitude) || 0, 
            Number(values.latitude) || 0
          ],
        },
      };

      const url = mode === "add" 
        ? "/api/product" 
        : `/api/product?productId=${product._id}`;

      const response = await fetch(url, {
        method: mode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save product");
      }

      toast({
        title: `Product ${mode === "add" ? "added" : "updated"}`,
        description: `${values.productName} has been ${mode === "add" ? "added" : "updated"} successfully.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Proper DialogHeader structure with required DialogTitle */}
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Product" : "Edit Product"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Fill in the details to add a new product to your inventory" 
              : "Update your existing product details"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Keep all your existing form fields exactly as they are */}
            {/* ... */}
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your product in detail..." className="h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brand name (default: Hand Made)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Variants */}
            <div>
              <FormLabel>Variants (Colors, Materials, etc.)</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {variants.map((variant, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {variant}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveVariant(variant)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add variant"
                  value={newVariant}
                  onChange={(e) => setNewVariant(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" size="sm" onClick={handleAddVariant}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <FormLabel>Sizes</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {sizes.map((size, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {size}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveSize(size)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add size"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" size="sm" onClick={handleAddSize}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 40.7128" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. -74.0060" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Location coordinates for your product</span>
            </div>

            {/* Delivery Options */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="delivery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FLAT">Flat Rate</SelectItem>
                        <SelectItem value="PERPIECE">Per Piece</SelectItem>
                        <SelectItem value="PERKG">Per Kilogram</SelectItem>
                        <SelectItem value="FREE">Free Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} disabled={form.watch("delivery") === "FREE"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Images */}
            <div>
              <FormLabel>Product Images</FormLabel>
              <FormDescription>Upload one or more images of your product</FormDescription>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="cursor-pointer mt-2"
              />
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className="gradient-bg border-0"
                disabled={mode === 'edit' && !isDirty}
              >
                {mode === "add" ? "Add Product" : "Update Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}