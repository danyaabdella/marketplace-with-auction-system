"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { MyAuctionCard } from "@/components/my-auctions-card"
import { useRouter } from "next/navigation";

// Mock data for auctions the user is participating in
// const myAuctions = [
//   {
//     id: "1",
//     title: "Vintage Polaroid Camera",
//     description: "Original Polaroid camera from the 1970s in excellent condition.",
//     currentBid: 150,
//     myBid: 150,
//     isHighestBidder: true,
//     bids: 8,
//     timeLeft: "2 hours",
//     endDate: "2024-03-15T18:00:00",
//     imageUrl: "/placeholder.svg?height=300&width=400",
//     seller: {
//       name: "Camera Collector",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     hasNewActivity: true,
//     status: "active",
//     bidHistory: [
//       { id: "bid1", bidder: "You", amount: 150, time: "2 hours ago", isYou: true },
//       { id: "bid2", bidder: "Sarah Chen", amount: 140, time: "3 hours ago", isYou: false },
//       { id: "bid3", bidder: "Michael Brown", amount: 130, time: "5 hours ago", isYou: false },
//     ],
//   },
//   {
//     id: "2",
//     title: "Antique Wooden Desk",
//     description: "Beautiful oak desk from the early 20th century.",
//     currentBid: 525,
//     myBid: 500,
//     isHighestBidder: false,
//     bids: 12,
//     timeLeft: "Ended",
//     endDate: "2024-03-10T10:00:00",
//     imageUrl: "/placeholder.svg?height=300&width=400",
//     seller: {
//       name: "Vintage Furniture",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     hasNewActivity: false,
//     status: "ended",
//     bidHistory: [
//       { id: "bid1", bidder: "Emma Wilson", amount: 525, time: "2 days ago", isYou: false },
//       { id: "bid2", bidder: "You", amount: 500, time: "3 days ago", isYou: true },
//       { id: "bid3", bidder: "John Smith", amount: 475, time: "3 days ago", isYou: false },
//     ],
//   },
//   {
//     id: "3",
//     title: "Limited Edition Vinyl Record",
//     description: "Rare first pressing of a classic album, still sealed.",
//     currentBid: 95,
//     myBid: 95,
//     isHighestBidder: true,
//     bids: 6,
//     timeLeft: "4 hours",
//     endDate: "2024-03-15T20:00:00",
//     imageUrl: "/placeholder.svg?height=300&width=400",
//     seller: {
//       name: "Music Enthusiast",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     hasNewActivity: true,
//     status: "active",
//     bidHistory: [
//       { id: "bid1", bidder: "You", amount: 95, time: "1 hour ago", isYou: true },
//       { id: "bid2", bidder: "Alex Thompson", amount: 90, time: "2 hours ago", isYou: false },
//       { id: "bid3", bidder: "Jessica Lee", amount: 85, time: "3 hours ago", isYou: false },
//     ],
//   },
//   {
//     id: "4",
//     title: "Handcrafted Leather Bag",
//     description: "Premium leather messenger bag, handmade by artisans.",
//     currentBid: 210,
//     myBid: 180,
//     isHighestBidder: false,
//     bids: 9,
//     timeLeft: "1 day",
//     endDate: "2024-03-16T15:00:00",
//     imageUrl: "/placeholder.svg?height=300&width=400",
//     seller: {
//       name: "Leather Artisan",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     hasNewActivity: true,
//     status: "active",
//     bidHistory: [
//       { id: "bid1", bidder: "Robert Johnson", amount: 210, time: "5 hours ago", isYou: false },
//       { id: "bid2", bidder: "You", amount: 180, time: "1 day ago", isYou: true },
//       { id: "bid3", bidder: "Maria Garcia", amount: 170, time: "1 day ago", isYou: false },
//     ],
//   },
//   {
//     id: "5",
//     title: "Vintage Mechanical Watch",
//     description: "Swiss-made mechanical watch from the 1960s, recently serviced.",
//     currentBid: 450,
//     myBid: 450,
//     isHighestBidder: true,
//     bids: 15,
//     timeLeft: "Won",
//     endDate: "2024-03-05T12:00:00",
//     imageUrl: "/placeholder.svg?height=300&width=400",
//     seller: {
//       name: "Watch Collector",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     hasNewActivity: false,
//     status: "won",
//     bidHistory: [
//       { id: "bid1", bidder: "You", amount: 450, time: "5 days ago", isYou: true },
//       { id: "bid2", bidder: "David Kim", amount: 425, time: "5 days ago", isYou: false },
//       { id: "bid3", bidder: "Lisa Wang", amount: 400, time: "6 days ago", isYou: false },
//     ],
//   },
//   {
//     id: "6",
//     title: "Art Deco Table Lamp",
//     description: "Original Art Deco lamp with stained glass shade.",
//     currentBid: 320,
//     myBid: 300,
//     isHighestBidder: false,
//     bids: 11,
//     timeLeft: "Lost",
//     endDate: "2024-03-08T16:00:00",
//     imageUrl: "/placeholder.svg?height=300&width=400",
//     seller: {
//       name: "Vintage Lighting",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     hasNewActivity: false,
//     status: "lost",
//     bidHistory: [
//       { id: "bid1", bidder: "Thomas Wilson", amount: 320, time: "7 days ago", isYou: false },
//       { id: "bid2", bidder: "You", amount: 300, time: "7 days ago", isYou: true },
//       { id: "bid3", bidder: "Anna Martinez", amount: 280, time: "8 days ago", isYou: false },
//     ],
//   },
// ]

