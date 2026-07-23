import api from '@/lib/axios';
import { LiveSessionResponse } from '../types/live';

export type { LiveSessionResponse };

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
