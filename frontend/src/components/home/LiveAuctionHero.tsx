'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Timer, TrendingUp, Sparkles, Gavel } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { LiveBidsCounter } from './LiveBidsCounter';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useProducts } from '@/features/products/hooks/useProducts';

interface LiveAuctionHeroProps {
  product?: {
    id: string;
    title: string;
    currentHighestBid?: number;
    price: number;
    auctionEndTime?: string;
    imageUrl?: string;
    bidCount?: number;
  };
}

export function LiveAuctionHero({ product: initialProduct }: LiveAuctionHeroProps) {
  const { data } = useProducts(0, 5);

  const product = initialProduct || data?.content?.find((p: any) => p.sellType === 'AUCTION' && !p.isExpired);

  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (!product?.auctionEndTime) return;

    const calculateTimeLeft = () => {
      const end = new Date(product.auctionEndTime!).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft('Đã kết thúc');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [product?.auctionEndTime]);

  if (!product) {
    return (
      <section className="w-full h-screen relative flex items-center justify-center overflow-hidden snap-start bg-[#fdfbf7] dark:bg-zinc-900/10" ref={ref}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Subtle Fading Dot Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,#80808025_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
          
          {/* Animated Background Blobs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none"
          />

          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6 flex items-center justify-center gap-4"
            >
              <span className="w-12 h-px bg-primary/50"></span> 
              Nền tảng đấu giá trực tuyến
              <span className="w-12 h-px bg-primary/50"></span> 
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[6rem] font-serif font-medium tracking-tight text-foreground mb-8 leading-tight"
            >
              Trở thành chủ nhân <br />
              <span className="italic font-normal font-serif text-primary">
                những món đồ độc
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto font-medium"
            >
              Tham gia đấu giá trực tuyến với hệ thống WebSocket real-time. Cảm giác căng thẳng, kịch tính khi giá cả cập nhật từng giây.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
            >
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-base bg-foreground text-background hover:bg-foreground/90 transition-all rounded-full shadow-xl hover:shadow-2xl hover:scale-105">
                  Khám phá đấu giá
                </Button>
              </Link>
              <Link href="/products/new" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-base rounded-full border-border/60 hover:bg-muted/50 transition-all group">
                  Đăng bán sản phẩm <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="w-full h-screen relative flex items-center justify-center overflow-hidden snap-start bg-[#fdfbf7] dark:bg-zinc-900/10" ref={ref}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Subtle Fading Dot Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,#80808025_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
        
        {/* Animated Background Blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full translate-x-[20%] -translate-y-[20%] blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full -translate-x-[20%] translate-y-[20%] blur-3xl pointer-events-none"
        />

        <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-12 lg:px-16 relative z-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
            {/* Left Content (5 columns) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 flex flex-col items-start text-left"
            >
              <motion.p
                className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6 flex items-center gap-4"
              >
                <span className="w-8 h-px bg-primary/50"></span> Phiên đấu giá trực tiếp
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="text-5xl sm:text-6xl xl:text-7xl font-serif font-medium tracking-tight text-foreground mb-8 leading-tight"
              >
                {product.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-4 mb-8"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold text-sm">
                  <Timer className="w-4 h-4" />
                  {isExpired ? 'Đã kết thúc' : `Còn lại: ${timeLeft}`}
                </div>
                <LiveBidsCounter productId={product.id} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                className="mb-10"
              >
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Giá hiện tại
                </p>
                <p className="text-5xl sm:text-6xl font-black text-primary tracking-tighter">
                  {formatCurrency(product.currentHighestBid || product.price)}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <Link href={`/auctions/${product.id}`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-base bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                    Tham gia đấu giá ngay
                  </Button>
                </Link>
                <Link href="/products" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-base rounded-full border-border/60 hover:bg-muted/50 transition-all">
                    Xem thêm
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Image (7 columns) */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-7 flex justify-end relative mt-8 lg:mt-0 w-full"
              style={{ perspective: 1000 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -10 }}
                transition={{ duration: 0.4 }}
                className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-border/50 bg-white dark:bg-zinc-900 flex items-center justify-center"
              >
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  src={product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80&seed=${product.id}`}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Floating details card */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute bottom-6 left-6 right-6 bg-background/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-border/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Giá khởi điểm</p>
                      <p className="text-lg font-medium text-muted-foreground line-through">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-primary uppercase tracking-widest font-bold mb-1">Giá hiện tại</p>
                      <p className="text-2xl font-black text-foreground">
                        {formatCurrency(product.currentHighestBid || product.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {product.bidCount || 0} người đã đặt giá
                    </div>
                    <Link href={`/auctions/${product.id}`} className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 group">
                      Ra giá ngay <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