export default function MyAuctionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOption, setSortOption] = useState("ending-soon")
  const router = useRouter();
  const [selectedAuction, setSelectedAuction] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [data, setData] = useState({ allActive: [], activeBids: [], won: [], lost: [] })
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    async function fetchAuctions() {
      setLoading(true)
      const res = await fetch("/api/fetchAuctions/auctionById")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
      setLoading(false)
    }
    fetchAuctions()
  }, [])

  // Filter auctions based on search query and status
  // const filteredAuctions = myAuctions.filter((auction) => {
  //   const matchesSearch =
  //     auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     auction.description.toLowerCase().includes(searchQuery.toLowerCase())

  //   if (statusFilter === "all") return matchesSearch
  //   if (statusFilter === "active") return matchesSearch && auction.status === "active"
  //   if (statusFilter === "won") return matchesSearch && auction.status === "won"
  //   if (statusFilter === "lost") return matchesSearch && auction.status === "lost"
  //   if (statusFilter === "ended")
  //     return matchesSearch && (auction.status === "ended" || auction.status === "won" || auction.status === "lost")

  //   return matchesSearch
  // })

  // // Sort auctions based on selected option
  // const sortedAuctions = [...filteredAuctions].sort((a, b) => {
  //   if (sortOption === "ending-soon") {
  //     if (a.status !== "active" && b.status === "active") return 1
  //     if (a.status === "active" && b.status !== "active") return -1
  //     if (a.status !== "active" && b.status !== "active") return 0
  //     return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  //   }
  //   if (sortOption === "newest") {
  //     return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  //   }
  //   if (sortOption === "highest-bid") {
  //     return b.currentBid - a.currentBid
  //   }
  //   if (sortOption === "most-bids") {
  //     return b.bids - a.bids
  //   }
  //   return 0
  // })
  const baseArray = {
    all: data.participated,
    active: data.activeBids,
    won: data.won,
    lost: data.lost,
  }[statusFilter] || []

  // 1) Filter by search + status (for “ended” tab include both won+lost)
  const filtered = baseArray.filter(auction => {
    const matchesSearch =
      auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // 2) Sort according to sortOption
  const sorted = filtered.sort((a, b) => {
    if (sortOption === "ending-soon") {
      // active first, then by soonest endDate
      if (a.status !== "active" && b.status === "active") return 1
      if (a.status === "active" && b.status !== "active") return -1
      return new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
    }
    if (sortOption === "newest") {
      return new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
    }
    if (sortOption === "highest-bid") {
      return b.highestBid - a.highestBid
    }
    if (sortOption === "most-bids") {
      return b.totalQuantity - a.totalQuantity // or use b.bidCount if you have it
    }
    return 0
  })


  const handleAuctionClick = (auction) => {
    router.push(`/auctions/${auction}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Auctions</h1>
        <p className="text-muted-foreground mt-1">Track and manage auctions you're participating in</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your auctions..."
            className="pl-9 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="sm:hidden" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <div className={`flex-1 sm:flex items-center gap-2 ${showFilters ? "flex" : "hidden"}`}>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Auctions</SelectItem>
                <SelectItem value="active">Active Bids</SelectItem>
                <SelectItem value="won">Won Auctions</SelectItem>
                <SelectItem value="lost">Lost Auctions</SelectItem>
                <SelectItem value="ended">Ended Auctions</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="highest-bid">Highest Bid</SelectItem>
                <SelectItem value="most-bids">Most Bids</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

       <Tabs
        defaultValue="all"
        onValueChange={(val) => setStatusFilter(val)}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Auctions</TabsTrigger>
          <TabsTrigger value="active">Active Bids</TabsTrigger>
          <TabsTrigger value="won">Won</TabsTrigger>
          <TabsTrigger value="lost">Lost</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="text-center py-12">Loading…</div>
            ) : sorted.length > 0 ? (
              <TabsContent value={statusFilter} className="mt-0">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sorted.map((auction) => (
                    <MyAuctionCard
                      key={auction._id}
                      auction={auction}
                      onClick={() => handleAuctionClick(auction)}
                    />
                  ))}
                </div>
              </TabsContent>
            ) : (
              <TabsContent value={statusFilter} className="mt-0 text-center py-12">
                <h3 className="text-lg font-medium">No auctions found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </TabsContent>
            )}
      </Tabs>

      {/* Auction Detail Dialog */}
      {/* {selectedAuction && (
        <AuctionDetailDialog open={isDetailOpen} onOpenChange={setIsDetailOpen} auction={selectedAuction} />
      )} */}
    </div>
  )
}

