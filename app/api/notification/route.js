import { Participant } from "@/libs/functions";
import { io } from 'socket.io-client';

const socket = io('/participant');

export async function GET() {
    const auctionIds = await Participant();
    if (auctionIds && auctionIds.length > 0) {
        console.log('User is participating in the following auctions:', auctionIds);
        auctionIds.forEach((auctionId) => {
                
        // Listen for new bids in the room for this auction
        socket.on('newBidIncrement', (data) => {
            if (data.description.auctionId === auctionId) {
                // Handle the new bid increment (e.g., show notification)
                console.log('New bid placed in auction', auctionId, ':', data.description);
            }
        });
    });
        return new Response(JSON.stringify({message: 'user joined auction rooms'}))
    } else {
        console.log('User is not a participant in any auction');
}

}


// export async function POST() {
//     const [notification, setnotifications] = 
//     useEffect(() => {
//         // Listen for new bids in the auction room
//         socket.on('newBidIncrement', (data) => {
//             if (data.description.auctionId === auctionId) {
//                 // Handle the new bid increment (e.g., show notification)
//                 console.log('New bid placed:', data.description);
//             }
//         });

//         return () => {
//             socket.off('newBidIncrement');
//         };
//     }, [auctionId]);

//     return (
//         <div>
//             {/* Your notification display logic */}
//         </div>
//     );
// }

// import { Participant } from '@/libs/functions';
// import { io } from 'socket.io-client';

// const socket = io('/participant');

// export async function POST() {
//     try {
//         const auctionIds = await Participant();
//         if (auctionIds && auctionIds.length > 0) {
//             console.log('User is participating in the following auctions:', auctionIds);
//             // Emit to relevant rooms for each auction the user is part of
//             auctionIds.forEach((auctionId) => {
//                 socket.emit('joinAuction', auctionId);
//             });
//             return new Response(
//                 JSON.stringify({ message: 'User joined auction rooms', auctionIds }),
//                 { status: 200 }
//             );
//         } else {
//             console.log('User is not a participant in any auction');
//             return new Response(
//                 JSON.stringify({ message: 'User is not a participant in any auction' }),
//                 { status: 404 }
//             );
//         }
//     } catch (error) {
//         return new Response(
//             JSON.stringify({ message: 'Failed to join auction rooms', error: error.message }),
//             { status: 500 }
//         );
//     }
// }
