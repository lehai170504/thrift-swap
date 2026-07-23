export interface LiveSessionResponse {
  id: string;
  auctionSessionId?: string;
  sellerId?: string;
  sellerUsername?: string;
  hostId?: string;
  hostUsername?: string;
  productId: string;
  productTitle?: string;
  productName?: string;
  productPrice?: number;
  productImageUrl?: string;
  productThumbnail?: string;
  agoraChannelName?: string;
  currentHighestBid?: number;
  currentPrice?: number;
  viewerCount?: number;
  status: 'ACTIVE' | 'ENDED' | string;
  startedAt?: string;
  endedAt?: string;
}

export interface LiveChatMessage {
  id?: string;
  type?: 'CHAT' | 'JOIN' | 'LEAVE' | 'BID_UPDATE' | 'REACTION' | string;
  senderName?: string;
  senderUsername?: string;
  content?: string;
  message?: string;
  timestamp?: string;
  viewerCount?: number;
}

