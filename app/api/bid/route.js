import { Server } from 'socket.io';
import Bid from '@/models/Bid';
import { connectToDB, userInfo } from '@/libs/functions';
import { sendEmail } from '@/libs/sendEmail';

// POST: Add a new bid or update an existing auction with a new bid
// let io = io.of('/participant');
// if (!io) {
//     io = new Server({ cors: { origin: '*' } });
//     io.on('connection', (socket) => {
//         console.log('A user connected');
        
//         // Join the auction room based on auctionId
//         socket.on('joinAuction', (auctionId) => {
//             socket.join(auctionId);
//             console.log(`User joined auction room: ${auctionId}`);
//         });

//         // Leave the auction room when the user disconnects
//         socket.on('disconnect', () => {
//             console.log('A user disconnected');
//         });
//     });
// }

// Initialize Socket.IO server
let io;

 if (!io) {
    io = new Server({ cors: { origin: '*' } });
 }
    // Create a namespace for participants
    const participantNamespace = io.of('/participant');

    participantNamespace.on('connection', (socket) => {
        console.log('A participant connected:', socket.id);

        // Join the room for a specific auction
        socket.on('joinAuction', (auctionId) => {
            socket.join(auctionId);
            console.log(`Participant ${socket.id} joined auction ${auctionId}`);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('A participant disconnected:', socket.id);
        });
    });


// const user = await userInfo();

//         if (!user || !user.email) {
//             return new Response(
//                 JSON.stringify({ message: 'User not authenticated' }),
//                 { status: 401 }
//             );
//         }
export async function POST(req) {
    try {
        await connectToDB();

        
        const { auctionId, bids} = await req.json();
        console.log(auctionId, bids);
    
        const { bidderEmail, bidderName, bidAmount } = bids[0]; 
        console.log(bidderEmail, bidderName, bidAmount);

        // Validate input
        if (!auctionId || !bids || bids.lenght==0 ) {
            return new Response(JSON.stringify({ message: 'All fields are required' }),
                { status: 400 }
            );
        }
        if(!auctionId.status=='active') {
            return new Response(JSON.stringify({
                message: 'Auction is not active'
            }))
        }
        
        let bid = await Bid.findOne({ auctionId });

        if (!bid) {
            bid = new Bid({
                auctionId,
                bids: [{ bidderEmail, bidderName, bidAmount }],
                highestBid: bidAmount,
                highestBidderEmail: bidderEmail,
            });
        } else {
            // If the auction is running, check if the new bid is higher than the highest bid
            if ( bidAmount <= bid.highestBid) {
                return new Response(JSON.stringify( { message: 'Bid amount must be higher than the current highest bid' }),
                    { status: 400 }
                );
            }

            // Add the new bid to the bids array
            bid.bids.push({ bidderEmail, bidderName, bidAmount });

            bid.highestBid = bidAmount;
            bid.highestBidderEmail = bidderEmail;
        }

        await bid.save();
        const previousBidders = bid.bids.map(b => b.bidderEmail).filter(email => email !== bidderEmail);
        if (previousBidders.length > 0) sendEmail(previousBidders, 'New Bid Placed!', `A new bid of ${bidAmount} has been placed by ${bidderName}.`)
        
        

        // Emit real-time update to Socket.IO clients
        participantNamespace.to(auctionId).emit('newBidIncrement', {
            description: { auctionId, bidAmount, bidderName }
        });

        return new Response(JSON.stringify({ message: 'Bid added successfully', bid }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Failed to add bid', error: error.message }),
            { status: 500 }
        );
    }
}


export async function GET(req) {
    try {
        await connectToDB();


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
        
        const bidderEmail = user.email;
        const { auctionId, newBidAmount } = await req.json();

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

        const auctionId = await req.json();
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