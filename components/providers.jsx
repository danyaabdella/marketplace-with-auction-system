"use client"
import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/components/cart-provider"

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  )
}