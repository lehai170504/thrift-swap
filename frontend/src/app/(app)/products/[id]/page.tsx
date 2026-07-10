/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
'use client';

import { useParams } from 'next/navigation';
import { useProduct } from '@/features/products/hooks/useProducts';
import { useProductCheckout } from '@/features/products/hooks/useProductCheckout';
import { RelatedProducts } from '@/features/products/components/RelatedProducts';
import { ProductReviews } from '@/features/reviews/components/ProductReviews';
import { SellerInfoCard } from '@/features/products/components/SellerInfoCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Gavel, ArrowLeft, Clock, ShieldCheck, User, ArrowRight, Star, MapPin, CalendarDays, Tag, Video } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useDeleteProduct } from '@/features/products/hooks/useProducts';
import { useStartLiveSession } from '@/features/live/hooks/useLive';
import { Trash2, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/features/chat/store/useChatStore';
import { MissingInfoModal } from '@/features/checkout/components/MissingInfoModal';
import { ProductDetailSkeleton } from '@/components/ui/loading-skeletons';

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const { data: product, isLoading, error } = useProduct(id);
  const deleteMutation = useDeleteProduct();
  const { mutate: startLiveSession, isPending: isStartingLive } = useStartLiveSession();
  const { openChatWith } = useChatStore();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isSeller = user?.id === product?.sellerId || user?.username === product?.sellerName;

  const {
    isMissingInfoModalOpen, setIsMissingInfoModalOpen, voucherCode, setVoucherCode,
    appliedVoucher, setAppliedVoucher, purchaseQuantity, setPurchaseQuantity,
    availableVouchers, discountAmount, finalPrice, handleApplyVoucher,
    handleBuyNow, handleMissingInfoSuccess, buyNowMutation, setPendingAction
  } = useProductCheckout(product, user, isSeller);



  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        router.push('/products');
      }
    });
  };



  const proceedStartLive = () => {
    startLiveSession(product?.id || '', {
      onSuccess: () => router.push(`/auctions/${product?.id}/live`)
    });
  };

  const handleStartLive = () => {
    if (!user?.phone || !user?.address) {
      setPendingAction(() => proceedStartLive);
      setIsMissingInfoModalOpen(true);
      return;
    }
    proceedStartLive();
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

              {product.videoUrl && (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-neutral-200/60 mt-4">
                  <video
                    src={product.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
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
                <SellerInfoCard sellerName={product.sellerName} sellerId={product.sellerId} isSeller={isSeller} />
              </div>

              <div className="mt-4 mb-8">
                <div className="text-sm text-neutral-500 font-medium mb-2">
                  {product.sellType === 'BUY_NOW' ? 'Giá bán' : (product.currentHighestBid && product.currentHighestBid > product.price ? 'Giá hiện hành' : 'Giá khởi điểm')}
                </div>
                <div className="text-4xl font-black text-primary tracking-tight">
                  {formatCurrency(product.sellType === 'AUCTION' && product.currentHighestBid && product.currentHighestBid > product.price ? product.currentHighestBid : product.price)}
                </div>
              </div>

              {/* Chi tiết sản phẩm */}
              <div className="bg-neutral-50 rounded-2xl p-5 mb-8 border border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-900 mb-4 uppercase tracking-wider">Chi tiết sản phẩm</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <div className="flex items-start text-sm">
                    <MapPin className="w-4 h-4 text-neutral-400 mr-2.5 mt-0.5 shrink-0" />
                    <span className="text-neutral-500 w-24 shrink-0">Khu vực:</span>
                    <span className="font-medium text-neutral-900 line-clamp-2">{product.location || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <CalendarDays className="w-4 h-4 text-neutral-400 mr-2.5 mt-0.5 shrink-0" />
                    <span className="text-neutral-500 w-24 shrink-0">Ngày đăng:</span>
                    <span className="font-medium text-neutral-900">{new Date(product.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <Tag className="w-4 h-4 text-neutral-400 mr-2.5 mt-0.5 shrink-0" />
                    <span className="text-neutral-500 w-24 shrink-0">Tình trạng:</span>
                    <span className="font-medium text-neutral-900">{product.condition === 'NEW' ? 'Mới 100%' : product.condition === 'LIKE_NEW' ? 'Như mới' : 'Đã sử dụng'}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <Star className="w-4 h-4 text-neutral-400 mr-2.5 mt-0.5 shrink-0" />
                    <span className="text-neutral-500 w-24 shrink-0">Danh mục:</span>
                    <span className="font-medium text-neutral-900">{product.categoryName}</span>
                  </div>
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
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-neutral-700">Số lượng ({product.quantity || 1} sẵn có)</span>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                              disabled={purchaseQuantity <= 1}
                            >
                              -
                            </Button>
                            <span className="font-semibold w-6 text-center">{purchaseQuantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setPurchaseQuantity(Math.min(product.quantity || 1, purchaseQuantity + 1))}
                              disabled={purchaseQuantity >= (product.quantity || 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        {availableVouchers && availableVouchers.length > 0 && (
                          <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mb-4">
                            <h4 className="text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
                              <Ticket className="w-4 h-4" />
                              Voucher của Shop
                            </h4>
                            <div className="flex flex-col gap-2">
                              {availableVouchers.map(v => (
                                <div key={v.id} className="flex items-center justify-between bg-white border border-orange-200/60 p-2.5 rounded-lg shadow-sm">
                                  <div>
                                    <div className="font-bold text-orange-600 text-sm">{v.code}</div>
                                    <div className="text-xs text-neutral-500 mt-0.5">
                                      Giảm {v.type === 'PERCENTAGE' ? `${v.discountValue}%` : formatCurrency(v.discountValue)}
                                      {v.minOrderValue ? ` cho đơn từ ${formatCurrency(v.minOrderValue)}` : ''}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
                                    onClick={() => {
                                      setVoucherCode(v.code);
                                      // Optional: auto apply
                                    }}
                                  >
                                    Dùng ngay
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Nhập mã giảm giá (nếu có)"
                            value={voucherCode}
                            onChange={(e) => {
                              setVoucherCode(e.target.value);
                              if (!e.target.value) setAppliedVoucher(null);
                            }}
                            className="bg-white"
                          />
                          <Button
                            variant="secondary"
                            onClick={handleApplyVoucher}
                            disabled={!voucherCode || buyNowMutation.isPending}
                          >
                            Áp dụng
                          </Button>
                        </div>
                        {appliedVoucher && discountAmount > 0 && (
                          <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100">
                            <Ticket className="w-4 h-4" />
                            <span>Đã giảm {formatCurrency(discountAmount)}</span>
                          </div>
                        )}
                        {appliedVoucher && (
                          <div className="flex justify-between items-center text-lg font-bold text-neutral-900 px-1 pb-1">
                            <span>Thành tiền:</span>
                            <span className="text-primary text-2xl">{formatCurrency(finalPrice)}</span>
                          </div>
                        )}
                        <Button
                          onClick={handleBuyNow}
                          disabled={buyNowMutation.isPending || product.status !== 'ACTIVE' || (product.quantity || 0) <= 0}
                          size="lg"
                          className="w-full h-14 text-lg bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/30"
                        >
                          <ShoppingBag className="mr-2 w-5 h-5" />
                          {buyNowMutation.isPending ? 'Đang xử lý...' : ((product.quantity || 0) > 0 ? 'Mua ngay an toàn' : 'Sản phẩm đã hết hàng')}
                        </Button>
                      </div>
                    ) : (
                      <Card className="border-primary/30 bg-primary/10/50 shadow-inner rounded-2xl">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center text-primary/90 font-medium">
                              <Clock className="w-5 h-5 mr-2" />
                              {product.auctionEndTime ? `Hạn: ${new Date(product.auctionEndTime).toLocaleString()}` : 'Chưa rõ thời gian'}
                            </div>
                          </div>
                          <Link href={`/auctions/${product.id}/live`}>
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
                    {product.sellType === 'AUCTION' && (
                      <Button
                        size="lg"
                        className="w-full h-14 text-lg mt-4 rounded-xl bg-red-600 hover:bg-red-700 animate-pulse hover:animate-none"
                        onClick={handleStartLive}
                        disabled={isStartingLive}
                      >
                        <Video className="mr-2 w-5 h-5" />
                        {isStartingLive ? 'Đang tạo phòng Live...' : '🔴 Bắt đầu Livestream'}
                      </Button>
                    )}
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
                  onSuccess={handleMissingInfoSuccess}
                />

                <p className="text-center text-xs text-neutral-400 mt-4 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  Giao dịch được bảo vệ bởi Thriftly Escrow
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Info & Reviews Section */}
        {product.sellerName && (
          <ProductReviews sellerName={product.sellerName} />
        )}

        {/* Related Products Section */}
        {product.categoryId && (
          <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
        )}
      </div>
    </div >
  );
}




