'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useActiveLiveAuctions } from '@/features/live/hooks/useLive';
import dynamic from 'next/dynamic';

const FloatingLiveWidgetInner = dynamic(() => import('./FloatingLiveWidgetInner'), { ssr: false });

export function FloatingLiveWidget() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  const { data: activeLiveSessions = [] } = useActiveLiveAuctions();

  // Check if user manually dismissed it in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('thriftly-live-widget-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  // Do not show if no live auctions or manually dismissed
  if (!isVisible || activeLiveSessions.length === 0) return null;

  // Do not show if the user is ALREADY inside an auction or live page, or in admin portal
  if (pathname?.startsWith('/auctions/') || pathname?.startsWith('/live') || pathname?.startsWith('/admin') || pathname?.startsWith('/portal-secure-entry')) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('thriftly-live-widget-dismissed', 'true');
  };

  return <FloatingLiveWidgetInner session={activeLiveSessions[0]} onDismiss={handleDismiss} />;
}
