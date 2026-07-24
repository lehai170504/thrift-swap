'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import Cookies from 'js-cookie';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Basic protection (Client-side)
    const storedUser = Cookies.get('user');
    if (!storedUser) {
      router.push('/portal-secure-entry');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'ADMIN' && parsedUser.role !== 'STAFF') {
        router.push('/');
        return;
      }
      setIsReady(true);
    } catch {
      router.push('/portal-secure-entry');
    }
  }, [router, pathname]);

  if (!isReady || !user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-muted-foreground bg-background">Đang tải cấu hình Quản trị viên...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-background/50 relative">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
