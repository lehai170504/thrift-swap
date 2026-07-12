'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useSellerProducts, useDeleteProduct, useBoostProduct } from '@/features/products/hooks/useProducts';
import { Package, Plus, Search, Trash2, ArrowUpCircle } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { EditProductModal } from '@/features/products/components/EditProductModal';
import { Product } from '@/features/products/types/product';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { CreateProductModal } from '@/features/products/components/CreateProductModal';

export default function SellerProductsPage() {
  const { user } = useAuth();
  const { data: products, isLoading } = useSellerProducts(user?.username || '');
  const deleteMutation = useDeleteProduct();
  const [searchQuery, setSearchQuery] = useState('');

  const [isBoostDialogOpen, setIsBoostDialogOpen] = useState(false);
  const [productToBoost, setProductToBoost] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setProductToDelete(null);
        }
      });
    }
  };

  const boostMutation = useBoostProduct();

  const handleBoostClick = (id: string) => {
    setProductToBoost(id);
    setIsBoostDialogOpen(true);
  };

  const handleConfirmBoost = () => {
    if (productToBoost) {
      boostMutation.mutate(productToBoost, {
        onSuccess: () => {
          setIsBoostDialogOpen(false);
          setProductToBoost(null);
        }
      });
    }
  };

  const filteredProducts = products?.filter((product: Product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container py-8 max-w-5xl mx-auto space-y-6 min-h-[60vh]">
        <div className="h-10 w-48 bg-white/10 animate-pulse rounded-[24px] mb-6 glass"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white/5 animate-pulse rounded-[24px] glass border border-white/10"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-6 py-8 max-w-5xl mx-auto space-y-6 min-h-[60vh]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 glass bg-primary/10 text-primary rounded-[24px] border border-primary/20 flex items-center justify-center">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">Sản phẩm của tôi</h1>
            <p className="text-muted-foreground text-sm mt-1">Quản lý kho hàng và các sản phẩm bạn đang bán</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm tên sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {!filteredProducts || filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-background/50 rounded-[24px] border border-white/10 shadow-lg glass backdrop-blur-xl">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Chưa có sản phẩm nào</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            {searchQuery
              ? 'Không tìm thấy sản phẩm nào phù hợp với từ khóa của bạn.'
              : 'Bạn chưa đăng bán sản phẩm nào trên Thriftly. Hãy bắt đầu ngay!'}
          </p>
          {!searchQuery && (
            <div className="flex justify-center">
              <CreateProductModal />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-background/50 glass backdrop-blur-xl rounded-[24px] shadow-lg border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Sản phẩm</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Loại hình</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">Giá</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredProducts.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-[16px] bg-white/5 overflow-hidden flex-shrink-0 border border-white/10">
                          <img
                            src={product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100&h=100&seed=${product.id}`}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link href={`/products/${product.id}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                            {product.title}
                          </Link>
                          <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{product.categoryName}</span>
                            {product.sellType === 'BUY_NOW' && (
                              <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-xs font-medium">Kho: {product.quantity || 1}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.sellType === 'AUCTION'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                        {product.sellType === 'AUCTION' ? 'Đấu giá' : 'Mua ngay'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-bold text-foreground">
                        {product.sellType === 'AUCTION' && product.currentHighestBid && product.currentHighestBid > product.price ? (
                          <div className="flex flex-col items-end">
                            <span>{formatCurrency(product.currentHighestBid)}</span>
                            <span className="text-xs text-primary font-medium">Giá hiện tại</span>
                          </div>
                        ) : (
                          formatCurrency(product.price)
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {product.boostedUntil && new Date(product.boostedUntil) > new Date() ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled
                            className="text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 opacity-100 cursor-not-allowed"
                            title={`Đang nổi bật đến ${new Date(product.boostedUntil).toLocaleTimeString('vi-VN')} ${new Date(product.boostedUntil).toLocaleDateString('vi-VN')}`}
                          >
                            <ArrowUpCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleBoostClick(product.id)}
                            className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/20"
                            title="Đẩy tin (20k/ngày)"
                          >
                            <ArrowUpCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <EditProductModal product={product} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(product.id)}
                          className="text-muted-foreground hover:text-red-500 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={isBoostDialogOpen}
        onOpenChange={setIsBoostDialogOpen}
        title="Đẩy tin sản phẩm"
        description="Phí đẩy tin là 20.000 VNĐ cho 1 ngày. Sản phẩm của bạn sẽ được ưu tiên hiển thị ở các trang tìm kiếm. Bạn có chắc chắn muốn đẩy tin sản phẩm này?"
        confirmText="Đẩy tin ngay"
        cancelText="Hủy"
        onConfirm={handleConfirmBoost}
        isLoading={boostMutation.isPending}
        variant="default"
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xóa sản phẩm"
        description="Bạn có chắc chắn muốn xóa sản phẩm này? Thao tác này không thể hoàn tác."
        confirmText="Xóa sản phẩm"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        variant="destructive"
      />
    </div>
  );
}
