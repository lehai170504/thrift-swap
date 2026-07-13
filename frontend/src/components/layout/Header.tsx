'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, LogOut, User as UserIcon, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateProductModal } from '@/features/products/components/CreateProductModal';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout, openLoginModal, openRegisterModal } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-md glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 bg-primary/20 rounded-[12px] flex items-center justify-center overflow-hidden border border-primary/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
            <img src="/logo.png?v=2" alt="Thriftly Logo" className="w-[120%] h-[120%] object-contain" />
          </div>
          <span className="text-xl font-heading font-black tracking-tight text-foreground">
            Thriftly
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">Khám phá</Link>
          <Link href="/products?sellType=AUCTION" className="text-muted-foreground hover:text-primary transition-colors">Đấu giá</Link>
          <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Về chúng tôi</Link>
        </nav>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Button onClick={openLoginModal} variant="ghost" className="hidden sm:inline-flex text-foreground hover:bg-accent rounded-[24px]">Đăng nhập</Button>
              <Button onClick={openRegisterModal} className="bg-primary hover:bg-primary/90 rounded-[24px] shadow-[0_0_15px_rgba(139,92,246,0.3)]">Đăng ký ngay</Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border-2 border-primary/20 cursor-default">
                <AvatarImage src={user?.avatar} alt={user?.fullName || user?.username} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary/90 font-bold">
                  {(user?.fullName || user?.username || 'U').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
