import Bid from '@/models/Bid';
   import Auction from '@/models/Auction';
   import { connectToDB, userInfo } from '@/libs/functions';
   import { sendEmail } from '@/libs/sendEmail';
   import { getIO } from "@/libs/socket";
   import { createBidNotification } from '@/libs/createNotification';

   export async function POST(req) {
       try {
           await connectToDB();
           const rawBody = await req.text();
           const body = JSON.parse(rawBody);
           console.log("Received request body:", body);

           const session = await userInfo(req);
           if (!session || !session.email) {
               return new Response(
                   JSON.stringify({ message: 'Unauthorized' }),
                   { status: 401 }
               );
           }

           const { auctionId, bidAmount } = body;
           const bidderId = session._id;
           const bidderEmail = session.email;
           const bidderName = session.fullName;

           if (!auctionId || !bidAmount) {
               return new Response(
                   JSON.stringify({ message: 'Auction ID and bid amount are required' }),
                   { status: 400 }
               );
           }

           const auction = await Auction.findById(auctionId);
           if (!auction || auction.status !== "active") {
               return new Response(
                   JSON.stringify({ message: 'Auction is not active' }),
                   { status: 400 }
               );
           }

           let bid = await Bid.findOne({ auctionId });
           const isNewBidDocument = !bid;

           if (isNewBidDocument) {
               bid = new Bid({
                   auctionId,
                   bids: []
               });
           }

           // Determine the current highest bid
           const currentHighestBid = bid.bids.length > 0
               ? Math.max(...bid.bids.map(b => b.bidAmount))
               : auction.startingPrice;

           // Validate bid amount
           const minBid = currentHighestBid + auction.bidIncrement;
           if (bidAmount < minBid) {
               return new Response(
                   JSON.stringify({ message: `Bid amount must be at least $${minBid}` }),
                   { status: 400 }
               );
           }

           const existingBidIndex = bid.bids.findIndex(b => b.bidderId.toString() === bidderId);
           const isNewBid = existingBidIndex === -1;

           if (isNewBid) {
               // Create new bid
               bid.bids.push({
                   bidderId,
                   bidderEmail,
                   bidderName,
                   bidAmount,
                   bidTime: new Date()
               });
           } else {
               // Update existing bid
               bid.bids[existingBidIndex].bidAmount = bidAmount;
               bid.bids[existingBidIndex].bidTime = new Date();
           }

           await bid.save();

           // Create notification for the bidder
           await createBidNotification({
               userId: bidderId,
               auctionId,
               bidAmount,
               bidderName,
               bidderEmail,
               type: 'bid'
           });

           // Create notifications for previous bidders (outbid)
           const previousBidders = bid.bids
               .filter(b => b.bidderId.toString() !== bidderId)
               .map(b => b.bidderId);

           for (const previousBidder of previousBidders) {
               await createBidNotification({
                   userId: previousBidder,
                   auctionId,
                   bidAmount,
                   bidderName,
                   bidderEmail,
                   type: 'outbid'
               });
           }

           // Emit socket events
           const io = getIO();
           io.to(auctionId).emit("newBid", {
               auctionId,
               bidAmount,
               bidderName,
               bidderEmail,
               bidderId
           });

           // Find the previous highest bidder and notify them specifically
           if (bid.bids.length > 1) {
               const sortedBids = bid.bids.sort((a, b) => b.bidAmount - a.bidAmount);
               const previousHighestBidder = sortedBids[1]?.bidderId;
               if (previousHighestBidder && previousHighestBidder.toString() !== bidderId) {
                   io.to(auctionId).emit("outbid", {
                       auctionId,
                       bidAmount,
                       bidderName,
                       bidderEmail,
                       bidderId,
                       recipientId: previousHighestBidder
                   });
               }
           }

           // Send email to previous bidders
           if (previousBidders.length > 0) {
               await sendEmail(
                   previousBidders,
                   'New Bid Placed!',
                   `A new bid of ${bidAmount} has been placed by ${bidderName}.`
               );
           }

           return new Response(
               JSON.stringify({
                   message: isNewBid ? 'Bid placed successfully' : 'Bid updated successfully',
                   highestBid: bidAmount,
                   totalBids: bid.bids.length
               }),
               { status: 200 }
           );

       } catch (error) {
           console.error('Bid placement error:', error);
           return new Response(
               JSON.stringify({
                   message: 'Failed to place bid',
                   error: error.message
               }),
               { status: 500 }
           );
       }
   }