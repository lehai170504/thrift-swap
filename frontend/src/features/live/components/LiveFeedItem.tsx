'use client';

import { LiveSessionResponse } from '@/features/live/api/liveApi';
import { useJoin, useRemoteUsers, RemoteUser } from 'agora-rtc-react';
import { useAuctionSocket } from '@/features/auction/hooks/useAuctionSocket';
import { useLiveSocket } from '@/features/live/hooks/useLiveSocket';
import { Heart, Share2, Users, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || 'dummy_app_id';

interface LiveFeedItemProps {
  session: LiveSessionResponse;
  isActive: boolean;
}

export default function LiveFeedItem({ session, isActive }: LiveFeedItemProps) {
  const router = useRouter();

  // Agora connection - only join if active
  useJoin({
    appid: appId,
    channel: session.agoraChannelName,
    token: null,
    uid: null,
  }, isActive);

  const remoteUsers = useRemoteUsers();
  const hostUser = remoteUsers.find(u => u.uid.toString() === session.hostId);

  // Sockets (Only connect if active to save resources? Actually our socket hooks connect on mount, but we can pass isActive to them if we refactor. 
  // For now, they connect automatically which is fine for small scale, but we can unmount items not active if needed. 
  // But wait, the WebSocket connections are lightweight compared to WebRTC, so it's acceptable for now.)
  const { currentHighestBid } = useAuctionSocket(session.productId);
  const { messages, viewerCount } = useLiveSocket(session.id);

  // We only show the latest 5 messages in feed
  const feedMessages = messages.slice(-5);

  const handleJoinRoom = () => {
    router.push(`/auctions/${session.productId}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/auctions/${session.productId}`);
    toast.success('Đã sao chép link!');
  };

  return (
    <div className="relative w-full h-full bg-background dark">
      {/* Video Element (placeholder for Agora/Video stream) */}
      {hostUser && isActive ? (
        <RemoteUser user={hostUser} playVideo={true} playAudio={true} className="w-full h-full object-cover" />
      ) : (
        <img
          src={session.productThumbnail || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?seed=${session.productId}`}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isActive ? 'opacity-30' : 'opacity-60'}`}
        />
      )}

      {/* Overlay top */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
        <div className="bg-background/40 backdrop-blur-xl border border-border/50 rounded-[24px] pl-1.5 pr-4 py-1.5 flex items-center gap-2 shadow-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-rose-500 flex items-center justify-center text-sm font-bold text-foreground shadow-inner">
            {session.hostUsername.charAt(0).toUpperCase()}
          </div>
          <span className="text-foreground text-sm font-bold">@{session.hostUsername}</span>
        </div>
        <div className="bg-background/40 backdrop-blur-xl border border-border/50 rounded-[24px] px-3 py-1.5 flex items-center gap-1.5 text-foreground text-sm font-bold shadow-lg">
          <Users className="w-4 h-4 text-primary" /> {viewerCount || 1}
        </div>
      </div>

      {/* Overlay right actions */}
      <div className="absolute right-4 bottom-32 z-10 flex flex-col gap-6 items-center">
        <button className="flex flex-col items-center gap-1 text-foreground hover:text-primary transition-colors group">
          <div className="w-12 h-12 rounded-[24px] bg-background/40 backdrop-blur-xl border border-border/50 flex items-center justify-center group-active:scale-90 transition-transform shadow-lg hover:bg-background/60">
            <Heart className="w-6 h-6" />
          </div>
        </button>

        <button onClick={handleShare} className="flex flex-col items-center gap-1 text-foreground hover:text-blue-400 transition-colors group">
          <div className="w-12 h-12 rounded-[24px] bg-background/40 backdrop-blur-xl border border-border/50 flex items-center justify-center group-active:scale-90 transition-transform shadow-lg hover:bg-background/60">
            <Share2 className="w-6 h-6" />
          </div>
        </button>

        <button onClick={handleJoinRoom} className="flex flex-col items-center gap-1 text-foreground hover:text-rose-400 transition-colors group mt-4">
          <div className="w-14 h-14 rounded-[24px] bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.6)] group-hover:scale-110 group-hover:animate-pulse border border-border/50 transition-transform">
            <ShoppingCart className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-[10px] font-black shadow-black drop-shadow-lg tracking-widest mt-2 uppercase">Vào Phòng</span>
        </button>
      </div>

      {/* Overlay bottom (Info + Chat) */}
      <div className="absolute bottom-0 left-0 right-20 z-10 p-6 pt-32 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end min-h-[50%] pointer-events-none">
        <div className="mb-4">
          <h3 className="text-foreground font-bold text-xl leading-snug line-clamp-2 drop-shadow-md">{session.productName}</h3>
          <p className="text-amber-400 font-black text-3xl mt-1 drop-shadow-md">{formatCurrency(currentHighestBid || session.currentPrice || 0)}</p>
        </div>

        {/* Mini Chat */}
        <div className="h-40 overflow-hidden flex flex-col justify-end pb-4 [mask-image:linear-gradient(to_top,black_70%,transparent_100%)] pointer-events-auto">
          {feedMessages.map((msg, idx) => (
            <div key={idx} className="text-sm mb-1.5 animate-in slide-in-from-bottom-2">
              {msg.type === 'CHAT' ? (
                <span className="bg-background/40 backdrop-blur-xl border border-border rounded-[20px] rounded-tl-sm px-3 py-1.5 inline-block text-foreground shadow-sm">
                  <span className="font-bold text-muted-foreground mr-2 opacity-80">{msg.senderUsername}:</span>
                  {msg.content}
                </span>
              ) : msg.type === 'BID_UPDATE' ? (
                <span className="bg-amber-400/20 backdrop-blur-xl border border-amber-400/30 rounded-[20px] px-3 py-1.5 inline-block text-amber-400 font-bold text-xs shadow-sm">
                  🔥 {msg.senderUsername} vừa ra giá {msg.content}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
