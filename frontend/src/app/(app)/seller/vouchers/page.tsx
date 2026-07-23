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
    <div className="container px-4 sm:px-6 mx-auto py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Quản lý mã giảm giá
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">Tạo và quản lý các mã khuyến mãi dành riêng cho khách hàng của bạn.</p>
            </div>
          </div>
          <CreateVoucherModal />
        </div>

        <div className="bg-card rounded-2xl shadow-xs border border-border/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[850px]">
              <thead>
                <tr className="bg-muted/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="py-3.5 px-5">Mã giảm giá</th>
                  <th className="py-3.5 px-5">Loại giảm</th>
                  <th className="py-3.5 px-5 text-right">Mức giảm</th>
                  <th className="py-3.5 px-5 text-right">Tối thiểu</th>
                  <th className="py-3.5 px-5 text-center">Số lượng còn</th>
                  <th className="py-3.5 px-5 text-center">Giới hạn/User</th>
                  <th className="py-3.5 px-5">Hạn sử dụng</th>
                  <th className="py-3.5 px-5 text-center">Lịch sử</th>
                  <th className="py-3.5 px-5 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary/40" />
                      <p className="text-xs">Đang tải danh sách...</p>
                    </td>
                  </tr>
                ) : !vouchers || vouchers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="w-16 h-16 bg-muted/60 rounded-full flex items-center justify-center mx-auto mb-3 border border-border/50">
                        <Ticket className="w-8 h-8 text-muted-foreground/60" />
                      </div>
                      <p className="text-sm font-semibold text-foreground mb-1">Bạn chưa tạo mã giảm giá nào</p>
                      <p className="text-xs text-muted-foreground">Hãy tạo mã giảm giá đầu tiên để thu hút người mua.</p>
                    </td>
                  </tr>
                ) : (
                  vouchers?.map((voucher) => {
                    const isExpired = new Date(voucher.expiryDate) < new Date();
                    const isAvailable = voucher.isActive && !isExpired && voucher.quantity > 0;

                    return (
                      <tr key={voucher.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-foreground">
                          <Badge variant="outline" className="font-mono text-xs px-2.5 py-0.5 rounded-md font-semibold border-primary/20 text-primary bg-primary/10">
                            {voucher.code}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-5 text-muted-foreground text-xs font-medium">
                          {voucher.type === 'FIXED_AMOUNT' ? 'Cố định' : 'Phần trăm'}
                        </td>
                        <td className="py-3.5 px-5 text-right font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                          {voucher.type === 'FIXED_AMOUNT'
                            ? formatCurrency(voucher.discountValue)
                            : `${voucher.discountValue}%`}
                        </td>
                        <td className="py-3.5 px-5 text-right text-xs text-muted-foreground">
                          {voucher.minOrderValue ? formatCurrency(voucher.minOrderValue) : 'Không có'}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span className={`text-xs font-semibold ${voucher.quantity > 0 ? 'text-foreground' : 'text-red-500'}`}>
                            {voucher.quantity}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span className="text-xs font-semibold text-foreground">
                            {voucher.usageLimitPerUser || 1}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span className={isExpired ? 'text-red-500 font-medium' : ''}>
                              {new Date(voucher.expiryDate).toLocaleString('vi-VN')}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-2.5 rounded-lg border-border hover:bg-accent font-medium text-foreground"
                            onClick={() => {
                              setSelectedVoucherId(voucher.id);
                              setSelectedVoucherCode(voucher.code);
                              setHistoryModalOpen(true);
                            }}
                          >
                            Xem
                          </Button>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <span className={`text-[11px] font-medium ${isAvailable ? 'text-emerald-600 dark:text-emerald-400' : isExpired ? 'text-red-500' : 'text-muted-foreground'}`}>
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
        </div>
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
