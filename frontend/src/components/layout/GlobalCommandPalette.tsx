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
  Ticket,
  Store,
  Wallet
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useDebounce } from "@/hooks/useDebounce"
import { useSearchProducts } from "@/features/products/hooks/useProducts"
import { formatCurrency } from "@/lib/utils"

export function GlobalCommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const router = useRouter()

  const debouncedSearch = useDebounce(search, 500)
  const { data: searchResults, isLoading: isSearching } = useSearchProducts({
    query: debouncedSearch
  })

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

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    setSearch("")
    command()
  }, [])

  const hasSearch = debouncedSearch.trim() !== ""

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Global Search" description="Tìm kiếm và điều hướng nhanh">
      <CommandInput
        placeholder="Tìm kiếm sản phẩm hoặc gõ lệnh điều hướng..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          {isSearching ? "Đang tìm kiếm..." : "Không tìm thấy kết quả."}
        </CommandEmpty>

        {hasSearch && searchResults?.content && searchResults.content.length > 0 && (
          <CommandGroup heading="Sản phẩm tìm thấy">
            {searchResults.content.slice(0, 5).map((product: any) => (
              <CommandItem
                key={product.id}
                onSelect={() => runCommand(() => router.push(`/products/${product.id}`))}
                className="flex items-center gap-3 py-2 cursor-pointer"
              >
                <div className="w-8 h-8 rounded bg-muted overflow-hidden flex-shrink-0">
                  <img
                    src={product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100&h=100&seed=${product.id}`}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">{product.title}</span>
                  <span className="text-xs text-primary font-semibold">{formatCurrency(product.price)}</span>
                </div>
              </CommandItem>
            ))}
            <CommandItem
              onSelect={() => runCommand(() => router.push(`/products?query=${encodeURIComponent(debouncedSearch)}`))}
              className="text-primary font-medium justify-center cursor-pointer mt-1"
            >
              Xem tất cả kết quả
            </CommandItem>
          </CommandGroup>
        )}

        {!hasSearch && (
          <>
            <CommandGroup heading="Gợi ý nhanh">
              <CommandItem onSelect={() => runCommand(() => router.push("/"))} className="cursor-pointer">
                <Home className="mr-2 h-4 w-4" />
                <span>Trang chủ</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/products"))} className="cursor-pointer">
                <Search className="mr-2 h-4 w-4" />
                <span>Khám phá sản phẩm</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/auctions"))} className="cursor-pointer">
                <Package className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-red-500">Đấu giá LIVE</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Cá nhân">
              <CommandItem onSelect={() => runCommand(() => router.push("/profile"))} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ cá nhân</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/orders"))} className="cursor-pointer">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>Đơn mua của tôi</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/wallet"))} className="cursor-pointer">
                <Wallet className="mr-2 h-4 w-4" />
                <span>Ví của tôi</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Bán hàng">
              <CommandItem onSelect={() => runCommand(() => router.push("/seller/orders"))} className="cursor-pointer">
                <Store className="mr-2 h-4 w-4" />
                <span>Đơn bán của tôi</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/seller/products"))} className="cursor-pointer">
                <Package className="mr-2 h-4 w-4" />
                <span>Sản phẩm của tôi</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
