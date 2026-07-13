/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSearchParams } from 'next/navigation';
import { useSearchProducts, useCategories } from '@/features/products/hooks/useProducts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { CategoryIcon } from '@/components/ui/category-icon';
import { ShoppingBag, Filter, ChevronLeft, ChevronRight, Star, MapPin, X, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { CreateProductModal } from '@/features/products/components/CreateProductModal';
import { useState, useEffect, Suspense } from 'react';

import { ProductCard } from '@/features/products/components/ProductCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LocationSelector } from '@/components/ui/LocationSelector';
import { useProfile } from '@/features/users/hooks/useUsers';
import { useAuth } from '@/contexts/AuthContext';
import { ProductGridSkeleton } from '@/components/ui/loading-skeletons';
import { motion, AnimatePresence } from 'framer-motion';

function ProductsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const initialSellType = searchParams.get('sellType') || 'all';
  const initialCategory = searchParams.get('category');
  const initialSort = searchParams.get('sort') || 'createdAt_desc';

  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [condition, setCondition] = useState<string>('all');
  const [sellType, setSellType] = useState<string>(initialSellType);
  const [location, setLocation] = useState<string>('');
  const [sort, setSort] = useState<string>(initialSort);
  const [page, setPage] = useState<number>(0);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState<string>('');

  useEffect(() => {
    const newCategory = searchParams.get('category');
    const newSort = searchParams.get('sort');
    const newSellType = searchParams.get('sellType');

    if (newCategory !== null) {
      setCategoryIds([newCategory]);
      setPage(0);
    }
    if (newSort !== null) {
      setSort(newSort);
      setPage(0);
    }
    if (newSellType !== null) {
      setSellType(newSellType);
      setPage(0);
    }
  }, [searchParams]);

  const { isAuthenticated } = useAuth();
  const { data: profile } = useProfile(isAuthenticated);
  const { data: categories } = useCategories();

  const { data: productsPage, isLoading, error } = useSearchProducts({
    query: query || undefined,
    categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    condition: condition !== 'all' ? condition : undefined,
    sellType: sellType !== 'all' ? sellType : undefined,
    location: location || undefined,
    sortBy: sort.split('_')[0],
    direction: sort.split('_')[1] as 'asc' | 'desc',
    page: page,
    size: 12
  });

  const products = productsPage?.content || [];
  const totalPages = productsPage?.totalPages || 1;

  const hasActiveFilters = categoryIds.length > 0 || condition !== 'all' || sellType !== 'all' || location !== '';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
              {query ? `Kết quả cho "${query}"` : 'Khám phá sản phẩm'}
            </h1>
            <p className="text-lg text-muted-foreground mt-3 font-medium">Tìm kiếm những món đồ cũ chất lượng với giá tốt nhất.</p>
          </div>
          <CreateProductModal />
        </motion.div>

        {/* Top Filters & Suggestions Section */}
        <div className="flex flex-col space-y-4 mb-8">

          {/* Gợi ý cho bạn */}
          {profile?.interests && profile.interests.filter((id: string) => !categoryIds.includes(id)).length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pb-2">
              <span className="text-sm font-bold text-foreground whitespace-nowrap flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-current" /> Gợi ý cho bạn:
              </span>
              {profile.interests.filter((id: string) => !categoryIds.includes(id)).map((interestId: string) => {
                const cat = categories?.find(c => c.id === interestId);
                if (!cat) return null;
                return (
                  <button
                    key={interestId}
                    onClick={() => {
                      setCategoryIds(prev => [...prev, interestId]);
                      setPage(0);
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border shadow-sm transition-all text-sm font-medium whitespace-nowrap glass border-border text-primary hover:bg-primary/10"
                  >
                    <CategoryIcon name={cat.icon} className="w-4 h-4" /> {cat.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Filter & Sort Toolbar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 glass p-4 rounded-[24px] shadow-lg border border-border relative z-20">
            <div className="flex flex-wrap items-center gap-2 flex-1 w-full lg:w-auto">
              <div className="flex items-center gap-2 px-2 text-foreground font-semibold border-r pr-4 mr-2">
                <Filter className="w-4 h-4" /> Lọc
              </div>

              {/* Danh mục Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" className="h-9 px-3 w-full sm:w-auto sm:min-w-[160px] font-medium bg-background/50 border-border" />}>
                  <span className="line-clamp-1 flex-1 text-left">
                    {categoryIds.length === 0 ? 'Tất cả danh mục' : `Đã chọn ${categoryIds.length} danh mục`}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]" align="start">
                  <DropdownMenuCheckboxItem checked={categoryIds.length === 0} onCheckedChange={() => { setCategoryIds([]); setPage(0); }}>
                    Tất cả danh mục
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  {categories?.map((c) => (
                    <DropdownMenuCheckboxItem key={c.id} checked={categoryIds.includes(c.id)} onCheckedChange={(checked) => {
                      if (checked) { setCategoryIds(prev => [...prev, c.id]); } else { setCategoryIds(prev => prev.filter(id => id !== c.id)); }
                      setPage(0);
                    }}>
                      {c.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Khu vực */}
              <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                <Button variant="outline" className="h-9 px-3 w-full sm:w-auto sm:min-w-[160px] font-medium bg-background/50 border-border" onClick={() => setIsLocationDialogOpen(true)}>
                  <span className="line-clamp-1 flex-1 text-left">
                    {location ? location.split(',').pop()?.trim() : 'Tất cả khu vực'}
                  </span>
                  <MapPin className="w-4 h-4 ml-2 text-muted-foreground opacity-50" />
                </Button>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader><DialogTitle>Chọn khu vực</DialogTitle></DialogHeader>
                  <div className="py-4"><LocationSelector value={tempLocation} onChange={setTempLocation} mode="full" /></div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => { setTempLocation(''); setLocation(''); setIsLocationDialogOpen(false); setPage(0); }}>Xóa lọc</Button>
                    <Button onClick={() => { setLocation(tempLocation); setIsLocationDialogOpen(false); setPage(0); }}>Áp dụng</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Hình thức */}
              <Select value={sellType} onValueChange={(val) => setSellType(val || 'all')}>
                <SelectTrigger className="h-9 w-full sm:w-auto sm:min-w-[160px] bg-background/50 border-border font-medium">
                  <span className="line-clamp-1 text-left">
                    {sellType === 'all' ? 'Tất cả hình thức' : sellType === 'BUY_NOW' ? 'Mua ngay' : 'Đấu giá'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hình thức</SelectItem>
                  <SelectItem value="BUY_NOW">Mua ngay</SelectItem>
                  <SelectItem value="AUCTION">Đấu giá</SelectItem>
                </SelectContent>
              </Select>

              {/* Tình trạng */}
              <Select value={condition} onValueChange={(val) => setCondition(val || 'all')}>
                <SelectTrigger className="h-9 w-full sm:w-auto sm:min-w-[160px] bg-background/50 border-border font-medium">
                  <span className="line-clamp-1 text-left">
                    {condition === 'all' ? 'Tất cả tình trạng' : condition === 'NEW' ? 'Mới 100%' : condition === 'LIKE_NEW' ? 'Như mới' : condition === 'GOOD' ? 'Tốt' : 'Khá'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tình trạng</SelectItem>
                  <SelectItem value="NEW">Mới 100%</SelectItem>
                  <SelectItem value="LIKE_NEW">Như mới</SelectItem>
                  <SelectItem value="GOOD">Tốt</SelectItem>
                  <SelectItem value="FAIR">Khá</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sắp xếp */}
            <div className="flex items-center gap-3 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0">
              <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">Sắp xếp:</span>
              <Select value={sort} onValueChange={(val) => { setSort(val || 'createdAt_desc'); setPage(0); }}>
                <SelectTrigger className="h-9 w-full lg:w-[180px] bg-background/50 font-medium border-border shadow-none">
                  <span className="line-clamp-1 text-left">
                    {sort === 'createdAt_desc' ? 'Mới nhất' : sort === 'price_asc' ? 'Giá: Thấp đến Cao' : 'Giá: Cao đến Thấp'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt_desc">Mới nhất</SelectItem>
                  <SelectItem value="price_asc">Giá: Thấp đến Cao</SelectItem>
                  <SelectItem value="price_desc">Giá: Cao đến Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm font-semibold text-muted-foreground mr-2">Đang lọc theo:</span>

              {/* Category Chips */}
              {categoryIds.map(id => {
                const cat = categories?.find(c => c.id === id);
                return (
                  <Badge key={id} variant="secondary" className="pl-3 pr-1 py-1 rounded-full gap-1 border-border glass text-foreground">
                    {cat?.name || 'Danh mục'}
                    <button onClick={() => { setCategoryIds(prev => prev.filter(c => c !== id)); setPage(0); }} className="hover:bg-secondary rounded-full p-0.5 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                );
              })}

              {/* Location Chip */}
              {location && (
                <Badge variant="secondary" className="pl-3 pr-1 py-1 rounded-full gap-1 border-border glass text-foreground">
                  Khu vực: {location.split(',').pop()?.trim()}
                  <button onClick={() => { setLocation(''); setTempLocation(''); setPage(0); }} className="hover:bg-secondary rounded-full p-0.5 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              )}

              {/* SellType Chip */}
              {sellType !== 'all' && (
                <Badge variant="secondary" className="pl-3 pr-1 py-1 rounded-full gap-1 border-border glass text-foreground">
                  {sellType === 'BUY_NOW' ? 'Mua ngay' : 'Đấu giá'}
                  <button onClick={() => { setSellType('all'); setPage(0); }} className="hover:bg-secondary rounded-full p-0.5 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              )}

              {/* Condition Chip */}
              {condition !== 'all' && (
                <Badge variant="secondary" className="pl-3 pr-1 py-1 rounded-full gap-1 border-border glass text-foreground">
                  {condition === 'NEW' ? 'Mới 100%' : condition === 'LIKE_NEW' ? 'Như mới' : condition === 'GOOD' ? 'Tốt' : 'Khá'}
                  <button onClick={() => { setCondition('all'); setPage(0); }} className="hover:bg-secondary rounded-full p-0.5 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCategoryIds([]);
                  setCondition('all');
                  setSellType('all');
                  setLocation('');
                  setTempLocation('');
                  setPage(0);
                }}
                className="text-xs text-primary hover:bg-primary/10 ml-2 h-7"
              >
                Xóa tất cả
              </Button>
            </div>
          )}



          {isLoading ? (
            <ProductGridSkeleton />
          ) : error ? (
            <div className="text-center py-20 bg-background/50 glass rounded-2xl shadow-sm border border-border">
              <p className="text-red-500 font-medium text-lg">Không thể tải danh sách sản phẩm lúc này. Vui lòng thử lại sau.</p>
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-32 bg-background/50 glass rounded-3xl shadow-sm border border-border">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
              <div className="mt-8">
                <CreateProductModal />
              </div>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              {products?.map((product: any) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                  }}
                  whileHover={{ y: -8 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {products.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-full w-10 h-10 border-border text-foreground"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  if (i === 0 || i === totalPages - 1 || Math.abs(page - i) <= 1) {
                    return (
                      <Button
                        key={i}
                        variant={page === i ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPage(i)}
                        className={`w-10 h-10 rounded-full font-bold ${page === i ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                      >
                        {i + 1}
                      </Button>
                    );
                  }
                  if (Math.abs(page - i) === 2) {
                    return <span key={i} className="text-muted-foreground">...</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="rounded-full w-10 h-10 border-border text-foreground"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-foreground">Đang tải...</div>}>
      <ProductsContent />
    </Suspense>
  );
}