
// components/cart-provider.jsx
// "use client"

// import { createContext, useContext, useState, useEffect } from "react"

// const CartContext = createContext()

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState(() => {
//     if (typeof window !== "undefined") {
//       const savedCart = localStorage.getItem("cart")
//       return savedCart ? JSON.parse(savedCart) : { merchants: [] }
//     }
//     return { merchants: [] }
//   })

//   // Persist to localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart))
//   }, [cart])

//   const addToCart = (product) => {
//     setCart(prev => {
//       const merchantIndex = prev.merchants.findIndex(
//         m => m.merchantId === product.merchantId
//       )

//       // New merchant
//       if (merchantIndex === -1) {
//         return {
//           merchants: [
//             ...prev.merchants,
//             {
//               merchantId: product.merchantId,
//               merchantName: product.merchantName,
//               products: [product]
//             }
//           ]
//         }
//       }

//       // Existing merchant
//       return {
//         merchants: prev.merchants.map((merchant, index) => {
//           if (index !== merchantIndex) return merchant

//           const existingProduct = merchant.products.find(
//             p => p.id === product.id
//           )

//           // New product
//           if (!existingProduct) {
//             return {
//               ...merchant,
//               products: [...merchant.products, product]
//             }
//           }

//           // Existing product - update quantity
//           return {
//             ...merchant,
//             products: merchant.products.map(p => 
//               p.id === product.id 
//                 ? { ...p, quantity: p.quantity + product.quantity }
//                 : p
//             )
//           }
//         })
//       }
//     })
//   }

//   return (
//     <CartContext.Provider value={{ cart, addToCart }}>
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

"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const { data: session, status } = useSession()
  const [cart, setCart] = useState({ merchants: [] })

  // Load cart from local storage when session is available
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      try {
        const storedCarts = localStorage.getItem("carts")
        if (storedCarts) {
          const allCarts = JSON.parse(storedCarts)
          const userCart = allCarts.filter(item => item.email === session.user.email)

          const merchantMap = {}
          userCart.forEach(item => {
            if (!merchantMap[item.merchantId]) {
              merchantMap[item.merchantId] = {
                merchantId: item.merchantId,
                merchantName: item.merchantName,
                products: []
              }
            }
            merchantMap[item.merchantId].products.push({
              id: item.productId,
              name: item.productName,
              price: item.price,
              quantity: item.quantity,
              delivery: item.delivery || "PERPIECE",
              deliveryPrice: item.deliveryPrice || 0,
              image: item.image || "/placeholder.svg"
            })
          })

          setCart({ merchants: Object.values(merchantMap) })
        } else {
          setCart({ merchants: [] })
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        setCart({ merchants: [] })
      }
    } else {
      setCart({ merchants: [] })
    }
  }, [session, status])

  // Save cart to local storage when it changes
  useEffect(() => {
    if (session?.user?.email && cart.merchants.length > 0) {
      try {
        const storedCarts = localStorage.getItem("carts")
        const allCarts = storedCarts ? JSON.parse(storedCarts) : []
        const otherUsersCarts = allCarts.filter(item => item.email !== session.user.email)

        const userCartItems = cart.merchants.flatMap(merchant =>
          merchant.products.map(product => ({
            email: session.user.email,
            merchantId: merchant.merchantId,
            merchantName: merchant.merchantName,
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: product.quantity,
            delivery: product.delivery,
            deliveryPrice: product.deliveryPrice,
            image: product.image
          }))
        )

        localStorage.setItem("carts", JSON.stringify([...otherUsersCarts, ...userCartItems]))
      } catch (error) {
        console.error("Error saving cart:", error)
      }
    }
  }, [cart, session])

  const addToCart = (item) => {
    if (!session?.user?.email) return

    const newCart = { ...cart }
    const merchantIndex = newCart.merchants.findIndex(m => m.merchantId === item.merchantId)

    if (merchantIndex >= 0) {
      const productIndex = newCart.merchants[merchantIndex].products.findIndex(p => p.id === item.id)
      if (productIndex >= 0) {
        newCart.merchants[merchantIndex].products[productIndex].quantity += item.quantity
      } else {
        newCart.merchants[merchantIndex].products.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          delivery: item.delivery,
          deliveryPrice: item.deliveryPrice,
          image: item.image
        })
      }
    } else {
      newCart.merchants.push({
        merchantId: item.merchantId,
        merchantName: item.merchantName,
        products: [{
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          delivery: item.delivery,
          deliveryPrice: item.deliveryPrice,
          image: item.image
        }]
      })
    }

    setCart(newCart)
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

  const removeProduct = (merchantId, productId) => {
    setCart(prev => ({
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
    }))
  }

  const clearMerchant = (merchantId) => {
    setCart(prev => ({
      ...prev,
      merchants: prev.merchants.filter(merchant => merchant.merchantId !== merchantId)
    }))
  }

 

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeProduct, clearMerchant }}>
      {children}
    </CartContext.Provider>
  )
  }

  export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
  }