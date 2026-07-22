'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const LiveFeedClient = dynamic(() => import('@/features/live/components/LiveFeedClient'), {
  ssr: false,
  loading: () => (
    <div className="dark h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <p>Đang tải danh sách Live...</p>
    </div>
  )
});

export default function LiveFeedPage() {
  return (
    <div className="dark">
      <LiveFeedClient />
    </div>
  );
}
