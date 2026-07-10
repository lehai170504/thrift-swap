'use client';

import { useState, useEffect } from 'react';
import { useDisputedOrders, useResolveDispute } from '@/features/orders/hooks/useOrders';
import { Order } from '@/features/orders/api/orderApi';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ShieldAlert, Check, X, Scale, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminDisputesPage() {
  const [page, setPage] = useState(0);
  const size = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: ordersData, isLoading } = useDisputedOrders(page, size, debouncedSearchTerm);
  const orders: Order[] = (ordersData as any)?.content || [];
  const totalPages = (ordersData as any)?.totalPages || 1;
  const resolveMutation = useResolveDispute();

  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [winner, setWinner] = useState<'BUYER' | 'SELLER' | null>(null);

  if (isLoading) {
    return (
      <div className="container py-8 max-w-5xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-500">Đang tải danh sách khiếu nại...</p>
        </div>
      </div>
    );
  }

  const handleOpenResolve = (orderId: string, selectedWinner: 'BUYER' | 'SELLER') => {
    setSelectedOrderId(orderId);
    setWinner(selectedWinner);
    setResolveModalOpen(true);
  };

  const handleConfirmResolve = () => {
    if (!selectedOrderId || !winner) return;

    resolveMutation.mutate(
      { orderId: selectedOrderId, winner },
      {
        onSuccess: () => {
          toast.success('Đã giải quyết khiếu nại thành công!');
          setResolveModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.response?.data || 'Có lỗi xảy ra khi giải quyết.');
        }
      }
    );
  };

  return (
    <div className="space-y-6 min-h-[60vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-xl">
            <Scale className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900">Quản trị viên - Giải quyết khiếu nại</h1>
            <p className="text-neutral-500 text-sm">Xem xét và phán quyết các đơn hàng đang tranh chấp</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Lọc mã đơn, người dùng, lý do..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full md:w-64 rounded-xl bg-white border-neutral-200"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center p-12 bg-neutral-50 rounded-3xl border border-neutral-100">
          <ShieldAlert className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">Tuyệt vời! Hiện không có đơn hàng nào bị khiếu nại.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-start border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-4">
                  {order.productImageUrl ? (
                    <img src={order.productImageUrl} alt={order.productTitle} className="w-16 h-16 rounded-xl object-cover bg-neutral-100" />
                  ) : (
                    <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200&h=200&seed=${order.productId}`} alt={order.productTitle} className="w-16 h-16 rounded-xl object-cover bg-neutral-100" />
                  )}
                  <div>
                    <div className="text-xs text-neutral-400 font-mono mb-1">Mã ĐH: #{order.id.substring(0, 8).toUpperCase()}</div>
                    <h3 className="font-bold text-neutral-900">{order.productTitle}</h3>
                    <div className="text-primary font-bold">{formatCurrency(order.totalAmount)}</div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-neutral-500 mb-1">Ngày tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                  {order.trackingCode && (
                    <div className="text-neutral-600 bg-neutral-100 px-2 py-1 rounded inline-block">
                      Mã vận đơn: <span className="font-mono">{order.trackingCode}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <div className="text-sm font-bold text-red-600 mb-2">Thông tin khiếu nại (Từ Người Mua)</div>
                  <div className="text-sm mb-1">Người mua: <strong>{order.buyerName}</strong></div>
                  <div className="bg-white p-3 rounded-lg border border-red-100 text-sm text-neutral-700 whitespace-pre-wrap">
                    "{order.disputeReason || 'Không có lý do rõ ràng'}"
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="text-sm font-bold text-blue-600 mb-2">Người Bán</div>
                  <div className="text-sm mb-1">Người bán: <strong>{order.sellerName}</strong></div>
                  <p className="text-xs text-neutral-500 mt-2">Admin cần liên hệ hoặc kiểm tra bằng chứng trước khi ra quyết định.</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  onClick={() => handleOpenResolve(order.id, 'SELLER')}
                  variant="outline"
                  className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Xử thắng cho Người Bán (Giao tiền)
                </Button>
                <Button
                  onClick={() => handleOpenResolve(order.id, 'BUYER')}
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Xử thắng cho Người Mua (Hoàn tiền)
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-xl"
          >
            Trang trước
          </Button>
          <span className="text-sm font-medium text-neutral-600">
            Trang {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="rounded-xl"
          >
            Trang sau
          </Button>
        </div>
      )}

      {/* Resolve Modal */}
      <ConfirmDialog
        isOpen={resolveModalOpen}
        onOpenChange={setResolveModalOpen}
        title="Xác nhận phán quyết"
        description={
          winner === 'BUYER' ? (
            <span>Bạn đang chọn <strong>Người Mua thắng</strong>. Hệ thống sẽ <strong className="text-red-600">hoàn tiền</strong> (Refund) toàn bộ số tiền Escrow về lại ví của người mua. Giao dịch sẽ bị Hủy bỏ.</span>
          ) : (
            <span>Bạn đang chọn <strong>Người Bán thắng</strong>. Hệ thống sẽ <strong className="text-emerald-600">giải phóng</strong> (Release) số tiền Escrow sang ví của người bán. Giao dịch sẽ Hoàn thành.</span>
          )
        }
        onConfirm={handleConfirmResolve}
        cancelText="Hủy"
        confirmText="Đồng ý thực thi"
        isLoading={resolveMutation.isPending}
        variant={winner === 'BUYER' ? 'destructive' : 'default'}
      />
    </div>
  );
}
