'use client';

import { Card } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Review {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

const reviews: Review[] = [
  {
    name: 'Hoàng Long',
    role: 'Người mua',
    content: 'Từ ngày dùng Thriftly, tôi săn được rất nhiều đồ công nghệ hiếm với giá rẻ nhờ chức năng đấu giá siêu tốc. Đặc biệt là tính năng live streaming cực kỳ chân thực.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    name: 'Minh Thư',
    role: 'Chủ cửa hàng đồ cổ',
    content: 'Thanh toán Escrow của web quá xịn, bán đồ không sợ bị boom hàng. Tiền về ví rất nhanh và minh bạch. Đặc biệt là hệ thống giao hàng GHN tự động rất tiết kiệm thời gian.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=44'
  },
  {
    name: 'Thanh Tùng',
    role: 'Người sưu tầm đồ cổ',
    content: 'Giao diện mượt mà, cộng đồng thân thiện. Tính năng Swap (trao đổi) là thứ tôi mong chờ nhất ở Việt Nam. Giá trị thực sự của kinh tế tuần hoàn được thể hiện rõ nhất ở đây.',
    rating: 4,
    avatar: 'https://i.pravatar.cc/150?img=68'
  },
  {
    name: 'Anh Dũng',
    role: 'Sinh viên',
    content: 'Mình mua máy ảnh cũ đấu giá được giảm 60% so với giá mới. Escrow bảo vệ tiền hoàn hảo, nhận hàng đúng mô tả. Sẽ tiếp tục ủng hộ!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=32'
  },
  {
    name: 'Chị Hoa',
    role: 'Nội trợ',
    content: 'Bán đồ cũ của con không lo bị lừa. Có hệ thống audit log minh bạch, admin hỗ trợ giải quyết khiếu nại rất nhanh. Đáng tin cậy hơn cả sàn thương mại điện tử lớn.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=80'
  },
  {
    name: 'Anh Khánh',
    role: 'Kỹ sư công nghệ',
    content: 'Hệ thống WebSocket real-time cực kỳ mượt mà. Mình từng tham gia đấu giá và cảm nhận được sự căng thẳng cực kỳ thú vị khi giá tăng từng giây.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=59'
  }
];

export function UpdatedTestimonials() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="h-screen w-full snap-start relative flex flex-col justify-center overflow-hidden" ref={ref}>
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6 flex items-center justify-center gap-4"
          >
            <span className="w-8 h-px bg-primary/50"></span>
            Đánh giá
            <span className="w-8 h-px bg-primary/50"></span>
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-serif font-medium text-foreground mb-6 tracking-tight leading-tight"
          >
            Cộng đồng tin tưởng
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground leading-relaxed font-medium"
          >
            Hàng ngàn người dùng đã tin tưởng ThriftSwap cho các giao dịch mua bán đồ cũ của họ.
          </motion.p>
        </motion.div>

        <div className="relative overflow-hidden w-full py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none hidden sm:block" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none hidden sm:block" />

          <div className="flex animate-marquee gap-6 w-max hover:[animation-play-state:paused]">
            {[...reviews, ...reviews].map((review, i) => (
              <div key={i} className="w-[320px] sm:w-[400px] shrink-0 h-[350px]">
                <Card className="bg-background dark:bg-zinc-900/40 p-8 sm:p-10 rounded-[2rem] border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 flex flex-col relative group cursor-pointer h-full">
                  <div className="absolute top-8 right-8 text-primary/10 group-hover:text-primary/20 transition-colors duration-500">
                    <Quote className="w-10 h-10" />
                  </div>

                  <div className="flex gap-1 text-amber-500 mb-6">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? 'fill-current' : 'text-muted/50'}`} />
                    ))}
                  </div>

                  <p className="text-foreground/80 font-medium leading-relaxed mb-8 flex-grow relative z-10 text-base line-clamp-4">
                    "{review.content}"
                  </p>

                  <div className="flex items-center gap-4 mt-auto border-t border-border/50 pt-6">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border border-border shadow-sm group-hover:scale-105 transition-transform duration-300"
                    />
                    <div>
                      <div className="font-bold text-sm text-foreground">{review.name}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{review.role}</div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>


        </div>
      </div>
    </section>
  );
}
