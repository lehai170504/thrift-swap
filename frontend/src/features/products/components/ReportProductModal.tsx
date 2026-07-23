'use client';

import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useReport } from '@/features/report/hooks/useReport';

interface ReportProductModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
}

export function ReportProductModal({ isOpen, onOpenChange, productId }: ReportProductModalProps) {
  const [reason, setReason] = useState('');
  const { user } = useAuth();
  const { submitReport } = useReport();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Vui lòng đăng nhập để thực hiện chức năng này');
      return;
    }

    if (reason.trim().length < 10) {
      toast.error('Lý do tố cáo phải dài ít nhất 10 ký tự');
      return;
    }

    submitReport.mutate({ productId, reason }, {
      onSuccess: () => {
        setReason('');
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Tố cáo sản phẩm vi phạm
            </DialogTitle>
            <DialogDescription>
              Vui lòng cung cấp lý do chi tiết để quản trị viên có thể xem xét và xử lý. Cảm ơn bạn đã giúp môi trường giao dịch an toàn hơn.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Nhập lý do tố cáo (ít nhất 10 ký tự)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={submitReport.isPending}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitReport.isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={submitReport.isPending || reason.trim().length < 10}
            >
              {submitReport.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Gửi Tố Cáo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
