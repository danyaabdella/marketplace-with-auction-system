import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const bidHistory = [
  {
    id: 1,
    bidder: {
      name: "Alex Thompson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    amount: 120,
    time: "2 hours ago",
  },
  {
    id: 2,
    bidder: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    amount: 110,
    time: "3 hours ago",
  },
  {
    id: 3,
    bidder: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    amount: 100,
    time: "5 hours ago",
  },
]

export function BidHistory({ auctionId }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bid History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bidHistory.map((bid) => (
            <div key={bid.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={bid.bidder.avatar} alt={bid.bidder.name} />
                  <AvatarFallback>{bid.bidder.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{bid.bidder.name}</p>
                  <p className="text-sm text-muted-foreground">{bid.time}</p>
                </div>
              </div>
              <p className="font-medium text-primary">${bid.amount}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
