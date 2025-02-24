// lib/socket.js
import { Server } from "socket.io";

let io;

export default function initializeSocket(server) {
    if (!io) {
        io = new Server(server, {
            cors: { origin: "*" },
        });

        io.on("connection", (socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on("joinAuction", (auctionId) => {
                socket.join(auctionId);
                console.log(`🔹 Participant ${socket.id} joined auction ${auctionId}`);
                   
            });
            
            socket.on("newBidIncrement", (data) => {
                
                const auctionId = data.auctionId;
                const bidAmount = data.bidAmount;
                const bidderName = data.bidderName;
                const bidderEmail = data.bidderEmail;
               
                if (!socket.rooms.has(auctionId)) {
                    socket.join(auctionId);
                    console.log(`🔹 Automatically joined auction ${auctionId} for ${socket.id}`);
                }
            
                console.log(`📢 Broadcasting bid in room: ${auctionId}`);
                console.log(`Socket rooms:`, socket.rooms);

                
                socket.to(auctionId).emit("newBid", {
                    bidderName,
                    bidAmount,
                    bidderEmail,
                    message: `${bidderName} placed a new bid of ${bidAmount} in the auction.`,
                });
               
            });
            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });
    }
    return io;
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.IO has not been initialized!");
    }
    return io;
}
