import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { reviewApi } from '@/features/reviews/api/reviewApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ReviewModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ orderId, isOpen, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: async () => {
      return reviewApi.createReview(orderId, { rating, comment });
    },
    onSuccess: () => {
      toast.success('Đánh giá thành công! Cảm ơn bạn đã phản hồi.');
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-sales'] });
      onClose();
    },
    onError: (error: any) => {
      const errorMsg = typeof error.response?.data === 'string'
        ? error.response?.data
        : error.response?.data?.message || 'Có lỗi xảy ra';
      toast.error('Gửi đánh giá thất bại: ' + errorMsg);
    }
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá!');
      return;
    }
    reviewMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 bg-white rounded-3xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Đánh giá Người bán</DialogTitle>
          <DialogDescription className="text-center text-neutral-500">
            Chia sẻ trải nghiệm mua hàng của bạn về đơn hàng này
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-neutral-600">Bạn cảm thấy sản phẩm thế nào?</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${star <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-neutral-100 text-neutral-200'
                      } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-bold text-amber-500 min-h-[20px]">
              {rating === 5 && 'Tuyệt vời!'}
              {rating === 4 && 'Rất tốt'}
              {rating === 3 && 'Bình thường'}
              {rating === 2 && 'Tệ'}
              {rating === 1 && 'Rất tệ!'}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Nhận xét chi tiết (Tùy chọn)</label>
            <Textarea
              placeholder="Hãy chia sẻ thêm về chất lượng sản phẩm, thái độ phục vụ của người bán..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none h-24 bg-neutral-50 focus-visible:ring-primary rounded-xl"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl px-6">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={reviewMutation.isPending}
            className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-white"
          >
            {reviewMutation.isPending ? 'Đang gửi...' : 'Gửi Đánh giá'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
