import { Search, ShoppingBag, ShieldCheck, Star, ArrowRight, Zap, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Cách thức hoạt động | Thriftly',
  description: 'Hướng dẫn mua bán trên nền tảng Thriftly từ A đến Z.',
};

export default function HowItWorksPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative pt-8 pb-24 bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-900 to-slate-900"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <Link href="/">
            <Button variant="ghost" className="text-blue-200 hover:text-white hover:bg-accent hover:text-accent-foreground mb-8 rounded-full px-6 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" /> Về trang chủ
            </Button>
          </Link>
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-blue-500/20 text-blue-200 border-none mb-6 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md">
              Dành cho người mới
            </Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-6 tracking-tight">
              Cách thức hoạt động của <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">
                Thriftly
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl mx-auto">
              Giao dịch đồ cũ chưa bao giờ an tâm và dễ dàng đến thế. Khám phá quy trình 3 bước mua bán bảo mật tuyệt đối trên nền tảng của chúng tôi.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass bg-background/50 p-8 rounded-[2rem] border border-border shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">1. Khám phá & Chọn lựa</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Tìm kiếm hàng ngàn sản phẩm chất lượng từ cộng đồng. Bạn có thể mua trực tiếp hoặc tham gia các phiên đấu giá đầy kịch tính.
              </p>
              <ul className="space-y-3 text-muted-foreground font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Bộ lọc thông minh</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Đấu giá thời gian thực</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="glass bg-background/50 p-8 rounded-[2rem] border border-border shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8">
                <ShieldCheck className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">2. Thanh toán Escrow</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Tiền của bạn được nạp vào hệ thống và đóng băng lại. Người bán yên tâm giao hàng, người mua yên tâm nhận hàng.
              </p>
              <ul className="space-y-3 text-muted-foreground font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> An toàn 100%</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Chống lừa đảo, bom hàng</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="glass bg-background/50 p-8 rounded-[2rem] border border-border shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8">
                <Star className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">3. Nhận hàng & Đánh giá</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Kiểm tra sản phẩm khi nhận. Chỉ khi bạn xác nhận hài lòng, tiền mới được chuyển cho người bán. Cuối cùng, hãy để lại đánh giá nhé!
              </p>
              <ul className="space-y-3 text-muted-foreground font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Quyền kiểm tra hàng</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Hệ thống uy tín</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-black text-white mb-6">Sẵn sàng trải nghiệm Thriftly?</h2>
          <Link href="/products">
            <Button size="lg" className="bg-white text-primary hover:bg-neutral-100 rounded-full px-10 h-14 text-lg font-bold">
              Bắt đầu ngay <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
);
