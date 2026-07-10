'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, ChevronDown, Send, Trash2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi, ConversationResponse } from '@/lib/api/chat';
import { useChatSocket } from '../hooks/useChatSocket';
import { useChatStore } from '../store/useChatStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';

export function GlobalChatWidget() {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isOpen = useChatStore(state => state.isOpen);
  const setIsOpen = useChatStore(state => state.setIsOpen);
  const activeUser = useChatStore(state => state.activeUser);
  const setActiveUser = useChatStore(state => state.openChatWith);
  const clearActiveUser = useChatStore(state => state.clearActiveUser);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [deleteTarget, setDeleteTarget] = useState<ConversationResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { sendMessage } = useChatSocket(isAuthenticated, user?.username, pathname.includes('/chat'));

  const { data: conversations, isLoading: isConversationsLoading } = useQuery({
    queryKey: ['chatConversations'],
    queryFn: chatApi.getConversations,
    enabled: isAuthenticated,
  });

  const { data: history, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['chatHistory', activeUser?.username],
    queryFn: () => chatApi.getChatHistory(activeUser!.username),
    enabled: !!activeUser,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    if (isOpen && activeUser) {
      const hasUnread = history?.some(msg => !msg.isRead && msg.senderUsername !== user?.username);
      if (hasUnread) {
        queryClient.setQueryData(['chatHistory', activeUser.username], (old: any) => {
          if (!old) return old;
          return old.map((msg: any) => ({ ...msg, isRead: true }));
        });
        chatApi.markAsRead(activeUser.username).then(() => {
          queryClient.invalidateQueries({ queryKey: ['chatConversations'] });
        });
      }
    }
  }, [history, isOpen, activeUser, queryClient, user?.username]);

  if (!isAuthenticated || pathname === '/chat') return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeUser) return;
    sendMessage(activeUser.username, message);
    setMessage('');
  };

  const handleDeleteConversation = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await chatApi.deleteConversation(deleteTarget.username);
      toast.success('Đã xóa cuộc trò chuyện!');
      queryClient.invalidateQueries({ queryKey: ['chatConversations'] });
      if (activeUser?.id === deleteTarget.id) {
        clearActiveUser();
      }
      setDeleteTarget(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa cuộc trò chuyện');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white border border-neutral-200 shadow-2xl rounded-2xl w-80 sm:w-96 mb-4 overflow-hidden flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-primary text-white p-3 flex items-center justify-between shadow-sm">
            {activeUser ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 rounded-full" onClick={() => clearActiveUser()}>
                  <ChevronDown className="w-5 h-5 rotate-90" />
                </Button>
                <Avatar className="h-8 w-8 border border-white/20">
                  <AvatarImage src={activeUser.avatar} />
                  <AvatarFallback className="bg-white/20 text-white text-xs">{activeUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">{activeUser.fullName || activeUser.username}</span>
              </div>
            ) : (
              <div className="font-bold text-sm ml-4">Tin nhắn</div>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 rounded-full" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-neutral-50/50 flex flex-col">
            {!activeUser ? (
              // Conversation List
              <div className="p-2">
                {isConversationsLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : !conversations || conversations.length === 0 ? (
                  <div className="text-center py-10 text-neutral-400 text-sm">Chưa có cuộc trò chuyện nào.</div>
                ) : (
                  conversations.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setActiveUser(c);
                        if (c.unreadCount && c.unreadCount > 0) {
                          chatApi.markAsRead(c.username).then(() => {
                            queryClient.invalidateQueries({ queryKey: ['chatConversations'] });
                          });
                        }
                      }}
                      className="group relative flex items-center gap-3 p-3 hover:bg-neutral-100 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={c.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">{c.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex justify-between items-center mb-0.5">
                          <div className="font-semibold text-neutral-900 text-sm truncate">{c.fullName || c.username}</div>
                          {c.lastMessageTime && (
                            <span className="text-[10px] text-neutral-500 flex-shrink-0">
                              {format(new Date(c.lastMessageTime), 'HH:mm')}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <p className={`text-xs truncate ${c.unreadCount && c.unreadCount > 0 ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}>
                            {c.lastMessage || 'Bắt đầu trò chuyện...'}
                          </p>
                          {c.unreadCount && c.unreadCount > 0 ? (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                              {c.unreadCount > 99 ? '99+' : c.unreadCount}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(c);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-sm border border-neutral-100 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all z-10 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              // Chat History
              <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                {isHistoryLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : history?.length === 0 ? (
                  <div className="text-center py-6 text-neutral-400 text-sm">Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện!</div>
                ) : (
                  history?.map((msg, idx) => {
                    const isMe = msg.senderUsername === user?.username;
                    const isLastMessage = idx === history.length - 1;
                    return (
                      <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-none shadow-sm'}`}>
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-1 mt-1 mx-1">
                          <span className="text-[10px] text-neutral-400">
                            {format(new Date(msg.timestamp.endsWith('Z') ? msg.timestamp : msg.timestamp + 'Z'), 'HH:mm')}
                          </span>
                          {isMe && isLastMessage && (
                            <span className="text-[10px] text-neutral-500 font-medium ml-1 flex items-center">
                              {msg.isRead ? (
                                <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span> Đã xem</>
                              ) : (
                                <><span className="w-1.5 h-1.5 rounded-full bg-neutral-300 mr-1"></span> Đã gửi</>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          {activeUser && (
            <div className="p-3 bg-white border-t border-neutral-100">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="rounded-full bg-neutral-100 border-transparent focus-visible:ring-1 focus-visible:ring-primary h-10"
                />
                <Button type="submit" size="icon" disabled={!message.trim()} className="rounded-full h-10 w-10 shrink-0 shadow-sm">
                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="h-14 w-14 rounded-full shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform p-0">
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xóa trò chuyện?"
        description={
          <>Xóa toàn bộ tin nhắn với <strong>{deleteTarget?.fullName || deleteTarget?.username}</strong>?</>
        }
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteConversation}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
