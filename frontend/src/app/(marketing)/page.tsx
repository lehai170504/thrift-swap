'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LiveAuctionHero } from "@/components/home/LiveAuctionHero";
import { UpdatedTestimonials } from "@/components/home/UpdatedTestimonials";
import { InteractiveEscrow } from "@/components/home/InteractiveEscrow";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { RecommendedProducts } from "@/components/home/RecommendedProducts";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function Home() {
  const { openRegisterModal } = useAuth();
  const [statsRef, statsInView] = useInView({ threshold: 0.5, triggerOnce: true });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.3, triggerOnce: true });

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section - Live Auction First */}
      <LiveAuctionHero />

      {/* Recommended Products Section (AI) */}
      <RecommendedProducts />

      {/* Featured Products Section (Live Auctions Only) */}
      <FeaturedProducts />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Escrow Section */}
      <InteractiveEscrow />

      {/* Stats/Logo Banner */}
      <section className="h-screen w-full snap-start relative flex flex-col justify-center overflow-hidden" ref={statsRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-10 flex items-center justify-center gap-4"
          >
            <span className="w-12 h-px bg-border"></span>
            Được tin tưởng & nhắc đến trên
            <span className="w-12 h-px bg-border"></span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center lg:justify-between items-center gap-10 opacity-70 grayscale hover:grayscale-0 transition-all duration-500 bg-background/60 backdrop-blur-xl border border-border/50 rounded-[2rem] p-10 sm:p-12 shadow-sm hover:shadow-xl"
          >
            {['TechCrunch', 'Forbes', 'VNExpress', 'StartupWheel', 'GenZ'].map((brand, i) => (
              <motion.h3
                key={brand}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading cursor-pointer"
              >
                {brand === 'TechCrunch' && <>Tech<span className="text-primary">Crunch</span></>}
                {brand === 'Forbes' && 'Forbes'}
                {brand === 'VNExpress' && <>VN<span className="text-red-500">Express</span></>}
                {brand === 'StartupWheel' && <>Startup<span className="text-blue-500">Wheel</span></>}
                {brand === 'GenZ' && <>Gen<span className="text-emerald-500">Z</span></>}
              </motion.h3>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <UpdatedTestimonials />

      {/* Call to Action CTA */}
      <section className="h-screen w-full snap-start relative flex flex-col justify-center overflow-hidden" ref={ctaRef}>
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={ctaInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-foreground text-background rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 0]
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-background/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />

            <div className="relative z-10 max-w-2xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-serif font-medium mb-6 leading-tight"
              >
                Sẵn sàng dọn dẹp<br />tủ đồ của bạn?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="text-lg text-background/80 mb-10 font-medium"
              >
                Hàng ngàn người đang tìm kiếm những món đồ mà bạn không còn sử dụng. Đăng bán ngay hôm nay và nhận tiền thật vào ví!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={openRegisterModal} size="lg" className="w-full sm:w-auto h-14 px-10 text-base bg-background text-foreground hover:bg-background/90 rounded-full shadow-lg">
                    Tạo tài khoản miễn phí
                  </Button>
                </motion.div>
                <Link href="/products" className="w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-base border-background/20 text-background hover:bg-white/10 rounded-full transition-colors group">
                      Khám phá đấu giá <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
