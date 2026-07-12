'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

function PayOSReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Đang xác thực giao dịch...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const query = searchParams.toString();
        if (!query) {
          setStatus('error');
          setMessage('Không tìm thấy thông tin giao dịch');
          return;
        }

        const res = await api.get(`/payment/payos/verify?${query}`);

        if (res.data.success) {
          setStatus('success');
          setMessage('Nạp tiền vào ví thành công!');
        } else {
          setStatus('error');
          setMessage(res.data.message || 'Giao dịch thất bại');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Có lỗi xảy ra khi xác thực giao dịch');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="w-full max-w-md bg-background/50 rounded-[24px] shadow-xl border border-white/10 glass p-8 text-center space-y-6">

      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <h2 className="text-xl font-bold text-foreground">Đang xử lý giao dịch</h2>
          <p className="text-muted-foreground text-sm">Vui lòng không đóng trình duyệt trong lúc này...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mb-2">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Thanh toán thành công!</h2>
          <p className="text-muted-foreground text-sm">{message}</p>
          <Button
            className="w-full mt-4 rounded-[24px] h-12 font-bold"
            onClick={() => router.push('/wallet')}
          >
            Quay về Ví điện tử
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-400 mb-2">
            <XCircle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Giao dịch thất bại</h2>
          <p className="text-muted-foreground text-sm">{message}</p>
          <Button
            variant="outline"
            className="w-full mt-4 rounded-[24px] h-12 font-bold text-foreground"
            onClick={() => router.push('/wallet')}
          >
            Quay lại
          </Button>
        </div>
      )}
    </div>
  );
}

export default function PayOSReturnPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <h2 className="text-xl font-bold text-foreground">Đang tải...</h2>
        </div>
      }>
        <PayOSReturnContent />
      </Suspense>
    </div>
  );
}
