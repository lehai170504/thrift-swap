'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('thriftly-announcement-dismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('thriftly-announcement-dismissed', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-[60] bg-gradient-to-r from-violet-600 via-primary to-blue-600 overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[100px] -left-[100px] w-[200px] h-[200px] bg-white/20 blur-3xl rounded-full mix-blend-overlay animate-pulse" />
            <div className="absolute top-[50px] right-[10%] w-[150px] h-[150px] bg-white/20 blur-3xl rounded-full mix-blend-overlay animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto px-4 py-2.5 sm:py-3 relative flex items-center justify-center text-center">
            <div className="flex items-center flex-wrap justify-center gap-x-3 gap-y-1 text-sm sm:text-base font-medium text-white pr-8">
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Mới
              </span>
              <span>
                Thriftly Mega Sale! Nhập mã <strong className="bg-white text-primary px-1.5 py-0.5 rounded shadow-sm mx-1 font-bold">THRIFTLY26</strong> để giảm 50% phí hoa hồng.
              </span>
              <Link
                href="/products"
                className="inline-flex items-center gap-1 font-bold underline underline-offset-4 hover:text-white/80 transition-colors"
                onClick={handleDismiss}
              >
                Khám phá ngay <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <button
              onClick={handleDismiss}
              className="absolute right-4 p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
