// components/cart-provider.jsx
"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ merchants: [] })

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to local storage when it changes
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

  const removeProduct = (merchantId, productId) => {
    setCart(prev => {
      const newCart = {
        ...prev,
        merchants: prev.merchants
          .map(merchant => {
            if (merchant.merchantId === merchantId) {
              return {
                ...merchant,
                products: merchant.products.filter(product => product.id !== productId)
              }
            }
            return merchant
          })
          .filter(merchant => merchant.products.length > 0)
      }
      return newCart
    })
  }

  const clearMerchant = (merchantId) => {
    setCart(prev => ({
      ...prev,
      merchants: prev.merchants.filter(merchant => merchant.merchantId !== merchantId)
    }))
  }

  const updateQuantity = (merchantId, productId, newQuantity) => {
    if (newQuantity === 0) {
      removeProduct(merchantId, productId)
      return
    }
    setCart(prev => ({
      ...prev,
      merchants: prev.merchants.map(merchant => {
        if (merchant.merchantId === merchantId) {
          return {
            ...merchant,
            products: merchant.products.map(product => {
              if (product.id === productId) {
                return { ...product, quantity: newQuantity }
              }
              return product
            })
          }
        }
        return merchant
      })
    }))
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeProduct, clearMerchant, updateQuantity }}>
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