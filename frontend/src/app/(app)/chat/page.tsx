'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi, ConversationResponse } from '@/lib/api/chat';
import { useChatSocket } from '@/features/chat/hooks/useChatSocket';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Send, Search, MessageCircle, ArrowLeft, MoreVertical, Phone, Video, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';

export default function ChatPage() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [activeUser, setActiveUser] = useState<ConversationResponse | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ConversationResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { sendMessage } = useChatSocket(isAuthenticated, user?.username);

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
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }

    // Nếu đang mở khung chat này và có tin nhắn mới tới, tự động đánh dấu đã đọc
    if (activeUser) {
      const hasUnread = history?.some(msg => !msg.isRead && msg.senderUsername !== user?.username);
      if (hasUnread) {
        chatApi.markAsRead(activeUser.username).then(() => {
          queryClient.invalidateQueries({ queryKey: ['chatConversations'] });
        });
      }
    }
  }, [history, activeUser]);

  if (!isAuthenticated) return null;

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
        setActiveUser(null);
      }
      setDeleteTarget(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa cuộc trò chuyện');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredConversations = conversations?.filter(c =>
    c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl h-[calc(100vh-64px)]">
      <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 flex overflow-hidden h-[85vh]">

        {/* Sidebar: Conversations */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-neutral-100 bg-neutral-50/50">
          <div className="p-4 border-b border-neutral-100 bg-white">
            <h1 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" /> Tin nhắn
            </h1>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm cuộc trò chuyện..."
                className="pl-10 bg-neutral-100 border-transparent rounded-xl h-11"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {isConversationsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-10 text-neutral-400 text-sm">
                Không tìm thấy cuộc trò chuyện nào.
              </div>
            ) : (
              filteredConversations.map((c) => (
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
                  className={`group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all mb-1 ${activeUser?.id === c.id ? 'bg-primary/10 border-transparent' : 'hover:bg-white hover:shadow-sm border border-transparent'
                    }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src={c.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">{c.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-bold text-neutral-900 truncate">{c.fullName || c.username}</div>
                      {c.lastMessageTime && (
                        <span className="text-xs text-neutral-500 flex-shrink-0">
                          {format(new Date(c.lastMessageTime), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-sm truncate ${c.unreadCount && c.unreadCount > 0 ? 'font-bold text-neutral-900' : 'text-neutral-500'}`}>
                        {c.lastMessage || 'Nhấn để xem tin nhắn'}
                      </p>
                      {c.unreadCount && c.unreadCount > 0 ? (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
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
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-sm border border-neutral-100 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all z-10 
                      ${activeUser?.id === c.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col bg-white ${!activeUser ? 'hidden md:flex' : 'flex'}`}>
          {!activeUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50/30">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-12 h-12 text-primary/40" />
              </div>
              <h3 className="text-xl font-bold text-neutral-700 mb-2">Chưa chọn cuộc trò chuyện</h3>
              <p className="text-neutral-500 max-w-sm text-center">Chọn một người bên danh sách để bắt đầu trò chuyện và giao dịch an toàn.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-6 bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-neutral-500" onClick={() => setActiveUser(null)}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeUser.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">{activeUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-neutral-900">{activeUser.fullName || activeUser.username}</div>
                    <div className="text-xs text-emerald-500 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Đang hoạt động
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/5 rounded-full"><Phone className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/5 rounded-full"><Video className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/5 rounded-full"><MoreVertical className="w-5 h-5" /></Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-neutral-50/50">
                {isHistoryLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : history?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                    <Avatar className="h-20 w-20 mb-4 border-4 border-white shadow-md">
                      <AvatarImage src={activeUser.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{activeUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-neutral-600">Bạn và {activeUser.fullName || activeUser.username} chưa có tin nhắn nào</p>
                    <p className="text-sm mt-1">Gửi lời chào để bắt đầu!</p>
                  </div>
                ) : (
                  history?.map((msg, idx) => {
                    const isMe = msg.senderUsername === user?.username;
                    return (
                      <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-[15px] shadow-sm ${isMe
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-white border border-neutral-100 text-neutral-800 rounded-bl-none'
                          }`}>
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 mx-2">
                          <span className="text-[11px] font-medium text-neutral-400">
                            {format(new Date(msg.timestamp), 'HH:mm - dd/MM/yyyy')}
                          </span>
                          {isMe && idx === history.length - 1 && (
                            <span className="text-[11px] text-neutral-500 font-semibold flex items-center">
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

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-neutral-100 shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Nhập tin nhắn để trao đổi giao dịch..."
                      className="rounded-full bg-neutral-100 border-transparent focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white h-12 pl-6 pr-12 text-[15px]"
                    />
                  </div>
                  <Button type="submit" size="icon" disabled={!message.trim()} className="rounded-full h-12 w-12 shrink-0 shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                    <Send className="w-5 h-5 ml-1" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xóa cuộc trò chuyện?"
        description={
          <>
            Bạn có chắc chắn muốn xóa toàn bộ tin nhắn với <strong>{deleteTarget?.fullName || deleteTarget?.username}</strong>? Hành động này không thể hoàn tác.
          </>
        }
        confirmText="Xóa ngay"
        cancelText="Hủy"
        onConfirm={handleDeleteConversation}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
