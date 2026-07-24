'use client';

import { useState } from 'react';
import { useAdminVouchers } from '@/features/admin/hooks/useAdminVouchers';
import { Plus, Power, PowerOff, Trash2, Tag, Percent } from 'lucide-react';
import { toast } from 'sonner';
import { VoucherFormModal } from '@/features/admin/components/VoucherFormModal';
import { Button } from '@/components/ui/button';

export default function AdminVouchersPage() {
  const { vouchers, isLoading, toggleStatus, deleteVoucher } = useAdminVouchers();
  const [isCreating, setIsCreating] = useState(false);

  const handleToggle = async (id: string) => {
    try {
      await toggleStatus.mutateAsync(id);
      toast.success('Cập nhật trạng thái thành công');
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa mã này?')) return;
    try {
      await deleteVoucher.mutateAsync(id);
      toast.success('Xóa mã giảm giá thành công');
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Đang tải danh sách...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Tag className="w-8 h-8 text-primary" />
            Mã Giảm Giá Sàn
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-medium">
            Quản lý các chiến dịch khuyến mãi toàn hệ thống
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="rounded-full shadow-lg hover:shadow-primary/20 transition-all font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo Mã Mới
        </Button>
      </div>

      <VoucherFormModal isOpen={isCreating} onClose={() => setIsCreating(false)} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.map(voucher => (
          <div key={voucher.id} className="glass rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300">
            <div className={`p-4 border-b border-border/50 flex justify-between items-center ${voucher.active ? 'bg-primary/5' : 'bg-muted/10'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${voucher.active ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
                  {voucher.type === 'PERCENTAGE' ? <Percent className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight uppercase">{voucher.code}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${voucher.active ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                    {voucher.active ? 'Đang bật' : 'Đã tắt'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleToggle(voucher.id)}
                  title={voucher.active ? 'Tắt mã này' : 'Bật mã này'}
                  className={`h-8 w-8 rounded-full ${voucher.active ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50 border-orange-200' : 'text-green-500 hover:text-green-600 hover:bg-green-50 border-green-200'}`}
                >
                  {voucher.active ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(voucher.id)}
                  title="Xóa mã"
                  className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mức giảm:</span>
                <span className="font-bold text-primary">
                  {voucher.type === 'PERCENTAGE'
                    ? `${voucher.discountValue}% (Tối đa ${voucher.maxDiscount?.toLocaleString()}đ)`
                    : `${voucher.discountValue.toLocaleString()}đ`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đơn tối thiểu:</span>
                <span className="font-medium">{voucher.minOrderValue.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số lượng còn lại:</span>
                <span className="font-medium">{voucher.quantity} lượt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hết hạn:</span>
                <span className="font-medium text-destructive">{new Date(voucher.expiryDate).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>
        ))}

        {vouchers.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Chưa có mã giảm giá nào. Hãy tạo mã đầu tiên!</p>
          </div>
        )}
      </div>
    </div>
  );
}
