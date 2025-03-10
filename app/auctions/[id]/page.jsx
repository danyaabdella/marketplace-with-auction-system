// 'use client'
// import { useState, useEffect } from 'react';
// import Image from "next/image"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Clock, Heart, Share2 } from "lucide-react"
// import { BidHistory } from "@/components/bid-history"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useToast } from '@/components/ui/use-toast';

// const auctionData = {
//   id: "1",
//   title: "Vintage Polaroid Camera",
//   description:
//     "Original Polaroid camera from the 1970s in excellent condition. This rare piece comes with its original leather case and user manual. The camera has been tested and is in perfect working condition, producing the classic Polaroid look that photographers love. The lens is clear with no fungus or haze, and all mechanical parts operate smoothly.",
//   currentBid: 120,
//   bids: 8,
//   timeLeft: "2 hours",
//   startingPrice: 50,
//   reservePrice: 100,
//   incrementAmount: 10,
//   images: [
//     "/image.png",
//     "/image.png",    
//     "/image.png"
//   ],
//   seller: {
//     name: "Camera Collector",
//     avatar: "/placeholder.svg?height=40&width=40",
//     rating: 4.8,
//     totalSales: 156,
//   },
//   condition: "Excellent",
//   category: "Cameras & Photography",
//   location: "New York, NY",
//   shippingCost: 15,
//   endDate: "2024-03-15T18:00:00",
// }

// export default function AuctionDetailPage({ params }) {
//   const [bidAmount, setBidAmount] = useState(auctionData.currentBid + 10)
//   const { toast } = useToast();
  
//   const handleBid = () => {
//     toast({
//       title: "Bid placed successfully!",
//       description: `You placed a bid of $${bidAmount} on ${auctionData.title}`,
//     })
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid gap-8 md:grid-cols-2">
//         {/* Image Gallery */}
//         <div className="space-y-4">
//           <div className="relative aspect-4/3 overflow-hidden rounded-lg border">
//             <Image
//               src={'/image.png' || "/placeholder.svg"}
//               alt={auctionData.title}
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>
//           <div className="grid grid-cols-3 gap-4">
//             {auctionData.images.slice(1).map((image, index) => (
//               <div key={index} className="relative aspect-4/3 overflow-hidden rounded-lg border">
//                 <Image
//                   src={'/image.png' || "/placeholder.svg"}
//                   alt={`${auctionData.title} - Image ${index + 2}`}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Auction Details */}
//         <div className="space-y-6 mt-4">
//           <div>
//             <h1 className="text-3xl font-bold">{auctionData.title}</h1>
//             <div className="mt-2 flex items-center gap-4">
//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <Clock className="h-4 w-4" />
//                 {auctionData.timeLeft} left
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button variant="ghost" size="icon" className="hover:text-primary">
//                   <Heart className="h-5 w-5" />
//                 </Button>
//                 <Button variant="ghost" size="icon" className="hover:text-primary">
//                   <Share2 className="h-5 w-5" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//           <div className="min-w-[200px]">
//             <Card className="p-6 w-full">
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Current Bid</p>
//                   <p className="text-3xl font-bold text-primary">${auctionData.currentBid}</p>
//                   <p className="text-sm text-muted-foreground">{auctionData.bids} bids</p>
//                 </div>
//                 <div className="flex gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">Starting Price</p>
//                     <p className="font-medium">${auctionData.startingPrice}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">Reserve Price</p>
//                     <p className="font-medium">${auctionData.reservePrice}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">Increment</p>
//                     <p className="font-medium">${auctionData.incrementAmount}</p>
//                   </div>
//                 </div>
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button size="sm" className="gradient-bg border-0 w-full">
//                       Place Bid
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Place a Bid</DialogTitle>
//                       <DialogDescription>
//                         Current highest bid is ${auctionData.currentBid}. Your bid must be higher.
//                       </DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-4 py-4">
//                       <div className="grid gap-2">
//                         <Label htmlFor="bid-amount">Bid Amount ($)</Label>
//                         <Input
//                           id="bid-amount"
//                           type="number"
//                           min={auctionData.currentBid + 1}
//                           value={bidAmount}
//                           onChange={(e) => setBidAmount(Number(e.target.value))}
//                           className="border-primary/20"
//                         />
//                       </div>
//                     </div>
//                     <DialogFooter>
//                       <Button onClick={handleBid} className="gradient-bg border-0">
//                         Place Bid
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </Card>
//           </div>
          

//           <div className="space-y-4">
//             <div className="flex items-center gap-4">
//               <Avatar>
//                 <AvatarImage src={auctionData.seller.avatar} alt={auctionData.seller.name} />
//                 <AvatarFallback>{auctionData.seller.name[0]}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <p className="font-medium">{auctionData.seller.name}</p>
//                 <p className="text-sm text-muted-foreground">
//                   {auctionData.seller.rating} ★ · {auctionData.seller.totalSales} sales
//                 </p>
//               </div>
//             </div>
//           </div>

