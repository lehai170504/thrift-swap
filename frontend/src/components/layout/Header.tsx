'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon, Wallet, Plus, LayoutDashboard, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateProductModal } from '@/features/products/components/CreateProductModal';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout, openLoginModal, openRegisterModal } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full pt-4 px-4 pb-4 bg-background/0">
      <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-background/80 backdrop-blur-xl border border-border/40 shadow-sm transition-all duration-300 px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="w-10 h-10 bg-[#fdfbf7] dark:bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 border border-border/50">
            <img src="/logo.png?v=2" alt="Thriftly Logo" className="w-[120%] h-[120%] object-contain" />
          </div>
          <span className="text-2xl font-serif font-medium tracking-tight text-foreground">
            Thriftly.
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium absolute left-1/2 -translate-x-1/2">
          <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1">Khám phá</Link>
          <Link href="/products?sellType=AUCTION" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1">Đấu giá</Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1">Về chúng tôi</Link>
        </nav>

        {/* Auth / Actions */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Button onClick={openLoginModal} variant="ghost" className="hidden sm:inline-flex text-foreground hover:bg-muted/50 rounded-full font-medium px-6">
                Đăng nhập
              </Button>
              <Button onClick={openRegisterModal} className="bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium px-6 shadow-md hover:shadow-lg transition-all">
                Đăng ký
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <CreateProductModal>
                <Button variant="outline" className="hidden sm:flex rounded-full gap-2 border-border/50 font-medium hover:bg-muted/50 transition-colors">
                  <Plus className="w-4 h-4" /> Đăng tin
                </Button>
              </CreateProductModal>

              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="h-10 w-10 border border-border/50 cursor-pointer hover:border-foreground/30 transition-colors shadow-sm">
                    <AvatarImage src={user?.avatar} alt={user?.fullName || user?.username} className="object-cover" />
                    <AvatarFallback className="bg-muted text-foreground font-medium">
                      {(user?.fullName || user?.username || 'U').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-3xl p-3 border-border/40 shadow-xl bg-background/95 backdrop-blur-xl mt-2">
                  <div className="px-3 py-3 mb-1">
                    <p className="font-heading font-bold text-base truncate">{user?.fullName || user?.username}</p>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-border/30 mb-2" />

                  <DropdownMenuItem className="cursor-pointer rounded-2xl py-3 px-3 focus:bg-muted/60 transition-colors" onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    <span className="font-medium">Bảng điều khiển</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer rounded-2xl py-3 px-3 focus:bg-muted/60 transition-colors" onClick={() => router.push('/profile')}>
                    <UserIcon className="mr-3 h-4 w-4" />
                    <span className="font-medium">Tài khoản của tôi</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer rounded-2xl py-3 px-3 focus:bg-muted/60 transition-colors" onClick={() => router.push('/wallet')}>
                    <Wallet className="mr-3 h-4 w-4" />
                    <span className="font-medium">Ví Thriftly</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer rounded-2xl py-3 px-3 focus:bg-muted/60 transition-colors" onClick={() => router.push('/profile/favorites')}>
                    <Heart className="mr-3 h-4 w-4" />
                    <span className="font-medium">Sản phẩm yêu thích</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border/30 my-2" />

                  <DropdownMenuItem className="cursor-pointer rounded-2xl py-3 px-3 text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30 transition-colors" onClick={logout}>
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
