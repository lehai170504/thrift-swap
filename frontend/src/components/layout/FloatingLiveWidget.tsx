'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { liveApi } from '@/features/live/api/liveApi';
import dynamic from 'next/dynamic';

const FloatingLiveWidgetInner = dynamic(() => import('./FloatingLiveWidgetInner'), { ssr: false });

export function FloatingLiveWidget() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Polling every 30 seconds for active live auctions
  const { data: activeLiveSessions = [] } = useQuery({
    queryKey: ['active-live-auctions-full'],
    queryFn: liveApi.getActiveLiveAuctions,
    refetchInterval: 30000,
  });

  // Check if user manually dismissed it in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('thriftly-live-widget-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  // Do not show if no live auctions or manually dismissed
  if (!isVisible || activeLiveSessions.length === 0) return null;

  // Do not show if the user is ALREADY inside an auction or live page
  if (pathname?.startsWith('/auctions/') || pathname?.startsWith('/live')) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('thriftly-live-widget-dismissed', 'true');
  };

  return <FloatingLiveWidgetInner session={activeLiveSessions[0]} onDismiss={handleDismiss} />;
}
