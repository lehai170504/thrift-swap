'use client';

import { useEffect, useState, useRef } from 'react';
import { LiveSessionResponse } from '@/features/live/api/liveApi';
import { useJoin, useRemoteUsers, RemoteUser } from 'agora-rtc-react';
import { useAuctionSocket } from '@/features/auction/hooks/useAuctionSocket';
import { useLiveSocket } from '@/features/live/hooks/useLiveSocket';
import { Heart, Share2, LogIn, Users } from 'lucide-react';
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
    <div className="relative w-full h-full bg-neutral-950">
      {/* Video Background */}
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
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full pl-1.5 pr-4 py-1.5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-rose-500 flex items-center justify-center text-sm font-bold text-white shadow-inner">
            {session.hostUsername.charAt(0).toUpperCase()}
          </div>
          <span className="text-white text-sm font-bold">@{session.hostUsername}</span>
        </div>
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white text-sm font-bold">
          <Users className="w-4 h-4 text-primary" /> {viewerCount || 1}
        </div>
      </div>

      {/* Overlay right actions (TikTok style) */}
      <div className="absolute right-6 bottom-32 z-10 flex flex-col gap-6 items-center">
        <button className="flex flex-col items-center gap-1 text-white hover:text-primary transition-colors group">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-active:scale-90 transition-transform">
            <Heart className="w-6 h-6" />
          </div>
        </button>

        <button onClick={handleShare} className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-active:scale-90 transition-transform">
            <Share2 className="w-6 h-6" />
          </div>
        </button>

        <button onClick={handleJoinRoom} className="flex flex-col items-center gap-1 text-white hover:text-rose-400 transition-colors group mt-4">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.6)] group-hover:animate-pulse border-2 border-white/20">
            <LogIn className="w-6 h-6 text-primary-foreground ml-1" />
          </div>
          <span className="text-xs font-bold shadow-black drop-shadow-lg tracking-wide mt-1">VÀO PHÒNG</span>
        </button>
      </div>

      {/* Overlay bottom (Info + Chat) */}
      <div className="absolute bottom-0 left-0 right-24 z-10 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end min-h-[50%]">
        <div className="mb-4">
          <h3 className="text-white font-bold text-xl leading-snug line-clamp-2 drop-shadow-md">{session.productName}</h3>
          <p className="text-primary font-black text-3xl mt-1 drop-shadow-md">{formatCurrency(currentHighestBid || session.currentPrice || 0)}</p>
        </div>

        {/* Mini Chat */}
        <div className="h-40 overflow-hidden flex flex-col justify-end pb-4 [mask-image:linear-gradient(to_top,black_70%,transparent_100%)]">
          {feedMessages.map((msg, idx) => (
            <div key={idx} className="text-sm mb-1.5 animate-in slide-in-from-bottom-2">
              {msg.type === 'CHAT' ? (
                <span className="bg-black/30 backdrop-blur-sm border border-white/5 rounded-2xl rounded-tl-sm px-3 py-1.5 inline-block text-white shadow-sm">
                  <span className="font-bold text-slate-300 mr-2 opacity-80">{msg.senderUsername}:</span>
                  {msg.content}
                </span>
              ) : msg.type === 'BID_UPDATE' ? (
                <span className="bg-primary/20 backdrop-blur-sm border border-primary/20 rounded-2xl px-3 py-1.5 inline-block text-primary font-bold text-xs shadow-sm">
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
