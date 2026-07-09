import api from '@/lib/axios';

export interface LiveSessionResponse {
  id: string;
  auctionSessionId: string;
  hostId: string;
  hostUsername: string;
  agoraChannelName: string;
  status: 'PENDING' | 'LIVE' | 'ENDED';
  viewerCount: number;
  startedAt: string;
  endedAt: string | null;
}

export const liveApi = {
  startLiveSession: async (auctionSessionId: string): Promise<LiveSessionResponse> => {
    const { data } = await api.post(`/lives/start/${auctionSessionId}`);
    return data;
  },
  endLiveSession: async (auctionSessionId: string): Promise<LiveSessionResponse> => {
    const { data } = await api.post(`/lives/end/${auctionSessionId}`);
    return data;
  },
  getLiveSession: async (auctionSessionId: string): Promise<LiveSessionResponse> => {
    const { data } = await api.get(`/lives/auction/${auctionSessionId}`);
    return data;
  },
  getActiveLiveAuctions: async (): Promise<string[]> => {
    const { data } = await api.get('/lives/active');
    return data;
  }
};
