// lib/socket.js
import { Server } from "socket.io";

let io = null;

export function initializeSocket(server) {
    if (!io) {
        io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true
            },
            path: "/socket.io/",
            transports: ["polling", "websocket"],
            pingTimeout: 60000,
            pingInterval: 25000,
            connectTimeout: 20000
        });

        io.on("connection", (socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on("joinAuction", (auctionId) => {
                socket.join(auctionId);
                console.log(`🔹 Participant ${socket.id} joined auction ${auctionId}`);
            });
            
            socket.on("newBidIncrement", (data) => {
                const { auctionId, bidAmount, bidderName, bidderEmail } = data;
                
                if (!socket.rooms.has(auctionId)) {
                    socket.join(auctionId);
                    console.log(`🔹 Automatically joined auction ${auctionId} for ${socket.id}`);
                }
            
                console.log(`📢 Broadcasting bid in room: ${auctionId}`);
                
                // Notify all participants about the new bid
                socket.to(auctionId).emit("newBid", {
                    bidderName,
                    bidAmount,
                    bidderEmail,
                    message: `${bidderName} placed a new bid of $${bidAmount} in the auction.`,
                });

                // Notify the previous highest bidder that they've been outbid
                socket.to(auctionId).emit("outbid", {
                    bidderName,
                    bidAmount,
                    bidderEmail,
                    message: `You've been outbid! ${bidderName} placed a higher bid of $${bidAmount}.`,
                });
            });

            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.id}`);
            });

            socket.on("error", (error) => {
                console.error(`Socket error for ${socket.id}:`, error);
            });
        });
    }
    return io;
}

export function getIO() {
    if (!io) {
        console.warn("Socket.IO has not been initialized! Initializing with default settings...");
        // Create a temporary server for API routes
        const http = require('http');
        const tempServer = http.createServer();
        io = initializeSocket(tempServer);
    }
    return io;
}

export { io };
