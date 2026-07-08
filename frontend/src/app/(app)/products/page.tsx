/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSearchParams } from 'next/navigation';
import { useSearchProducts, useCategories } from '@/features/products/hooks/useProducts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { CategoryIcon } from '@/components/ui/category-icon';
import { ShoppingBag, ArrowRight, Gavel, Filter, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { CreateProductModal } from '@/features/products/components/CreateProductModal';
import { useState, Suspense } from 'react';
import { useProfile } from '@/features/users/hooks/useUsers';
import { ProductGridSkeleton } from '@/components/ui/loading-skeletons';

function ProductsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const initialSellType = searchParams.get('sellType') || 'all';

  const [categoryId, setCategoryId] = useState<string>('all');
  const [condition, setCondition] = useState<string>('all');
  const [sellType, setSellType] = useState<string>(initialSellType);
  const [page, setPage] = useState<number>(0);

  const { data: profile } = useProfile();
  const { data: categories } = useCategories();

  const { data: productsPage, isLoading, error } = useSearchProducts({
    query: query || undefined,
    categoryId: categoryId !== 'all' ? categoryId : undefined,
    condition: condition !== 'all' ? condition : undefined,
    sellType: sellType !== 'all' ? sellType : undefined,
    page: page,
    size: 12
  });

  const products = productsPage?.content || [];
  const totalPages = productsPage?.totalPages || 1;

  const hasActiveFilters = categoryId !== 'all' || condition !== 'all' || sellType !== 'all';

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
              {query ? `Kết quả cho "${query}"` : 'Khám phá sản phẩm'}
            </h1>
            <p className="text-lg text-neutral-500 mt-2">Tìm kiếm những món đồ cũ chất lượng với giá tốt nhất.</p>
          </div>
          <CreateProductModal />
        </div>

        {/* Horizontal Filters Bar */}
        {/* Horizontal Filters Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-neutral-700 flex-shrink-0">
              <Filter className="w-5 h-5" />
              <span className="font-bold hidden md:inline-block">Bộ lọc:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
              <div className="flex flex-col justify-end space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 uppercase">Danh mục</label>
                <Select value={categoryId} onValueChange={(val) => setCategoryId(val || 'all')}>
                  <SelectTrigger className="w-full bg-neutral-50/50">
                    <span className="line-clamp-1 flex-1 text-left">
                      {categoryId === 'all' ? 'Tất cả danh mục' : (categories?.find(c => c.id === categoryId)?.name || 'Đang tải...')}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col justify-end space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 uppercase">Hình thức</label>
                <Select value={sellType} onValueChange={(val) => setSellType(val || 'all')}>
                  <SelectTrigger className="w-full bg-neutral-50/50">
                    <span className="line-clamp-1 flex-1 text-left">
                      {sellType === 'all' ? 'Tất cả hình thức' : sellType === 'BUY_NOW' ? 'Mua ngay' : 'Đấu giá'}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả hình thức</SelectItem>
                    <SelectItem value="BUY_NOW">Mua ngay</SelectItem>
                    <SelectItem value="AUCTION">Đấu giá</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col justify-end space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 uppercase">Tình trạng</label>
                <Select value={condition} onValueChange={(val) => setCondition(val || 'all')}>
                  <SelectTrigger className="w-full bg-neutral-50/50">
                    <span className="line-clamp-1 flex-1 text-left">
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
            </div>

            {hasActiveFilters && (
              <div className="flex flex-col justify-end flex-shrink-0 h-[62px]">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCategoryId('all');
                    setCondition('all');
                    setSellType('all');
                    setPage(0);
                  }}
                  className="text-neutral-500 hover:text-neutral-900 w-full md:w-auto h-10"
                >
                  Xóa lọc
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full">
          {profile?.interests && profile.interests.length > 0 && categoryId === 'all' && (
            <div className="mb-6 flex flex-wrap items-center gap-3 pb-2">
              <span className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-current" /> Dành cho bạn:
              </span>
              {profile.interests.map((interestId: string) => {
                const cat = categories?.find(c => c.id === interestId);
                if (!cat) return null;
                return (
                  <button
                    key={interestId}
                    onClick={() => setCategoryId(interestId)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-primary/20 text-primary hover:bg-primary hover:text-white shadow-sm transition-all text-sm font-medium whitespace-nowrap"
                  >
                    <CategoryIcon name={cat.icon} className="w-4 h-4" /> {cat.name}
                  </button>
                );
              })}
            </div>
          )}

          {isLoading ? (
            <ProductGridSkeleton />
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-neutral-100">
              <p className="text-red-500 font-medium text-lg">Không thể tải danh sách sản phẩm lúc này. Vui lòng thử lại sau.</p>
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-neutral-100">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-neutral-500 font-medium text-lg max-w-md mx-auto">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
              <div className="mt-8">
                <CreateProductModal />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products?.map((product: any) => {
                const imageUrl = product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600&h=600&seed=${product.id}`;

                return (
                  <Link href={`/products/${product.id}`} key={product.id} className="block group h-full">
                    <Card className="overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border-neutral-200/60 rounded-2xl bg-white h-full cursor-pointer">
                      <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=600&h=600&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                        {product.sellType === 'AUCTION' && (
                          <Badge className="absolute top-4 right-4 bg-primary/95 hover:bg-primary/90 shadow-sm border-none gap-1.5 px-3 py-1.5 text-sm backdrop-blur-md rounded-full">
                            <Gavel className="w-4 h-4" /> Đấu giá
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full w-fit">
                            {product.categoryName || 'Đồ cũ'}
                          </div>
                          <div className="text-xs text-neutral-500 font-medium">
                            {product.condition === 'NEW' ? 'Mới 100%' : product.condition === 'LIKE_NEW' ? 'Như mới' : 'Đã sử dụng'}
                          </div>
                        </div>
                        <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors mt-1">
                          {product.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">{product.description}</p>
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                          <div>
                            <div className="text-xs text-neutral-400 font-medium mb-1">
                              {product.sellType === 'BUY_NOW' ? 'Giá bán' : 'Khởi điểm'}
                            </div>
                            <span className="text-2xl font-extrabold text-neutral-900 tracking-tight group-hover:text-primary transition-colors duration-300">
                              {formatCurrency(product.price)}
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {products.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-full w-10 h-10 border-neutral-200"
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
                        className={`w-10 h-10 rounded-full font-bold ${page === i ? 'bg-primary text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-100'}`}
                      >
                        {i + 1}
                      </Button>
                    );
                  }
                  if (Math.abs(page - i) === 2) {
                    return <span key={i} className="text-neutral-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="rounded-full w-10 h-10 border-neutral-200"
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
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center">Đang tải...</div>}>
      <ProductsContent />
    </Suspense>
  );
}