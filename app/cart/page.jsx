// "use client"

// import { useState, useEffect } from "react"
// import { useSession } from "next-auth/react"
// import Image from "next/image"
// import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import toast from "react-hot-toast"
// import { useCart } from "@/components/cart-provider"
// import { CartProvider } from "@/components/cart-provider"


// // Function to get user location
// const getUserLocation = () => {
//   return new Promise((resolve, reject) => {
//     if (!navigator.geolocation) {
//       reject(new Error("Geolocation is not supported by your browser"));
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         resolve([position.coords.longitude, position.coords.latitude]);
//       },
//       (error) => {
//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             reject(new Error("Location access denied. Please enable location services."));
//             break;
//           case error.POSITION_UNAVAILABLE:
//             reject(new Error("Location information is unavailable."));
//             break;
//           case error.TIMEOUT:
//             reject(new Error("The request to get location timed out."));
//             break;
//           default:
//             reject(new Error("An unknown error occurred while fetching location."));
//         }
//       },
//       { timeout: 10000, enableHighAccuracy: true } // 10s timeout, high accuracy
//     );
//   });
// };

// export default function CartPage() {
//   const { data: session, status } = useSession()
//   const { cart, removeProduct, updateQuantity, clearMerchant } = useCart()
//   const [processingPayment, setProcessingPayment] = useState({})
//   const [coordinates, setCoordinates] = useState([0, 0]); // Default fallback coordinates
//   // Fetch user location on component mount
//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const location = await getUserLocation();
//         setCoordinates(location);
//       } catch (error) {
//         toast.error(error.message);
//         setCoordinates([0, 0]); // Fallback coordinates
//       }
//     };
//     fetchLocation();
//   }, []);

//   const calculateMerchantTotal = (merchant) => {
//     return merchant.products.reduce((total, product) => {
//       const productTotal = product.price * product.quantity
//       const deliveryTotal =
//         product.delivery === "PERPIECE" ? product.deliveryPrice * product.quantity : product.deliveryPrice
//       return total + productTotal + deliveryTotal
//     }, 0)
//   }

//   const calculateGrandTotal = () => {
//     return cart.merchants.reduce((total, merchant) => {
//       return total + calculateMerchantTotal(merchant)
//     }, 0)
//   }

//   const handlePayment = async (merchantId, total) => {
//     setProcessingPayment((prev) => ({ ...prev, [merchantId]: true }))
//     try {
//       // Fetch customer details from /api/user
//       const customerResponse = await fetch('/api/user')
//       if (!customerResponse.ok) {
//         throw new Error("Failed to fetch customer details")
//       }
//       const customerData = await customerResponse.json()
//       // Fetch merchant details
//       const merchantResponse = await fetch(`/api/user/${merchantId}`)
//       if (!merchantResponse.ok) {
//         throw new Error("Failed to fetch merchant details")
//       }
//       const merchantData = await merchantResponse.json()

//       // Prepare customerDetail
//       const customerDetail = {
//         customerId: customerData._id,
//         customerName: customerData.fullName,
//         phoneNumber: customerData.phoneNumber || "0000000000",
//         customerEmail: customerData.email,
//         address: {
//           state: customerData.stateName || "Default State",
//           city: customerData.cityName || "Default City",
//         },
//       }

//       // Prepare merchantDetail
//       const merchantDetail = {
//         merchantId: merchantData._id,
//         merchantName: merchantData.fullName,
//         merchantEmail: merchantData.email,
//         phoneNumber: merchantData.phoneNumber,
//         account_name: merchantData.account_name || "Merchant Account",
//         account_number: merchantData.account_number || "1234567890",
//         bank_code: merchantData.bank_code || "DEFAULT",
//       }
      

//       // Prepare products
//       const merchant = cart.merchants.find((m) => m.merchantId === merchantId)
//       const products = merchant.products.map((p) => ({
//         productId: p.id,
//         productName: p.name,
//         quantity: p.quantity,
//         price: p.price,
//         delivery: p.delivery === "PERPIECE" ? "PERPIECS" : p.delivery,
//         deliveryPrice: p.deliveryPrice,
//         categoryName: p.categoryName || "Uncategorized",
//       }))
//       // Prepare location
//       const location = {
//         type: "Point",
//         coordinates: coordinates,
//       };

//       // Call /api/checkout to initialize payment
//       const response = await fetch("/api/checkout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ 
//           amount: total, 
//           orderData: {
//             customerDetail,
//             merchantDetail,
//             products,
//             totalPrice: total,
//             location
//           }
//         }),
//       })

//       const data = await response.json()
//       if (!response.ok || !data.checkout_url) {
//         throw new Error(data.message || "Failed to initialize payment")
//       }

