'use client';

import { ShieldCheck, Lock, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function InteractiveEscrow() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const steps = [
    {
      icon: Lock,
      title: 'Nạp tiền vào ví',
      description: 'Chuyển tiền từ ngân hàng vào ví điện tử. Dữ liệu được mã hóa SSL 256-bit.',
    },
    {
      icon: KeyRound,
      title: 'Tạm giữ (Hold)',
      description: 'Khi bạn thắng đấu giá, tiền được giữ an toàn tại hệ thống Escrow trung gian.',
    },
    {
      icon: CheckCircle2,
      title: 'Nhả tiền (Release)',
      description: 'Tiền chỉ được chuyển cho người bán sau khi bạn xác nhận nhận hàng đúng mô tả.',
    }
  ];

  return (
    <section className="h-screen w-full snap-start relative flex flex-col justify-center overflow-hidden" ref={ref}>
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#fdfbf7] dark:bg-zinc-900/40 border border-border/40 p-6 lg:p-10 relative overflow-hidden shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-2 lg:order-1 flex flex-col items-start"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 flex items-center gap-4"
              >
                Thanh toán bảo mật
                <span className="w-8 h-px bg-primary/50"></span>
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-foreground mb-6 leading-tight"
              >
                Giao dịch an tâm với Escrow
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="text-base text-muted-foreground mb-6 leading-relaxed font-medium"
              >
                ThriftSwap là sàn đấu giá đầu tiên tại Việt Nam áp dụng hệ thống thanh toán trung gian chuẩn quốc tế.
                Tiền của bạn luôn được bảo vệ 100% cho đến khi nhận được hàng.
              </motion.p>

              <div className="space-y-4 mb-8 w-full">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-5 p-5 rounded-2xl hover:bg-muted/30 border border-transparent hover:border-border/50 transition-all duration-300 cursor-default group"
                  >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-background border border-border/60 shadow-sm group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                      <step.icon className="w-5 h-5 text-foreground/70 group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base text-foreground mb-1 font-heading group-hover:text-primary transition-colors">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-3 gap-4 mb-4 w-full border-t border-border/40 pt-4"
              >
                {[
                  { label: 'Hoàn tiền', value: '100%' },
                  { label: 'Xử lý', value: '< 24h' },
                  { label: 'Đánh giá', value: '4.9/5' }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-start cursor-default">
                    <span className="text-2xl font-serif font-medium text-foreground mb-1">{stat.value}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 1.1 }}
              >
                <Link href="/escrow">
                  <Button variant="link" className="px-0 text-foreground font-semibold hover:no-underline hover:text-primary transition-colors group">
                    Tìm hiểu chính sách Escrow <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-1 lg:order-2 relative w-full h-[300px] lg:h-[350px] xl:h-[400px] rounded-[2.5rem] overflow-hidden border border-border/50 bg-muted/20"
            >
              {/* Decorative Gradients */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

              {/* Mockup UI: Transaction Flow */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 z-20">
                <div className="w-full max-w-sm space-y-3 -mt-16">
                  {[
                    { title: "Khóa tiền an toàn", desc: "Đã chuyển vào ví trung gian", icon: Lock, status: "Hoàn tất", active: true, pulse: false },
                    { title: "Chờ xác nhận", desc: "Người mua đang kiểm tra hàng", icon: KeyRound, status: "Đang xử lý", active: true, pulse: true },
                    { title: "Giải ngân", desc: "Chuyển tiền cho người bán", icon: CheckCircle2, status: "Chờ", active: false, pulse: false }
                  ].map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 + idx * 0.2 }}
                      className={`p-3 sm:p-4 rounded-2xl border bg-background/80 backdrop-blur-xl shadow-sm transition-all duration-300 ${step.active ? 'border-primary/20 opacity-100' : 'border-border/50 opacity-60'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative ${step.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {step.pulse && (
                            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></span>
                          )}
                          <step.icon className="w-4 h-4 relative z-10" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <h4 className="font-bold text-foreground text-xs">{step.title}</h4>
                            <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${step.active && !step.pulse ? 'bg-primary/10 text-primary' : step.pulse ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                              {step.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
                className="absolute bottom-4 left-4 right-4 p-4 sm:p-6 rounded-[1.5rem] bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl z-30"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Bảo chứng giao dịch</p>
                    <p className="text-xl sm:text-2xl font-serif font-medium text-foreground">
                      Bảo vệ 100% tài sản
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                    <ShieldCheck className="w-7 h-7 text-emerald-500" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
