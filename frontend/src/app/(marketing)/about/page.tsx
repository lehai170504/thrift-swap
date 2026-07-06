import { Shield, RefreshCw, Handshake, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Về chúng tôi | ThriftSwap',
  description: 'Tìm hiểu về sứ mệnh và tầm nhìn của ThriftSwap - Nền tảng thanh lý và đấu giá đồ cũ hàng đầu.',
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-neutral-900 to-neutral-900"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none mb-6 px-4 py-1.5 rounded-full text-sm font-medium">
            Sứ mệnh của ThriftSwap
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Tái sinh giá trị <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Kết nối cộng đồng
            </span>
          </h1>
          <p className="text-lg text-neutral-400 mb-10 leading-relaxed">
            Chúng tôi tin rằng mọi món đồ đều có câu chuyện riêng và xứng đáng có cơ hội thứ hai. ThriftSwap ra đời để làm cho việc mua bán đồ cũ trở nên an toàn, minh bạch và thú vị hơn bao giờ hết.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-lg">
                Khám phá ngay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 mb-4">Giá trị cốt lõi</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto text-lg">Những nguyên tắc định hình cách chúng tôi xây dựng nền tảng và phục vụ cộng đồng.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">An toàn tuyệt đối</h3>
              <p className="text-neutral-500 leading-relaxed">
                Hệ thống thanh toán Escrow hiện đại giữ tiền an toàn cho đến khi bạn hài lòng với món đồ nhận được.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <RefreshCw className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Phát triển bền vững</h3>
              <p className="text-neutral-500 leading-relaxed">
                Kéo dài vòng đời sản phẩm, giảm thiểu rác thải và đóng góp vào nền kinh tế tuần hoàn bảo vệ môi trường.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <Handshake className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Giao dịch công bằng</h3>
              <p className="text-neutral-500 leading-relaxed">
                Cơ chế đấu giá minh bạch thời gian thực đảm bảo cả người mua và người bán đều nhận được giá trị tốt nhất.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Cộng đồng tin cậy</h3>
              <p className="text-neutral-500 leading-relaxed">
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
              <h2 className="text-3xl md:text-4xl font-black text-neutral-900">Câu chuyện của chúng tôi</h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                ThriftSwap bắt đầu từ một ý tưởng đơn giản: Làm thế nào để giải quyết những món đồ "bỏ thì thương, vương thì chật" một cách văn minh nhất?
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Nhận thấy những rủi ro trong giao dịch đồ cũ truyền thống (lừa đảo, bom hàng, ép giá), chúng tôi đã ứng dụng công nghệ <span className="font-bold text-primary">Thanh toán Escrow</span> và <span className="font-bold text-primary">Đấu giá thời gian thực</span> để định hình lại toàn bộ trải nghiệm mua bán đồ cũ tại Việt Nam.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-black text-primary mb-1">100K+</div>
                  <div className="text-sm text-neutral-500 font-medium">Sản phẩm tái chế</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary mb-1">0%</div>
                  <div className="text-sm text-neutral-500 font-medium">Lừa đảo giao dịch</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary mb-1">24/7</div>
                  <div className="text-sm text-neutral-500 font-medium">Hỗ trợ cộng đồng</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary mb-1">50K+</div>
                  <div className="text-sm text-neutral-500 font-medium">Thành viên tích cực</div>
                </div>
              </div>

              <div className="pt-8">
                <Link href="/about/contact">
                  <Button variant="outline" className="rounded-full px-8 h-12 text-base font-medium border-2 hover:bg-primary/5">
                    Liên hệ với ThriftSwap
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] bg-neutral-100 shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200"
                  alt="ThriftSwap Team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900">Cam kết môi trường</div>
                      <div className="text-sm text-neutral-500">Giảm thiểu 500 tấn CO2 mỗi năm</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-black mb-6">Sẵn sàng dọn dẹp tủ đồ của bạn?</h2>
          <p className="text-xl text-white/80 mb-10">Gia nhập cộng đồng ThriftSwap ngay hôm nay để biến đồ cũ thành tiền và nhường cơ hội thứ hai cho món đồ của bạn.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-primary hover:bg-neutral-100 rounded-full px-8 h-14 text-lg font-bold">
                Bắt đầu mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