//       // Clear the cart for this merchant after successful payment initialization
//       clearMerchant(merchantId)
      
//       // Redirect to Chapa checkout page
//       window.location.href = data.checkout_url
//     } catch (error) {
//       console.error("Payment error:", error)
//       toast.error(error.message || "There was an error processing your payment.")
//     } finally {
//       setProcessingPayment((prev) => ({ ...prev, [merchantId]: false }))
//     }
//   }

//   if (status === "loading") {
//     return (
//       <div className="container p-6">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!session) {
//     return (
//       <div className="container py-16">
//         <div className="flex flex-col items-center justify-center text-center">
//           <div className="rounded-full bg-muted p-6 mb-4">
//             <ShoppingBag className="h-12 w-12 text-muted-foreground" />
//           </div>
//           <h1 className="text-2xl font-bold mb-2">Please log in to view your cart</h1>
//           <p className="text-muted-foreground mb-6">You need to be logged in to access your shopping cart.</p>
//           <Button onClick={() => (window.location.href = "/login")}>Login to your account</Button>
//         </div>
//       </div>
//     )
//   }

//   if (!cart || cart.merchants.length === 0) {
//     return (
//       <div className="container py-16">
//         <div className="flex flex-col items-center justify-center text-center">
//           <div className="rounded-full bg-muted p-6 mb-4">
//             <ShoppingBag className="h-12 w-12 text-muted-foreground" />
//           </div>
//           <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
//           <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
//           <Button onClick={() => (window.location.href = "/products")}>Continue Shopping</Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container py-8">
//       <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
//       <div className="grid gap-8 lg:grid-cols-12">
//         <div className="lg:col-span-8 space-y-6">
//           {cart.merchants.map((merchant) => (
//             <Card key={merchant.merchantId} className="overflow-hidden">
//               <CardHeader className="bg-muted/50">
//                 <CardTitle className="flex items-center gap-2">
//                   <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//                     <ShoppingBag className="h-4 w-4 text-primary" />
//                   </div>
//                   {merchant.merchantName}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-0">
//                 <ScrollArea className="h-auto p-6">
//                   <div className="space-y-6">
//                     {merchant.products.map((product) => (
//                       <div key={product.id} className="flex gap-4">
//                         <div className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
//                           <Image
//                             src={product.image}
//                             alt={product.name}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <div className="flex flex-1 flex-col">
//                           <div className="flex-1">
//                             <h3 className="font-medium">{product.name}</h3>
//                             <p className="text-sm text-muted-foreground mt-1">${product.price.toFixed(2)}</p>
//                             <p className="text-sm text-muted-foreground">
//                               Delivery: {product.delivery} (${product.deliveryPrice})
//                             </p>
//                           </div>
//                           <div className="flex items-center justify-between mt-4">
//                             <div className="flex items-center gap-2">
//                               <Button
//                                 variant="outline"
//                                 size="icon"
//                                 className="h-8 w-8"
//                                 onClick={() =>
//                                   updateQuantity(merchant.merchantId, product.id, Math.max(0, product.quantity - 1))
//                                 }
//                               >
//                                 <Minus className="h-4 w-4" />
//                               </Button>
//                               <span className="w-12 text-center">{product.quantity}</span>
//                               <Button
//                                 variant="outline"
//                                 size="icon"
//                                 className="h-8 w-8"
//                                 onClick={() => updateQuantity(merchant.merchantId, product.id, product.quantity + 1)}
//                               >
//                                 <Plus className="h-4 w-4" />
//                               </Button>
//                             </div>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => removeProduct(merchant.merchantId, product.id)}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </CardContent>
//               <CardFooter className="flex items-center justify-between bg-muted/50 mt-4">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Subtotal</p>
//                   <p className="text-lg font-medium">${calculateMerchantTotal(merchant).toFixed(2)}</p>
//                 </div>
//                 <Button
//                   onClick={() => handlePayment(merchant.merchantId, calculateMerchantTotal(merchant))}
//                   disabled={processingPayment[merchant.merchantId]}
//                 >
//                   {processingPayment[merchant.merchantId] ? "Processing..." : "Pay Now"}
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//         <div className="lg:col-span-4 space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {cart.merchants.map((merchant) => (
//                 <div key={merchant.merchantId}>
//                   <div className="flex justify-between text-sm">
//                     <span className="font-medium">{merchant.merchantName}</span>
//                     <span>${calculateMerchantTotal(merchant).toFixed(2)}</span>
//                   </div>
//                   <p className="text-xs text-muted-foreground">{merchant.products.length} items</p>
//                   <Separator className="my-2" />
//                 </div>
//               ))}
//               <div className="flex justify-between font-medium text-lg">
//                 <span>Grand Total</span>
//                 <span>${calculateGrandTotal().toFixed(2)}</span>
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Button className="w-full" onClick={() => (window.location.href = "/products")}>
//                 Continue Shopping
//               </Button>
//             </CardFooter>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="rounded-lg border-2 border-dashed p-4 text-center">
//                 <p className="text-sm text-muted-foreground">
//                   Each merchant's products will be processed as a separate order
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import { useCart } from "@/components/cart-provider";

