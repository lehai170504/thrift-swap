/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import { BidRequest, BidResponse } from '@/features/auction/types/auction';
import api from '@/lib/axios';
import Cookies from 'js-cookie';

export const useAuctionSocket = (auctionId: string) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [bids, setBids] = useState<BidResponse[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentHighestBid, setCurrentHighestBid] = useState<number>(0);

  useEffect(() => {
    if (!auctionId) return;

    // Fetch bid history first
    api.get<BidResponse[]>(`/auctions/${auctionId}/bids`)
      .then(res => {
        setBids(res.data);
        if (res.data.length > 0) {
          setCurrentHighestBid(Math.max(...res.data.map(b => b.bidAmount)));
        }
      })
      .catch(err => console.error("Failed to fetch bid history", err));

    // Initialize Stomp Client directly with WebSocket
    // This ensures HttpOnly cookies are automatically sent during the WebSocket handshake
    const client = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081/ws'}/auction/websocket`,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setIsConnected(true);
      console.log('Connected to WebSocket!');

      // Subscribe to the auction topic
      client.subscribe(`/topic/auction/${auctionId}`, (message) => {
        if (message.body) {
          const newBid: BidResponse = JSON.parse(message.body);
          setBids((prevBids) => [newBid, ...prevBids]);
          setCurrentHighestBid((prev) => Math.max(prev, newBid.bidAmount));
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [auctionId]);

  const placeBid = useCallback((amount: number) => {
    if (stompClient && stompClient.connected) {
      let token = '';
      const userStr = Cookies.get('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          token = userObj.token;
        } catch (e) { }
      }
      const bidRequest: BidRequest = {
        auctionSessionId: auctionId,
        bidAmount: amount,
      };
      stompClient.publish({
        destination: '/app/auction/bid',
        body: JSON.stringify(bidRequest),
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } else {
      console.error('STOMP client is not connected');
    }
  }, [stompClient, auctionId]);

  return { bids, isConnected, placeBid, currentHighestBid };
};
