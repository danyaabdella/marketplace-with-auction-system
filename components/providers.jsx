"use client"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "./cart-provider"

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  )
}