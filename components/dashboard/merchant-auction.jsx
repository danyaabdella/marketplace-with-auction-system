"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"

const auctions = [
  {
    id: "1",
    name: "Vintage Polaroid Camera",
    status: "Active",
    currentBid: 120.0,
    bids: 8,
    endDate: "2024-03-15",
    image: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Antique Wooden Desk",
    status: "Ending Soon",
    currentBid: 350.0,
    bids: 12,
    endDate: "2024-03-10",
    image: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Limited Edition Vinyl",
    status: "Completed",
    currentBid: 75.0,
    bids: 5,
    endDate: "2024-03-05",
    image: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Art Deco Lamp",
    status: "Scheduled",
    currentBid: 220.0,
    bids: 0,
    endDate: "2024-03-20",
    image: "/placeholder.svg",
  },
]

export function MerchantAuctions() {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between p-6">
        <div>
          <h3 className="text-xl font-semibold">Auctions</h3>
          <p className="text-sm text-muted-foreground">Manage your active and upcoming auctions</p>
        </div>
        <Button className="gradient-bg border-0">
          <Plus className="mr-2 h-4 w-4" />
          Create Auction
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
              Status
            </TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort("currentBid")}>
              Current Bid
            </TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort("bids")}>
              Bids
            </TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort("endDate")}>
              End Date
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auctions.map((auction) => (
            <TableRow key={auction.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Image
                    src={auction.image || "/placeholder.svg"}
                    alt={auction.name}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover"
                  />
                  <span className="font-medium">{auction.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    auction.status === "Active" && "bg-success/10 text-success",
                    auction.status === "Ending Soon" && "bg-warning/10 text-warning",
                    auction.status === "Completed" && "bg-muted",
                    auction.status === "Scheduled" && "bg-primary/10 text-primary",
                  )}
                >
                  {auction.status}
                </div>
              </TableCell>
              <TableCell className="text-right">${auction.currentBid.toFixed(2)}</TableCell>
              <TableCell className="text-right">{auction.bids}</TableCell>
              <TableCell className="text-right">{new Date(auction.endDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Auction
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Cancel Auction
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

