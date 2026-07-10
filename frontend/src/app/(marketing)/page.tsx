'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Gavel, ShieldCheck, RefreshCw, Zap, Star, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

export default function Home() {
  const { openRegisterModal } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] opacity-20 blur-3xl rounded-full bg-gradient-to-tr from-primary to-primary/40 translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] opacity-20 blur-3xl rounded-full bg-gradient-to-tr from-primary/60 to-transparent -translate-x-1/2 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Hero Content */}
            <div className="flex flex-col items-start text-left max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-fade-in group hover:bg-primary/10 transition-colors cursor-pointer">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse group-hover:scale-150 transition-transform"></span>
                Nền tảng C2C thế hệ mới 2026
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl mb-6 leading-[1.1] relative">
                Trao giá trị mới <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%_auto] animate-gradient-x relative inline-block">
                  Cho món đồ cũ.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 mb-10 leading-relaxed max-w-xl">
                Nền tảng thanh lý và đấu giá đồ cũ thông minh hàng đầu. Tích hợp thanh toán Escrow an toàn tuyệt đối, bảo vệ 100% quyền lợi cho người mua và người bán.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1 rounded-xl">
                    Khám phá ngay <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/products/new" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-14 px-8 text-base border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all rounded-xl">
                    Đăng bán sản phẩm
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-4 text-sm text-neutral-500 font-medium">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center overflow-hidden`}>
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="mt-0.5">Được tin dùng bởi 10,000+ người dùng</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] animate-fade-in group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] transform rotate-3 scale-105 -z-10 transition-transform duration-700 group-hover:rotate-6"></div>
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/50 bg-white/50 backdrop-blur-sm transform transition-transform duration-700 group-hover:-rotate-2 group-hover:scale-[1.02]">
                <Image
                  src="/images/hero.png"
                  alt="Thriftly Platform Illustration"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-neutral-100 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Gavel className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Đấu giá thành công</p>
                  <p className="text-lg font-bold text-neutral-900">+50,000 phiên</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section (Real Data) */}
      <FeaturedProducts />

      {/* Stats/Logo Banner */}
      <section className="border-y border-neutral-100 bg-neutral-50/50 py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-bold text-neutral-400 uppercase tracking-widest mb-8">Được nhắc đến trên</p>
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <h3 className="text-2xl font-black tracking-tight text-neutral-900 hover:scale-110 transition-transform cursor-pointer">Tech<span className="text-primary">Crunch</span></h3>
            <h3 className="text-2xl font-black tracking-tight text-neutral-900 hover:scale-110 transition-transform cursor-pointer">Forbes</h3>
            <h3 className="text-2xl font-black tracking-tight text-neutral-900 hover:scale-110 transition-transform cursor-pointer">VN<span className="text-red-600">Express</span></h3>
            <h3 className="text-2xl font-black tracking-tight text-neutral-900 hover:scale-110 transition-transform cursor-pointer">Startup<span className="text-blue-600">Wheel</span></h3>
            <h3 className="text-2xl font-black tracking-tight text-neutral-900 hover:scale-110 transition-transform cursor-pointer">Gen<span className="text-emerald-600">Z</span></h3>
          </div>
        </div>
      </section>

      {/* Feature 1: Escrow (Image Right) */}
      <section className="py-24 lg:py-32 overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 flex flex-col items-start">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                Giao dịch an tâm tuyệt đối với <span className="text-primary">Escrow</span>.
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Tiền của bạn sẽ được giữ an toàn trên hệ thống cho đến khi bạn nhận được hàng và xác nhận hài lòng. Không còn nỗi lo lừa đảo khi mua đồ cũ qua mạng.
              </p>
              <ul className="space-y-5 mb-10">
                {[
                  'Thanh toán được giữ 100% an toàn trên ví trung gian.',
                  'Hoàn tiền lập tức nếu sản phẩm không đúng mô tả.',
                  'Giải quyết khiếu nại công bằng và minh bạch bởi đội ngũ admin.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3 mt-0.5 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/escrow">
                <Button variant="link" className="px-0 text-primary font-semibold text-lg hover:no-underline hover:opacity-80">
                  Tìm hiểu thêm về chính sách Escrow <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="order-1 lg:order-2 relative w-full h-[400px] sm:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 to-transparent z-10"></div>
              <Image
                src="/images/escrow.png"
                alt="Secure Escrow Payment"
                fill
                className="object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features Grid */}
      <section className="py-24 bg-neutral-50 border-y border-neutral-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 mb-6 tracking-tight">Hệ sinh thái toàn diện</h2>
            <p className="text-lg text-neutral-600 leading-relaxed">Thriftly cung cấp đầy đủ các công cụ thông minh giúp trải nghiệm mua bán đồ cũ của bạn trở nên chuyên nghiệp và tiện lợi chưa từng có.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-sm border border-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-300">
                <Gavel className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Đấu giá Live Stream</h3>
              <p className="text-neutral-600 leading-relaxed">Phòng đấu giá live kịch tính, kết nối qua WebSocket siêu tốc không độ trễ. Trải nghiệm cảm giác săn đồ hiếm với cộng đồng ngay tại nhà.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-sm border border-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-2xl flex items-center justify-center text-amber-600 mb-8 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Mua bán siêu tốc</h3>
              <p className="text-neutral-600 leading-relaxed">Không muốn chờ đợi? Tính năng &quot;Mua Ngay&quot; kết hợp bộ lọc thông minh giúp bạn tìm và sở hữu món đồ yêu thích chỉ trong chớp mắt.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-sm border border-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform duration-300">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Trao đổi 0 đồng</h3>
              <p className="text-neutral-600 leading-relaxed">Dọn dẹp tủ đồ bằng cách trao đổi ngang giá (Swap) với những thành viên khác mà không cần đụng đến tiền mặt. Kinh tế tuần hoàn đích thực.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 mb-6 tracking-tight">Cộng đồng nói gì?</h2>
            <p className="text-lg text-neutral-600 leading-relaxed">Hơn 10,000 người dùng đã thay đổi thói quen mua sắm cùng Thriftly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Hoàng Long', role: 'Người mua chuyên nghiệp', content: 'Từ ngày dùng Thriftly, tôi săn được rất nhiều đồ công nghệ hiếm với giá rẻ nhờ chức năng đấu giá siêu tốc.', rating: 5, avatar: '11' },
              { name: 'Minh Thư', role: 'Shop thời trang', content: 'Thanh toán Escrow của web quá xịn, bán đồ không sợ bị boom hàng. Tiền về ví rất nhanh và minh bạch.', rating: 5, avatar: '44' },
              { name: 'Thanh Tùng', role: 'Người sưu tầm', content: 'Giao diện mượt mà, cộng đồng thân thiện. Tính năng Swap (trao đổi) là thứ tôi mong chờ nhất ở Việt Nam.', rating: 4, avatar: '68' },
            ].map((review, i) => (
              <div key={i} className="bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100 relative">
                <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/10" />
                <div className="flex text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-neutral-300'}`} />
                  ))}
                </div>
                <p className="text-neutral-700 text-lg leading-relaxed mb-8 relative z-10 italic">
                  "{review.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={`https://i.pravatar.cc/100?img=${review.avatar}`} alt={review.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                  <div>
                    <div className="font-bold text-neutral-900">{review.name}</div>
                    <div className="text-sm text-neutral-500">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Sẵn sàng dọn dẹp tủ đồ của bạn?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Hàng ngàn người đang tìm kiếm những món đồ mà bạn không còn sử dụng. Đăng bán ngay hôm nay và nhận tiền thật vào ví!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={openRegisterModal} size="lg" className="w-full sm:w-auto h-14 px-10 text-lg bg-white text-primary hover:bg-neutral-100 font-bold rounded-xl shadow-xl transition-transform hover:-translate-y-1">
              Tạo tài khoản miễn phí
            </Button>
            <Link href="/products">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg border-white/50 bg-transparent text-white hover:bg-white/10 font-bold rounded-xl transition-colors">
                Khám phá thị trường
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
