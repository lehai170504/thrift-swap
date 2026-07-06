import api from '../axios';

export interface ChatMessageDto {
  senderUsername: string;
  receiverUsername: string;
  content: string;
  timestamp: string;
  isRead?: boolean;
}

export interface ChatUser {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
}

export interface ConversationResponse {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export const chatApi = {
  getChatHistory: async (username: string): Promise<ChatMessageDto[]> => {
    const res = await api.get(`/chat/history/${username}`);
    return res.data;
  },

  getConversations: async (): Promise<ConversationResponse[]> => {
    const res = await api.get('/chat/conversations');
    return res.data;
  },

  markAsRead: async (username: string): Promise<void> => {
    await api.put(`/chat/read/${username}`);
  },

  deleteConversation: async (username: string): Promise<void> => {
    await api.delete(`/chat/conversations/${username}`);
  }
};
