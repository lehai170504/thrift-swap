import { ConversationResponse } from '@/features/chat/api/chatApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ChatSidebarProps {
  conversations: ConversationResponse[];
  activeUser: ConversationResponse | null;
  setActiveUser: (user: ConversationResponse | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isConversationsLoading: boolean;
  onDeleteClick: (user: ConversationResponse) => void;
  onConversationClick: (user: ConversationResponse) => void;
}

export function ChatSidebar({
  conversations,
  activeUser,
  searchQuery,
  setSearchQuery,
  isConversationsLoading,
  onDeleteClick,
  onConversationClick
}: ChatSidebarProps) {

  const filteredConversations = conversations.filter(c =>
    c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOnlineStatus = (lastActiveAt?: string) => {
    if (!lastActiveAt) return false;
    const lastActive = new Date(lastActiveAt).getTime();

    const now = new Date().getTime();
    const diffMinutes = Math.floor((now - lastActive) / (1000 * 60));
    return diffMinutes <= 5;
  };

  return (
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
              onClick={() => onConversationClick(c)}
              className={`group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all mb-1 ${activeUser?.id === c.id ? 'bg-primary/10 border-transparent' : 'hover:bg-white hover:shadow-sm border border-transparent'
                }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarImage src={c.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">{c.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {getOnlineStatus(c.lastActiveAt) && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                )}
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
                  onDeleteClick(c);
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
  );
}
