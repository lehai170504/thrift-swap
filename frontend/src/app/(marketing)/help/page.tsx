import { HelpCircle, Search, Mail, MessageCircle, FileText, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Trung tâm trợ giúp | Thriftly',
  description: 'Hỗ trợ và giải đáp thắc mắc cho người dùng Thriftly.',
};

export default function HelpPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-8 pb-24 bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-neutral-900 to-neutral-900"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <Link href="/">
            <Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-white/10 mb-8 rounded-full px-6 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" /> Về trang chủ
            </Button>
          </Link>
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Chúng tôi có thể giúp gì cho bạn?
            </h1>
            <div className="relative max-w-xl mx-auto mt-8">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                className="w-full h-14 pl-12 pr-4 rounded-full bg-white text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-4 focus:ring-primary/30 text-lg shadow-xl"
                placeholder="Nhập từ khóa tìm kiếm..."
              />
              <Button className="absolute right-2 top-2 bottom-2 rounded-full px-6 bg-primary hover:bg-primary/90 text-white font-bold">
                Tìm kiếm
              </Button>
            </div>
          </div>
          </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-black text-neutral-900 mb-8 text-center">Chủ đề phổ biến</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:border-primary hover:shadow-md transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Tài khoản & Hồ sơ</h3>
              <p className="text-neutral-500 text-sm">Quản lý thông tin, đổi mật khẩu, xác thực tài khoản.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:border-primary hover:shadow-md transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Mua & Đấu giá</h3>
              <p className="text-neutral-500 text-sm">Cách thức đặt giá, quy định tham gia phòng live, mua ngay.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:border-primary hover:shadow-md transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Thanh toán Escrow</h3>
              <p className="text-neutral-500 text-sm">Hướng dẫn nạp rút ví, xử lý tiền đang giam, hoàn tiền.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-black text-neutral-900 mb-6">Bạn vẫn cần hỗ trợ trực tiếp?</h2>
          <p className="text-neutral-500 mb-10 text-lg">Đội ngũ chăm sóc khách hàng của Thriftly luôn sẵn sàng 24/7 để giải quyết vấn đề của bạn.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="h-14 rounded-full px-8 text-base border-2 hover:bg-neutral-50">
              <Mail className="w-5 h-5 mr-2" /> Gửi Email Hỗ Trợ
            </Button>
            <Button size="lg" className="h-14 rounded-full px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
              <MessageCircle className="w-5 h-5 mr-2" /> Chat với Nhân Viên
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

const ShoppingBag = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
);
