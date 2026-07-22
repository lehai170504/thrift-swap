/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProduct, useDeleteProduct } from '@/features/products/hooks/useProducts';
import { useProductCheckout } from '@/features/products/hooks/useProductCheckout';
import { RelatedProducts } from '@/features/products/components/RelatedProducts';
import { ProductReviews } from '@/features/reviews/components/ProductReviews';
import { SellerInfoCard } from '@/features/products/components/SellerInfoCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Gavel, ArrowLeft, Clock, ShieldCheck, Star, MapPin, CalendarDays, Tag, Video, Trash2, Ticket, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useStartLiveSession } from '@/features/live/hooks/useLive';
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
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierState, setMagnifierState] = useState({ x: 0, y: 0, mouseX: 0, mouseY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { left, top, width, height } = elem.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMagnifierState({
      x,
      y,
      mouseX: e.clientX - left,
      mouseY: e.clientY - top
    });
  };

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
      onSuccess: () => router.push(`/auctions/${product?.id}`)
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
        <h2 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy sản phẩm</h2>
        <p className="text-muted-foreground mb-8">Sản phẩm này có thể đã bị xóa hoặc không tồn tại.</p>
        <Link href="/products">
          <Button variant="outline"><ArrowLeft className="mr-2 w-4 h-4" /> Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const imageUrl = product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800&h=800&seed=${product.id}`;

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 dark:bg-background">
      <div className="container mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/products" className="hover:text-primary transition-colors">Sản phẩm</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">{product.title}</span>
        </div>

        {/* Top Fold: Gallery & Main Info */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">

            {/* Left: Gallery */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div
                className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border cursor-crosshair group"
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {/* Magnifier Glass */}
                {showMagnifier && (
                  <div
                    className="absolute pointer-events-none border-2 border-primary/50 shadow-lg z-50 bg-white dark:bg-black/50"
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      left: `${magnifierState.mouseX - 100}px`,
                      top: `${magnifierState.mouseY - 100}px`,
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: '250%',
                      backgroundPosition: `${magnifierState.x}% ${magnifierState.y}%`,
                      backgroundRepeat: 'no-repeat',
                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.3)'
                    }}
                  />
                )}

                {product.sellType === 'AUCTION' && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground shadow-sm px-3 py-1 text-xs rounded-md">
                    <Gavel className="w-4 h-4 mr-1.5" /> Đấu giá
                  </Badge>
                )}
              </div>

              {product.videoUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-sm border border-border mt-2">
                  <video
                    src={product.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Right: Info & Actions */}
            <div className="lg:col-span-7 flex flex-col">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium text-foreground leading-tight mb-4">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium text-foreground">5.0</span>
                </div>
                <div className="w-[1px] h-4 bg-border" />
                <div>Đã bán <span className="font-medium text-foreground">0</span></div>
                <div className="w-[1px] h-4 bg-border" />
                <div className="flex items-center gap-1 text-primary cursor-pointer hover:underline">
                  Tố cáo sản phẩm
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 mb-6">
                <div className="text-sm text-muted-foreground mb-1">
                  {product.sellType === 'BUY_NOW' ? 'Giá bán' : (product.currentHighestBid && product.currentHighestBid > product.price ? 'Giá đấu hiện tại' : 'Giá khởi điểm')}
                </div>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(product.sellType === 'AUCTION' && product.currentHighestBid && product.currentHighestBid > product.price ? product.currentHighestBid : product.price)}
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm mb-8">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Vận chuyển từ:</span>
                  <span className="font-medium truncate">{product.location || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tình trạng:</span>
                  <span className="font-medium">{product.condition === 'NEW' ? 'Mới 100%' : product.condition === 'LIKE_NEW' ? 'Như mới' : 'Đã sử dụng'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ngày đăng:</span>
                  <span className="font-medium">{new Date(product.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] rounded-md font-normal">
                    {product.categoryName}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto">
                {!isSeller && (
                  <>
                    {product.sellType === 'BUY_NOW' ? (
                      <div className="space-y-6">
                        <div className="flex items-center gap-6">
                          <span className="text-sm text-muted-foreground">Số lượng</span>
                          <div className="flex items-center bg-background border border-border rounded-md">
                            <button
                              className="px-3 py-1.5 hover:bg-muted text-foreground transition-colors border-r border-border"
                              onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                              disabled={purchaseQuantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-12 text-center text-sm font-medium">{purchaseQuantity}</span>
                            <button
                              className="px-3 py-1.5 hover:bg-muted text-foreground transition-colors border-l border-border"
                              onClick={() => setPurchaseQuantity(Math.min(product.quantity || 1, purchaseQuantity + 1))}
                              disabled={purchaseQuantity >= (product.quantity || 1)}
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm text-muted-foreground">{product.quantity || 0} sản phẩm có sẵn</span>
                        </div>

                        {/* Vouchers Section */}
                        {availableVouchers && availableVouchers.length > 0 && (
                          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                            <h4 className="text-xs font-semibold text-primary mb-3 flex items-center gap-1">
                              <Ticket className="w-3.5 h-3.5" />
                              Mã giảm giá của Shop
                            </h4>
                            <div className="flex flex-col gap-2">
                              {availableVouchers.map(v => (
                                <div key={v.id} className="flex items-center justify-between bg-background border border-border p-3 rounded-lg shadow-sm">
                                  <div>
                                    <div className="font-semibold text-primary text-sm">{v.code}</div>
                                    <div className="text-xs text-muted-foreground">
                                      Giảm {v.type === 'PERCENTAGE' ? `${v.discountValue}%` : formatCurrency(v.discountValue)}
                                      {v.minOrderValue ? ` đơn từ ${formatCurrency(v.minOrderValue)}` : ''}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs bg-muted"
                                    onClick={() => setVoucherCode(v.code)}
                                  >
                                    Áp dụng
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Input
                            placeholder="Nhập mã ưu đãi"
                            value={voucherCode}
                            onChange={(e) => {
                              setVoucherCode(e.target.value);
                              if (!e.target.value) setAppliedVoucher(null);
                            }}
                            className="bg-background rounded-md h-12 flex-1"
                          />
                          <Button
                            variant="secondary"
                            onClick={handleApplyVoucher}
                            disabled={!voucherCode || buyNowMutation.isPending}
                            className="h-12 px-6 rounded-md font-medium"
                          >
                            Áp dụng
                          </Button>
                        </div>

                        {appliedVoucher && discountAmount > 0 && (
                          <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                            <Ticket className="w-4 h-4" /> Đã giảm {formatCurrency(discountAmount)}
                          </div>
                        )}

                        <div className="flex gap-4 pt-4 border-t border-border">
                          <Button
                            variant="outline"
                            className="flex-1 h-12 text-base font-medium rounded-md border-primary text-primary hover:bg-primary/5"
                            onClick={() => { }}
                          >
                            <ShoppingBag className="mr-2 w-5 h-5" /> Thêm vào giỏ
                          </Button>
                          <Button
                            onClick={handleBuyNow}
                            disabled={buyNowMutation.isPending || product.status !== 'ACTIVE' || (product.quantity || 0) <= 0}
                            className="flex-1 h-12 text-base font-medium rounded-md bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                          >
                            {buyNowMutation.isPending ? 'Đang xử lý...' : ((product.quantity || 0) > 0 ? 'Mua ngay' : 'Hết hàng')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-muted p-4 rounded-xl flex items-center justify-between border border-border">
                          <div className="flex items-center text-primary font-medium text-sm">
                            <Clock className="w-5 h-5 mr-2" />
                            {product.auctionEndTime ? `Hạn: ${new Date(product.auctionEndTime).toLocaleString()}` : 'Chưa rõ thời gian'}
                          </div>
                        </div>
                        <Link href={`/auctions/${product.id}`} className="block">
                          <Button className="w-full h-14 text-lg font-medium rounded-md bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                            <Gavel className="mr-2 w-5 h-5" /> Tham gia đấu giá
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}

                {isSeller && (
                  <div className="flex flex-row flex-wrap gap-3 mt-6 pt-6 border-t border-border">
                    {product.sellType === 'AUCTION' && (
                      <Button
                        variant="default"
                        className="px-6 h-10 rounded-md font-medium text-sm bg-red-600 hover:bg-red-700 text-white uppercase"
                        onClick={product.isLive ? () => router.push(`/auctions/${product.id}`) : handleStartLive}
                        disabled={!product.isLive && isStartingLive}
                      >
                        <Video className="mr-2 w-4 h-4" />
                        {product.isLive ? 'Vào phòng Live' : isStartingLive ? 'Đang tạo phòng Live...' : 'Bắt đầu Livestream'}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="px-6 h-10 rounded-md font-medium text-sm text-destructive border-destructive hover:bg-destructive/10 uppercase"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-2 w-4 h-4" /> Xóa sản phẩm
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seller Info Block */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 mb-6">
          <SellerInfoCard sellerName={product.sellerName} sellerId={product.sellerId} sellerAvatar={product.sellerAvatar} isSeller={isSeller} />
        </div>

        {/* Product Details & Description */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 md:p-8 mb-6">
          <div className="bg-muted px-4 py-3 rounded-md mb-6">
            <h2 className="text-lg font-medium uppercase text-foreground">Chi tiết sản phẩm</h2>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap max-w-4xl">
            {product.description || 'Không có mô tả cho sản phẩm này.'}
          </div>
        </div>

        {/* Reviews Section */}
        {product.sellerName && (
          <div id="reviews-section" className="mb-6">
            <ProductReviews sellerName={product.sellerName} sellerAvatar={product.sellerAvatar} />
          </div>
        )}

        {/* Related Products Section */}
        {product.categoryId && (
          <div className="mb-6">
            <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
          </div>
        )}

      </div>

      <MissingInfoModal
        isOpen={isMissingInfoModalOpen}
        onOpenChange={setIsMissingInfoModalOpen}
        onSuccess={handleMissingInfoSuccess}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xóa Sản Phẩm"
        description={
          <>Bạn có chắc chắn muốn xóa sản phẩm <strong>"{product.title}"</strong> không? Thao tác này không thể hoàn tác.</>
        }
        onConfirm={handleDelete}
        cancelText="Hủy"
        confirmText="Xóa"
        isLoading={deleteMutation.isPending}
        variant="destructive"
      />
    </div>
  );
}
