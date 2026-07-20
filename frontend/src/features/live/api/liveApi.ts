import api from '@/lib/axios';

export interface LiveSessionResponse {
  id: string;
  auctionSessionId: string;
  productId: string;
  productName: string;
  productThumbnail: string | null;
  hostId: string;
  hostUsername: string;
  agoraChannelName: string;
  status: 'PENDING' | 'LIVE' | 'ENDED';
  viewerCount: number;
  startedAt: string;
  endedAt: string | null;
  currentPrice: number;
}

export const liveApi = {
  startLiveSession: async (auctionSessionId: string): Promise<LiveSessionResponse> => {
    const { data } = await api.post(`/lives/start/${auctionSessionId}`);
    return data;
  },
  endLiveSession: async (auctionSessionId: string, endAuction?: boolean): Promise<LiveSessionResponse> => {
    const { data } = await api.post(`/lives/end/${auctionSessionId}${endAuction ? '?endAuction=true' : ''}`);
    return data;
  },
  getLiveSession: async (auctionSessionId: string): Promise<LiveSessionResponse> => {
    const { data } = await api.get(`/lives/auction/${auctionSessionId}`);
    return data;
  },
  getActiveLiveAuctions: async (): Promise<LiveSessionResponse[]> => {
    const { data } = await api.get('/lives/active');
    return data;
  },
  getDepositStatus: async (productId: string): Promise<boolean> => {
    const { data } = await api.get(`/auctions/${productId}/deposit-status`);
    return data;
  },
  placeDeposit: async (productId: string): Promise<any> => {
    const { data } = await api.post(`/auctions/${productId}/deposit`);
    return data;
  }
};
