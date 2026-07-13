'use client';

import { useParams } from 'next/navigation';
import { useUserProfile } from '@/features/users/hooks/useUserProfile';
import { useFollow } from '@/features/users/hooks/useFollow';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Star, Package, CalendarDays, ShieldCheck, Users, UserPlus, UserCheck, Award } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';

import { ProfileSkeleton, ProductGridSkeleton } from '@/components/ui/loading-skeletons';

export default function SellerProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const { user } = useAuth();
  const { profile, isProfileLoading, products, isProductsLoading, reviews, isReviewsLoading } = useUserProfile(username);
  const { isFollowing, followerCount, followersList, toggleFollow, isToggling } = useFollow(username);

  if (isProfileLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground mb-2">Không tìm thấy người dùng</h2>
        <p>Người dùng này không tồn tại hoặc đã bị khóa.</p>
      </div>
    );
  }

  const averageRating = reviews && reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
    : 0;

  const isTrustedSeller = averageRating >= 4.5 && reviews && reviews.length >= 2;

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Seller Header Info */}
      <div className="bg-background/50 rounded-[24px] glass border border-border p-8 shadow-lg flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        <Avatar className="w-32 h-32 border-4 border-background shadow-lg ring-2 ring-primary/20">
          <AvatarImage src={profile.avatar} alt={profile.fullName || profile.username} className="object-cover" />
          <AvatarFallback className="bg-primary/20 text-primary text-4xl font-bold">
            {(profile.fullName || profile.username || 'U').substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
            {profile.fullName || profile.username}
            {isTrustedSeller ? (
              <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm px-3 py-1 rounded-[24px] font-bold ml-2">
                <Award className="w-4 h-4" />
                Gian hàng Uy tín
              </div>
            ) : (
              <ShieldCheck className="text-emerald-500 w-6 h-6" />
            )}
          </h1>
          <p className="text-muted-foreground mb-6 text-lg">@{profile.username}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
            <div className="flex items-center gap-2 text-foreground bg-muted border border-border px-4 py-2 rounded-[24px]">
              <Star className="text-amber-400 w-5 h-5 fill-current" />
              <span className="font-bold text-lg">{averageRating ? averageRating.toFixed(1) : 'Chưa có'}</span>
              <span className="text-sm text-muted-foreground">({reviews?.length || 0} đánh giá)</span>
            </div>

            <Dialog>
              <DialogTrigger
                render={
                  <button className="flex items-center gap-2 text-foreground bg-muted border border-border px-4 py-2 rounded-[24px] cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors" />
                }
              >
                <Users className="text-pink-500 w-5 h-5" />
                <span className="font-bold text-lg">{followerCount}</span>
                <span className="text-sm text-muted-foreground">Người theo dõi</span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-background border-border glass rounded-[24px] p-6 text-foreground">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-center">Người theo dõi ({followerCount})</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4 space-y-4">
                  {followersList && followersList.length > 0 ? (
                    followersList.map((follower: any) => (
                      <div key={follower.id} className="flex items-center justify-between gap-4 p-3 hover:bg-accent rounded-[16px] transition-colors border border-transparent hover:border-border">
                        <Link href={`/users/${follower.username}`} className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 border border-border">
                            <AvatarImage src={follower.avatar} alt={follower.fullName || follower.username} className="object-cover" />
                            <AvatarFallback className="bg-primary/20 text-primary font-bold">
                              {(follower.fullName || follower.username || 'U').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-foreground">{follower.fullName || follower.username}</p>
                            <p className="text-sm text-muted-foreground">@{follower.username}</p>
                          </div>
                        </Link>
                        <Link href={`/users/${follower.username}`}>
                          <Button variant="outline" size="sm" className="rounded-[24px] px-4 text-xs font-semibold">
                            Xem hồ sơ
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                      <p>Chưa có ai theo dõi gian hàng này.</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex items-center gap-2 text-foreground bg-muted border border-border px-4 py-2 rounded-[24px]">
              <Package className="text-primary w-5 h-5" />
              <span className="font-bold text-lg">{products?.length || 0}</span>
              <span className="text-sm text-muted-foreground">Sản phẩm</span>
            </div>

            <div className="flex items-center gap-2 text-foreground bg-muted border border-border px-4 py-2 rounded-[24px]">
              <CalendarDays className="text-blue-500 w-5 h-5" />
              <span className="text-sm text-muted-foreground">Tham gia:</span>
              <span className="font-semibold">{format(new Date(profile.createdAt), 'MM/yyyy', { locale: vi })}</span>
            </div>
          </div>

          {user?.username !== username && (
            <div className="flex justify-center md:justify-start">
              <Button
                size="lg"
                onClick={() => toggleFollow()}
                disabled={isToggling}
                variant={isFollowing ? "outline" : "default"}
                className={`rounded-[24px] px-8 font-bold ${isFollowing ? 'border-border text-foreground hover:bg-accent hover:text-accent-foreground' : 'shadow-lg shadow-primary/30'}`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-5 h-5 mr-2" /> Đang theo dõi
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" /> Theo dõi
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <div className="flex justify-center md:justify-start w-full mb-8">
          <TabsList className="inline-flex w-auto bg-muted p-1.5 rounded-[24px] gap-2 border border-border glass">
            <TabsTrigger
              value="products"
              className="rounded-[24px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-6 py-3 text-base font-bold transition-all text-muted-foreground"
            >
              Sản phẩm đang bán ({products?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-[24px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-6 py-3 text-base font-bold transition-all text-muted-foreground"
            >
              Đánh giá từ người mua ({reviews?.length || 0})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="products" className="min-h-[300px]">
          {isProductsLoading ? (
            <ProductGridSkeleton />
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-background/50 rounded-[24px] glass border border-border">
              <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Chưa có sản phẩm nào</h3>
              <p className="text-muted-foreground">Người bán này hiện chưa đăng bán sản phẩm nào.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="min-h-[300px]">
          {isReviewsLoading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-background/50 p-6 rounded-[24px] border border-border glass shadow-sm flex gap-4">
                  <Avatar className="w-12 h-12 border border-border">
                    <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} className="object-cover" />
                    <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                      {review.reviewerName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-foreground">{review.reviewerName}</h4>
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <span className="text-primary font-medium">Sản phẩm:</span> {review.productTitle}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-current' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                    <p className="text-foreground/80 leading-relaxed bg-muted border border-border p-4 rounded-[16px]">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-background/50 rounded-[24px] glass border border-border">
              <Star className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Chưa có đánh giá nào</h3>
              <p className="text-muted-foreground">Người bán này chưa nhận được đánh giá nào từ người mua.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
