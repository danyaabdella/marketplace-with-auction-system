import Bid from '@/models/Bid';
import Auction from '@/models/Auction';
import GroupBid from '@/models/GroupBid';
import { connectToDB, userInfo } from '@/libs/functions';
import { sendEmail } from '@/libs/sendEmail';
import { getIO } from "@/libs/socket";

export async function POST(req) {
    try {
        await connectToDB();

        const { auctionId, bids } = await req.json();
        
        // Validate input
        if (!auctionId || !bids || bids.length === 0) {
            return new Response(
                JSON.stringify({ message: 'All fields are required' }),
                { status: 400 }
            );
        }

        const { bidderEmail, bidderName, bidAmount, quantity, groupBidId } = bids[0];
        
        // Get auction with proper locking to prevent race conditions
        const auction = await Auction.findById(auctionId);
        if (!auction || auction.status !== "active") {
            return new Response(
                JSON.stringify({ message: 'Auction is not active' }), 
                { status: 400 }
            );
        }

        // Validate quantity
        if (auction.buyByParts && quantity > auction.remainingQuantity) {
            return new Response(
                JSON.stringify({ message: 'Bid quantity exceeds remaining quantity' }),
                { status: 400 }
            );
        }

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
        const existingBidIndex = bid.bids.findIndex(b => b.quantity === quantity);
        
        if (existingBidIndex >= 0) {
            // Update existing bid if amount is higher
            if (bidAmount <= bid.bids[existingBidIndex].bidAmount) {
                return new Response(
                    JSON.stringify({ 
                        message: 'Bid amount must be higher than current bid for this quantity' 
                    }),
                    { status: 400 }
                );
            }
            bid.bids[existingBidIndex] = { 
                bidderEmail, 
                bidderName, 
                bidAmount, 
                quantity,
                isGroupBid: !!groupBidId,
                groupBidId: groupBidId || null,
                timestamp: new Date()
            };
        } else {
            // Add new bid
            bid.bids.push({
                bidderEmail,
                bidderName,
                bidAmount,
                quantity,
                isGroupBid: !!groupBidId,
                groupBidId: groupBidId || null,
                timestamp: new Date()
            });
        }

        // Update auction remaining quantity (only for new quantities)
        if (existingBidIndex === -1) {
            auction.remainingQuantity -= quantity;
            if (auction.remainingQuantity < 0) {
                return new Response(
                    JSON.stringify({ message: 'Not enough quantity remaining' }),
                    { status: 400 }
                );
            }
        }

        // Handle group bid if applicable
        if (groupBidId) {
            await GroupBid.findByIdAndUpdate(groupBidId, { 
                status: 'active',
                $inc: { currentBidAmount: bidAmount } 
            });
        }

        // Save changes in transaction
        await Promise.all([
            auction.save(),
            bid.save()
        ]);

        // Notify previous bidders
        const previousBidders = bid.bids
            .filter(b => b.bidderEmail !== bidderEmail)
            .map(b => b.bidderEmail);
            
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
            remainingQuantity: auction.remainingQuantity
        });

        return new Response(
            JSON.stringify({ 
                message: 'Bid placed successfully',
                remainingQuantity: auction.remainingQuantity
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


export async function GET() {
    try {
        await connectToDB();

        const user = userInfo();
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
        
        const user = userInfo();
        //const bidderEmail = user.email;
        const { auctionId, newBidAmount, bidderEmail } = await req.json();

        // Validate input
        if (!auctionId || !bidderEmail || !newBidAmount) {
            return new Response(JSON.stringify({ message: 'All fields are required'}),
            { status: 400 }
            );
        }

        // Find the bid document for the auction
        const bid = await Bid.findOne({ bidderEmail });

        if (!bid) {
            return new Response(JSON.stringify({ message: 'No bids for this id'}),
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

        // Check if the new bid amount is higher than the previous bid
        if (newBidAmount <= userBid.bidAmount) {
            return new Response(JSON.stringify({ message: 'New bid amount must be higher than the previous bid' }),
            { status: 400 }
            );
        }

        userBid.bidAmount = newBidAmount;

        // Update the highest bid if necessary
        if (newBidAmount > bid.highestBid) {
            bid.highestBid = newBidAmount;
            bid.highestBidderEmail = bidderEmail;
        }

        // Save the updated bid document
        await bid.save();

        const io = getIO();

        io.to(auctionId).emit("newBidIncrement", {
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