//           <Tabs defaultValue="details">
//             <TabsList>
//               <TabsTrigger value="details">Details</TabsTrigger>
//               <TabsTrigger value="shipping">Shipping</TabsTrigger>
//               <TabsTrigger value="seller">Seller</TabsTrigger>
//             </TabsList>
//             <TabsContent value="details" className="space-y-4">
//               <div>
//                 <h3 className="font-medium">Description</h3>
//                 <p className="text-muted-foreground">{auctionData.description}</p>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="font-medium">Condition</p>
//                   <p className="text-muted-foreground">{auctionData.condition}</p>
//                 </div>
//                 <div>
//                   <p className="font-medium">Category</p>
//                   <p className="text-muted-foreground">{auctionData.category}</p>
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="shipping">
//               <div className="space-y-4">
//                 <div>
//                   <p className="font-medium">Location</p>
//                   <p className="text-muted-foreground">{auctionData.location}</p>
//                 </div>
//                 <div>
//                   <p className="font-medium">Shipping Cost</p>
//                   <p className="text-muted-foreground">${auctionData.shippingCost}</p>
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="seller">
//               <div className="space-y-4">
//                 <div>
//                   <p className="font-medium">Seller Rating</p>
//                   <p className="text-muted-foreground">{auctionData.seller.rating} out of 5 stars</p>
//                 </div>
//                 <div>
//                   <p className="font-medium">Total Sales</p>
//                   <p className="text-muted-foreground">{auctionData.seller.totalSales} items sold</p>
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>

//       <div className="mt-12 grid gap-8">
//         <BidHistory auctionId={params.id} />
//       </div>
//     </div>
//   )
// }
'use client'
import { useState, useEffect } from 'react';
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Heart, Share2 } from "lucide-react"
import { BidHistory } from "@/components/bid-history"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/components/ui/use-toast';

const auctionData = {
  id: "1",
  title: "Vintage Polaroid Camera",
  description:
    "Original Polaroid camera from the 1970s in excellent condition. This rare piece comes with its original leather case and user manual. The camera has been tested and is in perfect working condition, producing the classic Polaroid look that photographers love. The lens is clear with no fungus or haze, and all mechanical parts operate smoothly.",
  currentBid: 120,
  bids: 8,
  timeLeft: "2 hours",
  startingPrice: 50,
  reservePrice: 100,
  incrementAmount: 10,
  images: [
    "/bag.jpeg",
    "/bag.jpeg",    
    "/bag.jpeg"
  ],
  seller: {
    name: "Camera Collector",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.8,
    totalSales: 156,
  },
  condition: "Excellent",
  category: "Cameras & Photography",
  location: "New York, NY",
  shippingCost: 15,
  endDate: "2024-03-15T18:00:00",
}

export default function AuctionDetailPage({ params }) {
  const [bidAmount, setBidAmount] = useState(auctionData.currentBid + 10)
  const { toast } = useToast();
  
  const handleBid = () => {
    toast({
      title: "Bid placed successfully!",
      description: `You placed a bid of $${bidAmount} on ${auctionData.title}`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 overflow-hidden rounded-lg border">
            <Image
              src={'/image.png' || "/placeholder.svg"}
              alt={auctionData.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {auctionData.images.slice(1).map((image, index) => (
              <div key={index} className="relative aspect-4/3 overflow-hidden rounded-lg border">
                <Image
                  src={'/image.png' || "/placeholder.svg"}
                  alt={`${auctionData.title} - Image ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Auction Details */}
        <div className="space-y-6 mt-4">
          <div>
            <h1 className="text-3xl font-bold">{auctionData.title}</h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {auctionData.timeLeft} left
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Current Bid Section */}
          <div className="w-full"> {/* Set a minimum height */}
            <Card className="p-6 w-full"> {/* Ensure the card takes full height */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Bid</p>
                  <p className="text-3xl font-bold text-primary">${auctionData.currentBid}</p>
                  <p className="text-sm text-muted-foreground">{auctionData.bids} bids</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Starting Price</p>
                    <p className="font-medium">${auctionData.startingPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reserve Price</p>
                    <p className="font-medium">${auctionData.reservePrice}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Increment</p>
                    <p className="font-medium">${auctionData.incrementAmount}</p>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gradient-bg border-0 w-full">
                      Place Bid
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Place a Bid</DialogTitle>
                      <DialogDescription>
                        Current highest bid is ${auctionData.currentBid}. Your bid must be higher.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="bid-amount">Bid Amount ($)</Label>
                        <Input
                          id="bid-amount"
                          type="number"
                          min={auctionData.currentBid + 1}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          className="border-primary/20"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleBid} className="gradient-bg border-0">
                        Place Bid
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={auctionData.seller.avatar} alt={auctionData.seller.name} />
                <AvatarFallback>{auctionData.seller.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{auctionData.seller.name}</p>
                <p className="text-sm text-muted-foreground">
                  {auctionData.seller.rating} ★ · {auctionData.seller.totalSales} sales
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground">{auctionData.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Condition</p>
                  <p className="text-muted-foreground">{auctionData.condition}</p>
                </div>
                <div>
                  <p className="font-medium">Category</p>
                  <p className="text-muted-foreground">{auctionData.category}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping">
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{auctionData.location}</p>
                </div>
                <div>
                  <p className="font-medium">Shipping Cost</p>
                  <p className="text-muted-foreground">${auctionData.shippingCost}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="seller">
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Seller Rating</p>
                  <p className="text-muted-foreground">{auctionData.seller.rating} out of 5 stars</p>
                </div>
                <div>
                  <p className="font-medium">Total Sales</p>
                  <p className="text-muted-foreground">{auctionData.seller.totalSales} items sold</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-12 grid gap-8">
        <BidHistory auctionId={params.id} />
      </div>
    </div>
  )
}