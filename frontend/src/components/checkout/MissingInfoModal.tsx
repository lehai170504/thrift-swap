'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api/users';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const missingInfoSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
});

type MissingInfoFormData = z.infer<typeof missingInfoSchema>;

interface MissingInfoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function MissingInfoModal({ isOpen, onOpenChange, onSuccess }: MissingInfoModalProps) {
  const { user, login } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<MissingInfoFormData>({
    resolver: zodResolver(missingInfoSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });

  const onSubmit = async (data: MissingInfoFormData) => {
    setIsSaving(true);
    try {
      await userApi.updateProfile({
        ...data,
        avatar: user?.avatar,
        interests: user?.interests
      });

      toast.success('Cập nhật thông tin thành công!');

      if (user) {
        login({ ...user, ...data });
      }

      onOpenChange(false);
      onSuccess(); // Continue with the purchase
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Bổ sung thông tin giao hàng</DialogTitle>
          <DialogDescription className="text-center text-sm">
            Để tiếp tục mua hàng, vui lòng cung cấp thông tin liên hệ và địa chỉ nhận hàng của bạn.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Họ và tên</Label>
            <Input
              placeholder="Vd: Nguyễn Văn A"
              {...register('fullName')}
              className={`h-11 ${errors.fullName ? 'border-red-500' : ''}`}
            />
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Số điện thoại</Label>
            <Input
              placeholder="Vd: 0912345678"
              {...register('phone')}
              className={`h-11 ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Địa chỉ giao hàng</Label>
            <Input
              placeholder="Nhập địa chỉ nhận hàng mặc định"
              {...register('address')}
              className={`h-11 ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
          </div>

          <DialogFooter className="sm:justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary text-white"
            >
              {isSaving ? "Đang lưu..." : "Cập nhật & Mua hàng"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
