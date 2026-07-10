import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/lib/api/chat';

export function useChatConversations(isAuthenticated: boolean) {
  return useQuery({
    queryKey: ['chatConversations'],
    queryFn: chatApi.getConversations,
    enabled: isAuthenticated,
  });
}

export function useChatHistory(activeUsername?: string) {
  return useQuery({
    queryKey: ['chatHistory', activeUsername],
    queryFn: () => chatApi.getChatHistory(activeUsername!),
    enabled: !!activeUsername,
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => chatApi.deleteConversation(username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatConversations'] });
    }
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => chatApi.markAsRead(username),
    onMutate: async (username) => {
      await queryClient.cancelQueries({ queryKey: ['chatHistory', username] });
      const previousHistory = queryClient.getQueryData(['chatHistory', username]);
      queryClient.setQueryData(['chatHistory', username], (old: any) => {
        if (!old) return old;
        return old.map((msg: any) => ({ ...msg, isRead: true }));
      });
      return { previousHistory };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatConversations'] });
    },
    onError: (err, username, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(['chatHistory', username], context.previousHistory);
      }
    }
  });
}
