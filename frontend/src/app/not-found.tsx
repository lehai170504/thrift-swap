import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-xl border border-neutral-100 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-6xl font-black text-neutral-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Oops! Không tìm thấy trang</h2>
        <p className="text-neutral-500 mb-8">
          Có vẻ như trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc tên đường dẫn bị sai.
        </p>
        <Link href="/">
          <Button className="w-full h-12 text-lg font-bold rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
}
