export interface BidRequest {
  auctionSessionId: string;
  bidAmount: number;
}

export interface BidResponse {
  bidId?: string;
  auctionSessionId: string;
  bidderName: string;
  bidAmount: number;
  bidTime?: string;
  timestamp?: string;
  message?: string;
}

export interface AuctionHistoryItem {
  id: string;
  bidderName: string;
  bidAmount: number;
  timestamp: string;
}
