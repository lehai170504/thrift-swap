import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useCreateVoucher } from '@/features/orders/hooks/useVouchers';
import { CreateVoucherDTO } from '@/features/orders/types/voucher';
import { formatCurrency } from '@/lib/utils';

export function CreateVoucherModal() {
  const [isOpen, setIsOpen] = useState(false);
  const createMutation = useCreateVoucher();

  const [formData, setFormData] = useState<CreateVoucherDTO>(() => ({
    code: '',
    type: 'FIXED_AMOUNT',
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    quantity: 1,
    usageLimitPerUser: 1,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16) // +7 days
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      expiryDate: new Date(formData.expiryDate).toISOString()
    }, {
      onSuccess: () => {
        setIsOpen(false);
        // Reset form
        setFormData({
          code: '',
          type: 'FIXED_AMOUNT',
          discountValue: 0,
          minOrderValue: 0,
          maxDiscount: 0,
          quantity: 1,
          usageLimitPerUser: 1,
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-[24px]" onClick={() => setIsOpen(true)}>
        <PlusCircle className="w-5 h-5" />
        Tạo mã giảm giá
      </Button>
      <DialogContent className="sm:max-w-[500px] glass border-border rounded-[24px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold text-foreground">Tạo mã giảm giá mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-foreground">Mã giảm giá (VD: SALE10K, MEGA50)</Label>
            <Input
              id="code"
              placeholder="Nhập mã viết liền không dấu"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
              required
              className="uppercase bg-background/50 border-border rounded-[24px] text-foreground focus-visible:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Loại mã</Label>
              <Select
                value={formData.type}
                onValueChange={(val: any) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger className="bg-background/50 border-border rounded-[24px] text-foreground">
                  {formData.type === 'FIXED_AMOUNT' ? 'Giảm số tiền cố định' : 'Giảm theo %'}
                </SelectTrigger>
                <SelectContent className="glass border-border rounded-[24px]">
                  <SelectItem value="FIXED_AMOUNT" className="hover:bg-accent hover:text-accent-foreground rounded-xl cursor-pointer">Giảm số tiền cố định</SelectItem>
                  <SelectItem value="PERCENTAGE" className="hover:bg-accent hover:text-accent-foreground rounded-xl cursor-pointer">Giảm theo %</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Mức giảm {formData.type === 'PERCENTAGE' ? '(%)' : '(đ)'}</Label>
              <Input
                type="number"
                min="1"
                required
                value={formData.discountValue || ''}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                className="bg-background/50 border-border rounded-[24px] text-foreground focus-visible:ring-primary"
              />
              {formData.type === 'FIXED_AMOUNT' && Number(formData.discountValue) > 0 && (
                <p className="text-xs text-primary font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block"></span>
                  Giảm: <strong className="font-bold">{formatCurrency(formData.discountValue)}</strong>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Đơn hàng tối thiểu (đ)</Label>
            <Input
              type="number"
              min="0"
              value={formData.minOrderValue || ''}
              onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
              className="bg-background/50 border-border rounded-[24px] text-foreground focus-visible:ring-primary"
            />
            {Number(formData.minOrderValue) > 0 && (
              <p className="text-xs text-primary font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block"></span>
                Đơn từ: <strong className="font-bold">{formatCurrency(formData.minOrderValue)}</strong>
              </p>
            )}
          </div>

          {formData.type === 'PERCENTAGE' && (
            <div className="space-y-2">
              <Label className="text-foreground">Mức giảm tối đa (đ) - Bỏ trống nếu không giới hạn</Label>
              <Input
                type="number"
                min="0"
                value={formData.maxDiscount || ''}
                onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                className="bg-background/50 border-border rounded-[24px] text-foreground focus-visible:ring-primary"
              />
              {Number(formData.maxDiscount) > 0 && (
                <p className="text-xs text-primary font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block"></span>
                  Tối đa: <strong className="font-bold">{formatCurrency(formData.maxDiscount)}</strong>
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Số lượng mã</Label>
              <Input
                type="number"
                min="1"
                required
                value={formData.quantity || ''}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="bg-background/50 border-border rounded-[24px] text-foreground focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Giới hạn số lần dùng / Người</Label>
              <Input
                type="number"
                min="1"
                required
                value={formData.usageLimitPerUser || ''}
                onChange={(e) => setFormData({ ...formData, usageLimitPerUser: Number(e.target.value) })}
                className="bg-background/50 border-border rounded-[24px] text-foreground focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Hạn sử dụng</Label>
              <Input
                type="datetime-local"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="bg-background/50 border-border rounded-[24px] text-foreground focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-[24px] border-border text-foreground hover:bg-accent hover:text-accent-foreground hover:text-foreground">
              Hủy
            </Button>
            <Button type="submit" disabled={createMutation.isPending || !formData.code} className="rounded-[24px] bg-primary text-primary-foreground hover:bg-primary/90">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {createMutation.isPending ? 'Đang tạo...' : 'Tạo mã'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
