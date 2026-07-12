'use client';

import { useState } from 'react';
import { useMyOrders, usePayOrder, useConfirmReceipt, useDisputeOrder } from '@/features/orders/hooks/useOrders';
import { Order } from '@/features/orders/api/orderApi';
import { formatCurrency } from '@/lib/utils';
import { ReviewModal } from '@/features/reviews/components/ReviewModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ShoppingBag, Package, CheckCircle, AlertTriangle, Star } from 'lucide-react';
import { toast } from 'sonner';
import { OrderListSkeleton } from '@/components/ui/loading-skeletons';
import { InvoiceGenerator } from '@/features/orders/components/InvoiceGenerator';

export default function OrdersPage() {
  const { data: ordersData, isLoading } = useMyOrders();
  const orders: Order[] = (ordersData as any)?.content || [];
  const { mutate: payOrder, isPending: isPaying } = usePayOrder();
  const { mutate: confirmReceipt, isPending: isConfirming } = useConfirmReceipt();
  const { mutate: disputeOrder, isPending: isDisputing } = useDisputeOrder();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeOrderId, setDisputeOrderId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  if (isLoading) {
    return <OrderListSkeleton />;
  }

  const handlePay = (orderId: string) => {
    payOrder(orderId, {
      onSuccess: () => {
        toast.success('Thanh toán bằng ví Escrow thành công! Tiền đã được tạm giữ.');
      },
      onError: (err: any) => {
        toast.error(err.response?.data || 'Thanh toán thất bại. Vui lòng nạp thêm tiền vào ví.');
      }
    });
  };

  const handleConfirm = (orderId: string) => {
    confirmReceipt(orderId, {
      onSuccess: () => {
        toast.success('Đã xác nhận nhận hàng! Tiền đã được chuyển cho người bán.');
      },
      onError: (err: any) => {
        toast.error('Có lỗi xảy ra khi xác nhận.');
      }
    });
  };

  const handleOpenDispute = (orderId: string) => {
    setDisputeOrderId(orderId);
    setDisputeReason('');
    setDisputeModalOpen(true);
  };

  const handleConfirmDispute = () => {
    if (!disputeOrderId) return;
    if (!disputeReason.trim()) {
      toast.error('Vui lòng nhập lý do khiếu nại!');
      return;
    }
    disputeOrder({ orderId: disputeOrderId, reason: disputeReason }, {
      onSuccess: () => {
        toast.success('Đã gửi khiếu nại thành công!');
        setDisputeModalOpen(false);
      },
      onError: (err: any) => {
        toast.error(err.response?.data || 'Có lỗi xảy ra khi khiếu nại.');
      }
    });
  };

  const handleOpenReviewModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setReviewModalOpen(true);
  };

  return (
    <div className="container px-4 sm:px-6 py-8 max-w-5xl mx-auto space-y-6 min-h-[60vh]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-[24px] glass border border-primary/20">
          <ShoppingBag className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Đơn hàng của tôi</h1>
          <p className="text-muted-foreground">Quản lý các sản phẩm bạn đã đấu giá thắng hoặc mua ngay</p>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center p-12 bg-background/50 rounded-[24px] border border-white/10 glass backdrop-blur-xl">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-background/50 glass backdrop-blur-xl p-6 rounded-[24px] border border-white/10 shadow-lg flex flex-col md:flex-row gap-6 items-center transition-all hover:border-primary/30 hover:shadow-primary/5">
              {order.productImageUrl ? (
                <img src={order.productImageUrl} alt={order.productTitle} className="w-24 h-24 rounded-[16px] object-cover bg-white/5 border border-white/10" />
              ) : (
                <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200&h=200&seed=${order.productId}`} alt={order.productTitle} className="w-24 h-24 rounded-[16px] object-cover bg-white/5 border border-white/10" />
              )}

              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1 font-mono">Mã ĐH: #{order.id.substring(0, 8).toUpperCase()}</div>
                <h3 className="text-lg font-bold text-foreground mb-1">{order.productTitle}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                  <span>Người bán: <strong className="text-foreground">{order.sellerName}</strong></span>
                  <span>•</span>
                  <span>Ngày tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                  <span>•</span>
                  <span className="font-semibold text-orange-400">SL: {order.quantity || 1}</span>
                </div>
                <div className="text-xl font-bold text-primary">{formatCurrency(order.totalAmount)}</div>
                {order.trackingCode && (
                  <div className="mt-2 text-sm text-foreground bg-white/5 px-3 py-1.5 rounded-[12px] inline-flex items-center gap-2 border border-white/10">
                    <Package className="w-4 h-4 text-muted-foreground" /> Mã vận đơn: <span className="font-bold font-mono">{order.trackingCode}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-3 min-w-[200px]">
                {order.status === 'PENDING_PAYMENT' && <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">Chờ thanh toán</Badge>}
                {order.status === 'PAID' && <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Đã thanh toán (Escrow)</Badge>}
                {order.status === 'SHIPPED' && <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">Đang giao hàng</Badge>}
                {order.status === 'DELIVERED' && <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Đã giao hàng (Chờ xác nhận)</Badge>}
                {order.status === 'DISPUTED' && <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">Đang khiếu nại</Badge>}
                {order.status === 'COMPLETED' && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Đã hoàn thành</Badge>}
                {order.status === 'CANCELED' && <Badge variant="outline" className="bg-white/5 text-muted-foreground border-white/10">Đã hủy / Hoàn tiền</Badge>}

                {order.status === 'PENDING_PAYMENT' && (
                  <Button
                    onClick={() => handlePay(order.id)}
                    disabled={isPaying}
                    className="w-full rounded-[24px]"
                  >
                    Thanh toán bằng Ví
                  </Button>
                )}

                {(order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                  <Button
                    onClick={() => handleConfirm(order.id)}
                    disabled={isConfirming}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-[24px] text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Đã nhận được hàng
                  </Button>
                )}

                {order.status === 'COMPLETED' && !order.isReviewed && (
                  <Button
                    onClick={() => handleOpenReviewModal(order.id)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 rounded-[24px] text-white"
                  >
                    <Star className="w-4 h-4 mr-2 fill-current" />
                    Đánh giá người bán
                  </Button>
                )}

                {order.status === 'COMPLETED' && (
                  <div className="w-full mt-2">
                    <InvoiceGenerator order={order} buttonVariant="outline" buttonSize="default" className="w-full" />
                  </div>
                )}

                {order.status === 'COMPLETED' && order.isReviewed && (
                  <div className="w-full mt-2 bg-amber-500/10 p-4 rounded-[16px] border border-amber-500/20 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{order.reviewRating} sao</span>
                      <span className="text-muted-foreground text-xs ml-auto whitespace-nowrap bg-background/50 px-2 py-0.5 rounded-full border border-white/10">Đã đánh giá</span>
                    </div>
                    {order.reviewComment && (
                      <p className="text-xs text-foreground/80 italic mt-1">"{order.reviewComment}"</p>
                    )}
                  </div>
                )}

                {(order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                  <Button
                    onClick={() => handleOpenDispute(order.id)}
                    disabled={isDisputing}
                    variant="outline"
                    className="w-full border-red-500/20 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-400 rounded-[24px] mt-2"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Khiếu nại
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dispute Modal */}
      <ConfirmDialog
        isOpen={disputeModalOpen}
        onOpenChange={setDisputeModalOpen}
        title="Khiếu nại đơn hàng"
        description={
          <div className="text-left mt-2">
            <p className="mb-4 text-muted-foreground">
              Bạn có chắc chắn muốn khiếu nại đơn hàng này? Hệ thống sẽ giữ lại tiền Escrow để chờ admin xử lý.
            </p>
            <label className="text-sm font-medium text-foreground mb-2 block">Lý do khiếu nại</label>
            <Textarea
              placeholder="Hàng giả, hàng lỗi, không đúng mô tả..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="bg-background/50 border-white/10 rounded-[16px]"
              rows={3}
            />
          </div>
        }
        onConfirm={handleConfirmDispute}
        cancelText="Hủy"
        confirmText="Xác nhận khiếu nại"
        isLoading={isDisputing}
        variant="destructive"
      />

      {/* Review Modal Premium */}
      {selectedOrderId && (
        <ReviewModal
          orderId={selectedOrderId}
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedOrderId(null);
          }}
        />
      )}
    </div>
  );
}
