// // pages/api/my‑auctions.js
// import { connectToDB, userInfo } from "@/libs/functions"
// import Auction from "@/models/Auction"
// import Bid from "@/models/Bid"
// import { NextResponse } from "next/server"

// export async function GET(req, res) {
//   const userId = await userInfo(req)
//   if (!userId?._id) {
//     return NextResponse.json(
//                 { message: "Unauthorized" },
//                 { status: 401 }
//     )
//   }

//   await connectToDB()

//   // 1) Fetch all bids by this user
//   const userBidDocs = await Bid.find({ "bids.bidderId": userId }).lean().exec()

//   const participatedAuctionIds = userBidDocs
//     .map(doc => doc.auctionId)
//     .filter(Boolean)

//   // 2) Fetch all auctions the user participated in
//   const participated = participatedAuctionIds.length
//     ? await Auction.find({ _id: { $in: participatedAuctionIds } }).lean().exec()
//     : []

//    // 3) Partition into active, won, lost
//    const activeBids = participated.filter(a => a.status === "active")
//    const won = participated.filter(
//      a => a.status === "ended" && a.highestBidder?.toString() === userId.toString()
//    )
//    const lost = participated.filter(
//      a => a.status === "ended" && a.highestBidder?.toString() !== userId.toString()
//    )
 
//   return NextResponse.json(
//     { participated, activeBids, won, lost },
//     { status: 200 }
// )
// }
import { connectToDB, userInfo } from "@/libs/functions";
import Auction from "@/models/Auction";
import Bid from "@/models/Bid";
import { NextResponse } from "next/server";

export async function GET(req) {
  const userId = await userInfo(req);
  if (!userId?._id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();

  // 1) Fetch all bids by this user
  const userBidDocs = await Bid.find({ "bids.bidderId": userId })
    .lean()
    .exec();

  const participatedAuctionIds = userBidDocs
    .map((doc) => doc.auctionId)
    .filter(Boolean);

  // 2) Fetch all auctions the user participated in
  const participated = participatedAuctionIds.length
    ? await Auction.find({ _id: { $in: participatedAuctionIds } })
        .lean()
        .exec()
    : [];

  // 3) Transform auction data and compute additional fields
  const transformedAuctions = participated.map((auction) => {
    // Find the bid document for this auction
    const bidDoc = userBidDocs.find(
      (bid) => bid.auctionId.toString() === auction._id.toString()
    );

    // Get the user's latest bid
    const userBids = bidDoc?.bids
      .filter((bid) => bid.bidderId.toString() === userId.toString())
      .sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime)); // Sort by latest bid
    const myBid = userBids?.[0]?.bidAmount || 0;

    // Calculate time left
    const now = new Date();
    const endTime = new Date(auction.endTime);
    let timeLeft = "";
    if (auction.status === "active") {
      const diffMs = endTime - now;
      if (diffMs <= 0) {
        timeLeft = "Ended";
      } else {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        timeLeft = `${diffHours}h ${diffMinutes}m`;
      }
    } else if (auction.status === "ended") {
      timeLeft = auction.highestBidder?.toString() === userId.toString() ? "Won" : "Lost";
    } else {
      timeLeft = "N/A";
    }

    // Check for new activity (e.g., new bids since user's last bid)
    const lastUserBidTime = userBids?.[0]?.bidTime || now;
    const hasNewActivity = bidDoc?.bids.some(
      (bid) => new Date(bid.bidTime) > new Date(lastUserBidTime)
    );

    return {
      _id: auction._id,
      title: auction.auctionTitle, // Map auctionTitle to title
      description: auction.description || "",
      imageUrl: auction.itemImg?.[0] || "/placeholder.svg", // Use first image
      status: auction.status,
      currentBid: bidDoc?.highestBid || auction.startingPrice, // Use highest bid or starting price
      myBid, // User's latest bid
      isHighestBidder: bidDoc?.highestBidder?.toString() === userId.toString(), // Check if user is highest bidder
      hasNewActivity, // Indicate new bid activity
      bids: bidDoc?.totalBids || 0, // Total number of bids
      timeLeft, // Computed time left or status
      endTime: auction.endTime, // Needed for sorting
      totalQuantity: auction.totalQuantity, // Needed for sorting
      highestBid: bidDoc?.highestBid || 0, // Needed for sorting
    };
  });

  // 4) Partition into active, won, lost
  const activeBids = transformedAuctions.filter((a) => a.status === "active");
  const won = transformedAuctions.filter(
    (a) => a.status === "ended" && a.isHighestBidder
  );
  const lost = transformedAuctions.filter(
    (a) => a.status === "ended" && !a.isHighestBidder
  );

  return NextResponse.json(
    { participated: transformedAuctions, activeBids, won, lost },
    { status: 200 }
  );
}