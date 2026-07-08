import { create } from 'zustand';
import { ConversationResponse } from '@/lib/api/chat';

interface ChatStore {
  isOpen: boolean;
  activeUser: ConversationResponse | null;
  openChatWith: (user: ConversationResponse) => void;
  clearActiveUser: () => void;
  closeChat: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  activeUser: null,
  openChatWith: (user) => set({ isOpen: true, activeUser: user }),
  clearActiveUser: () => set({ activeUser: null }),
  closeChat: () => set({ isOpen: false, activeUser: null }),
  setIsOpen: (isOpen) => set({ isOpen }),
}));
