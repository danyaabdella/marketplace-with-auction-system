import { AuctionCard } from "@/components/auction-card"

export function AuctionGrid() {
  const auctions = [
    {
      id: "1",
      title: "Vintage Polaroid Camera",
      description: "Original Polaroid camera from the 1970s in excellent condition.",
      currentBid: 120,
      bids: 8,
      timeLeft: "2 hours",
      imageUrl: "/placeholder.svg?height=300&width=400",
      seller: {
        name: "Camera Collector",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "2",
      title: "Antique Wooden Desk",
      description: "Beautiful oak desk from the early 20th century.",
      currentBid: 350,
      bids: 12,
      timeLeft: "1 day",
      imageUrl: "/placeholder.svg?height=300&width=400",
      seller: {
        name: "Vintage Furniture",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "3",
      title: "Limited Edition Vinyl Record",
      description: "Rare first pressing of a classic album, still sealed.",
      currentBid: 75,
      bids: 5,
      timeLeft: "4 hours",
      imageUrl: "/placeholder.svg?height=300&width=400",
      seller: {
        name: "Music Enthusiast",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "4",
      title: "Handcrafted Leather Bag",
      description: "Premium leather messenger bag, handmade by artisans.",
      currentBid: 180,
      bids: 9,
      timeLeft: "3 days",
      imageUrl: "/placeholder.svg?height=300&width=400",
      seller: {
        name: "Leather Artisan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "5",
      title: "Vintage Mechanical Watch",
      description: "Swiss-made mechanical watch from the 1960s, recently serviced.",
      currentBid: 450,
      bids: 15,
      timeLeft: "12 hours",
      imageUrl: "/placeholder.svg?height=300&width=400",
      seller: {
        name: "Watch Collector",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "6",
      title: "Art Deco Table Lamp",
      description: "Original Art Deco lamp with stained glass shade.",
      currentBid: 220,
      bids: 7,
      timeLeft: "2 days",
      imageUrl: "/placeholder.svg?height=300&width=400",
      seller: {
        name: "Vintage Lighting",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  )
}
