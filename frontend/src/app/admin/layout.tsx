'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminFooter } from '@/components/layout/AdminFooter';
import Cookies from 'js-cookie';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') return;

    // Basic protection (Client-side)
    const storedUser = Cookies.get('user');
    if (!storedUser) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'ADMIN') {
        router.push('/');
        return;
      }
      setIsReady(true);
    } catch {
      router.push('/admin/login');
    }
  }, [router, pathname]);

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-neutral-50/50">{children}</div>;
  }

  if (!isReady || !user || user.role !== 'ADMIN') {
    return <div className="min-h-screen flex items-center justify-center font-bold text-neutral-500">Đang tải cấu hình Quản trị viên...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50/50">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}
