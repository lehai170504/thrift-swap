'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LiveAuctionHero } from "@/components/home/LiveAuctionHero";
import { RecommendedProducts } from "@/components/home/RecommendedProducts";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { InteractiveEscrow } from "@/components/home/InteractiveEscrow";
import { UpdatedTestimonials } from "@/components/home/UpdatedTestimonials";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const { openRegisterModal } = useAuth();
  const [ctaRef, ctaInView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <div className="w-full bg-background text-foreground">
      <LiveAuctionHero />

      <section className="py-16 bg-background">
        <RecommendedProducts />
      </section>

      <section className="py-20 bg-background border-t border-border/50">
        <FeaturedProducts />
      </section>

      <section id="how-it-works" className="py-20 bg-muted/30 border-t border-border/50 scroll-mt-24">
        <HowItWorks />
      </section>

      <section className="py-20 bg-background border-t border-border/50">
        <InteractiveEscrow />
      </section>

      <section className="py-20 bg-muted/30 border-t border-border/50">
        <UpdatedTestimonials />
      </section>

      <section className="py-24 bg-background border-t border-border/50 overflow-hidden" ref={ctaRef}>
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={ctaInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-slate-900 text-white rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 max-w-2xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white font-sans"
              >
                Sẵn sàng trải nghiệm<br />đấu giá thông minh?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-lg text-slate-300 mb-10 font-medium"
              >
                Hàng ngàn người đang tìm kiếm và bán những món đồ độc đáo mỗi ngày. Đăng ký ngay hôm nay để nhận ưu đãi phí giao dịch!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button onClick={openRegisterModal} size="lg" className="w-full sm:w-auto h-14 px-10 text-base bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-semibold shadow-lg shadow-blue-500/30">
                  Tạo tài khoản miễn phí
                </Button>
                <Link href="/products" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-base border-slate-700 text-white hover:bg-slate-800 rounded-xl transition-colors group">
                    Khám phá đấu giá <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
