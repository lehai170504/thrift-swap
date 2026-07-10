'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserReviews } from '@/features/reviews/hooks/useReviews';

interface ProductReviewsProps {
  sellerName: string;
}

export function ProductReviews({ sellerName }: ProductReviewsProps) {
  const { data: reviews, isLoading } = useUserReviews(sellerName);
  const [showAll, setShowAll] = useState(false);

  if (isLoading || !reviews || reviews.length === 0) return null;

  const averageRating = reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length;
  const displayedReviews = showAll ? reviews : reviews.slice(0, 4);

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter((r: any) => r.rating === star).length,
    percent: Math.round((reviews.filter((r: any) => r.rating === star).length / reviews.length) * 100)
  }));

  return (
    <div className="mt-16 bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-neutral-900">Đánh giá Người bán</h2>
          <p className="text-neutral-500 mt-1">Khách hàng nói gì về {sellerName} • {reviews.length} đánh giá</p>
        </div>
        <div className="flex flex-col items-center gap-1 bg-amber-50 px-6 py-4 rounded-2xl border border-amber-100 shrink-0">
          <div className="flex items-center gap-2">
            <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
            <span className="text-3xl font-black text-amber-600">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-amber-600/70 text-sm font-medium">trên 5 sao</span>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`w-4 h-4 ${s <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-8 max-w-xs">
        {ratingCounts.map(({ star, count, percent }) => (
          <div key={star} className="flex items-center gap-3 text-sm">
            <span className="text-neutral-500 w-4 text-right">{star}</span>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${percent}%` }} />
            </div>
            <span className="text-neutral-400 w-6 text-right">{count}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedReviews.map((review: any) => (
          <div key={review.id} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100/80 hover:border-neutral-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                {review.reviewerAvatar ? (
                  <img src={review.reviewerAvatar} alt={review.reviewerName} className="w-9 h-9 rounded-full object-cover border border-neutral-200" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {review.reviewerName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-neutral-900 text-sm">{review.reviewerName}</div>
                  <div className="text-xs text-neutral-400">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-neutral-600 text-sm leading-relaxed mb-3">"{review.comment}"</p>
            )}
            <div className="text-xs text-neutral-400 border-t border-neutral-200/60 pt-2.5">
              Sản phẩm: {review.productTitle}
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 4 && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAll(v => !v)}
            className="rounded-xl px-8"
          >
            {showAll ? 'Thu gọn' : `Xem tất cả ${reviews.length} đánh giá`}
          </Button>
        </div>
      )}
    </div>
  );
}
