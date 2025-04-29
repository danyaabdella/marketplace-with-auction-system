import Bid from '@/models/Bid';
import Auction from '@/models/Auction';
import GroupBid from '@/models/GroupBid';
import { connectToDB, userInfo } from '@/libs/functions';
import { sendEmail } from '@/libs/sendEmail';
import { getIO } from "@/libs/socket";

export async function POST(req) {
    try {
        await connectToDB();
        // First read and parse the body
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
        
        const { auctionId, bidAmount} = body;
        const bidderId = session._id;
        const bidderEmail = session.email;
        const bidderName = session.name;
        // Validate input
        if (!auctionId || !bidAmount ) {
            return new Response(
                JSON.stringify({ message: 'Auction ID and bid amount are required'  }),
                { status: 400 }
            );
        }

        // const { bidAmount, quantity } = bids[0];
        
        // Get auction with proper locking to prevent race conditions
        const auction = await Auction.findById(auctionId);
        if (!auction || auction.status !== "active") {
            return new Response(
                JSON.stringify({ message: 'Auction is not active' }), 
                { status: 400 }
            );
        }

        // Validate quantity
        // if (auction.buyByParts && quantity > auction.remainingQuantity) {
        //     return new Response(
        //         JSON.stringify({ message: 'Bid quantity exceeds remaining quantity' }),
        //         { status: 400 }
        //     );
        // }

        // Find or create bid document
        let bid = await Bid.findOne({ auctionId });
        const isNewBid = !bid;

        if (isNewBid) {
            bid = new Bid({
                auctionId,
                bids: []
            });
        }

        // Check for existing bid on this quantity
        const existingBidIndex = bid.bids.findIndex(b => b.bidderId === bidderId);
        
        if (existingBidIndex >= 0) {
            // User already has a bid - they should use PUT to update it
            return new Response(
                JSON.stringify({ 
                    message: 'You already have a bid. Use PUT to update your bid amount.' 
                }),
                { status: 400 }
            );
        }

        // Add new bid
        bid.bids.push({
            bidderId,
            bidAmount,
            bidTime: new Date()
        });

        // Save changes
        await bid.save();

        // Update auction remaining quantity (only for new quantities)
        // if (existingBidIndex === -1) {
        //     auction.remainingQuantity -= quantity;
        //     if (auction.remainingQuantity < 0) {
        //         return new Response(
        //             JSON.stringify({ message: 'Not enough quantity remaining' }),
        //             { status: 400 }
        //         );
        //     }
        // }

        // Handle group bid if applicable
        // if (groupBidId) {
        //     await GroupBid.findByIdAndUpdate(groupBidId, { 
        //         status: 'active',
        //         $inc: { currentBidAmount: bidAmount } 
        //     });
        // }

        // Save changes in transaction
        // await Promise.all([
        //     auction.save(),
        //     bid.save()
        // ]);

        // Notify previous bidders
        const previousBidders = bid.bids
            .filter(b => b.bidderId !== bidderId)
            .map(b => b.bidderId);
            
        if (previousBidders.length > 0) {
            sendEmail(
                previousBidders, 
                'New Bid Placed!', 
                `A new bid of ${bidAmount} has been placed by ${bidderName}.`
            );
        }

        // Emit socket event
        getIO().to(auctionId).emit("newBidIncrement", {
            auctionId,
            bidAmount,
            bidderName,
            bidderEmail,
        });

        return new Response(
            JSON.stringify({ 
                message: 'Bid placed successfully',
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


export async function GET(req) {
    try {
        await connectToDB();

        const user = userInfo(req);
        const bidderEmail = user.email;

        // Find all bids where the customer has participated
        const bids = await Bid.find({ 'bids.bidderEmail': bidderEmail });

        if (!bids || bids.length === 0) {
            return new Response(
                JSON.stringify({ message: 'No auctions found for this customer' }),
                { status: 404 }
            );
        }

        // Extract relevant data (auctionId and customer's bids)
        const customerAuctions = bids.map((bid) => {
            const customerBids = bid.bids.filter(
                (b) => b.bidderEmail === bidderEmail
            );
            return {
                auctionId: bid.auctionId,
                bids: customerBids,
                highestBid: bid.highestBid,
                highestBidderEmail: bid.highestBidderEmail,
            };
        });

        return new Response(
            JSON.stringify({
                message: 'Customer auctions fetched successfully',
                auctions: customerAuctions,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: 'Failed to fetch customer auctions',
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// PUT: Update a specific user's bid amount
export async function PUT(req) {
    try {
        await connectToDB();
        
        const session = await userInfo(req);
        if (!session || !session.email) {
            return new Response(
                JSON.stringify({ message: 'Unauthorized' }),
                { status: 401 }
            );
        }

        const { auctionId, newBidAmount } = await req.json();
        const bidderId = session._id;
        const bidderEmail = session.email;
        const bidderName = session.name;

        // Validate input
        if (!auctionId || !newBidAmount) {
            return new Response(JSON.stringify({ message: 'Auction Id and bid amount are required'}),
            { status: 400 }
            );
        }
        
        // Find the bid document for the auction
        const bid = await Bid.findOne({ auctionId });
        // Find user's existing bid
        const userBidIndex = bid.bids.findIndex(b => b.bidderId.equals(bidderId));
        if (userBidIndex === -1) {
            return new Response(
                JSON.stringify({ message: 'No bid found for this user' }),
                { status: 404 }
            );
        }


        const userBid = bid.bids.find((bid) => bid.bidderEmail === bidderEmail);
        
        if (!userBid) {
            return new Response(
                JSON.stringify({ message: 'No bid found for this user' }),
                { status: 404 }
            );
        }

        // Check if new bid is higher than current
        if (newBidAmount <= bid.bids[userBidIndex].bidAmount) {
            return new Response(
                JSON.stringify({ message: 'New bid amount must be higher than current bid' }),
                { status: 400 }
            );
        }

        // Update bid amount
        bid.bids[userBidIndex].bidAmount = newBidAmount;
        bid.bids[userBidIndex].bidTime = new Date();

        // Save changes
        await bid.save();
         // Notify other bidders
         const previousBidders = bid.bids
         .filter(b => !b.bidderId.equals(bidderId))
         .map(b => b.bidderEmail);
         
        if (previousBidders.length > 0) {
            sendEmail(
                previousBidders, 
                'Bid Updated!', 
                `A bid has been updated to $${newBidAmount} by ${bidderName}.`
            );
        }
        // const io = ;

        getIO().to(auctionId).emit("newBidIncrement", {
         auctionId,
         newBidAmount,
         bidderEmail
         },
        );
       

        return new Response(JSON.stringify({ message: 'Bid updated successfully', bid }),
        { status: 200 }
        );

        
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Failed to update bid', error: error.message }),
        { status: 500 }
        );
    }
}

// DELETE: Delete a specific bid (optional)
export async function DELETE(req) {
    try {
        await connectToDB();
    
        const {auctionId} = await req.json();
        const bidderEmail = user.email

        if (!auctionId ) {
            return new Response(JSON.stringify({ message: 'Auction ID is required' }),
            { status: 400 }
            );
        }

        // Find the bid document for the auction
        const bid = await Bid.findOne({ auctionId });

        // Remove the specific bid from the bids array
        bid.bids = bid.bids.filter((bid) => bid.bidderEmail !== bidderEmail);

        // Update the highest bid if the deleted bid was the highest
        if (bid.highestBidderEmail === bidderEmail) {
            if (bid.bids.length > 0) {
                const newHighestBid = Math.max(...bid.bids.map((bid) => bid.bidAmount));
                bid.highestBid = newHighestBid;
                bid.highestBidderEmail = bid.bids.find(
                    (bid) => bid.bidAmount === newHighestBid
                ).bidderEmail;
            } else {
                bid.highestBid = 0;
                bid.highestBidderEmail = null;
            }
        }

        // Save the updated bid document
        await bid.save();

        return new Response(JSON.stringify({ message: 'Bid deleted successfully', bid }),
        { status: 200 }
        );
    } catch (error) {
        return new Response(JSON.stringify(
        { message: 'Failed to delete bid', error: error.message }),
        { status: 500 }
        );
    }
}
