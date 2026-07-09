'use client';

import { useState } from 'react';
import { useMyOrders, usePayOrder, useConfirmReceipt, useDisputeOrder } from '@/features/orders/hooks/useOrders';
import { Order } from '@/lib/api/orders';
import { formatCurrency } from '@/lib/utils';
import { ReviewModal } from '@/features/reviews/components/ReviewModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ShoppingBag, Package, CheckCircle, AlertTriangle, Star } from 'lucide-react';
import { toast } from 'sonner';
import { OrderListSkeleton } from '@/components/ui/loading-skeletons';

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
    <div className="container py-8 max-w-5xl mx-auto space-y-6 min-h-[60vh]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <ShoppingBag className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-neutral-900">Đơn hàng của tôi</h1>
          <p className="text-neutral-500">Quản lý các sản phẩm bạn đã đấu giá thắng hoặc mua ngay</p>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center p-12 bg-neutral-50 rounded-3xl border border-neutral-100">
          <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              {order.productImageUrl ? (
                <img src={order.productImageUrl} alt={order.productTitle} className="w-24 h-24 rounded-2xl object-cover bg-neutral-100" />
              ) : (
                <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200&h=200&seed=${order.productId}`} alt={order.productTitle} className="w-24 h-24 rounded-2xl object-cover bg-neutral-100" />
              )}

              <div className="flex-1">
                <div className="text-xs text-neutral-400 mb-1 font-mono">Mã ĐH: #{order.id.substring(0, 8).toUpperCase()}</div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">{order.productTitle}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 mb-2">
                  <span>Người bán: <strong className="text-neutral-700">{order.sellerName}</strong></span>
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
                {order.status === 'PENDING_PAYMENT' && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Chờ thanh toán</Badge>}
                {order.status === 'PAID' && <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Đã thanh toán (Escrow)</Badge>}
                {order.status === 'SHIPPED' && <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Đang giao hàng</Badge>}
                {order.status === 'DISPUTED' && <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Đang khiếu nại</Badge>}
                {order.status === 'COMPLETED' && <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Đã hoàn thành</Badge>}
                {order.status === 'CANCELED' && <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-300">Đã hủy / Hoàn tiền</Badge>}

                {order.status === 'PENDING_PAYMENT' && (
                  <Button
                    onClick={() => handlePay(order.id)}
                    disabled={isPaying}
                    className="w-full bg-primary hover:bg-primary/90 rounded-xl"
                  >
                    Thanh toán bằng Ví
                  </Button>
                )}

                {(order.status === 'PAID' || order.status === 'SHIPPED') && (
                  <Button
                    onClick={() => handleConfirm(order.id)}
                    disabled={isConfirming}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Đã nhận được hàng
                  </Button>
                )}

                {order.status === 'COMPLETED' && !order.isReviewed && (
                  <Button
                    onClick={() => handleOpenReviewModal(order.id)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 rounded-xl text-white"
                  >
                    <Star className="w-4 h-4 mr-2 fill-current" />
                    Đánh giá người bán
                  </Button>
                )}

                {order.status === 'COMPLETED' && order.isReviewed && (
                  <div className="w-full mt-2 bg-amber-50 p-3 rounded-xl border border-amber-100 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{order.reviewRating} sao</span>
                      <span className="text-neutral-400 text-xs ml-auto whitespace-nowrap bg-white px-2 py-0.5 rounded-full border border-amber-100">Đã đánh giá</span>
                    </div>
                    {order.reviewComment && (
                      <p className="text-xs text-neutral-600 italic">"{order.reviewComment}"</p>
                    )}
                  </div>
                )}

                {(order.status === 'PAID' || order.status === 'SHIPPED') && (
                  <Button
                    onClick={() => handleOpenDispute(order.id)}
                    disabled={isDisputing}
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl mt-2"
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
            <p className="mb-4 text-neutral-600">
              Bạn có chắc chắn muốn khiếu nại đơn hàng này? Hệ thống sẽ giữ lại tiền Escrow để chờ admin xử lý.
            </p>
            <label className="text-sm font-medium text-neutral-700 mb-2 block">Lý do khiếu nại</label>
            <Textarea
              placeholder="Hàng giả, hàng lỗi, không đúng mô tả..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="bg-white"
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
