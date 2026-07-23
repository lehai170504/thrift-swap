import api from '@/lib/axios';
import { ChatMessageDto, ConversationResponse } from '../types/chat';
export type { ChatMessageDto, ConversationResponse };

export const chatApi = {
  getChatHistory: async (username: string): Promise<ChatMessageDto[]> => {
    const { data } = await api.get(`/chat/history/${username}`);
    return data;
  },

  getConversations: async (): Promise<ConversationResponse[]> => {
    const { data } = await api.get('/chat/conversations');
    return data;
  },

  markAsRead: async (username: string): Promise<void> => {
    await api.put(`/chat/read/${username}`);
  },

  deleteConversation: async (username: string): Promise<void> => {
    await api.delete(`/chat/conversations/${username}`);
  },
};
