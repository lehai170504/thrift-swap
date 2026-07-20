'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('thriftly-cookie-consent');
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('thriftly-cookie-consent', 'accepted');
    window.dispatchEvent(new Event('cookie-consent-changed'));
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('thriftly-cookie-consent', 'declined');
    window.dispatchEvent(new Event('cookie-consent-changed'));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[100] max-w-sm"
        >
          <div className="bg-background/80 backdrop-blur-xl border border-border/60 shadow-2xl rounded-3xl p-6 relative overflow-hidden">
            {/* Background glowing effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={handleDecline}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1 tracking-tight">Sử dụng Cookie</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Chúng tôi sử dụng cookie để mang đến cho bạn trải nghiệm mua sắm đồ cũ tuyệt vời nhất trên Thriftly.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button
                onClick={handleAccept}
                className="w-full rounded-full font-semibold shadow-md"
              >
                Chấp nhận tất cả
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                className="w-full rounded-full bg-transparent"
              >
                Tùy chỉnh
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
