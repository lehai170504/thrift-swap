import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useCreateVoucher, CreateVoucherDTO } from '@/features/orders/hooks/useVouchers';

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
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl" onClick={() => setIsOpen(true)}>
        <PlusCircle className="w-5 h-5" />
        Tạo mã giảm giá
      </Button>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Tạo mã giảm giá mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="code">Mã giảm giá (VD: SALE10K, MEGA50)</Label>
            <Input
              id="code"
              placeholder="Nhập mã viết liền không dấu"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
              required
              className="uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại mã</Label>
              <Select
                value={formData.type}
                onValueChange={(val: any) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger>
                  {formData.type === 'FIXED_AMOUNT' ? 'Giảm số tiền cố định' : 'Giảm theo %'}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIXED_AMOUNT">Giảm số tiền cố định</SelectItem>
                  <SelectItem value="PERCENTAGE">Giảm theo %</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mức giảm {formData.type === 'PERCENTAGE' ? '(%)' : '(đ)'}</Label>
              <Input
                type="number"
                min="1"
                required
                value={formData.discountValue || ''}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Đơn hàng tối thiểu (đ)</Label>
            <Input
              type="number"
              min="0"
              value={formData.minOrderValue || ''}
              onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
            />
          </div>

          {formData.type === 'PERCENTAGE' && (
            <div className="space-y-2">
              <Label>Mức giảm tối đa (đ) - Bỏ trống nếu không giới hạn</Label>
              <Input
                type="number"
                min="0"
                value={formData.maxDiscount || ''}
                onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số lượng mã</Label>
              <Input
                type="number"
                min="1"
                required
                value={formData.quantity || ''}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Hạn sử dụng</Label>
              <Input
                type="datetime-local"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl">
              Hủy
            </Button>
            <Button type="submit" disabled={createMutation.isPending || !formData.code} className="rounded-xl bg-primary text-white">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {createMutation.isPending ? 'Đang tạo...' : 'Tạo mã'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
