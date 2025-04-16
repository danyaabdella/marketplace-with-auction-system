// "use client"

// import { createContext, useContext, useState } from "react"

// const CartContext = createContext()

// export function CartProvider({ children }) {
//   const [cartItems, setCartItems] = useState([])

//   const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

//   const addToCart = (product, quantity = 1) => {
//     setCartItems((prev) => {
//       const existingItem = prev.find((item) => item.id === product.id)
//       if (existingItem) {
//         return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
//       }
//       return [...prev, { ...product, quantity }]
//     })
//   }

//   const removeFromCart = (productId) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== productId))
//   }

//   const updateQuantity = (productId, quantity) => {
//     setCartItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
//   }

//   return (
//     <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, updateQuantity }}>
//       {children}
//     </CartContext.Provider>
//   )
// }

// export const useCart = () => {
//   const context = useContext(CartContext)
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider")
//   }
//   return context
// }

// components/cart-provider.jsx
"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      return savedCart ? JSON.parse(savedCart) : { merchants: [] }
    }
    return { merchants: [] }
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart(prev => {
      const merchantIndex = prev.merchants.findIndex(
        m => m.merchantId === product.merchantId
      )

      // New merchant
      if (merchantIndex === -1) {
        return {
          merchants: [
            ...prev.merchants,
            {
              merchantId: product.merchantId,
              merchantName: product.merchantName,
              products: [product]
            }
          ]
        }
      }

      // Existing merchant
      return {
        merchants: prev.merchants.map((merchant, index) => {
          if (index !== merchantIndex) return merchant

          const existingProduct = merchant.products.find(
            p => p.id === product.id
          )

          // New product
          if (!existingProduct) {
            return {
              ...merchant,
              products: [...merchant.products, product]
            }
          }

          // Existing product - update quantity
          return {
            ...merchant,
            products: merchant.products.map(p => 
              p.id === product.id 
                ? { ...p, quantity: p.quantity + product.quantity }
                : p
            )
          }
        })
      }
    })
  }

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}