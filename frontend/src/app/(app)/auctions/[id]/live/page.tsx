'use client';

import { useLiveSession } from '@/features/live/hooks/useLive';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, VideoOff } from 'lucide-react';
import dynamic from 'next/dynamic';

// We must dynamically import the actual LiveRoom UI because Agora requires browser environment (window/navigator)
const LiveVideoChat = dynamic(() => import('@/features/live/components/LiveVideoChat'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4 text-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Đang kết nối phòng Live...</p>
      </div>
    </div>
  )
});

export default function LiveRoomPage() {
  const params = useParams();
  const router = useRouter();
  const auctionSessionId = params.id as string;
  const { user } = useAuth();

  const { data: liveSession, isLoading, error } = useLiveSession(auctionSessionId);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !liveSession) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center bg-neutral-900 text-white">
        <VideoOff className="w-20 h-20 text-neutral-600 mb-6" />
        <h1 className="text-3xl font-bold mb-2">Phiên Live không tồn tại</h1>
        <p className="text-neutral-400 mb-8">Phiên live này chưa bắt đầu hoặc đã kết thúc.</p>
        <Button onClick={() => router.push(`/products/${auctionSessionId}`)} variant="outline" className="text-black">
          Quay lại sản phẩm
        </Button>
      </div>
    );
  }

  const isHost = user?.id === liveSession.hostId;

  return (
    <div className="bg-black min-h-[calc(100vh-4rem)]">
      <LiveVideoChat
        liveSession={liveSession}
        isHost={isHost}
        auctionSessionId={auctionSessionId}
      />
    </div>
  );
}
