'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Gavel, ShieldCheck, RefreshCw, Zap, Users, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

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
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-fade-in">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                Nền tảng C2C thế hệ mới 2026
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl mb-6 leading-[1.1]">
                Trao giá trị mới <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                  Cho món đồ cũ.
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
                  alt="ThriftSwap Platform Illustration"
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

      {/* Stats/Logo Banner */}
      <section className="border-y border-neutral-100 bg-neutral-50/50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <h3 className="text-xl font-black tracking-tight text-neutral-900">Tech<span className="text-primary">Crunch</span></h3>
            <h3 className="text-xl font-black tracking-tight text-neutral-900">Forbes</h3>
            <h3 className="text-xl font-black tracking-tight text-neutral-900">VN<span className="text-red-600">Express</span></h3>
            <h3 className="text-xl font-black tracking-tight text-neutral-900">Startup<span className="text-blue-600">Wheel</span></h3>
            <h3 className="text-xl font-black tracking-tight text-neutral-900">Gen<span className="text-emerald-600">Z</span></h3>
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
      <section className="py-24 bg-neutral-50/80 border-y border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Hệ sinh thái toàn diện</h2>
            <p className="text-lg text-neutral-600">ThriftSwap cung cấp đầy đủ các công cụ để bạn mua bán, trao đổi đồ cũ một cách chuyên nghiệp và tiện lợi nhất.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Gavel className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Đấu giá thời gian thực</h3>
              <p className="text-neutral-600 leading-relaxed">Phòng đấu giá live kịch tính, kết nối qua WebSocket siêu tốc không độ trễ. Săn đồ hiếm chưa bao giờ thú vị đến thế.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Mua ngay lập tức</h3>
              <p className="text-neutral-600 leading-relaxed">Không muốn chờ đợi? Chức năng &quot;Mua Ngay&quot; giúp bạn sở hữu món đồ yêu thích chỉ với một cú click chuột.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <RefreshCw className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Tính năng Swap (Sắp ra mắt)</h3>
              <p className="text-neutral-600 leading-relaxed">Thanh lý đồ bằng cách trao đổi ngang giá với người khác mà không cần sử dụng tiền mặt. Tiết kiệm và linh hoạt.</p>
            </div>
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
