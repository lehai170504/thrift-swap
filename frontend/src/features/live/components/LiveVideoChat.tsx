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
import { Mic, MicOff, Video, VideoOff, Send, Users, LogOut, Gavel, Share2, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEndLiveSession, useAuctionDepositStatus, usePlaceAuctionDeposit } from '../hooks/useLive';
import { useLiveSocket } from '../hooks/useLiveSocket';
import { useAuctionSocket } from '@/features/auction/hooks/useAuctionSocket';
import { useProduct } from '@/features/products/hooks/useProducts';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { MissingInfoModal } from '@/features/checkout/components/MissingInfoModal';

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
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const { mutate: endLiveSession } = useEndLiveSession();
  const { data: product } = useProduct(auctionSessionId);

  const [chatInput, setChatInput] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [showEndModal, setShowEndModal] = useState(false);
  const [isMissingInfoModalOpen, setIsMissingInfoModalOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { messages, viewerCount, sendMessage, sendReaction, reactions } = useLiveSocket(liveSession.id);
  const { currentHighestBid, placeBid } = useAuctionSocket(auctionSessionId);

  const { data: hasDeposited, isLoading: isCheckingDeposit } = useAuctionDepositStatus(auctionSessionId, isAuthenticated && !isHost);
  const { mutate: placeDeposit, isPending: isDepositing } = usePlaceAuctionDeposit();

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
    if (e.key === 'Enter') handleSendMessage();
  };

  const proceedWithBid = () => {
    const amount = Number(bidAmount);
    placeBid(amount);
    setBidAmount('');
  };

  const handlePlaceBid = () => {
    const amount = Number(bidAmount);
    if (!amount || isNaN(amount) || amount <= currentHighestBid) {
      toast.error(`Giá đấu phải lớn hơn giá hiện tại (${formatCurrency(currentHighestBid)})`);
      return;
    }

    if (!user?.phone || !user?.address) {
      setIsMissingInfoModalOpen(true);
      return;
    }

    proceedWithBid();
  };

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isHost && micOn);
  const { localCameraTrack } = useLocalCameraTrack(isHost && cameraOn);
  const remoteUsers = useRemoteUsers();
  const hostUser = remoteUsers.find(u => u.uid.toString() === liveSession.hostId);

  useJoin({
    appid: appId,
    channel: liveSession.agoraChannelName,
    token: null,
    uid: user?.id || null,
  }, true);

  usePublish([localMicrophoneTrack, localCameraTrack], isHost);

  const handleShare = () => {
    const url = `${window.location.origin}/auctions/${auctionSessionId}`;
    navigator.clipboard.writeText(url);
    toast.success('Đã sao chép đường dẫn phòng Live!');
  };

  const confirmEndStream = (endAuction: boolean) => {
    setShowEndModal(false);
    endLiveSession({ auctionSessionId, endAuction }, {
      onSuccess: () => {
        router.push(`/products/${auctionSessionId}`);
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-background overflow-hidden relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { transform: translateY(-50px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-400px) scale(1.5); opacity: 0; }
        }
      `}} />

      {/* End Live Modal */}
      {showEndModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass rounded-[24px] border border-border p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground" onClick={() => setShowEndModal(false)}>
              <X className="w-5 h-5" />
            </Button>
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-center text-foreground mb-2">Kết thúc Phiên Live</h3>
            <p className="text-muted-foreground text-center mb-8">
              Bạn có muốn chốt phiên đấu giá ngay lập tức cho người trả giá cao nhất hiện tại không?
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => confirmEndStream(true)} className="w-full h-12 rounded-[24px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                Xác nhận kết thúc và chốt giá ({formatCurrency(currentHighestBid)})
              </Button>
              <Button onClick={() => confirmEndStream(false)} variant="outline" className="w-full h-12 rounded-[24px] font-bold border-border hover:bg-accent hover:text-accent-foreground text-foreground">
                Kết thúc Live (Tiếp tục đấu giá ngầm)
              </Button>
            </div>
          </div>
        </div>
      )}

      <MissingInfoModal
        isOpen={isMissingInfoModalOpen}
        onOpenChange={setIsMissingInfoModalOpen}
        onSuccess={proceedWithBid}
      />

      {/* Video Area (Left) */}
      <div className="flex-1 relative flex flex-col items-center justify-center bg-black">
        {/* Floating Reactions overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {reactions.map((r) => (
            <div
              key={r.id}
              className="absolute text-5xl animate-[floatUp_2s_ease-out_forwards]"
              style={{ bottom: '10%', left: `${Math.random() * 80 + 10}%` }}
            >
              {r.emoji}
            </div>
          ))}
        </div>

        <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-3 pointer-events-none w-full pr-8">
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            <Button onClick={() => router.push(`/products/${auctionSessionId}`)} size="sm" variant="secondary" className="rounded-full bg-black/40 hover:bg-black/60 text-white border-none backdrop-blur-md h-[32px] px-3">
              <LogOut className="w-4 h-4 mr-1.5" /> Thoát
            </Button>
            <Badge variant="destructive" className="animate-pulse px-3 py-1 text-sm font-bold shadow-lg shadow-red-500/50">
              <span className="w-2 h-2 rounded-full bg-white mr-2"></span>
              LIVE
            </Badge>
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium text-white">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" /> {viewerCount || 1}
              </span>
            </div>
            <Button onClick={handleShare} size="sm" variant="secondary" className="rounded-full bg-black/40 hover:bg-black/60 text-white border-none backdrop-blur-md h-[32px]">
              <Share2 className="w-4 h-4 mr-2" /> Chia sẻ
            </Button>
          </div>

          {product && (
            <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-2 flex gap-3 max-w-[280px] sm:max-w-[320px] pointer-events-auto mt-2">
              <img src={product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?seed=${product.id}`} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{product.title}</p>
                <p className="text-primary font-black text-sm mt-0.5">{formatCurrency(currentHighestBid || product?.price || 0)}</p>
              </div>
            </div>
          )}
        </div>

        {isHost ? (
          <div className="w-full h-full relative">
            <LocalUser
              audioTrack={localMicrophoneTrack}
              videoTrack={localCameraTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              playAudio={false}
              playVideo={true}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-full relative">
            {hostUser ? (
              <RemoteUser user={hostUser} playVideo={true} playAudio={true} className="w-full h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                <VideoOff className="w-16 h-16 mb-4" />
                <p className="text-lg">Người bán hiện đang vắng mặt hoặc chưa bật camera</p>
              </div>
            )}
          </div>
        )}

        {/* Host Controls */}
        {isHost && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full z-10 pointer-events-auto">
            <Button variant={micOn ? "secondary" : "destructive"} size="icon" className="rounded-full w-12 h-12" onClick={() => setMicOn(!micOn)}>
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            <Button variant={cameraOn ? "secondary" : "destructive"} size="icon" className="rounded-full w-12 h-12" onClick={() => setCameraOn(!cameraOn)}>
              {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            <Button variant="destructive" className="rounded-full h-12 px-6 font-bold" onClick={() => setShowEndModal(true)}>
              <LogOut className="w-4 h-4 mr-2" />
              Kết thúc
            </Button>
          </div>
        )}
      </div>

      {/* Interaction Area (Right) */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-background/90 flex flex-col border-l border-border glass">
        <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm z-10 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-foreground font-heading font-bold text-lg flex items-center gap-2">
              <Gavel className="w-5 h-5 text-primary" /> Phiên đấu giá
            </h2>
            <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-lg text-sm">{formatCurrency(currentHighestBid)}</span>
          </div>
          <p className="text-muted-foreground text-sm">Của @{liveSession.hostUsername}</p>
        </div>

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
          <div className="text-center text-xs text-muted-foreground my-2 bg-background/50 py-2 rounded-lg border border-border">
            Chào mừng bạn đến với phiên Live!
          </div>
          {messages.map((msg, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {msg.type === 'CHAT' ? (
                <div>
                  <span className="font-bold text-muted-foreground text-sm mr-2">{msg.senderUsername}:</span>
                  <span className="text-foreground text-sm bg-muted/80 px-3 py-1.5 rounded-2xl rounded-tl-sm inline-block">{msg.content}</span>
                </div>
              ) : msg.type === 'BID_UPDATE' ? (
                <div className="text-center text-xs text-primary bg-primary/10 border border-primary/20 py-1.5 rounded-lg font-medium">
                  🔥 {msg.senderUsername} vừa ra giá {msg.content}
                </div>
              ) : (
                <div className="text-center text-xs text-muted-foreground italic">
                  {msg.senderUsername} {msg.type === 'JOIN' ? 'vừa vào phòng' : 'vừa rời phòng'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reaction Toolbar */}
        <div className="px-4 py-2 border-t border-border flex items-center justify-center gap-4 bg-background/50">
          {['❤️', '👍', '🔥', '😂', '🎉'].map(emoji => (
            <button
              key={emoji}
              onClick={() => sendReaction(emoji)}
              className="text-2xl hover:scale-125 transition-transform active:scale-95 p-2 rounded-full hover:bg-accent hover:text-accent-foreground"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Bidding & Chat Input Area */}
        <div className="p-4 pt-2 bg-background/50 flex flex-col gap-3 pb-8 lg:pb-4">
          {!isAuthenticated ? (
            <div className="bg-muted rounded-xl p-4 text-center border border-border">
              <p className="text-muted-foreground text-sm mb-3">Vui lòng đăng nhập để tham gia chat và đấu giá</p>
              <Button onClick={openLoginModal} variant="outline" className="w-full bg-transparent border-primary/50 text-primary hover:bg-primary/10 rounded-[24px]">Đăng nhập ngay</Button>
            </div>
          ) : (
            <>
              {!isHost && (
                <>
                  {!hasDeposited ? (
                    <div className="bg-muted rounded-xl p-4 text-center border border-border relative overflow-hidden group">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-foreground text-sm mb-1 font-bold">Chống phá giá (Clone)</p>
                      <p className="text-muted-foreground text-xs mb-3">Hệ thống yêu cầu tạm giữ <strong className="text-primary">50.000đ</strong> từ ví của bạn để tham gia. Tiền sẽ được hoàn lại nếu bạn không thắng.</p>
                      <Button
                        onClick={() => placeDeposit(auctionSessionId)}
                        disabled={isDepositing || isCheckingDeposit}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-[24px]"
                      >
                        {isDepositing ? 'Đang xử lý...' : 'Cọc 50.000đ để Tham gia'}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder={`> ${formatCurrency(currentHighestBid)}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-12 flex-1 text-center font-bold text-lg rounded-[24px]"
                      />
                      <Button
                        onClick={handlePlaceBid}
                        className="h-12 px-6 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] animate-pulse hover:animate-none transition-all rounded-[24px]">
                        ĐẶT GIÁ
                      </Button>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập tin nhắn..."
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-10 rounded-[24px] px-4 focus-visible:ring-1 focus-visible:ring-white/20"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="h-10 w-10 rounded-full shrink-0 bg-muted/80 hover:bg-secondary text-foreground border-none">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
