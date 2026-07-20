'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { liveApi } from '@/features/live/api/liveApi';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react';

// Removed top level createClient since AgoraRTC requires window object during SSR

// Dynamically import the Agora/WebSocket heavy item
const LiveFeedItem = dynamic(() => import('@/features/live/components/LiveFeedItem'), {
  ssr: false,
  loading: () => <div className="h-screen w-full flex items-center justify-center bg-black"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
});

export default function LiveFeedPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  // Use a ref to hold the client so it is only created on the client side
  const clientRef = useRef<any>(null);
  if (typeof window !== 'undefined' && !clientRef.current) {
    clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  }

  const { data: activeLiveSessions = [], isLoading } = useQuery({
    queryKey: ['active-live-auctions-full'],
    queryFn: liveApi.getActiveLiveAuctions,
    refetchInterval: 30000,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect which Live is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 } // Needs to be 60% visible to become active
    );

    const children = containerRef.current?.children;
    if (children) {
      Array.from(children).forEach((child) => observer.observe(child));
    }

    return () => observer.disconnect();
  }, [activeLiveSessions]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p>Đang tải danh sách Live...</p>
      </div>
    );
  }

  if (activeLiveSessions.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-background text-foreground">
        <p className="text-xl font-bold mb-4">Hiện không có phiên Live nào diễn ra</p>
        <Button onClick={() => router.push('/')} variant="outline" className="rounded-full">Quay về trang chủ</Button>
      </div>
    );
  }

  if (!clientRef.current) return null; // Avoid rendering on server

  return (
    <AgoraRTCProvider client={clientRef.current}>
      <div
        ref={containerRef}
        className="h-[calc(100vh-4rem)] w-full bg-black overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />

        {activeLiveSessions.map((session, index) => (
          <div
            key={session.id}
            data-index={index}
            className="h-[calc(100vh-4rem)] w-full snap-start relative flex-shrink-0"
          >
            <LiveFeedItem
              session={session}
              isActive={activeIndex === index}
            />
          </div>
        ))}
      </div>
    </AgoraRTCProvider>
  );
}
