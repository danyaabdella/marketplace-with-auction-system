"use client"

import { useEffect, useState } from "react"
import { AuctionCard } from "@/components/auction-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// This would be replaced with your actual API call
async function fetchEndingSoonAuctions() {
  // In a real implementation, this would be a fetch call to your API
  // Example: return fetch('/api/auctions/ending-soon').then(res => res.json())

  // For now, we'll simulate a delay and return mock data
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // const now = new Date()
  // const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  // Mock data for auctions ending soon
  return [
    {
      id: "1",
      title: "Vintage Camera",
      description: "A beautiful vintage camera in excellent condition",
      currentBid: 120,
      bids: 8,
      endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      image: "/placeholder.svg?height=300&width=400",
      status: "active",
      condition: "used",
    },
    {
      id: "2",
      title: "Antique Watch",
      description: "Rare antique watch from the 1920s",
      currentBid: 350,
      bids: 12,
      endTime: new Date(now.getTime() + 5 * 60 * 60 * 1000), // 5 hours from now
      image: "/placeholder.svg?height=300&width=400",
      status: "active",
      condition: "used",
    },
    {
      id: "3",
      title: "Modern Art Painting",
      description: "Original painting by an emerging artist",
      currentBid: 500,
      bids: 6,
      endTime: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours from now
      image: "/placeholder.svg?height=300&width=400",
      status: "active",
      condition: "new",
    },
    {
      id: "4",
      title: "Collectible Coins",
      description: "Set of rare collectible coins",
      currentBid: 220,
      bids: 15,
      endTime: new Date(now.getTime() + 18 * 60 * 60 * 1000), // 18 hours from now
      image: "/placeholder.svg?height=300&width=400",
      status: "active",
      condition: "used",
    },
  ]
}

export function EndingSoonAuctions() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getAuctions = async () => {
      try {
        setLoading(true)
        const data = await fetchEndingSoonAuctions()
        const now = Date.now()
        const updatedData = data.map((auction) => ({
          ...auction,
          endTime: new Date(now + auction.endTime),
        }))
        setAuctions(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch auctions:", err)
        setError("Failed to load auctions. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    getAuctions()
  }, [])

  if (loading) {
    return <EndingSoonSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (auctions.length === 0) {
    return (
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertTitle>No auctions ending soon</AlertTitle>
        <AlertDescription>
          There are currently no auctions ending within the next 24 hours. Check back later!
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="scroll-smooth overflow-x-hidden mt-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {auctions.map((auction) => (
          <AuctionCard
            key={auction.id}
            id={auction.id}
            title={auction.title}
            description={auction.description}
            currentBid={auction.currentBid}
            bids={auction.bids}
            timeLeft={getTimeLeft(auction.endTime)}
            image={auction.image}
            status={auction.status}
            condition={auction.condition}
            urgent={getUrgencyLevel(auction.endTime)}
          />
        ))}
      </div>
    </div>
  )
}

// Helper function to calculate time left in a human-readable format
function getTimeLeft(endTime) {
  const now = new Date()
  const timeLeft = endTime.getTime() - now.getTime()

  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

// Helper function to determine urgency level based on time left
function getUrgencyLevel(endTime) {
  const now = new Date()
  const hoursLeft = (endTime.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursLeft < 3) {
    return "high"
  } else if (hoursLeft < 12) {
    return "medium"
  } else {
    return "low"
  }
}

function EndingSoonSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

