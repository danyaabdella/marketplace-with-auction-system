"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import toast from "react-hot-toast" // Replaced useToast with react-hot-toast

// Demo cart data grouped by merchant
const demoCart = {
  merchants: [
    {
      merchantId: "1",
      merchantName: "Tech Store",
      merchantEmail: "store@example.com",
      products: [
        {
          id: "1",
          name: "iPhone 15 Pro",
          price: 999.99,
          quantity: 1,
          image: "/placeholder.svg",
          delivery: "FLAT",
          deliveryPrice: 10,
        },
        {
          id: "2",
          name: "AirPods Pro",
          price: 249.99,
          quantity: 1,
          image: "/placeholder.svg",
          delivery: "FLAT",
          deliveryPrice: 5,
        },
      ],
    },
    {
      merchantId: "2",
      merchantName: "Fashion Store",
      merchantEmail: "fashion@example.com",
      products: [
        {
          id: "3",
          name: "Designer T-Shirt",
          price: 49.99,
          quantity: 2,
          image: "/placeholder.svg",
          delivery: "PERPIECE",
          deliveryPrice: 3,
        },
      ],
    },
  ],
}

export default function CartPage() {
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart")
      return storedCart ? JSON.parse(storedCart) : demoCart
    }
    return demoCart
  })
  const [processingPayment, setProcessingPayment] = useState({})

  // Sync cart with local storage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart])

  const updateQuantity = (merchantId, productId, newQuantity) => {
    setCart((prev) => ({
      ...prev,
      merchants: prev.merchants.map((merchant) => {
        if (merchant.merchantId === merchantId) {
          return {
            ...merchant,
            products: merchant.products.map((product) => {
              if (product.id === productId) {
                return { ...product, quantity: newQuantity }
              }
              return product
            }),
          }
        }
        return merchant
      }),
    }))
  }

  const removeProduct = (merchantId, productId) => {
    setCart((prev) => ({
      ...prev,
      merchants: prev.merchants
        .map((merchant) => {
          if (merchant.merchantId === merchantId) {
            return {
              ...merchant,
              products: merchant.products.filter((product) => product.id !== productId),
            }
          }
          return merchant
        })
        .filter((merchant) => merchant.products.length > 0),
    }))
  }

  const calculateMerchantTotal = (merchant) => {
    return merchant.products.reduce((total, product) => {
      const productTotal = product.price * product.quantity
      const deliveryTotal =
        product.delivery === "PERPIECE" ? product.deliveryPrice * product.quantity : product.deliveryPrice
      return total + productTotal + deliveryTotal
    }, 0)
  }

  const calculateGrandTotal = () => {
    return cart.merchants.reduce((total, merchant) => {
      return total + calculateMerchantTotal(merchant)
    }, 0)
  }

  const handlePayment = async (merchantId, total) => {
    setProcessingPayment((prev) => ({ ...prev, [merchantId]: true }))

    try {
      // Simulated payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success("Your order has been placed successfully.") // Updated to use react-hot-toast

      // Remove paid items from cart
      setCart((prev) => ({
        ...prev,
        merchants: prev.merchants.filter((m) => m.merchantId !== merchantId),
      }))
    } catch (error) {
      toast.error("There was an error processing your payment.") // Updated to use react-hot-toast
    } finally {
      setProcessingPayment((prev) => ({ ...prev, [merchantId]: false }))
    }
  }

  if (cart.merchants.length === 0) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Button onClick={() => (window.location.href = "/products")}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {cart.merchants.map((merchant) => (
            <Card key={merchant.merchantId} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                  {merchant.merchantName}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-auto p-6">
                  <div className="space-y-6">
                    {merchant.products.map((product) => (
                      <div key={product.id} className="flex gap-4">
                        <div className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">${product.price.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              Delivery: {product.delivery} (${product.deliveryPrice})
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(merchant.merchantId, product.id, Math.max(0, product.quantity - 1))
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center">{product.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(merchant.merchantId, product.id, product.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeProduct(merchant.merchantId, product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex items-center justify-between bg-muted/50 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="text-lg font-medium">${calculateMerchantTotal(merchant).toFixed(2)}</p>
                </div>
                <Button
                  onClick={() => handlePayment(merchant.merchantId, calculateMerchantTotal(merchant))}
                  disabled={processingPayment[merchant.merchantId]}
                >
                  {processingPayment[merchant.merchantId] ? "Processing..." : "Pay Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.merchants.map((merchant) => (
                <div key={merchant.merchantId}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{merchant.merchantName}</span>
                    <span>${calculateMerchantTotal(merchant).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{merchant.products.length} items</p>
                  <Separator className="my-2" />
                </div>
              ))}
              <div className="flex justify-between font-medium text-lg">
                <span>Grand Total</span>
                <span>${calculateGrandTotal().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => (window.location.href = "/products")}>
                Continue Shopping
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="rounded-lg border-2 border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Each merchant's products will be processed as a separate order
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}