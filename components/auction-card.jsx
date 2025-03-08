"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
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
import { useToast } from "@/components/ui/use-toast"
import { Clock, Heart } from "lucide-react"

export function AuctionCard({ auction }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [bidAmount, setBidAmount] = useState(auction.currentBid + 10)
  const { toast } = useToast()

  const handleBid = () => {
    toast({
      title: "Bid placed successfully!",
      description: `You placed a bid of $${bidAmount} on ${auction.title}`,
    })
  }

  const isEndingSoon = auction.timeLeft.includes("hour") || auction.timeLeft.includes("min")

  const handleCardClick = () => {
    router.push(`/auctions/${auction.id}`)
  }
  
  return (
    <Card className="overflow-hidden border-primary/10 auction-card-hover">
      <CardHeader className="p-0">
        <div className="relative">
          <Link href={`/auctions/${auction.id}`}>
            <div className="aspect-[4/3] w-full overflow-hidden">
              <Image
                src={auction.imageUrl || "/placeholder.svg"}
                alt={auction.title}
                width={400}
                height={300}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
          </Button>
          {isEndingSoon && <div className="absolute left-2 top-2 highlight-badge animate-pulse-slow">Ending Soon</div>}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/auctions/${auction.id}`} className="block">
            <h3 className="line-clamp-1 font-semibold">{auction.title}</h3>
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground">{auction.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Current Bid</p>
              <p className="text-lg font-bold text-primary">${auction.currentBid}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{auction.bids} bids</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {auction.timeLeft}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4 bg-muted/30">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6 border border-primary/20">
            <AvatarImage src={auction.seller.avatar} alt={auction.seller.name} />
            <AvatarFallback className="bg-primary/10 text-primary">{auction.seller.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{auction.seller.name}</span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-bg border-0">
              Place Bid
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Place a Bid</DialogTitle>
              <DialogDescription>
                Current highest bid is ${auction.currentBid}. Your bid must be higher.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="bid-amount">Bid Amount ($)</Label>
                <Input
                  id="bid-amount"
                  type="number"
                  min={auction.currentBid + 1}
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
      </CardFooter>
    </Card>
  )
}
