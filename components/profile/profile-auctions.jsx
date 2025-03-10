"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AuctionCard } from "@/components/auction-card"
import { Clock, Plus } from "lucide-react"

// Mock auction data - in a real app, you would fetch this from your API
const mockAuctions = {
  participating: [
    {
      id: "auction1",
      title: "Vintage Camera Collection",
      image: "/placeholder.svg?height=200&width=300",
      currentBid: 250,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      bids: 12,
      condition: "used",
    },
    {
      id: "auction2",
      title: "Antique Wooden Desk",
      image: "/placeholder.svg?height=200&width=300",
      currentBid: 450,
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      bids: 8,
      condition: "used",
    },
  ],
  won: [
    {
      id: "auction3",
      title: "Vintage Vinyl Records",
      image: "/placeholder.svg?height=200&width=300",
      currentBid: 120,
      endTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      bids: 15,
      condition: "used",
    },
  ],
  created: [
    {
      id: "auction4",
      title: "Handcrafted Jewelry Collection",
      image: "/placeholder.svg?height=200&width=300",
      currentBid: 350,
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      bids: 5,
      condition: "new",
    },
    {
      id: "auction5",
      title: "Rare Book Collection",
      image: "/placeholder.svg?height=200&width=300",
      currentBid: 180,
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      bids: 7,
      condition: "used",
    },
    {
      id: "auction6",
      title: "Vintage Watch",
      image: "/placeholder.svg?height=200&width=300",
      currentBid: 220,
      endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      bids: 10,
      condition: "used",
    },
  ],
}

export function ProfileAuctions({ userId, isMerchant }) {
  const [auctions, setAuctions] = useState({
    participating: [],
    won: [],
    created: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(isMerchant ? "created" : "participating")

  useEffect(() => {
    // In a real app, you would fetch auctions from your API
    // async function fetchAuctions() {
    //   try {
    //     const participating = await fetch(`/api/users/${userId}/auctions/participating`).then(res => res.json())
    //     const won = await fetch(`/api/users/${userId}/auctions/won`).then(res => res.json())
    //     const created = isMerchant ? await fetch(`/api/users/${userId}/auctions/created`).then(res => res.json()) : []
    //
    //     setAuctions({ participating, won, created })
    //   } catch (error) {
    //     console.error('Error fetching auctions:', error)
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }
    //
    // fetchAuctions()

    // Using mock data for demonstration
    setTimeout(() => {
      setAuctions({
        participating: mockAuctions.participating,
        won: mockAuctions.won,
        created: isMerchant ? mockAuctions.created : [],
      })
      setIsLoading(false)
    }, 1000)
  }, [userId, isMerchant])

  if (isLoading) {
    return <AuctionsSkeleton isMerchant={isMerchant} />
  }

  const hasNoAuctions =
    auctions.participating.length === 0 && auctions.won.length === 0 && (!isMerchant || auctions.created.length === 0)

  if (hasNoAuctions) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No Auctions Yet</h3>
          <p className="text-muted-foreground mt-1">You haven't participated in any auctions yet.</p>
          <Button className="mt-6">Browse Auctions</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Auctions</CardTitle>
          <CardDescription>Auctions you've participated in, won, or created</CardDescription>
        </div>
        {isMerchant && (
          <Link href="/dashboard/auctions/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Auction
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-3 mb-6">
            <TabsTrigger value="participating" disabled={auctions.participating.length === 0}>
              Participating ({auctions.participating.length})
            </TabsTrigger>
            <TabsTrigger value="won" disabled={auctions.won.length === 0}>
              Won ({auctions.won.length})
            </TabsTrigger>
            {isMerchant && (
              <TabsTrigger value="created" disabled={auctions.created.length === 0}>
                Created ({auctions.created.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="participating">
            {auctions.participating.length === 0 ? (
              <EmptyState message="You're not participating in any auctions yet." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.participating.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    id={auction.id}
                    title={auction.title}
                    image={auction.image}
                    currentBid={auction.currentBid}
                    endTime={new Date(auction.endTime)}
                    bids={auction.bids}
                    condition={auction.condition}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="won">
            {auctions.won.length === 0 ? (
              <EmptyState message="You haven't won any auctions yet." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.won.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    id={auction.id}
                    title={auction.title}
                    image={auction.image}
                    currentBid={auction.currentBid}
                    endTime={new Date(auction.endTime)}
                    bids={auction.bids}
                    condition={auction.condition}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {isMerchant && (
            <TabsContent value="created">
              {auctions.created.length === 0 ? (
                <EmptyState message="You haven't created any auctions yet." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {auctions.created.map((auction) => (
                    <AuctionCard
                      key={auction.id}
                      id={auction.id}
                      title={auction.title}
                      image={auction.image}
                      currentBid={auction.currentBid}
                      endTime={new Date(auction.endTime)}
                      bids={auction.bids}
                      condition={auction.condition}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Clock className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">{message}</p>
      <Button className="mt-6">Browse Auctions</Button>
    </div>
  )
}

function AuctionsSkeleton({ isMerchant }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        {isMerchant && <Skeleton className="h-9 w-32" />}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

