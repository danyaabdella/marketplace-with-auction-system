// import { AuctionCard } from "./auction-card"

// export function AuctionGrid() {
//   const auctions= [
//     {
//       id: "1",
//       title: "Vintage Polaroid Camera",
//       description: "Original Polaroid camera from the 1970s in excellent condition.",
//       currentBid: 120,
//       bids: 8,
//       timeLeft: "2 hours",
//       imageUrl: "/placeholder.svg?height=300&width=400",
//       seller: {
//         name: "Camera Collector",
//         avatar: "/placeholder.svg?height=40&width=40",
//       },
//     },
//     {
//       id: "2",
//       title: "Antique Wooden Desk",
//       description: "Beautiful oak desk from the early 20th century.",
//       currentBid: 350,
//       bids: 12,
//       timeLeft: "1 day",
//       imageUrl: "/placeholder.svg?height=300&width=400",
//       seller: {
//         name: "Vintage Furniture",
//         avatar: "/placeholder.svg?height=40&width=40",
//       },
//     },
//     {
//       id: "3",
//       title: "Limited Edition Vinyl Record",
//       description: "Rare first pressing of a classic album, still sealed.",
//       currentBid: 75,
//       bids: 5,
//       timeLeft: "4 hours",
//       imageUrl: "/placeholder.svg?height=300&width=400",
//       seller: {
//         name: "Music Enthusiast",
//         avatar: "/placeholder.svg?height=40&width=40",
//       },
//     },
//     {
//       id: "4",
//       title: "Handcrafted Leather Bag",
//       description: "Premium leather messenger bag, handmade by artisans.",
//       currentBid: 180,
//       bids: 9,
//       timeLeft: "3 days",
//       imageUrl: "/placeholder.svg?height=300&width=400",
//       seller: {
//         name: "Leather Artisan",
//         avatar: "/placeholder.svg?height=40&width=40",
//       },
//     },
//     {
//       id: "5",
//       title: "Vintage Mechanical Watch",
//       description: "Swiss-made mechanical watch from the 1960s, recently serviced.",
//       currentBid: 450,
//       bids: 15,
//       timeLeft: "12 hours",
//       imageUrl: "/placeholder.svg?height=300&width=400",
//       seller: {
//         name: "Watch Collector",
//         avatar: "/placeholder.svg?height=40&width=40",
//       },
//     },
//     {
//       id: "6",
//       title: "Art Deco Table Lamp",
//       description: "Original Art Deco lamp with stained glass shade.",
//       currentBid: 220,
//       bids: 7,
//       timeLeft: "2 days",
//       imageUrl: "/placeholder.svg?height=300&width=400",
//       seller: {
//         name: "Vintage Lighting",
//         avatar: "/placeholder.svg?height=40&width=40",
//       },
//     },
//   ]

//   return (
//     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//       {auctions.map((auction) => (
//         <AuctionCard key={auction.id} auction={auction} />
//       ))}
//     </div>
//   )
// }

"use client"

import { AuctionCard } from "./auction-card"
import { useEffect, useState, useCallback, useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function AuctionGrid({ filters = {} }) {
    const [auctions, setAuctions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    // Create stable filter object to prevent unnecessary re-renders
    const stableFilters = useMemo(() => filters, [JSON.stringify(filters)])

    const fetchAuctions = useCallback(async () => {
        try {
            setLoading(true)
            const queryParams = new URLSearchParams({
                type: "all-active",
                ...stableFilters
            }).toString()

            const response = await fetch(`/api/fetchAuctions?${queryParams}`)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            setAuctions(data)
            setError(null)
        } catch (err) {
            setError(err.message)
            console.error('Error fetching auctions:', err)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [stableFilters]) 

    // Initial fetch and fetch when filters change
    useEffect(() => {
        const controller = new AbortController()
        fetchAuctions()

        return () => {
            controller.abort()
        }
    }, [fetchAuctions])

    const refreshAuctions = () => {
        setRefreshing(true)
        fetchAuctions()
    }

    if (loading && !refreshing) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <p className="text-red-500">Error loading auctions: {error}</p>
                <Button 
                    variant="outline" 
                    onClick={refreshAuctions}
                    disabled={refreshing}
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Retry
                </Button>
            </div>
        )
    }

    if (auctions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <p className="text-muted-foreground">No active auctions found</p>
                <Button 
                    variant="outline" 
                    onClick={refreshAuctions}
                    disabled={refreshing}
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={refreshAuctions}
                    disabled={refreshing}
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {auctions.map((auction) => (
                    <AuctionCard 
                        key={auction._id} 
                        auction={{
                            id: auction._id,
                            title: auction.productName,
                            description: auction.description,
                            currentBid: auction.currentBid || auction.startingPrice,
                            bids: auction.bidCount || 0,
                            timeLeft: formatTimeLeft(auction.timeLeft),
                            imageUrl: auction.mainImage || '/placeholder.svg',
                            seller: {
                                name: auction.merchantId?.fullName || 'Seller',
                                avatar: auction.merchantId?.image || '/placeholder.svg'
                            },
                            endTime: auction.endTime
                        }} 
                    />
                ))}
            </div>
        </>
    )
}

function formatTimeLeft(hours) {
    if (hours <= 0) return 'Ended'
    
    const days = Math.floor(hours / 24)
    const remainingHours = Math.floor(hours % 24)
    
    if (days > 0) {
        return `${days}d ${remainingHours}h`
    }
    return `${Math.floor(hours)}h`
}