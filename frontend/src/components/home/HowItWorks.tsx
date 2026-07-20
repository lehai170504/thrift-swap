'use client';

import { Card } from '@/components/ui/card';
import { Gavel, ArrowRightLeft, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function HowItWorks() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const steps = [
    {
      icon: Gavel,
      title: 'Chọn sản phẩm',
      description: 'Duyệt qua hàng ngàn sản phẩm đang diễn ra đấu giá với giá khởi điểm hấp dẫn.',
    },
    {
      icon: ArrowRightLeft,
      title: 'Đặt giá thầu',
      description: 'Nhập số tiền bạn sẵn sàng trả và theo dõi giá thầu real-time qua hệ thống.',
    },
    {
      icon: Clock,
      title: 'Theo dõi trực tiếp',
      description: 'Trải nghiệm sự kịch tính khi giá cập nhật từng giây trong phòng đấu giá.',
    },
    {
      icon: ShieldCheck,
      title: 'Thanh toán an toàn',
      description: 'Tiền được giữ an toàn trong ví Escrow, chỉ chuyển đi khi bạn đã xác nhận hàng.',
    }
  ];

  return (
    <section className="h-screen w-full snap-start relative flex flex-col justify-center overflow-hidden" ref={ref}>
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6 flex items-center justify-center gap-4"
          >
            <span className="w-8 h-px bg-primary/50"></span>
            Quy trình
            <span className="w-8 h-px bg-primary/50"></span>
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-serif font-medium text-foreground mb-6 tracking-tight leading-tight"
          >
            Cách thức hoạt động
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground leading-relaxed font-medium"
          >
            Trải nghiệm mua sắm minh bạch và chuyên nghiệp chỉ với 4 bước tiêu chuẩn.
          </motion.p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Continuous Line (Desktop) */}
          <div className="hidden lg:block absolute top-[48px] left-[10%] right-[10%] h-[1px] bg-border/80 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                className="relative group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-background border border-border/50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary group-hover:-translate-y-2 transition-all duration-500 shadow-sm relative z-10">
                  <step.icon className="w-10 h-10 text-foreground/70 group-hover:text-primary-foreground transition-colors duration-500" />
                </div>

                <div className="text-primary font-mono text-sm font-bold mb-4 tracking-[0.15em] opacity-60">BƯỚC 0{i + 1}</div>
                <h3 className="text-xl font-bold text-foreground mb-4 font-heading">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="mt-12 lg:mt-20 max-w-4xl mx-auto border-t border-border/40 pt-8 lg:pt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { value: '500+', label: 'Phiên đấu giá mỗi ngày' },
              { value: '99.9%', label: 'Giao dịch an toàn' },
              { value: '10k+', label: 'Người dùng tin tưởng' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center cursor-default"
              >
                <span className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-3">{stat.value}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
