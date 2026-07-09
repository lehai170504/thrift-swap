'use client';

import { useMyVouchers, useToggleVoucherStatus } from '@/features/orders/hooks/useVouchers';
import { CreateVoucherModal } from '@/features/orders/components/CreateVoucherModal';
import { formatCurrency } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ticket, CalendarDays, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { VoucherUsageModal } from '@/features/orders/components/VoucherUsageModal';
import { Button } from '@/components/ui/button';

export default function SellerVouchersPage() {
  const { data: vouchers, isLoading } = useMyVouchers();
  const toggleMutation = useToggleVoucherStatus();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>('');
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string>('');

  const handleToggle = (id: string) => {
    setTogglingId(id);
    toggleMutation.mutate(id, {
      onSettled: () => setTogglingId(null)
    });
  };

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <Ticket className="w-6 h-6 text-primary" />
              Quản lý mã giảm giá
            </h1>
            <p className="text-neutral-500 mt-1">Tạo và quản lý các mã khuyến mãi dành riêng cho khách hàng của bạn.</p>
          </div>
          <CreateVoucherModal />
        </div>

        <Card className="rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50/50 text-neutral-500 font-medium border-b border-neutral-100">
                <tr>
                  <th className="py-4 px-6">Mã giảm giá</th>
                  <th className="py-4 px-6">Loại giảm</th>
                  <th className="py-4 px-6 text-right">Mức giảm</th>
                  <th className="py-4 px-6 text-right">Tối thiểu</th>
                  <th className="py-4 px-6 text-center">Số lượng còn</th>
                  <th className="py-4 px-6">Hạn sử dụng</th>
                  <th className="py-4 px-6 text-center">Lịch sử</th>
                  <th className="py-4 px-6 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary/40" />
                      Đang tải danh sách...
                    </td>
                  </tr>
                ) : !vouchers || vouchers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ticket className="w-8 h-8 text-neutral-400" />
                      </div>
                      <p className="text-neutral-500 font-medium">Bạn chưa tạo mã giảm giá nào.</p>
                    </td>
                  </tr>
                ) : (
                  vouchers?.map((voucher) => {
                    const isExpired = new Date(voucher.expiryDate) < new Date();
                    const isAvailable = voucher.isActive && !isExpired && voucher.quantity > 0;

                    return (
                      <tr key={voucher.id} className="hover:bg-neutral-50/30 transition-colors">
                        <td className="py-4 px-6 font-bold text-neutral-900">
                          <Badge variant="outline" className="font-mono text-sm border-primary/20 text-primary bg-primary/5">
                            {voucher.code}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-neutral-600">
                          {voucher.type === 'FIXED_AMOUNT' ? 'Cố định' : 'Phần trăm'}
                        </td>
                        <td className="py-4 px-6 text-right font-semibold text-emerald-600">
                          {voucher.type === 'FIXED_AMOUNT'
                            ? formatCurrency(voucher.discountValue)
                            : `${voucher.discountValue}%`}
                        </td>
                        <td className="py-4 px-6 text-right text-neutral-600">
                          {voucher.minOrderValue ? formatCurrency(voucher.minOrderValue) : 'Không có'}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`font-medium ${voucher.quantity > 0 ? 'text-neutral-900' : 'text-red-500'}`}>
                            {voucher.quantity}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span className={isExpired ? 'text-red-500 font-medium' : ''}>
                              {new Date(voucher.expiryDate).toLocaleString('vi-VN')}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs text-primary border-primary/20 hover:bg-primary/5"
                            onClick={() => {
                              setSelectedVoucherId(voucher.id);
                              setSelectedVoucherCode(voucher.code);
                              setHistoryModalOpen(true);
                            }}
                          >
                            Xem
                          </Button>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <span className="text-xs font-medium text-neutral-500">
                              {isAvailable ? 'Đang chạy' : isExpired ? 'Hết hạn' : 'Đã tắt'}
                            </span>
                            <Switch
                              checked={voucher.isActive}
                              onCheckedChange={() => handleToggle(voucher.id)}
                              disabled={togglingId === voucher.id || isExpired}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <VoucherUsageModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        voucherId={selectedVoucherId}
        voucherCode={selectedVoucherCode}
      />
    </div>
  );
}
