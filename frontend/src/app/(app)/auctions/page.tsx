'use client';

import { useState, useMemo } from 'react';
import { useSearchProducts, useCategories } from '@/features/products/hooks/useProducts';
import { useActiveLiveAuctions } from '@/features/live/hooks/useLive';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/loading-skeletons';
import { Gavel, Activity, Flame, Filter, Tag } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AuctionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');

  const { data: categories } = useCategories();

  const { data: productsPage, isLoading } = useSearchProducts({
    sellType: 'AUCTION',
    categoryIds: selectedCategory !== 'all' ? [selectedCategory] : undefined,
    sortBy: sortBy,
    direction: direction,
    size: 20,
  });

  const { data: activeLiveSessions } = useActiveLiveAuctions();

  const productsWithLiveStatus = useMemo(() => {
    if (!productsPage?.content) return [];
    return productsPage.content.map(product => ({
      ...product,
      isLive: activeLiveSessions?.some(session => session.productId === product.id) || false
    }));
  }, [productsPage?.content, activeLiveSessions]);

  // Sắp xếp ưu tiên các phòng đang LIVE lên đầu nếu đang sort theo mặc định (createdAt)
  const sortedProducts = useMemo(() => {
    if (sortBy !== 'createdAt') return productsWithLiveStatus;
    return [...productsWithLiveStatus].sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return 0;
    });
  }, [productsWithLiveStatus, sortBy]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Banner */}
      <div className="relative w-full mb-8 overflow-hidden rounded-b-[40px] md:rounded-b-[60px] border-b border-border bg-gradient-to-br from-background via-muted/30 to-background shadow-sm">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative container mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[13px] font-semibold mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Trực tiếp & Đấu giá
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight mb-3 flex items-center gap-3">
                <Gavel className="w-10 h-10 text-primary drop-shadow-sm" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  Sàn Đấu Giá
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Nơi hội tụ những món đồ độc lạ, giới hạn. Hãy cạnh tranh minh bạch và đưa ra mức giá tốt nhất để trở thành người chiến thắng!
              </p>
            </div>

            <div className="flex gap-4 w-full md:w-auto z-10">
              <div className="glass bg-background/60 backdrop-blur-xl rounded-[24px] p-5 flex-1 md:flex-none md:w-40 border border-white/20 dark:border-white/10 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-foreground mb-1 tracking-tight">24/7</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Liên tục hoạt động</div>
              </div>
              <div className="glass bg-background/60 backdrop-blur-xl rounded-[24px] p-5 flex-1 md:flex-none md:w-40 border border-white/20 dark:border-white/10 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-chart-2/10 flex items-center justify-center text-chart-2 mx-auto mb-3 group-hover:scale-110 group-hover:bg-chart-2 group-hover:text-white transition-all duration-300">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-foreground mb-1 tracking-tight">HOT</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Phiên sôi động</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 font-heading font-bold text-lg text-foreground mb-4">
                <Filter className="w-5 h-5 text-primary" /> Danh Mục
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-muted font-medium'}`}
                >
                  <Tag className="w-4 h-4" />
                  Tất cả sản phẩm
                </button>
                {categories?.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${selectedCategory === cat.id ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-muted font-medium'}`}
                  >
                    {/* Placeholder cho icon danh mục nếu có */}
                    <span className="w-4 h-4 rounded-full bg-border" />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-card border border-border p-4 rounded-[20px] shadow-sm">
              <h2 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
                Kết quả tìm kiếm
                {!isLoading && (
                  <span className="text-muted-foreground font-medium text-sm bg-muted px-2.5 py-1 rounded-full">
                    {productsPage?.totalElements || sortedProducts.length} sản phẩm
                  </span>
                )}
              </h2>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground font-medium whitespace-nowrap hidden sm:inline-block">Sắp xếp:</span>
                <Select value={`${sortBy}-${direction}`} onValueChange={(val) => {
                  if (!val) return;
                  const [s, d] = val.split('-');
                  setSortBy(s);
                  setDirection(d as 'asc' | 'desc');
                }}>
                  <SelectTrigger className="w-full sm:w-[200px] bg-background border-border rounded-xl">
                    <SelectValue placeholder="Sắp xếp theo">
                      {(val: string) => {
                        if (val === 'createdAt-desc') return 'Mới nhất';
                        if (val === 'price-asc') return 'Giá: Thấp đến cao';
                        if (val === 'price-desc') return 'Giá: Cao xuống thấp';
                        return 'Sắp xếp theo';
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
                    <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                    <SelectItem value="price-desc">Giá: Cao xuống thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <ProductGridSkeleton />
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-24 bg-card rounded-[24px] border border-border shadow-sm flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Gavel className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Hiện tại không có phiên đấu giá nào phù hợp với bộ lọc của bạn. Hãy thử chọn danh mục khác nhé!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