// Function to get user location
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Location access denied. Please enable location services."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information is unavailable."));
            break;
          case error.TIMEOUT:
            reject(new Error("The request to get location timed out."));
            break;
          default:
            reject(new Error("An unknown error occurred while fetching location."));
        }
      },
      { timeout: 10000, enableHighAccuracy: true } // 10s timeout, high accuracy
    );
  });
};

export default function CartPage() {
  const { data: session, status } = useSession();
  const { cart, removeProduct, updateQuantity, clearMerchant } = useCart();
  const [processingPayment, setProcessingPayment] = useState({});
  const [coordinates, setCoordinates] = useState([0, 0]); // Default fallback coordinates

  // Fetch user location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getUserLocation();
        setCoordinates(location);
      } catch (error) {
        toast.error(error.message);
        setCoordinates([0, 0]); // Fallback coordinates
      }
    };
    fetchLocation();
  }, []);

  const calculateMerchantTotal = (merchant) => {
    return merchant.products.reduce((total, product) => {
      const productTotal = product.price * product.quantity;
      const deliveryTotal =
        product.delivery === "PERPIECE" ? product.deliveryPrice * product.quantity : product.deliveryPrice;
      return total + productTotal + deliveryTotal;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return cart.merchants.reduce((total, merchant) => {
      return total + calculateMerchantTotal(merchant);
    }, 0);
  };

  const handlePayment = async (merchantId, total) => {
    setProcessingPayment((prev) => ({ ...prev, [merchantId]: true }));
    try {
      // Fetch customer details from /api/user
      const customerResponse = await fetch('/api/user');
      if (!customerResponse.ok) {
        throw new Error("Failed to fetch customer details");
      }
      const customerData = await customerResponse.json();

      // Fetch merchant details
      const merchantResponse = await fetch(`/api/user/${merchantId}`);
      if (!merchantResponse.ok) {
        throw new Error("Failed to fetch merchant details");
      }
      const merchantData = await merchantResponse.json();

      // Prepare customerDetail
      const customerDetail = {
        customerId: customerData._id,
        customerName: customerData.fullName,
        phoneNumber: customerData.phoneNumber || "0000000000",
        customerEmail: customerData.email,
        address: {
          state: customerData.stateName || "Default State",
          city: customerData.cityName || "Default City",
        },
      };

      // Prepare merchantDetail
      const merchantDetail = {
        merchantId: merchantData._id,
        merchantName: merchantData.fullName,
        merchantEmail: merchantData.email,
        phoneNumber: merchantData.phoneNumber,
        account_name: merchantData.account_name || "Merchant Account",
        account_number: merchantData.account_number || "1234567890",
        bank_code: merchantData.bank_code || "DEFAULT",
      };

      // Prepare products
      const merchant = cart.merchants.find((m) => m.merchantId === merchantId);
      const products = merchant.products.map((p) => ({
        productId: p.id,
        productName: p.name,
        quantity: p.quantity,
        price: p.price,
        delivery: p.delivery === "PERPIECE" ? "PERPIECS" : p.delivery,
        deliveryPrice: p.deliveryPrice,
        categoryName: p.categoryName || "Uncategorized",
      }));

      // Prepare location
      const location = {
        type: "Point",
        coordinates: coordinates,
      };

      // Call /api/checkout to initialize payment
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          orderData: {
            customerDetail,
            merchantDetail,
            products,
            totalPrice: total,
            location, // Include location in orderData
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.checkout_url) {
        throw new Error(data.message || "Failed to initialize payment");
      }

      // Clear the cart for this merchant after successful payment initialization
      clearMerchant(merchantId);

      // Redirect to Chapa checkout page
      window.location.href = data.checkout_url;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "There was an error processing your payment.");
    } finally {
      setProcessingPayment((prev) => ({ ...prev, [merchantId]: false }));
    }
  };

  if (status === "loading") {
    return (
      <div className="container p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Please log in to view your cart</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to access your shopping cart.</p>
          <Button onClick={() => (window.location.href = "/login")}>Login to your account</Button>
        </div>
      </div>
    );
  }

  if (!cart || cart.merchants.length === 0) {
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
    );
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
                            src={product.image}
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
  );
}