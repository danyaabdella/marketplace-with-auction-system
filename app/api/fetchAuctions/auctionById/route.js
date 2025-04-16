// pages/api/my‑auctions.js
import { connectToDB, userInfo } from "@/libs/functions"
import Auction from "@/models/Auction"
import Bid from "@/models/Bid"
import { NextResponse } from "next/server"

export async function GET(req, res) {
  const userId = await userInfo(req)
  if (!userId?._id) {
    return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
    )
  }

  await connectToDB()

  // 1) Fetch all bids by this user
  const userBidDocs = await Bid.find({ "bids.bidderId": userId }).lean().exec()

  const participatedAuctionIds = userBidDocs
    .map(doc => doc.auctionId)
    .filter(Boolean)

  // 2) Fetch all auctions the user participated in
  const participated = participatedAuctionIds.length
    ? await Auction.find({ _id: { $in: participatedAuctionIds } }).lean().exec()
    : []

   // 3) Partition into active, won, lost
   const activeBids = participated.filter(a => a.status === "active")
   const won = participated.filter(
     a => a.status === "ended" && a.highestBidder?.toString() === userId.toString()
   )
   const lost = participated.filter(
     a => a.status === "ended" && a.highestBidder?.toString() !== userId.toString()
   )
 
  return NextResponse.json(
    { participated, activeBids, won, lost },
    { status: 200 }
)
}
