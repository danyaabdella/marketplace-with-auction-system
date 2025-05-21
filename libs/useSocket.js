import { useEffect, useCallback } from 'react';
import { initSocket, getSocket, disconnectSocket } from './socket-client';

export const useSocket = () => {
  useEffect(() => {
    // Initialize socket connection when component mounts
    const socket = initSocket();

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  const joinAuction = useCallback((auctionId) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('joinAuction', auctionId);
    }
  }, []);

  const placeBid = useCallback((data) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('newBidIncrement', data);
    }
  }, []);

  const onNewBid = useCallback((callback) => {
    const socket = getSocket();
    if (socket) {
      socket.on('newBid', callback);
      return () => socket.off('newBid', callback);
    }
  }, []);

  const onOutbid = useCallback((callback) => {
    const socket = getSocket();
    if (socket) {
      socket.on('outbid', callback);
      return () => socket.off('outbid', callback);
    }
  }, []);

  return {
    joinAuction,
    placeBid,
    onNewBid,
    onOutbid,
  };
}; 