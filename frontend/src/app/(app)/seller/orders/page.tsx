'use client';

import { useMySales } from '@/features/orders/hooks/useOrders';
import { Order } from '@/lib/api/orders';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Package, Store, Star } from 'lucide-react';
import Link from 'next/link';
import { OrderListSkeleton } from '@/components/ui/loading-skeletons';

export default function SellerOrdersPage() {
  const { data: salesData, isLoading } = useMySales();
  const sales: Order[] = (salesData as any)?.content || [];

  if (isLoading) {
    return <OrderListSkeleton />;
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto space-y-6 min-h-[60vh]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Store className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-neutral-900">Đơn bán của tôi</h1>
          <p className="text-neutral-500">Quản lý các sản phẩm bạn đã bán và chờ giao hàng</p>
        </div>
      </div>

      {!sales || sales.length === 0 ? (
        <div className="text-center p-12 bg-neutral-50 rounded-3xl border border-neutral-100">
          <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">Bạn chưa bán được sản phẩm nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              {order.productImageUrl ? (
                <img src={order.productImageUrl} alt={order.productTitle} className="w-24 h-24 rounded-2xl object-cover bg-neutral-100" />
              ) : (
                <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200&h=200&seed=${order.productId}`} alt={order.productTitle} className="w-24 h-24 rounded-2xl object-cover bg-neutral-100" />
              )}

              <div className="flex-1">
                <div className="text-xs text-neutral-400 mb-1 font-mono">Mã ĐH: #{order.id.substring(0, 8).toUpperCase()}</div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">
                  <Link href={`/products/${order.productId}`} className="hover:text-primary transition-colors">
                    {order.productTitle}
                  </Link>
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 mb-2">
                  <span>Người mua: <strong className="text-neutral-700">{order.buyerName}</strong></span>
                  <span>•</span>
                  <span>Ngày tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                  <span>•</span>
                  <span className="font-semibold text-orange-600">SL: {order.quantity || 1}</span>
                </div>
                <div className="text-xl font-black text-primary">{formatCurrency(order.totalAmount)}</div>
                {order.trackingCode && (
                  <div className="mt-2 text-sm text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 border border-neutral-200">
                    <Package className="w-4 h-4" /> Mã vận đơn: <span className="font-bold font-mono">{order.trackingCode}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-3 min-w-[200px]">
                {order.status === 'PENDING_PAYMENT' && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Người mua chờ thanh toán</Badge>}
                {order.status === 'PAID' && <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Chờ lấy hàng (Đã Escrow)</Badge>}
                {order.status === 'SHIPPED' && <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Đang giao hàng</Badge>}
                {order.status === 'DELIVERED' && <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">Đã giao hàng (Chờ xác nhận)</Badge>}
                {order.status === 'DISPUTED' && <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Đang khiếu nại</Badge>}
                {order.status === 'COMPLETED' && <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Đã hoàn thành</Badge>}
                {order.status === 'CANCELED' && <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-300">Đã hủy / Hoàn tiền</Badge>}


                {order.status === 'COMPLETED' && order.isReviewed && (
                  <div className="w-full mt-2 bg-amber-50 p-3 rounded-xl border border-amber-100 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{order.reviewRating} sao</span>
                      <span className="text-neutral-400 text-xs ml-auto whitespace-nowrap bg-white px-2 py-0.5 rounded-full border border-amber-100">Người mua đánh giá</span>
                    </div>
                    {order.reviewComment && (
                      <p className="text-xs text-neutral-600 italic">"{order.reviewComment}"</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
