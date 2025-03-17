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
        console.log(auctionId, bids);
    
        const { bidderEmail, bidderName, bidAmount, quantity, groupBidId } = bids[0]; 
        console.log(bidderEmail, bidderName, bidAmount, quantity);

        // Validate input
        if (!auctionId || !bids || bids.length === 0 ) {
            return new Response(JSON.stringify({ message: 'All fields are required' }),
                { status: 400 }
            );
        }
        const auction = await Auction.findById(auctionId);
        if (!auction || auction.status !== "active") {
            return new Response(JSON.stringify({ message: 'Auction is not active' }), { status: 400 });
        }
        
         

        let bid = await Bid.findOne({ auctionId });

        if (!bid) {
            bid = new Bid({
                auctionId,
                bids: [{ bidderEmail, bidderName, bidAmount, quantity,
                        isGroupBid: !!groupBidId,
                        groupBidId: groupBidId || null
                 }],
                // highestBid: bidAmount,
                // highestBidderEmail: bidderEmail,
            });
        } else {
            const existingBid = bid.bids.find((b) => b.quantity === quantity)
            if(existingBid ) {
                if (bidAmount <= existingBid.bidAmount) {
                    return new Response(
                        JSON.stringify({ message: 'Bid amount must be higher than the current bid for this quantity' }),
                        { status: 400 }
                    );
                }
                bid.bids.push({ bidderEmail, bidderName, bidAmount, quantity,
                                isGroupBid: !!groupBidId,
                                groupBidId: groupBidId || null
                 });

                // bid.highestBid = bidAmount;
                // bid.highestBidderEmail = bidderEmail;

            } else {
                if(auction.buyByParts && quantity > auction.remainingQuantity) {
                    return new Response(
                            JSON.stringify({ message: 'Bid quantity exceeds remaining quantity' }),
                            { status: 400 }
                        );
                }
                bid = new Bid({
                    auctionId,
                    bids: [{ bidderEmail, bidderName, bidAmount, quantity,
                            isGroupBid: !!groupBidId,
                            groupBidId: groupBidId || null
                     }],
                    // highestBid: bidAmount,
                    // highestBidderEmail: bidderEmail,
                });
                auction.remainingQuantity-= quantity
                await auction.save();

            }
        }
        
        if (groupBidId) {
            // If it's a group bid, mark the group as participating
            await GroupBid.findByIdAndUpdate(groupBidId, { status: 'active' });
        }

        await bid.save();
        const previousBidders = bid.bids.map(b => b.bidderEmail).filter(email => email !== bidderEmail);
        if (previousBidders.length > 0) sendEmail(previousBidders, 'New Bid Placed!', `A new bid of ${bidAmount} has been placed by ${bidderName}.`)
        
        
        const io = getIO(); 

        io.to(auctionId).emit("newBidIncrement", {
            auctionId,
            bidAmount,
            bidderName,
            bidderEmail
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: 'Failed to add bid', error: error.message }),
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