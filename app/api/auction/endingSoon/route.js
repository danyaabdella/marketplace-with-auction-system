// // app/api/auctions/ending-soon/route.ts
// import connectToDB from "@/libs/functions"
// import Auction from "@/models/Auction"

// export async function GET() {
//   try {
//     await connectToDB()
    
//     const now = new Date()
//     const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
//     // Find active auctions ending within the next 24 hours
//     const auctions = await Auction.find({
//       status: "active",
//       endTime: { $gte: now, $lte: in24Hours }
//     })
//     .sort({ endTime: 1 }) // Sort by end time (soonest first)
//     .populate('productId', 'productName images description') // Get product details if needed
    
//     return new Response(
//       JSON.stringify({ auctions }),
//       { status: 201 }
//   );
//   } catch (error) {
//       console.error("Error fetching ending soon auctions:", error)
//       return new Response(
//         JSON.stringify({error: "Failed to fetch auctions"},
//           {status: 500}
//         )
//       )
//   }
// }
// app/api/auctions/ending-soon/route.ts
import { NextResponse } from 'next/server'
import {connectToDB} from "@/libs/functions"
import Auction from "@/models/Auction"

export async function GET() {
  try {
    await connectToDB()
    
    const now = new Date()
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    const auctions = await Auction.find({
      status: "active",
      endTime: { $gte: now, $lte: in24Hours }
    })
    .sort({ endTime: 1 })
    .lean() // Convert to plain JavaScript objects
    
    return NextResponse.json({ auctions })
  } catch (error) {
    console.error("Error fetching ending soon auctions:", error)
    return NextResponse.json(
      { error: "Failed to fetch auctions" },
      { status: 500 }
    )
  }
}