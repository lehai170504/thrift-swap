'use client';

import { useMySales } from '@/features/orders/hooks/useOrders';
import { Order } from '@/features/orders/api/orderApi';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Package, Store, Star } from 'lucide-react';
import Link from 'next/link';
import { OrderListSkeleton } from '@/components/ui/loading-skeletons';
import { InvoiceGenerator } from '@/features/orders/components/InvoiceGenerator';

export default function SellerOrdersPage() {
  const { data: salesData, isLoading } = useMySales();
  const sales: Order[] = (salesData as any)?.content || [];

  if (isLoading) {
    return <OrderListSkeleton />;
  }

  return (
    <div className="container px-4 sm:px-6 py-8 max-w-5xl mx-auto space-y-6 min-h-[60vh]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-[24px] glass border border-primary/20">
          <Store className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Đơn bán của tôi</h1>
          <p className="text-muted-foreground">Quản lý các sản phẩm bạn đã bán và chờ giao hàng</p>
        </div>
      </div>

      {!sales || sales.length === 0 ? (
        <div className="text-center p-12 bg-background/50 rounded-[24px] border border-border glass backdrop-blur-xl">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Bạn chưa bán được sản phẩm nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map((order) => (
            <div key={order.id} className="bg-background/50 glass backdrop-blur-xl p-6 rounded-[24px] border border-border shadow-lg flex flex-col md:flex-row gap-6 items-center transition-all hover:border-primary/30 hover:shadow-primary/5">
              {order.productImageUrl ? (
                <img src={order.productImageUrl} alt={order.productTitle} className="w-24 h-24 rounded-[16px] object-cover bg-muted border border-border" />
              ) : (
                <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200&h=200&seed=${order.productId}`} alt={order.productTitle} className="w-24 h-24 rounded-[16px] object-cover bg-muted border border-border" />
              )}

              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1 font-mono">Mã ĐH: #{order.id.substring(0, 8).toUpperCase()}</div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  <Link href={`/products/${order.productId}`} className="hover:text-primary transition-colors">
                    {order.productTitle}
                  </Link>
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                  <span>Người mua: <strong className="text-foreground">{order.buyerName}</strong></span>
                  <span>•</span>
                  <span>Ngày tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                  <span>•</span>
                  <span className="font-semibold text-orange-400">SL: {order.quantity || 1}</span>
                </div>
                <div className="text-xl font-bold text-primary">{formatCurrency(order.totalAmount)}</div>
                {order.trackingCode && (
                  <div className="mt-2 text-sm text-foreground bg-muted px-3 py-1.5 rounded-[12px] inline-flex items-center gap-2 border border-border">
                    <Package className="w-4 h-4 text-muted-foreground" /> Mã vận đơn: <span className="font-bold font-mono">{order.trackingCode}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-3 min-w-[200px]">
                {order.status === 'PENDING_PAYMENT' && <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">Người mua chờ thanh toán</Badge>}
                {order.status === 'PAID' && <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Chờ lấy hàng (Đã Escrow)</Badge>}
                {order.status === 'SHIPPED' && <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">Đang giao hàng</Badge>}
                {order.status === 'DELIVERED' && <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Đã giao hàng (Chờ xác nhận)</Badge>}
                {order.status === 'DISPUTED' && <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">Đang khiếu nại</Badge>}
                {order.status === 'COMPLETED' && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Đã hoàn thành</Badge>}
                {order.status === 'CANCELED' && <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Đã hủy / Hoàn tiền</Badge>}

                {order.status === 'COMPLETED' && (
                  <div className="w-full mt-2">
                    <InvoiceGenerator order={order} buttonVariant="outline" buttonSize="sm" className="w-full" />
                  </div>
                )}

                {order.status === 'COMPLETED' && order.isReviewed && (
                  <div className="w-full mt-2 bg-amber-500/10 p-4 rounded-[16px] border border-amber-500/20 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{order.reviewRating} sao</span>
                      <span className="text-muted-foreground text-xs ml-auto whitespace-nowrap bg-background/50 px-2 py-0.5 rounded-full border border-border">Người mua đánh giá</span>
                    </div>
                    {order.reviewComment && (
                      <p className="text-xs text-foreground/80 italic mt-1">"{order.reviewComment}"</p>
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
