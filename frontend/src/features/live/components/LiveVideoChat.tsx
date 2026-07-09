'use client';

import { useState, useEffect, useRef } from 'react';
import AgoraRTC, {
  AgoraRTCProvider,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useJoin,
  usePublish,
  useRemoteUsers,
  RemoteUser,
  LocalUser
} from 'agora-rtc-react';
import { LiveSessionResponse } from '../api/liveApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Send, Users, LogOut, Gavel } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEndLiveSession } from '../hooks/useLive';
import { useLiveSocket } from '../hooks/useLiveSocket';
import { useAuctionSocket } from '@/features/auction/hooks/useAuctionSocket';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || 'dummy_app_id';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

interface LiveVideoChatProps {
  liveSession: LiveSessionResponse;
  isHost: boolean;
  auctionSessionId: string;
}

export default function LiveVideoChatWrapper(props: LiveVideoChatProps) {
  return (
    <AgoraRTCProvider client={client}>
      <LiveVideoChat {...props} />
    </AgoraRTCProvider>
  );
}

function LiveVideoChat({ liveSession, isHost, auctionSessionId }: LiveVideoChatProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { mutate: endLiveSession } = useEndLiveSession();

  const [chatInput, setChatInput] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { messages, viewerCount, sendMessage } = useLiveSocket(liveSession.id);
  const { currentHighestBid, placeBid } = useAuctionSocket(auctionSessionId);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setChatInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handlePlaceBid = () => {
    const amount = Number(bidAmount);
    if (!amount || isNaN(amount) || amount <= currentHighestBid) {
      toast.error(`Giá đấu phải lớn hơn giá hiện tại (${formatCurrency(currentHighestBid)})`);
      return;
    }
    placeBid(amount);
    setBidAmount('');
  };

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  // Host tracks (only request permission if isHost is true)
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isHost && micOn);
  const { localCameraTrack } = useLocalCameraTrack(isHost && cameraOn);

  // Audience tracks
  const remoteUsers = useRemoteUsers();

  // Since 1 Live = 1 Product, the only person publishing should be the Host.
  // We assume the host is the only one sending video/audio.
  const hostUser = remoteUsers.find(u => u.uid.toString() === liveSession.hostId);

  // Join channel
  useJoin({
    appid: appId,
    channel: liveSession.agoraChannelName,
    token: null, // For MVP without secure token server
    uid: user?.id || null, // Join with our own DB user ID
  }, true); // Join immediately

  // Publish tracks if we are the host
  usePublish([localMicrophoneTrack, localCameraTrack], isHost);

  const handleEndStream = () => {
    endLiveSession(auctionSessionId, {
      onSuccess: () => {
        router.push(`/products/${auctionSessionId}`);
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-neutral-950 overflow-hidden">
      {/* Video Area (Left) */}
      <div className="flex-1 relative flex flex-col items-center justify-center bg-black">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className="flex items-center justify-between text-white mb-2">
            <Badge variant="destructive" className="animate-pulse px-3 py-1 text-sm font-bold shadow-lg shadow-red-500/50">
              <span className="w-2 h-2 rounded-full bg-white mr-2"></span>
              LIVE
            </Badge>
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" /> {viewerCount || 1}
              </span>
            </div>
          </div>
        </div>

        {isHost ? (
          <div className="w-full h-full relative">
            <LocalUser
              audioTrack={localMicrophoneTrack}
              videoTrack={localCameraTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              playAudio={false} // Don't play own audio
              playVideo={true}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-full relative">
            {hostUser ? (
              <RemoteUser user={hostUser} playVideo={true} playAudio={true} className="w-full h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full text-white/50">
                <VideoOff className="w-16 h-16 mb-4" />
                <p className="text-lg">Người bán hiện đang vắng mặt hoặc chưa bật camera</p>
              </div>
            )}
          </div>
        )}

        {/* Host Controls */}
        {isHost && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full z-10">
            <Button
              variant={micOn ? "secondary" : "destructive"}
              size="icon"
              className="rounded-full w-12 h-12"
              onClick={() => setMicOn(!micOn)}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            <Button
              variant={cameraOn ? "secondary" : "destructive"}
              size="icon"
              className="rounded-full w-12 h-12"
              onClick={() => setCameraOn(!cameraOn)}
            >
              {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            <Button
              variant="destructive"
              className="rounded-full h-12 px-6 font-bold"
              onClick={handleEndStream}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Kết thúc Live
            </Button>
          </div>
        )}
      </div>

      {/* Interaction Area (Right) */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-neutral-900 flex flex-col border-l border-neutral-800">
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm z-10">
          <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
            <Gavel className="w-5 h-5 text-primary" /> Phiên đấu giá
          </h2>
          <p className="text-neutral-400 text-sm flex justify-between">
            <span>Của @{liveSession.hostUsername}</span>
            <span className="text-primary font-bold">Giá cao nhất: {formatCurrency(currentHighestBid)}</span>
          </p>
        </div>

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
          <div className="text-center text-xs text-neutral-500 my-4 bg-neutral-800/50 py-2 rounded-lg">
            Chào mừng bạn đến với phiên Live! Hãy chat một cách lịch sự nhé.
          </div>
          {messages.map((msg, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {msg.type === 'CHAT' ? (
                <div>
                  <span className="font-bold text-neutral-300 text-sm mr-2">{msg.senderUsername}:</span>
                  <span className="text-white text-sm bg-neutral-800 px-3 py-1.5 rounded-2xl rounded-tl-sm inline-block">{msg.content}</span>
                </div>
              ) : msg.type === 'BID_UPDATE' ? (
                <div className="text-center text-xs text-primary bg-primary/10 py-1 rounded">
                  {msg.senderUsername} đã trả giá {msg.content}
                </div>
              ) : (
                <div className="text-center text-xs text-neutral-500 italic">
                  {msg.senderUsername} {msg.type === 'JOIN' ? 'vừa vào phòng' : 'vừa rời phòng'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bidding & Chat Input Area */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex flex-col gap-3">
          {!isHost && (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`> ${formatCurrency(currentHighestBid)}`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 h-12 flex-1 text-center font-bold text-lg"
              />
              <Button
                onClick={handlePlaceBid}
                className="h-12 px-6 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] animate-pulse hover:animate-none transition-all">
                ĐẶT GIÁ NGAY
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 h-10 rounded-full px-4 focus-visible:ring-1 focus-visible:ring-neutral-600"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-10 w-10 rounded-full shrink-0 bg-neutral-800 hover:bg-neutral-700 text-white border-none">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
