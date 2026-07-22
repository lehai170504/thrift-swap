'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserReviews } from '@/features/reviews/hooks/useReviews';

interface ProductReviewsProps {
  sellerName: string;
  sellerAvatar?: string;
}

export function ProductReviews({ sellerName, sellerAvatar }: ProductReviewsProps) {
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
    <div className="mt-16 glass rounded-[24px] p-8 border border-border shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-heading font-bold text-foreground">Đánh giá Người bán</h2>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted border border-border shrink-0">
              {sellerAvatar ? (
                <img src={sellerAvatar} alt={sellerName} className="w-full h-full object-cover" />
              ) : (
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sellerName}`} alt={sellerName} className="w-full h-full object-cover" />
              )}
            </div>
            <p className="text-muted-foreground">Khách hàng nói gì về <span className="font-medium text-foreground">{sellerName}</span> • {reviews.length} đánh giá</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 bg-amber-500/10 px-6 py-4 rounded-[24px] border border-amber-500/20 shrink-0">
          <div className="flex items-center gap-2">
            <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
            <span className="text-3xl font-bold text-amber-500">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-amber-500/70 text-sm font-medium">trên 5 sao</span>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`w-4 h-4 ${s <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-8 max-w-xs">
        {ratingCounts.map(({ star, count, percent }) => (
          <div key={star} className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground w-4 text-right">{star}</span>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${percent}%` }} />
            </div>
            <span className="text-muted-foreground w-6 text-right">{count}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedReviews.map((review: any) => (
          <div key={review.id} className="p-5 rounded-[24px] bg-background/50 border border-border hover:border-border transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`relative ${review.reviewerTier === 'DIAMOND' ? 'rounded-full p-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-pulse-slow shadow-[0_0_15px_rgba(34,211,238,0.6)]' :
                  review.reviewerTier === 'GOLD' ? 'rounded-full p-0.5 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.5)]' :
                    review.reviewerTier === 'SILVER' ? 'rounded-full p-[1px] bg-gradient-to-r from-slate-300 to-slate-400' :
                      ''
                  }`}>
                  <Avatar className="w-9 h-9 border border-border relative z-10 bg-background">
                    <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary/90 font-bold text-xs">
                      {(review.reviewerName || 'U').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{review.reviewerName}</div>
                  <div className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">"{review.comment}"</p>
            )}
            <div className="text-xs text-muted-foreground border-t border-border pt-2.5">
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
            className="rounded-[24px] px-8 border-border text-foreground hover:bg-accent hover:text-accent-foreground hover:text-foreground"
          >
            {showAll ? 'Thu gọn' : `Xem tất cả ${reviews.length} đánh giá`}
          </Button>
        </div>
      )}
    </div>
  );
}
