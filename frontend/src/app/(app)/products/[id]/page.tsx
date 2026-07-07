/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
'use client';

import { useParams } from 'next/navigation';
import { useProduct, useRelatedProducts } from '@/features/products/hooks/useProducts';
import { useUserReviews } from '@/features/reviews/hooks/useReviews';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Gavel, ArrowLeft, Clock, ShieldCheck, User, ArrowRight, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useDeleteProduct } from '@/features/products/hooks/useProducts';
import { useCreateBuyNowOrder } from '@/features/orders/hooks/useOrders';
import { Trash2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useChatStore } from '@/features/chat/store/useChatStore';
import { MissingInfoModal } from '@/components/checkout/MissingInfoModal';
import { ProductDetailSkeleton } from '@/components/ui/loading-skeletons';

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const { data: product, isLoading, error } = useProduct(id);
  const deleteMutation = useDeleteProduct();
  const buyNowMutation = useCreateBuyNowOrder();
  const { openChatWith } = useChatStore();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMissingInfoModalOpen, setIsMissingInfoModalOpen] = useState(false);

  const isSeller = user?.id === product?.sellerId || user?.username === product?.sellerName;

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        router.push('/products');
      }
    });
  };

  const proceedWithPurchase = () => {
    buyNowMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Đã đặt hàng thành công! Vui lòng thanh toán.');
        router.push('/orders');
      },
      onError: (err: any) => {
        toast.error(err.response?.data || 'Có lỗi xảy ra khi mua hàng.');
      }
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để mua hàng!');
      router.push('/login');
      return;
    }

    if (isSeller) {
      toast.error('Bạn không thể mua sản phẩm của chính mình!');
      return;
    }

    if (!user.phone || !user.address) {
      setIsMissingInfoModalOpen(true);
      return;
    }

    proceedWithPurchase();
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Không tìm thấy sản phẩm</h2>
        <p className="text-neutral-500 mb-8">Sản phẩm này có thể đã bị xóa hoặc không tồn tại.</p>
        <Link href="/products">
          <Button variant="outline"><ArrowLeft className="mr-2 w-4 h-4" /> Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const imageUrl = product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800&h=800&seed=${product.id}`;

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24">
      <div className="container mx-auto px-4 py-8">
        <Link href="/products" className="inline-flex items-center text-neutral-500 hover:text-primary transition-colors mb-8 font-medium">
          <ArrowLeft className="mr-2 w-4 h-4" /> Khám phá thêm sản phẩm
        </Link>

        <div className="bg-white rounded-3xl p-6 md:p-8 lg:p-12 shadow-sm border border-neutral-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Image Gallery */}
            <div className="space-y-6">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/60">
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.sellType === 'AUCTION' && (
                  <Badge className="absolute top-4 left-4 bg-primary/95 shadow-lg border-none gap-1.5 px-4 py-2 text-sm backdrop-blur-md rounded-full">
                    <Gavel className="w-4 h-4" /> Đang đấu giá
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full">
                  {product.categoryName}
                </Badge>
                <Badge variant="outline" className="text-neutral-600 border-neutral-200 bg-neutral-50 px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full">
                  {product.condition === 'NEW' ? 'Mới 100%' : product.condition === 'LIKE_NEW' ? 'Như mới' : 'Đã sử dụng'}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight mb-4">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 py-4 border-y border-neutral-100 my-4">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-neutral-400" />
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Người bán</div>
                  <div className="font-semibold text-neutral-900">{product.sellerName}</div>
                </div>
                <div className="ml-auto flex flex-col items-end gap-2">
                  <div className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-medium">
                    <ShieldCheck className="w-4 h-4 mr-1" /> Đã xác thực
                  </div>
                  {!isSeller && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs rounded-full border-primary text-primary hover:bg-primary/10"
                      onClick={() => openChatWith({ id: product.sellerId, username: product.sellerName, fullName: product.sellerName })}
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                      Nhắn tin
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 mb-8">
                <div className="text-sm text-neutral-500 font-medium mb-2">
                  {product.sellType === 'BUY_NOW' ? 'Giá bán' : 'Giá khởi điểm'}
                </div>
                <div className="text-4xl font-black text-primary tracking-tight">
                  {formatCurrency(product.price)}
                </div>
              </div>

              <div className="prose prose-neutral max-w-none mb-10">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Mô tả sản phẩm</h3>
                <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </div>

              <div className="mt-auto">
                {!isSeller && (
                  <>
                    {product.sellType === 'BUY_NOW' ? (
                      <Button
                        onClick={handleBuyNow}
                        disabled={buyNowMutation.isPending || product.status !== 'ACTIVE'}
                        size="lg"
                        className="w-full h-14 text-lg bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/30"
                      >
                        <ShoppingBag className="mr-2 w-5 h-5" />
                        {buyNowMutation.isPending ? 'Đang xử lý...' : (product.status === 'ACTIVE' ? 'Mua ngay an toàn' : 'Sản phẩm đã bán')}
                      </Button>
                    ) : (
                      <Card className="border-primary/30 bg-primary/10/50 shadow-inner rounded-2xl">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center text-primary/90 font-medium">
                              <Clock className="w-5 h-5 mr-2" />
                              {product.auctionEndTime ? `Hạn: ${new Date(product.auctionEndTime).toLocaleString()}` : 'Chưa rõ thời gian'}
                            </div>
                          </div>
                          <Link href={`/auctions/${product.id}`}>
                            <Button size="lg" className="w-full h-14 text-lg bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/30">
                              <Gavel className="mr-2 w-5 h-5" /> Tham gia phòng đấu giá
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {isSeller && (
                  <>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="w-full h-14 text-lg mt-4 rounded-xl"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-2 w-5 h-5" /> Hủy bỏ sản phẩm này
                    </Button>

                    <ConfirmDialog
                      isOpen={isDeleteDialogOpen}
                      onOpenChange={setIsDeleteDialogOpen}
                      title="Xóa Sản Phẩm"
                      description={
                        <>
                          Bạn có chắc chắn muốn hủy bỏ sản phẩm <strong>"{product.title}"</strong> không? Thao tác này không thể hoàn tác.
                        </>
                      }
                      onConfirm={handleDelete}
                      cancelText="Giữ lại"
                      confirmText="Đồng ý xóa"
                      isLoading={deleteMutation.isPending}
                      variant="destructive"
                    />
                  </>
                )}

                <MissingInfoModal
                  isOpen={isMissingInfoModalOpen}
                  onOpenChange={setIsMissingInfoModalOpen}
                  onSuccess={proceedWithPurchase}
                />

                <p className="text-center text-xs text-neutral-400 mt-4 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  Giao dịch được bảo vệ bởi ThriftSwap Escrow
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Info & Reviews Section */}
        {product.sellerName && (
          <SellerReviewsSection sellerName={product.sellerName} />
        )}

        {/* Related Products Section */}
        {product.categoryId && (
          <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
        )}
      </div>
    </div>
  );
}

function RelatedProducts({ categoryId, currentProductId }: { categoryId: string, currentProductId: string }) {
  const { data: relatedProducts, isLoading } = useRelatedProducts(currentProductId, categoryId);

  if (isLoading || !relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-neutral-900 mb-8">Sản phẩm cùng danh mục</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {relatedProducts.map((product: any) => {
          const imageUrl = product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400&h=400&seed=${product.id}`;

          return (
            <Link href={`/products/${product.id}`} key={product.id} className="block group h-full">
              <Card className="overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border-neutral-200/60 rounded-2xl bg-white h-full cursor-pointer">
                <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  {product.sellType === 'AUCTION' && (
                    <Badge className="absolute top-3 right-3 bg-primary/95 shadow-sm border-none px-2.5 py-1 text-xs rounded-full">
                      <Gavel className="w-3 h-3 mr-1 inline-block" /> Đấu giá
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-4">
                    {product.title}
                  </h3>
                  <div className="flex items-end justify-between mt-auto">
                    <div className="text-xl font-extrabold text-neutral-900 tracking-tight group-hover:text-primary transition-colors duration-300">
                      {formatCurrency(product.price)}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                      <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SellerReviewsSection({ sellerName }: { sellerName: string }) {
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
