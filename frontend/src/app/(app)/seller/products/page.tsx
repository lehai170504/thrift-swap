'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useSellerProducts, useDeleteProduct } from '@/features/products/hooks/useProducts';
import { Package, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { EditProductModal } from '@/features/products/components/EditProductModal';
import { Product } from '@/features/products/types/product';

export default function SellerProductsPage() {
  const { user } = useAuth();
  const { data: products, isLoading } = useSellerProducts(user?.username || '');
  const deleteMutation = useDeleteProduct();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Thao tác này không thể hoàn tác.')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredProducts = products?.filter((product: Product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container py-8 max-w-5xl mx-auto space-y-6 min-h-[60vh]">
        <div className="h-10 w-48 bg-neutral-200 animate-pulse rounded-lg mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-neutral-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto space-y-6 min-h-[60vh]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Sản phẩm của tôi</h1>
            <p className="text-neutral-500 text-sm mt-1">Quản lý kho hàng và các sản phẩm bạn đang bán</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Tìm tên sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64 rounded-full bg-neutral-50 border-transparent focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      {!filteredProducts || filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100 shadow-sm">
          <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-neutral-300" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Chưa có sản phẩm nào</h2>
          <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
            {searchQuery
              ? 'Không tìm thấy sản phẩm nào phù hợp với từ khóa của bạn.'
              : 'Bạn chưa đăng bán sản phẩm nào trên ThriftSwap. Hãy bắt đầu ngay!'}
          </p>
          {!searchQuery && (
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 rounded-full px-8 h-12 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                <Plus className="w-5 h-5 mr-2" /> Đăng tin ngay
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-500">Sản phẩm</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-500">Loại hình</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-neutral-500">Giá</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-neutral-500">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200/60">
                          <img
                            src={product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100&h=100&seed=${product.id}`}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link href={`/products/${product.id}`} className="font-semibold text-neutral-900 hover:text-primary transition-colors line-clamp-1">
                            {product.title}
                          </Link>
                          <div className="text-sm text-neutral-500 mt-1 flex items-center gap-2">
                            <span className="bg-neutral-100 px-2 py-0.5 rounded text-xs">{product.categoryName}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.sellType === 'AUCTION'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-emerald-100 text-emerald-700'
                        }`}>
                        {product.sellType === 'AUCTION' ? 'Đấu giá' : 'Mua ngay'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-bold text-neutral-900">{formatCurrency(product.price)}</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <EditProductModal product={product} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          className="text-neutral-400 hover:text-red-600 hover:bg-red-50"
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
    </div>
  );
}
