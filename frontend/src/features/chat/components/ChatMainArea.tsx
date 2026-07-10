import { ConversationResponse, ChatMessageDto } from '@/features/chat/api/chatApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { format } from 'date-fns';
import { RefObject } from 'react';

interface ChatMainAreaProps {
  activeUser: ConversationResponse | null;
  setActiveUser: (user: ConversationResponse | null) => void;
  history: ChatMessageDto[] | undefined;
  isHistoryLoading: boolean;
  message: string;
  setMessage: (msg: string) => void;
  handleSend: (e: React.FormEvent) => void;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  currentUsername?: string;
}

export function ChatMainArea({
  activeUser,
  setActiveUser,
  history,
  isHistoryLoading,
  message,
  setMessage,
  handleSend,
  scrollContainerRef,
  messagesEndRef,
  currentUsername
}: ChatMainAreaProps) {

  if (!activeUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50/30 hidden md:flex">
        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <MessageCircle className="w-12 h-12 text-primary/40" />
        </div>
        <h3 className="text-xl font-bold text-neutral-700 mb-2">Chưa chọn cuộc trò chuyện</h3>
        <p className="text-neutral-500 max-w-sm text-center">Chọn một người bên danh sách để bắt đầu trò chuyện và giao dịch an toàn.</p>
      </div>
    );
  }

  const getOnlineStatus = (lastActiveAt?: string) => {
    if (!lastActiveAt) return { isOnline: false, text: 'Ngoại tuyến' };

    const lastActive = new Date(lastActiveAt).getTime();

    const now = new Date().getTime();
    const diffMinutes = Math.floor((now - lastActive) / (1000 * 60));

    if (diffMinutes <= 5) return { isOnline: true, text: 'Đang hoạt động' };
    if (diffMinutes < 60) return { isOnline: false, text: `Hoạt động ${diffMinutes} phút trước` };

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return { isOnline: false, text: `Hoạt động ${diffHours} giờ trước` };

    const diffDays = Math.floor(diffHours / 24);
    return { isOnline: false, text: `Hoạt động ${diffDays} ngày trước` };
  };

  const status = getOnlineStatus(activeUser.lastActiveAt);

  return (
    <div className="flex-1 flex flex-col bg-white min-h-0">
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
            <div className={`text-xs flex items-center gap-1 ${status.isOnline ? 'text-emerald-500' : 'text-neutral-400'}`}>
              <span className={`w-2 h-2 rounded-full ${status.isOnline ? 'bg-emerald-500' : 'bg-neutral-300'}`}></span> {status.text}
            </div>
          </div>
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
            const isMe = msg.senderUsername === currentUsername;
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
    </div>
  );
}
