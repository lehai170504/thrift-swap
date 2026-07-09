'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useVoucherUsages } from '../hooks/useVouchers';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Loader2, Ticket, History } from 'lucide-react';

interface VoucherUsageModalProps {
  voucherId: string;
  voucherCode: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VoucherUsageModal({ voucherId, voucherCode, isOpen, onClose }: VoucherUsageModalProps) {
  const { data: usages, isLoading } = useVoucherUsages(voucherId, isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white p-6 rounded-2xl border-0 shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-xl text-neutral-900">
            <History className="w-5 h-5 text-primary" />
            Lịch sử sử dụng mã: <span className="text-primary font-bold">{voucherCode}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 pt-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-neutral-500 font-medium">Đang tải lịch sử...</p>
            </div>
          ) : !usages || usages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                <Ticket className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-neutral-500 font-medium text-lg">Chưa có ai sử dụng mã này</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              {usages.map((usage) => (
                <div key={usage.id} className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900">{usage.username}</span>
                      <span className="text-xs text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded-full">{usage.email}</span>
                    </div>
                    <div className="text-sm text-neutral-600 line-clamp-1">
                      Sản phẩm: <span className="font-medium">{usage.productTitle}</span>
                    </div>
                    <div className="text-xs text-neutral-400">
                      Thời gian: {format(new Date(usage.usedAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end justify-center">
                    <div className="text-sm text-neutral-500 mb-1">Mức giảm:</div>
                    <div className="text-lg font-bold text-emerald-600">
                      - {formatCurrency(usage.discountAmount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
