"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Smile,
  User,
  Search,
  Package,
  Home,
  ShoppingBag,
  Ticket
} from "lucide-react"

interface CommandPaletteProps {
  onSelect?: () => void;
}

export function CommandPalette({ onSelect }: CommandPaletteProps) {
  const router = useRouter()

  const runCommand = (path: string) => {
    router.push(path)
    if (onSelect) onSelect()
  }

  return (
    <div className="py-2 max-h-[400px] overflow-y-auto">
      <div className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        Gợi ý nhanh
      </div>
      <div
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors"
        onClick={() => runCommand("/")}
      >
        <Home className="h-4 w-4 text-neutral-500" />
        <span className="text-sm font-medium text-neutral-900">Trang chủ</span>
      </div>
      <div
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors"
        onClick={() => runCommand("/products")}
      >
        <Search className="h-4 w-4 text-neutral-500" />
        <span className="text-sm font-medium text-neutral-900">Khám phá sản phẩm</span>
      </div>

      <div className="h-px bg-neutral-100 my-1 mx-4"></div>

      <div className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        Cá nhân
      </div>
      <div
        className="flex items-center justify-between px-4 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors"
        onClick={() => runCommand("/profile")}
      >
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-900">Hồ sơ cá nhân</span>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">⌘P</kbd>
      </div>
      <div
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors"
        onClick={() => runCommand("/orders")}
      >
        <ShoppingBag className="h-4 w-4 text-neutral-500" />
        <span className="text-sm font-medium text-neutral-900">Đơn mua của tôi</span>
      </div>
      <div
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors"
        onClick={() => runCommand("/seller/orders")}
      >
        <ShoppingBag className="h-4 w-4 text-neutral-500" />
        <span className="text-sm font-medium text-neutral-900">Đơn bán của tôi</span>
      </div>
      <div
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors"
        onClick={() => runCommand("/seller/products")}
      >
        <Package className="h-4 w-4 text-neutral-500" />
        <span className="text-sm font-medium text-neutral-900">Sản phẩm của tôi</span>
      </div>
      <div
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors"
        onClick={() => runCommand("/seller/vouchers")}
      >
        <Ticket className="h-4 w-4 text-neutral-500" />
        <span className="text-sm font-medium text-neutral-900">Quản lý mã giảm giá</span>
      </div>

      <div className="h-px bg-neutral-100 my-1 mx-4"></div>

      <div className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        Hệ thống
      </div>
      <div
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors"
        onClick={() => runCommand("/about")}
      >
        <Smile className="h-4 w-4 text-neutral-500" />
        <span className="text-sm font-medium text-neutral-900">Về chúng tôi</span>
      </div>
    </div>
  )
}