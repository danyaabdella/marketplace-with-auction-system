'use client'
import { io } from "socket.io-client";

let socket;

if (typeof window !== 'undefined') {
    // Explicitly use port 3000 for socket connection
    const socketUrl = process.env.NODE_ENV === 'production' 
        ? window.location.origin 
        : 'http://localhost:3000';

    socket = io(socketUrl, {
        path: '/socket.io/',
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        forceNew: true
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        console.log('Attempting to connect to:', socketUrl);
    });

    socket.on('connect', () => {
        console.log('Socket connected successfully to:', socketUrl);
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
}

export { socket };