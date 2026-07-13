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
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-24"
    >
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <Link href="/products" className="group inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
          <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Khám phá thêm
        </Link>

        <div className="relative">
          {/* Subtle background glow */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative z-10">
            {/* Image Gallery (Sticky) */}
            <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-24">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative aspect-square rounded-[32px] overflow-hidden bg-muted border border-border p-2 shadow-lg cursor-crosshair group"
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-[24px]"
                />

                {/* Magnifier Glass */}
                {showMagnifier && (
                  <div
                    className="absolute pointer-events-none border-2 border-primary/50 shadow-[0_0_20px_rgba(var(--color-primary),0.3)] z-50 bg-black/5 backdrop-blur-sm"
                    style={{
                      width: '240px',
                      height: '240px',
                      borderRadius: '50%',
                      left: `${magnifierState.mouseX - 120}px`,
                      top: `${magnifierState.mouseY - 120}px`,
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: '250%', // Phóng to 2.5 lần
                      backgroundPosition: `${magnifierState.x}% ${magnifierState.y}%`,
                      backgroundRepeat: 'no-repeat',
                      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.5)'
                    }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none rounded-[32px]" />
                {product.sellType === 'AUCTION' && (
                  <Badge className="absolute top-6 left-6 bg-primary/90 text-primary-foreground shadow-lg border-none px-4 py-2 text-xs backdrop-blur-md rounded-full neon-glow">
                    <Gavel className="w-4 h-4 mr-1.5" /> Đang đấu giá
                  </Badge>
                )}
              </motion.div>

              {product.videoUrl && (
                <div className="relative aspect-video rounded-[32px] overflow-hidden bg-black shadow-lg p-2 border border-border">
                  <video
                    src={product.videoUrl}
                    controls
                    className="w-full h-full object-contain rounded-[24px]"
                  />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col lg:col-span-7 gap-6">

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-muted border border-border rounded-[32px] p-8 lg:p-10 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10 px-4 py-1.5 text-[10px] rounded-full">
                    {product.categoryName}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground border-border bg-muted px-4 py-1.5 text-[10px] rounded-full">
                    {product.condition === 'NEW' ? 'Mới 100%' : product.condition === 'LIKE_NEW' ? 'Như mới' : 'Đã sử dụng'}
                  </Badge>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-foreground leading-[1.1]">
                  {product.title}
                </h1>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-muted p-8 lg:p-10 rounded-[32px] border border-border flex flex-col justify-center"
                >
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-3">
                    {product.sellType === 'BUY_NOW' ? 'Giá bán chính thức' : (product.currentHighestBid && product.currentHighestBid > product.price ? 'Giá đấu hiện tại' : 'Giá khởi điểm')}
                  </div>
                  <div className="text-5xl font-black text-primary tracking-tighter drop-shadow-[0_0_15px_rgba(var(--color-primary),0.5)]">
                    {formatCurrency(product.sellType === 'AUCTION' && product.currentHighestBid && product.currentHighestBid > product.price ? product.currentHighestBid : product.price)}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-muted p-8 lg:p-10 rounded-[32px] border border-border flex flex-col justify-center"
                >
                  <SellerInfoCard sellerName={product.sellerName} sellerId={product.sellerId} isSeller={isSeller} />
                </motion.div>
              </div>

              {/* Chi tiết sản phẩm */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-muted border border-border rounded-[24px] p-6 flex flex-col gap-3 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Khu vực</div>
                    <div className="font-bold text-foreground text-sm line-clamp-2">{product.location || 'Chưa cập nhật'}</div>
                  </div>
                </div>
                <div className="bg-muted border border-border rounded-[24px] p-6 flex flex-col gap-3 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <CalendarDays className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Ngày đăng</div>
                    <div className="font-bold text-foreground text-sm">{new Date(product.createdAt).toLocaleDateString('vi-VN')}</div>
                  </div>
                </div>
                <div className="bg-muted border border-border rounded-[24px] p-6 flex flex-col gap-3 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Tag className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Tình trạng</div>
                    <div className="font-bold text-foreground text-sm">{product.condition === 'NEW' ? 'Mới 100%' : product.condition === 'LIKE_NEW' ? 'Như mới' : 'Đã sử dụng'}</div>
                  </div>
                </div>
                <div className="bg-muted border border-border rounded-[24px] p-6 flex flex-col gap-3 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Star className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Danh mục</div>
                    <div className="font-bold text-foreground text-sm">{product.categoryName}</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-muted border border-border rounded-[32px] p-8 lg:p-10"
              >
                <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-8 h-[1px] bg-primary" /> Mô tả
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">{product.description}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-auto"
              >
                {!isSeller && (
                  <>
                    {product.sellType === 'BUY_NOW' ? (
                      <div className="space-y-6 bg-muted p-8 lg:p-10 rounded-[32px] border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-foreground">Số lượng ({product.quantity || 1} sẵn có)</span>
                          <div className="flex items-center gap-3 bg-muted/80 rounded-full border border-border p-1">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="rounded-full hover:bg-secondary text-foreground"
                              onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                              disabled={purchaseQuantity <= 1}
                            >
                              -
                            </Button>
                            <span className="font-bold w-8 text-center text-sm">{purchaseQuantity}</span>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="rounded-full hover:bg-secondary text-foreground"
                              onClick={() => setPurchaseQuantity(Math.min(product.quantity || 1, purchaseQuantity + 1))}
                              disabled={purchaseQuantity >= (product.quantity || 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        {availableVouchers && availableVouchers.length > 0 && (
                          <div className="bg-primary/10 border border-primary/20 rounded-[24px] p-6">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                              <Ticket className="w-4 h-4" />
                              Voucher của Shop
                            </h4>
                            <div className="flex flex-col gap-3">
                              {availableVouchers.map(v => (
                                <div key={v.id} className="flex items-center justify-between bg-muted border border-border p-4 rounded-[16px]">
                                  <div>
                                    <div className="font-bold text-primary text-sm mb-1">{v.code}</div>
                                    <div className="text-xs text-muted-foreground">
                                      Giảm {v.type === 'PERCENTAGE' ? `${v.discountValue}%` : formatCurrency(v.discountValue)}
                                      {v.minOrderValue ? ` cho đơn từ ${formatCurrency(v.minOrderValue)}` : ''}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-full text-[10px] bg-muted border-border"
                                    onClick={() => setVoucherCode(v.code)}
                                  >
                                    Dùng ngay
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-3">
                          <Input
                            placeholder="Nhập mã giảm giá (nếu có)"
                            value={voucherCode}
                            onChange={(e) => {
                              setVoucherCode(e.target.value);
                              if (!e.target.value) setAppliedVoucher(null);
                            }}
                            className="bg-muted border-border rounded-full px-6 h-14 text-foreground"
                          />
                          <Button
                            variant="secondary"
                            onClick={handleApplyVoucher}
                            disabled={!voucherCode || buyNowMutation.isPending}
                            className="h-14 rounded-full px-8 bg-muted/80 text-foreground hover:bg-secondary"
                          >
                            Áp dụng
                          </Button>
                        </div>
                        {appliedVoucher && discountAmount > 0 && (
                          <div className="flex items-center gap-2 p-4 bg-primary/20 text-primary rounded-[20px] text-sm font-bold border border-primary/30">
                            <Ticket className="w-4 h-4" />
                            <span>Đã giảm {formatCurrency(discountAmount)}</span>
                          </div>
                        )}
                        {appliedVoucher && (
                          <div className="flex justify-between items-center text-lg font-bold text-foreground px-2 pb-2">
                            <span className="text-xs uppercase tracking-widest">Thành tiền:</span>
                            <span className="text-primary text-3xl font-black drop-shadow-[0_0_10px_rgba(var(--color-primary),0.5)]">{formatCurrency(finalPrice)}</span>
                          </div>
                        )}
                        <Button
                          onClick={handleBuyNow}
                          disabled={buyNowMutation.isPending || product.status !== 'ACTIVE' || (product.quantity || 0) <= 0}
                          size="lg"
                          className="w-full rounded-full h-16 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                        >
                          <ShoppingBag className="mr-2 w-5 h-5" />
                          {buyNowMutation.isPending ? 'Đang xử lý...' : ((product.quantity || 0) > 0 ? 'Mua ngay an toàn' : 'Sản phẩm đã hết hàng')}
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-muted rounded-[32px] overflow-hidden border border-border hover:bg-accent hover:text-accent-foreground transition-colors">
                        <div className="p-8 lg:p-10 relative">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center text-primary font-bold tracking-widest text-xs uppercase">
                              <Clock className="w-5 h-5 mr-2 animate-pulse" />
                              {product.auctionEndTime ? `Hạn: ${new Date(product.auctionEndTime).toLocaleString()}` : 'Chưa rõ thời gian'}
                            </div>
                          </div>
                          <Link href={`/auctions/${product.id}/live`} className="block">
                            <Button size="lg" className="w-full rounded-[24px] h-16 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                              <Gavel className="mr-2 w-5 h-5" /> Tham gia phòng đấu giá
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {isSeller && (
                  <div className="space-y-4 bg-muted p-8 lg:p-10 rounded-[32px] border border-border mt-6">
                    {product.sellType === 'AUCTION' && (
                      <Button
                        size="lg"
                        variant="default"
                        className="w-full rounded-full h-16 text-lg font-bold bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                        onClick={handleStartLive}
                        disabled={isStartingLive}
                      >
                        <Video className="mr-2 w-5 h-5" />
                        {isStartingLive ? 'Đang tạo phòng Live...' : 'Bắt đầu Livestream'}
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="lg"
                      className="w-full rounded-full h-16 text-lg font-bold"
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
                  </div>
                )}

                <MissingInfoModal
                  isOpen={isMissingInfoModalOpen}
                  onOpenChange={setIsMissingInfoModalOpen}
                  onSuccess={handleMissingInfoSuccess}
                />

                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-8 flex items-center justify-center opacity-70">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Giao dịch được bảo vệ bởi Thriftly Escrow
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Seller Info & Reviews Section */}
        {product.sellerName && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-16"
          >
            <ProductReviews sellerName={product.sellerName} />
          </motion.div>
        )}

        {/* Related Products Section */}
        {product.categoryId && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-16"
          >
            <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}




