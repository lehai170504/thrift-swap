import { Shield, RefreshCw, Handshake, Heart, Target, TrendingUp, Users as UsersIcon, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-counter';

export const metadata = {
  title: 'Về chúng tôi | Thriftly',
  description: 'Tìm hiểu về sứ mệnh và tầm nhìn của Thriftly - Nền tảng thanh lý và đấu giá đồ cũ hàng đầu.',
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-background/50 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none mb-6 px-4 py-1.5 rounded-full text-sm font-medium">
            Sứ mệnh của Thriftly
          </Badge>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 tracking-tight">
            Tái sinh giá trị <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Kết nối cộng đồng
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Chúng tôi tin rằng mọi món đồ đều có câu chuyện riêng và xứng đáng có cơ hội thứ hai. Thriftly ra đời để làm cho việc mua bán đồ cũ trở nên an toàn, minh bạch và thú vị hơn bao giờ hết.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-14 text-lg">
                Khám phá ngay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-black text-foreground mb-4">Giá trị cốt lõi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Những nguyên tắc định hình cách chúng tôi xây dựng nền tảng và phục vụ cộng đồng.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass bg-background/50 p-8 rounded-3xl border border-border shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">An toàn tuyệt đối</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hệ thống thanh toán Escrow hiện đại giữ tiền an toàn cho đến khi bạn hài lòng với món đồ nhận được.
              </p>
            </div>

            <div className="glass bg-background/50 p-8 rounded-3xl border border-border shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                <RefreshCw className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Phát triển bền vững</h3>
              <p className="text-muted-foreground leading-relaxed">
                Kéo dài vòng đời sản phẩm, giảm thiểu rác thải và đóng góp vào nền kinh tế tuần hoàn bảo vệ môi trường.
              </p>
            </div>

            <div className="glass bg-background/50 p-8 rounded-3xl border border-border shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Handshake className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Giao dịch công bằng</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cơ chế đấu giá minh bạch thời gian thực đảm bảo cả người mua và người bán đều nhận được giá trị tốt nhất.
              </p>
            </div>

            <div className="glass bg-background/50 p-8 rounded-3xl border border-border shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all">
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Cộng đồng tin cậy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Xây dựng môi trường giao lưu lành mạnh với hệ thống đánh giá uy tín đa chiều.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-black text-foreground">Câu chuyện của chúng tôi</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Thriftly bắt đầu từ một ý tưởng đơn giản: Làm thế nào để giải quyết những món đồ "bỏ thì thương, vương thì chật" một cách văn minh nhất?
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nhận thấy những rủi ro trong giao dịch đồ cũ truyền thống (lừa đảo, bom hàng, ép giá), chúng tôi đã ứng dụng công nghệ <span className="font-bold text-primary">Thanh toán Escrow</span> và <span className="font-bold text-primary">Đấu giá thời gian thực</span> để định hình lại toàn bộ trải nghiệm mua bán đồ cũ tại Việt Nam.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-black text-primary mb-1"><AnimatedCounter end={120} suffix="K+" /></div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Sản phẩm tái sinh</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-primary mb-1"><AnimatedCounter end={0} suffix="%" /></div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Lừa đảo giao dịch</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-primary mb-1"><AnimatedCounter end={24} suffix="/7" /></div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Hỗ trợ cộng đồng</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-primary mb-1"><AnimatedCounter end={50} suffix="K+" /></div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Thành viên tích cực</div>
                </div>
              </div>

              <div className="pt-8">
                <Link href="/about/contact">
                  <Button variant="outline" className="rounded-full px-8 h-12 text-base font-medium border-2 hover:bg-primary/5">
                    Liên hệ với Thriftly
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg group">
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" alt="Đóng gói" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="relative rounded-3xl overflow-hidden aspect-square shadow-lg group">
                    <img src="https://images.unsplash.com/photo-1555529733-0e67056058e1?auto=format&fit=crop&q=80&w=800" alt="Giao tiếp" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative rounded-3xl overflow-hidden aspect-square shadow-lg group">
                    <img src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=800" alt="Cửa hàng" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg group">
                    <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800" alt="Môi trường" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-6 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-8 h-8 mb-2" />
                      <div className="font-bold">Cam kết môi trường</div>
                      <div className="text-sm text-muted-foreground">Giảm thiểu 500 tấn CO2 mỗi năm</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-background/80 text-foreground relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-black mb-6">Hành trình của chúng tôi</h2>
            <p className="text-muted-foreground text-lg">Từ một ý tưởng nhỏ trong quán cafe đến một hệ sinh thái đồ cũ an toàn nhất Việt Nam.</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Cột mốc dọc (Chỉ hiện trên desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-muted/80 -translate-x-1/2 rounded-full"></div>

            <div className="space-y-12">
              {[
                { year: '2023', title: 'Ý tưởng khởi nguồn', desc: 'Thriftly ra đời từ nhận thức về vấn nạn lừa đảo khi mua bán đồ cũ trên các diễn đàn mạng xã hội.', icon: Target },
                { year: '2024', title: 'Ra mắt tính năng Escrow', desc: 'Lần đầu tiên tích hợp hệ thống thanh toán trung gian an toàn tuyệt đối cho mô hình C2C tại Việt Nam.', icon: Shield },
                { year: '2025', title: 'Phát triển Đấu giá Live', desc: 'Nâng tầm trải nghiệm săn hàng độc lạ bằng công nghệ WebSocket, mang lại cảm giác kịch tính như đấu giá thực.', icon: TrendingUp },
                { year: '2026', title: 'Cộng đồng 50,000+ thành viên', desc: 'Trở thành nền tảng đáng tin cậy nhất, đóng góp vào việc giảm thiểu hàng ngàn tấn rác thải thời trang mỗi năm.', icon: Award },
              ].map((item, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center justify-between gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="w-full md:w-5/12 text-center md:text-left">
                    <div className={`md:hidden flex items-center justify-center w-16 h-16 bg-primary/20 text-primary rounded-full mb-4 mx-auto`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 mb-2 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                      {item.year}
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>{item.title}</h3>
                    <p className={`text-muted-foreground leading-relaxed ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>{item.desc}</p>
                  </div>

                  {/* Chấm tròn ở giữa */}
                  <div className="hidden md:flex w-2/12 justify-center relative">
                    <div className="w-12 h-12 bg-background border-4 border-primary rounded-full flex items-center justify-center z-10 shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  <div className="hidden md:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-background/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="glass bg-background/50 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-border flex flex-col md:flex-row items-center gap-10 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-shadow duration-300">
            <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 mx-auto md:mx-0 rounded-full overflow-hidden border-8 border-primary/10 shadow-inner relative group">
              <img
                src="/founder.jpg"
                alt="Nhà sáng lập"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            <div className="text-center md:text-left">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none mb-4 px-4 py-1.5 rounded-full text-sm font-medium">
                Nhà Sáng Lập (Solo Developer)
              </Badge>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-foreground mb-4">Chào bạn, tôi là Developer phía sau Thriftly 👋</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Thriftly được xây dựng và phát triển độc lập với một niềm đam mê duy nhất: Tạo ra một nền tảng giao dịch đồ cũ an toàn, minh bạch và hiện đại nhất cho người Việt. Từng dòng code, từng tính năng đều được tôi chăm chút tỉ mỉ nhằm mang lại trải nghiệm tốt nhất cho bạn.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Link href="/about/contact">
                  <Button className="rounded-full px-6 bg-muted/80 text-foreground hover:bg-secondary border border-border">
                    Trò chuyện cùng tôi
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-serif font-black mb-6">Sẵn sàng dọn dẹp tủ đồ của bạn?</h2>
          <p className="text-xl text-muted-foreground mb-10">Gia nhập cộng đồng Thriftly ngay hôm nay để biến đồ cũ thành tiền và nhường cơ hội thứ hai cho món đồ của bạn.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8 h-14 text-lg font-bold">
                Khám phá ngay
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
