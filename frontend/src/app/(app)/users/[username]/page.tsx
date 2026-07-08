'use client';

import { useParams } from 'next/navigation';
import { useUserProfile } from '@/features/users/hooks/useUserProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Star, Package, CalendarDays, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SellerProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const { profile, isProfileLoading, products, isProductsLoading, reviews, isReviewsLoading } = useUserProfile(username);

  if (isProfileLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-neutral-500">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Không tìm thấy người dùng</h2>
        <p>Người dùng này không tồn tại hoặc đã bị khóa.</p>
      </div>
    );
  }

  const averageRating = reviews && reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'Chưa có';

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Seller Header Info */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        <Avatar className="w-32 h-32 border-4 border-white shadow-lg ring-2 ring-primary/10">
          <AvatarImage src={profile.avatar} alt={profile.fullName || profile.username} className="object-cover" />
          <AvatarFallback className="bg-primary/5 text-primary text-4xl font-bold">
            {(profile.fullName || profile.username || 'U').substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-black text-neutral-900 mb-2 flex items-center justify-center md:justify-start gap-2">
            {profile.fullName || profile.username}
            <ShieldCheck className="text-emerald-500 w-6 h-6" />
          </h1>
          <p className="text-neutral-500 mb-6 text-lg">@{profile.username}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <div className="flex items-center gap-2 text-neutral-700 bg-neutral-50 px-4 py-2 rounded-2xl">
              <Star className="text-amber-400 w-5 h-5 fill-current" />
              <span className="font-bold text-lg">{averageRating}</span>
              <span className="text-sm text-neutral-500">({reviews?.length || 0} đánh giá)</span>
            </div>

            <div className="flex items-center gap-2 text-neutral-700 bg-neutral-50 px-4 py-2 rounded-2xl">
              <Package className="text-primary w-5 h-5" />
              <span className="font-bold text-lg">{products?.length || 0}</span>
              <span className="text-sm text-neutral-500">Sản phẩm</span>
            </div>

            <div className="flex items-center gap-2 text-neutral-700 bg-neutral-50 px-4 py-2 rounded-2xl">
              <CalendarDays className="text-blue-500 w-5 h-5" />
              <span className="text-sm text-neutral-500">Tham gia:</span>
              <span className="font-semibold">{format(new Date(profile.createdAt), 'MM/yyyy', { locale: vi })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="w-full justify-start border-b border-neutral-200 rounded-none bg-transparent h-auto p-0 mb-8 gap-8">
          <TabsTrigger
            value="products"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 py-4 text-base font-bold bg-transparent"
          >
            Sản phẩm đang bán ({products?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 py-4 text-base font-bold bg-transparent"
          >
            Đánh giá từ người mua ({reviews?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="min-h-[300px]">
          {isProductsLoading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-100">
              <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Chưa có sản phẩm nào</h3>
              <p className="text-neutral-500">Người bán này hiện chưa đăng bán sản phẩm nào.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="min-h-[300px]">
          {isReviewsLoading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex gap-4">
                  <Avatar className="w-12 h-12 border border-neutral-100">
                    <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} className="object-cover" />
                    <AvatarFallback className="bg-neutral-100 text-neutral-600 font-bold">
                      {review.reviewerName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-neutral-900">{review.reviewerName}</h4>
                        <div className="flex items-center gap-1 mt-1 text-sm text-neutral-500">
                          <span className="text-primary font-medium">Sản phẩm:</span> {review.productTitle}
                        </div>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-current' : 'text-neutral-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-2xl">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-100">
              <Star className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Chưa có đánh giá nào</h3>
              <p className="text-neutral-500">Người bán này chưa nhận được đánh giá nào từ người mua.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
