'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Gavel, ShieldCheck, RefreshCw, Zap, Star, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { RecommendedProducts } from "@/components/home/RecommendedProducts";

export default function Home() {
  const { openRegisterModal } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* Hero Section - Soft, Elegant "Typeform" Style */}
      <section className="pt-6 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {/* Main Card Container */}
        <div className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#fdfbf7] dark:bg-zinc-900/40 border border-border/40 min-h-[80vh] lg:min-h-[70vh] flex items-center shadow-sm">

          {/* Subtle Organic Background Shape */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full translate-x-[20%] -translate-y-[20%] blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full -translate-x-[20%] translate-y-[20%] blur-3xl pointer-events-none"></div>

          <div className="container mx-auto px-6 sm:px-12 lg:px-16 relative z-10 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">

              {/* Hero Content (Left) */}
              <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left">
                <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6">Nền tảng mua bán đồ cũ</p>

                <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-medium tracking-tight text-foreground mb-6 leading-[1.05] font-serif">
                  Khám phá <br />giá trị mới<br />
                  <span className="italic text-muted-foreground/80 font-normal">cho đồ cũ</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-md font-medium">
                  Trải nghiệm giao dịch đồ cũ an toàn và thông minh. An tâm tuyệt đối với hệ thống thanh toán trung gian Escrow.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link href="/products" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-foreground text-background hover:bg-foreground/90 transition-all rounded-full shadow-lg">
                      Khám phá ngay
                    </Button>
                  </Link>
                  <Link href="/products/new" className="w-full sm:w-auto">
                    <Button size="lg" variant="ghost" className="w-full sm:w-auto h-14 px-8 text-base hover:bg-black/5 dark:hover:bg-white/5 transition-all rounded-full">
                      Đăng bán sản phẩm <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hero Image / Mockup (Right) */}
              <div className="lg:col-span-6 xl:col-span-7 flex justify-end relative mt-8 lg:mt-0">
                {/* Floating Card Mockup */}
                <div className="relative w-full max-w-[650px] aspect-[16/10] lg:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-border/50 bg-background transform transition-transform hover:-translate-y-2 duration-700">
                  <Image
                    src="/images/hero.png"
                    alt="ThriftSwap Platform Illustration"
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Internal Floating UI Element to mimic the Typeform overlay card */}
                  <div className="absolute bottom-6 left-6 right-6 md:left-auto md:w-72 bg-background/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Đang đấu giá</p>
                    </div>
                    <p className="font-semibold text-foreground text-sm mb-4 truncate">Ghế xoay văn phòng Ergonomic</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[11px] text-muted-foreground uppercase font-semibold mb-1">Giá hiện tại</p>
                        <p className="font-bold text-xl text-foreground">1.500.000đ</p>
                      </div>
                      <Button size="sm" className="rounded-full h-9 px-5 text-xs bg-primary text-primary-foreground">Ra giá</Button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Recommended Products Section (AI) */}
      <RecommendedProducts />

      {/* Featured Products Section (Real Data) */}
      <FeaturedProducts />

      {/* Stats/Logo Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-[1000px]">
          <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-10">Được nhắc đến trên</p>
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <h3 className="text-2xl font-bold tracking-tight text-foreground font-heading">Tech<span className="text-primary">Crunch</span></h3>
            <h3 className="text-2xl font-bold tracking-tight text-foreground font-heading">Forbes</h3>
            <h3 className="text-2xl font-bold tracking-tight text-foreground font-heading">VN<span className="text-red-500">Express</span></h3>
            <h3 className="text-2xl font-bold tracking-tight text-foreground font-heading">Startup<span className="text-blue-500">Wheel</span></h3>
            <h3 className="text-2xl font-bold tracking-tight text-foreground font-heading">Gen<span className="text-emerald-500">Z</span></h3>
          </div>
        </div>
      </section>

      {/* Feature 1: Escrow (Image Right) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#fdfbf7] dark:bg-zinc-900/40 border border-border/40 p-8 md:p-16 lg:p-20 relative overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="order-2 lg:order-1 flex flex-col items-start">
              <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center text-primary mb-8 shadow-sm border border-border/50">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-foreground mb-6 leading-[1.1]">
                Giao dịch an tâm với <span className="text-primary">Escrow</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-medium">
                Tiền của bạn sẽ được giữ an toàn trên hệ thống cho đến khi bạn nhận được hàng và xác nhận hài lòng. Không còn nỗi lo lừa đảo khi mua đồ cũ qua mạng.
              </p>
              <ul className="space-y-5 mb-10">
                {[
                  'Thanh toán được giữ 100% an toàn trên ví trung gian.',
                  'Hoàn tiền lập tức nếu sản phẩm không đúng mô tả.',
                  'Giải quyết khiếu nại công bằng và minh bạch bởi đội ngũ admin.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="text-foreground/80 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/escrow">
                <Button variant="link" className="px-0 text-foreground font-semibold hover:no-underline group">
                  Tìm hiểu chính sách Escrow <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="order-1 lg:order-2 relative w-full h-[400px] sm:h-[500px] rounded-[2rem] overflow-hidden shadow-xl border border-border/50 bg-background group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Image
                src="/images/escrow.png"
                alt="Secure Escrow Payment"
                fill
                className="object-cover transform transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">Hệ sinh thái</p>
          <h2 className="text-3xl md:text-5xl font-serif font-medium text-foreground mb-6 tracking-tight">Công cụ toàn diện</h2>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">Trải nghiệm mua bán đồ cũ trở nên chuyên nghiệp, minh bạch và tiện lợi chưa từng có.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Live Stream */}
          <div className="lg:col-span-3 bg-[#fdfbf7] dark:bg-zinc-900/40 p-10 lg:p-12 rounded-[2.5rem] sm:rounded-[3rem] border border-border/40 hover:shadow-lg transition-all duration-500 group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center text-primary mb-8 border border-border/50 shadow-sm">
                <Gavel className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">Đấu giá trực tuyến</h3>
              <p className="text-muted-foreground leading-relaxed font-medium max-w-md">Tham gia các phòng đấu giá trực tiếp đầy kịch tính, tương tác thời gian thực không độ trễ. Trải nghiệm cảm giác săn đồ hiếm ngay tại nhà một cách chân thực nhất.</p>
            </div>
            <div className="mt-10 h-32 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/50 relative overflow-hidden flex items-center justify-center">
              <span className="text-muted-foreground/40 font-bold tracking-widest text-xs uppercase">Live Interface Preview</span>
            </div>
          </div>

          {/* Mua bán siêu tốc */}
          <div className="lg:col-span-2 bg-[#fdfbf7] dark:bg-zinc-900/40 p-10 lg:p-12 rounded-[2.5rem] sm:rounded-[3rem] border border-border/40 hover:shadow-lg transition-all duration-500 group flex flex-col">
            <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center text-amber-500 mb-8 border border-border/50 shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">Giao dịch siêu tốc</h3>
            <p className="text-muted-foreground leading-relaxed font-medium mb-auto">Không muốn chờ đợi? Tính năng "Mua Ngay" cùng bộ lọc AI thông minh giúp bạn tìm và sở hữu món đồ yêu thích chỉ trong chớp mắt.</p>
          </div>

          {/* Trao đổi 0 đồng */}
          <div className="lg:col-span-5 bg-[#fdfbf7] dark:bg-zinc-900/40 p-10 lg:p-12 rounded-[2.5rem] sm:rounded-[3rem] border border-border/40 hover:shadow-lg transition-all duration-500 group flex flex-col md:flex-row items-center gap-10">
            <div className="w-16 h-16 bg-background rounded-full flex-shrink-0 flex items-center justify-center text-emerald-500 border border-border/50 shadow-sm">
              <RefreshCw className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3 font-heading">Trao đổi vật phẩm (Swap)</h3>
              <p className="text-muted-foreground leading-relaxed font-medium max-w-3xl">Làm mới không gian sống bằng cách trao đổi ngang giá các món đồ với cộng đồng thành viên mà không cần giao dịch tiền mặt. Đóng góp tích cực vào nền kinh tế tuần hoàn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">Đánh giá</p>
          <h2 className="text-3xl md:text-5xl font-serif font-medium text-foreground mb-6 tracking-tight">Cộng đồng tin tưởng</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Hoàng Long', role: 'Người mua', content: 'Từ ngày dùng Thriftly, tôi săn được rất nhiều đồ công nghệ hiếm với giá rẻ nhờ chức năng đấu giá siêu tốc.', rating: 5, avatar: '11' },
            { name: 'Minh Thư', role: 'Chủ cửa hàng', content: 'Thanh toán Escrow của web quá xịn, bán đồ không sợ bị boom hàng. Tiền về ví rất nhanh và minh bạch.', rating: 5, avatar: '44' },
            { name: 'Thanh Tùng', role: 'Người sưu tầm', content: 'Giao diện mượt mà, cộng đồng thân thiện. Tính năng Swap (trao đổi) là thứ tôi mong chờ nhất ở Việt Nam.', rating: 4, avatar: '68' },
          ].map((review, i) => (
            <div key={i} className="bg-[#fdfbf7] dark:bg-zinc-900/40 p-10 rounded-[2.5rem] border border-border/40 hover:shadow-lg transition-all duration-500 flex flex-col relative">
              <Quote className="absolute top-8 right-8 w-10 h-10 text-primary/5" />
              <div className="flex text-amber-400 mb-6">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? 'fill-current' : 'text-muted/50'}`} />
                ))}
              </div>
              <p className="text-foreground/80 font-medium leading-relaxed mb-8 flex-grow relative z-10">
                "{review.content}"
              </p>
              <div className="flex items-center gap-4">
                <img src={`https://i.pravatar.cc/100?img=${review.avatar}`} alt={review.name} className="w-10 h-10 rounded-full object-cover border border-border/50" />
                <div>
                  <div className="font-bold text-sm text-foreground">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action CTA */}
      <section className="py-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="bg-foreground text-background rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20 opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-background/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 leading-tight">Sẵn sàng dọn dẹp<br />tủ đồ của bạn?</h2>
            <p className="text-lg text-background/80 mb-10 font-medium">
              Hàng ngàn người đang tìm kiếm những món đồ mà bạn không còn sử dụng. Đăng bán ngay hôm nay và nhận tiền thật vào ví!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={openRegisterModal} size="lg" className="w-full sm:w-auto h-14 px-10 text-base bg-background text-foreground hover:bg-background/90 rounded-full shadow-lg transition-transform hover:-translate-y-1">
                Tạo tài khoản miễn phí
              </Button>
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-base border-background/20 text-background hover:bg-white/10 rounded-full transition-colors">
                  Khám phá thị trường
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
