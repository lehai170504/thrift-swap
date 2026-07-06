/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProduct } from '@/features/products/hooks/useProducts';
import { useAuctionSocket } from '@/features/auction/hooks/useAuctionSocket';
import { useEndAuction } from '@/features/orders/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Clock, Gavel, History, TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react';
import { formatCurrency, preventInvalidNumberInput } from '@/lib/utils';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

function Countdown({ targetDate, onEnd }: { targetDate: string, onEnd?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('Đã kết thúc');
        if (onEnd) onEnd();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const hStr = hours.toString().padStart(2, '0');
      const mStr = minutes.toString().padStart(2, '0');
      const sStr = seconds.toString().padStart(2, '0');

      if (days > 0) {
        setTimeLeft(`${days} ngày ${hStr}:${mStr}:${sStr}`);
      } else {
        setTimeLeft(`${hStr}:${mStr}:${sStr}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span>{timeLeft || 'Đang tính...'}</span>;
}

export default function AuctionRoomPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const { data: product, isLoading, error } = useProduct(id);
  const { bids, isConnected, placeBid, currentHighestBid } = useAuctionSocket(id);
  const { mutate: endAuction } = useEndAuction();

  const [bidInput, setBidInput] = useState<string>('');
  const [realTimeHighest, setRealTimeHighest] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setRealTimeHighest(Math.max(product.price, currentHighestBid));
    }
  }, [product, currentHighestBid]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-primary font-medium">Đang vào phòng đấu giá...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-32 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white border border-neutral-100 rounded-3xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">Yêu cầu đăng nhập</h2>
          <p className="text-neutral-500 mb-8">Bạn cần đăng nhập để có thể tham gia vào phòng đấu giá trực tiếp.</p>
          <div className="flex flex-col gap-3">
            <Button onClick={openLoginModal} className="w-full bg-primary hover:bg-primary/90 h-12 text-base rounded-xl font-semibold text-white">
              Đăng nhập ngay
            </Button>
            <Button onClick={() => router.push(`/products/${id}`)} variant="ghost" className="text-neutral-500 hover:text-neutral-900">
              Quay lại trang sản phẩm
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product || product.sellType !== 'AUCTION') {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Lỗi truy cập</h2>
        <p className="text-neutral-500 mb-8">Sản phẩm không tồn tại hoặc không phải là sản phẩm đấu giá.</p>
        <Button onClick={() => router.push('/products')} variant="outline">Quay lại danh sách</Button>
      </div>
    );
  }

  const imageUrl = product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800&h=800&seed=${product.id}`;
  const minBid = realTimeHighest + 50000; // Step là 50k

  const handlePlaceBid = () => {
    const amount = Number(bidInput);
    if (isNaN(amount) || amount < minBid) {
      toast.error(`Giá ra tối thiểu phải là ${formatCurrency(minBid)}`);
      return;
    }
    placeBid(amount);
    setBidInput('');
    toast.success('Đã ra giá thành công!');
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-900 pb-24 font-sans">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/products/${id}`} className="inline-flex items-center text-neutral-500 hover:text-primary transition-colors font-medium">
            <ArrowLeft className="mr-2 w-4 h-4" /> Thoát phòng
          </Link>

          <div className="flex items-center gap-3">
            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
              {isConnected ? 'LIVE' : 'Đang kết nối...'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)] min-h-[600px]">

          {/* Left Column: Product Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/50">
                <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col">
                <Badge className="w-fit bg-primary hover:bg-primary mb-3 text-white border-none">Phòng đấu giá</Badge>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2 leading-tight">
                  {product.title}
                </h1>
                <p className="text-neutral-500 text-sm mb-6 line-clamp-2">{product.description}</p>

                <div className="mt-auto grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                    <div className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-1">Thời gian còn lại</div>
                    <div className="text-2xl font-bold text-neutral-900 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-primary" /> {product.auctionEndTime ? <Countdown targetDate={product.auctionEndTime} onEnd={() => endAuction(id)} /> : 'Đang tính...'}
                    </div>
                  </div>
                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                    <div className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-1">Người bán</div>
                    <div className="text-lg font-bold text-neutral-900 line-clamp-1">{product.sellerName}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bidding Control Panel */}
            <div className="bg-primary/10 rounded-3xl p-6 lg:p-10 border border-primary/80/20 backdrop-blur-xl flex-1 flex flex-col justify-center">
              <div className="text-center mb-8">
                <div className="text-primary/80 text-sm font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Giá cao nhất hiện tại
                </div>
                <div className="text-5xl md:text-7xl font-black text-primary tracking-tight">
                  {formatCurrency(realTimeHighest)}
                </div>
              </div>

              <div className="max-w-xl mx-auto w-full space-y-6">
                {user?.id === product.sellerId || user?.username === product.sellerName ? (
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center backdrop-blur-md">
                    <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-neutral-900 font-bold text-lg mb-1">Đây là sản phẩm của bạn</p>
                    <p className="text-primary/80 text-sm">Với tư cách là người đăng bán, bạn không thể tham gia trả giá cho sản phẩm này để đảm bảo tính công bằng.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">VNĐ</div>
                        <Input
                          type="number"
                          placeholder={`Tối thiểu ${formatCurrency(minBid)}`}
                          className="h-16 pl-14 pr-4 bg-white border-neutral-200 text-xl font-bold text-neutral-900 focus-visible:ring-primary focus-visible:border-primary rounded-2xl w-full"
                          value={bidInput}
                          onChange={(e) => setBidInput(e.target.value)}
                          onKeyDown={preventInvalidNumberInput}
                          min={minBid}
                          step="1"
                        />
                      </div>
                      <Button
                        size="lg"
                        className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-primary hover:bg-primary/100 text-white font-bold text-lg shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        disabled={!isConnected || !bidInput || Number(bidInput) < minBid}
                        onClick={handlePlaceBid}
                      >
                        <Gavel className="w-6 h-6 mr-2" /> Trả Giá
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <Button variant="outline" className="h-10 rounded-xl border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700" onClick={() => setBidInput(String(realTimeHighest + 50000))}>+ 50K</Button>
                      <Button variant="outline" className="h-10 rounded-xl border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700" onClick={() => setBidInput(String(realTimeHighest + 100000))}>+ 100K</Button>
                      <Button variant="outline" className="h-10 rounded-xl border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700" onClick={() => setBidInput(String(realTimeHighest + 500000))}>+ 500K</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Feed */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center">
                <History className="w-5 h-5 mr-2 text-primary" /> Lịch sử đấu giá
              </h3>
              <Badge variant="outline" className="bg-neutral-50 border-neutral-200 text-neutral-600">
                {bids.length} lượt
              </Badge>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
              {bids.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-3 opacity-50">
                  <AlertCircle className="w-12 h-12" />
                  <p>Chưa có lượt ra giá nào.</p>
                  <p className="text-sm">Hãy là người đầu tiên!</p>
                </div>
              ) : (
                bids.map((bid, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl flex items-center justify-between transition-all ${index === 0 ? 'bg-primary/5 border border-primary/20' : 'bg-neutral-50 border border-neutral-100'}`}
                  >
                    <div>
                      <div className="text-neutral-900 font-bold">{bid.bidderName}</div>
                      <div className="text-neutral-500 text-xs mt-1">
                        {bid.bidTime ? new Date(bid.bidTime).toLocaleTimeString() : new Date().toLocaleTimeString()}
                      </div>
                    </div>
                    <div className={`font-black ${index === 0 ? 'text-primary' : 'text-neutral-900'}`}>
                      {formatCurrency(bid.bidAmount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
