import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-background/50 glass p-8 rounded-[24px] shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] border border-white/10 text-center">
        <div className="w-20 h-20 bg-primary/20 rounded-[24px] border border-primary/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-6xl font-heading font-black text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-2">Oops! Không tìm thấy trang</h2>
        <p className="text-muted-foreground mb-8">
          Có vẻ như trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc tên đường dẫn bị sai.
        </p>
        <Link href="/">
          <Button className="w-full h-12 text-lg font-bold rounded-[24px] shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 transition-all">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
}
