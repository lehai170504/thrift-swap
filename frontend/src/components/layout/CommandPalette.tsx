"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Smile,
  User,
  Search,
  Package,
  Home,
  ShoppingBag
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Tìm kiếm sản phẩm, đơn hàng hoặc gõ lệnh..." />
        <CommandList>
          <CommandEmpty>Không tìm thấy kết quả nào.</CommandEmpty>

          <CommandGroup heading="Gợi ý nhanh (Quick Links)">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Trang chủ</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/products"))}>
              <Search className="mr-2 h-4 w-4" />
              <span>Khám phá sản phẩm</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Cá nhân (Personal)">
            <CommandItem onSelect={() => runCommand(() => router.push("/profile"))}>
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ cá nhân</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/orders"))}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Đơn mua của tôi</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/seller/orders"))}>
              <Package className="mr-2 h-4 w-4" />
              <span>Đơn bán của tôi</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/seller/products"))}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Sản phẩm của tôi (Kho hàng)</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Hệ thống (System)">
            <CommandItem onSelect={() => runCommand(() => router.push("/about"))}>
              <Smile className="mr-2 h-4 w-4" />
              <span>Về chúng tôi (About)</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
