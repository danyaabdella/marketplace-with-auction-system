"use client"

import { cn } from "@/libs/utils"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, Edit, AlertTriangle, CheckCircle, XCircle, DollarSign, Users, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditAuctionForm } from "@/components/dashboard/editAuctionForm"

// Mock auction data based on the MongoDB schema
const auctionData = {
  id: "1",
  productId: "prod1",
  productName: "Vintage Polaroid Camera",
  merchantId: "merch1",
  description:
    "Original Polaroid camera from the 1970s in excellent condition. This rare piece comes with its original leather case and user manual. The camera has been tested and is in perfect working condition, producing the classic Polaroid look that photographers love. The lens is clear with no fungus or haze, and all mechanical parts operate smoothly.",
  condition: "used",
  startTime: "2024-03-10T10:00:00Z",
  endTime: "2024-03-15T10:00:00Z",
  itemImg: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  startingPrice: 120.0,
  reservedPrice: 200.0,
  bidIncrement: 10.0,
  status: "active",
  adminApproval: "rejected",
  paymentduration: "2024-03-17T10:00:00Z",
  quantity: 1,
  currentBid: 150.0,
  bids: [
    {
      id: "bid1",
      bidder: {
        id: "user1",
        name: "John Smith",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      amount: 150.0,
      time: "2024-03-12T14:30:00Z",
    },
    {
      id: "bid2",
      bidder: {
        id: "user2",
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      amount: 140.0,
      time: "2024-03-12T12:15:00Z",
    },
    {
      id: "bid3",
      bidder: {
        id: "user3",
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      amount: 130.0,
      time: "2024-03-11T18:45:00Z",
    },
  ],
}


// export default function AuctionDetailPage({ params }) {
//   const router = useRouter()
//   const [isEditAuctionOpen, setIsEditAuctionOpen] = useState(false)

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A"
//     return new Date(dateString).toLocaleString()
//   }

//   const getTimeLeft = () => {
//     const endTime = new Date(auctionData.endTime).getTime()
//     const now = new Date().getTime()
//     const timeLeft = endTime - now

//     if (timeLeft <= 0) return "Auction ended"

//     const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
//     const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
//     const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

//     return `${days}d ${hours}h ${minutes}m remaining`
//   }

//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-success/10 text-success"
//       case "ended":
//         return "bg-muted"
//       case "cancelled":
//         return "bg-destructive/10 text-destructive"
//       default:
//         return "bg-muted"
//     }
//   }

//   const getApprovalBadgeClass = (approval) => {
//     switch (approval) {
//       case "approved":
//         return "bg-success/10 text-success"
//       case "pending":
//         return "bg-warning/10 text-warning"
//       case "rejected":
//         return "bg-destructive/10 text-destructive"
//       default:
//         return "bg-muted"
//     }
//   }

//   const getApprovalIcon = (approval) => {
//     switch (approval) {
//       case "approved":
//         return <CheckCircle className="h-5 w-5 text-success" />
//       case "pending":
//         return <Clock className="h-5 w-5 text-warning" />
//       case "rejected":
//         return <XCircle className="h-5 w-5 text-destructive" />
//       default:
//         return null
//     }
//   }

//   // Calculate auction progress
//   const calculateProgress = () => {
//     const startTime = new Date(auctionData.startTime).getTime()
//     const endTime = new Date(auctionData.endTime).getTime()
//     const now = new Date().getTime()

//     if (now >= endTime) return 100
//     if (now <= startTime) return 0

//     const total = endTime - startTime
//     const elapsed = now - startTime
//     return Math.floor((elapsed / total) * 100)
//   }

//   // Check if edit button should be enabled
//   const canEdit = auctionData.adminApproval === "pending" || auctionData.adminApproval === "rejected"

//   return (
//     <div className="container p-6">
//       <div className="mb-6">
//         <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={() => router.back()}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Auctions
//         </Button>

//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold">{auctionData.productName}</h1>
//             <div className="flex flex-wrap gap-2 mt-2">
//               <Badge variant="outline" className="capitalize">
//                 {auctionData.condition} condition
//               </Badge>
//               <Badge className={cn("capitalize", getStatusBadgeClass(auctionData.status))}>{auctionData.status}</Badge>
//               <Badge
//                 className={cn("capitalize flex items-center gap-1", getApprovalBadgeClass(auctionData.adminApproval))}
//               >
//                 {getApprovalIcon(auctionData.adminApproval)}
//                 {auctionData.adminApproval}
//               </Badge>
//             </div>
//           </div>
//           <Button
//             className={cn(
//               "mt-4 sm:mt-0",
//               auctionData.adminApproval === "approved"? "gradient-bg border-0" : "bg-muted text-muted-foreground cursor-not-allowed",
//             )}
//             onClick={() => setIsEditAuctionOpen(true)}
//             disabled={auctionData.adminApproval === "approved"}
//           >
//             <Edit className="mr-2 h-4 w-4" />
//             Edit Auction
//           </Button>
//         </div>

//         {!canEdit && auctionData.adminApproval === "approved" && (
//           <div className="mt-4 flex items-center p-3 rounded-md bg-muted/50 text-sm">
//             <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
//             <span>This auction has been approved by an admin and cannot be edited.</span>
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Auction Images and Details */}
//         <div className="md:col-span-2 space-y-6">
//           <Card>
//             <CardContent className="p-6">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 {/* Main Image */}
//                 <div className="relative aspect-square overflow-hidden rounded-lg border">
//                   <Image
//                     src={auctionData.itemImg[0] || "/placeholder.svg"}
//                     alt={auctionData.productName}
//                     fill
//                     className="object-cover"
//                     priority
//                   />
//                 </div>

//                 {/* Auction Details */}
//                 <div className="space-y-4">
//                   <div>
//                     <h2 className="text-xl font-semibold">{auctionData.productName}</h2>
//                     <p className="text-muted-foreground capitalize">{auctionData.condition} condition</p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm text-muted-foreground">Current Bid</p>
//                     <p className="text-2xl font-bold">${auctionData.currentBid.toFixed(2)}</p>
//                     <p className="text-sm text-muted-foreground">
//                       Starting Price: ${auctionData.startingPrice.toFixed(2)}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       Reserve Price: ${auctionData.reservedPrice.toFixed(2)}
//                     </p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm text-muted-foreground">Bid Increment</p>
//                     <p className="font-medium">${auctionData.bidIncrement.toFixed(2)}</p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm text-muted-foreground">Time Remaining</p>
//                     <div className="flex items-center">
//                       <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
//                       <span className="font-medium">{getTimeLeft()}</span>
//                     </div>
//                     <div className="mt-2">
//                       <Progress value={calculateProgress()} className="h-2" />
//                     </div>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm text-muted-foreground">Auction Period</p>
//                     <p className="font-medium">
//                       {formatDate(auctionData.startTime)} - {formatDate(auctionData.endTime)}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Additional Images */}
//               {auctionData.itemImg.length > 1 && (
//                 <div className="mt-6 grid grid-cols-4 gap-2">
//                   {auctionData.itemImg.slice(0, 4).map((image, index) => (
//                     <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
//                       <Image
//                         src={image || "/placeholder.svg"}
//                         alt={`${auctionData.productName} - Image ${index + 1}`}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Description */}
//               <div className="mt-6">
//                 <h3 className="font-semibold mb-2">Description</h3>
//                 <p className="text-muted-foreground whitespace-pre-line">{auctionData.description}</p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Bid History */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Bid History</CardTitle>
//               <CardDescription>
//                 {auctionData.bids.length > 0
//                   ? `${auctionData.bids.length} bids on this auction`
//                   : "No bids yet on this auction"}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {auctionData.bids.length > 0 ? (
//                 <div className="space-y-4">
//                   {auctionData.bids.map((bid) => (
//                     <div
//                       key={bid.id}
//                       className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
//                     >
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-8 w-8">
//                           <AvatarImage src={bid.bidder.avatar} alt={bid.bidder.name} />
//                           <AvatarFallback>{bid.bidder.name[0]}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <p className="font-medium">{bid.bidder.name}</p>
//                           <p className="text-xs text-muted-foreground">{formatDate(bid.time)}</p>
//                         </div>
//                       </div>
//                       <p className="font-medium text-primary">${bid.amount.toFixed(2)}</p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-center py-6 text-muted-foreground">No bids have been placed on this auction yet.</p>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Auction Stats */}
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Auction Status</CardTitle>
//               <CardDescription>Current status and approval information</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-muted-foreground">Status</span>
//                   <Badge className={cn("capitalize", getStatusBadgeClass(auctionData.status))}>
//                     {auctionData.status}
//                   </Badge>
//                 </div>
//                 <Separator />
//                 <div className="flex items-center justify-between">
//                   <span className="text-muted-foreground">Admin Approval</span>
//                   <Badge
//                     className={cn(
//                       "capitalize flex items-center gap-1",
//                       getApprovalBadgeClass(auctionData.adminApproval),
//                     )}
//                   >
//                     {getApprovalIcon(auctionData.adminApproval)}
//                     {auctionData.adminApproval}
//                   </Badge>
//                 </div>
//                 <Separator />
//                 <div className="flex items-center justify-between">
//                   <span className="text-muted-foreground">Quantity</span>
//                   <span className="font-medium">{auctionData.quantity}</span>
//                 </div>
//                 <Separator />
//                 <div className="flex items-center justify-between">
//                   <span className="text-muted-foreground">Payment Due</span>
//                   <span className="font-medium">
//                     {auctionData.paymentduration ? formatDate(auctionData.paymentduration) : "N/A"}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Auction Stats</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="flex items-center p-4 rounded-lg bg-muted/30">
//                   <DollarSign className="h-8 w-8 mr-4 text-primary" />
//                   <div>
//                     <p className="text-sm text-muted-foreground">Current Bid</p>
//                     <p className="text-xl font-bold">
//                       $
//                       {auctionData.currentBid > 0
//                         ? auctionData.currentBid.toFixed(2)
//                         : auctionData.startingPrice.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center p-4 rounded-lg bg-muted/30">
//                   <Users className="h-8 w-8 mr-4 text-primary" />
//                   <div>
//                     <p className="text-sm text-muted-foreground">Total Bids</p>
//                     <p className="text-xl font-bold">{auctionData.bids.length}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center p-4 rounded-lg bg-muted/30">
//                   <Calendar className="h-8 w-8 mr-4 text-primary" />
//                   <div>
//                     <p className="text-sm text-muted-foreground">Duration</p>
//                     <p className="text-xl font-bold">
//                       {Math.ceil(
//                         (new Date(auctionData.endTime).getTime() - new Date(auctionData.startTime).getTime()) /
//                           (1000 * 60 * 60 * 24),
//                       )}{" "}
//                       days
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {auctionData.adminApproval === "rejected" && (
//             <Card className="border-destructive">
//               <CardHeader className="bg-destructive/10">
//                 <CardTitle className="text-destructive flex items-center">
//                   <AlertTriangle className="h-5 w-5 mr-2" />
//                   Rejection Notice
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="pt-4">
//                 <p className="text-sm">
//                   This auction has been rejected by an admin. Please review and update the auction details to meet our
//                   guidelines, then resubmit for approval.
//                 </p>
//                 <Button
//                   className="w-full mt-4 gradient-bg border-0"
//                   onClick={() => setIsEditAuctionOpen(true)}
//                   disabled={auctionData.adminApproval === "approved"}
//                 >
//                   <Edit className="mr-2 h-4 w-4" />
//                   Edit Auction
//                 </Button>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//       {/* Edit Auction Form Dialog */}
//       <EditAuctionForm open={isEditAuctionOpen} onOpenChange={setIsEditAuctionOpen} auction={auctionData} />
//     </div>
//   )
// }

export default function AuctionDetailPage({ params }) {
  const router = useRouter()
  const [isEditAuctionOpen, setIsEditAuctionOpen] = useState(false)

    const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  const getTimeLeft = () => {
    const endTime = new Date(auctionData.endTime).getTime()
    const now = new Date().getTime()
    const timeLeft = endTime - now

    if (timeLeft <= 0) return "Auction ended"

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

    return `${days}d ${hours}h ${minutes}m remaining`
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success"
      case "ended":
        return "bg-muted"
      case "cancelled":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted"
    }
  }

  const getApprovalBadgeClass = (approval) => {
    switch (approval) {
      case "approved":
        return "bg-success/10 text-success"
      case "pending":
        return "bg-warning/10 text-warning"
      case "rejected":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted"
    }
  }

  const getApprovalIcon = (approval) => {
    switch (approval) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-success" />
      case "pending":
        return <Clock className="h-5 w-5 text-warning" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return null
    }
  }

  // Calculate auction progress
  const calculateProgress = () => {
    const startTime = new Date(auctionData.startTime).getTime()
    const endTime = new Date(auctionData.endTime).getTime()
    const now = new Date().getTime()

    if (now >= endTime) return 100
    if (now <= startTime) return 0

    const total = endTime - startTime
    const elapsed = now - startTime
    return Math.floor((elapsed / total) * 100)
  }

  // Check if edit button should be enabled
  const canEdit = auctionData.adminApproval === "pending" || auctionData.adminApproval === "rejected"


  return (
    <div className="container p-6">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Auctions
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{auctionData.productName}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="capitalize">
                {auctionData.condition} condition
              </Badge>
              <Badge className={cn("capitalize", getStatusBadgeClass(auctionData.status))}>{auctionData.status}</Badge>
              <Badge
                className={cn("capitalize flex items-center gap-1", getApprovalBadgeClass(auctionData.adminApproval))}
              >
                {getApprovalIcon(auctionData.adminApproval)}
                {auctionData.adminApproval}
              </Badge>
            </div>
          </div>
          <Button
            className={cn(
              "mt-4 sm:mt-0",
              auctionData.adminApproval === "approved" ? "bg-muted text-muted-foreground cursor-not-allowed" : "gradient-bg border-0"
            )}
            onClick={() => setIsEditAuctionOpen(true)}
            disabled={auctionData.adminApproval === "approved"}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Auction
          </Button>
        </div>

        {auctionData.adminApproval === "approved" && (
          <div className="mt-4 flex items-center p-3 rounded-md bg-muted/50 text-sm">
            <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>This auction has been approved by an admin and cannot be edited.</span>
          </div>
        )}
      </div>

      {/* ... (rest of the component code) */}
      
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Auction Images and Details */}
         <div className="md:col-span-2 space-y-6">
           <Card>
             <CardContent className="p-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {/* Main Image */}
                 <div className="relative aspect-square overflow-hidden rounded-lg border">
                   <Image
                     src={auctionData.itemImg[0] || "/placeholder.svg"}
                     alt={auctionData.productName}
                     fill
                     className="object-cover"
                     priority
                   />
                 </div>

                {/* Auction Details */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">{auctionData.productName}</h2>
                    <p className="text-muted-foreground capitalize">{auctionData.condition} condition</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Current Bid</p>
                    <p className="text-2xl font-bold">${auctionData.currentBid.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      Starting Price: ${auctionData.startingPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Reserve Price: ${auctionData.reservedPrice.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Bid Increment</p>
                    <p className="font-medium">${auctionData.bidIncrement.toFixed(2)}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Time Remaining</p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{getTimeLeft()}</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={calculateProgress()} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Auction Period</p>
                    <p className="font-medium">
                      {formatDate(auctionData.startTime)} - {formatDate(auctionData.endTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Images */}
              {auctionData.itemImg.length > 1 && (
                <div className="mt-6 grid grid-cols-4 gap-2">
                  {auctionData.itemImg.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${auctionData.productName} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{auctionData.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Bid History */}
          <Card>
            <CardHeader>
              <CardTitle>Bid History</CardTitle>
              <CardDescription>
                {auctionData.bids.length > 0
                  ? `${auctionData.bids.length} bids on this auction`
                  : "No bids yet on this auction"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auctionData.bids.length > 0 ? (
                <div className="space-y-4">
                  {auctionData.bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={bid.bidder.avatar} alt={bid.bidder.name} />
                          <AvatarFallback>{bid.bidder.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{bid.bidder.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(bid.time)}</p>
                        </div>
                      </div>
                      <p className="font-medium text-primary">${bid.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">No bids have been placed on this auction yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Auction Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auction Status</CardTitle>
              <CardDescription>Current status and approval information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={cn("capitalize", getStatusBadgeClass(auctionData.status))}>
                    {auctionData.status}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Admin Approval</span>
                  <Badge
                    className={cn(
                      "capitalize flex items-center gap-1",
                      getApprovalBadgeClass(auctionData.adminApproval),
                    )}
                  >
                    {getApprovalIcon(auctionData.adminApproval)}
                    {auctionData.adminApproval}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{auctionData.quantity}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Due</span>
                  <span className="font-medium">
                    {auctionData.paymentduration ? formatDate(auctionData.paymentduration) : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auction Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center p-4 rounded-lg bg-muted/30">
                  <DollarSign className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Current Bid</p>
                    <p className="text-xl font-bold">
                      $
                      {auctionData.currentBid > 0
                        ? auctionData.currentBid.toFixed(2)
                        : auctionData.startingPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-lg bg-muted/30">
                  <Users className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bids</p>
                    <p className="text-xl font-bold">{auctionData.bids.length}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-lg bg-muted/30">
                  <Calendar className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-xl font-bold">
                      {Math.ceil(
                        (new Date(auctionData.endTime).getTime() - new Date(auctionData.startTime).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
          </div>

      {/* Rejection Notice Card */}
      {auctionData.adminApproval === "rejected" && (
        <Card className="border-destructive">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="text-destructive flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Rejection Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm">
              This auction has been rejected by an admin. Please review and update the auction details to meet our
              guidelines, then resubmit for approval.
            </p>
            <Button
              className="w-full mt-4 gradient-bg border-0"
              onClick={() => setIsEditAuctionOpen(true)}
              disabled={auctionData.adminApproval === "approved"}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Auction
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Auction Form Dialog */}
      <EditAuctionForm open={isEditAuctionOpen} onOpenChange={setIsEditAuctionOpen} auction={auctionData} />
    </div>
  )
}