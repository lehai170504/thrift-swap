'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPassword } from '@/features/auth/hooks/useAuthMutations';
import { resetPasswordSchema, ResetPasswordFormData } from '@/features/auth/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ShoppingBag, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get('email') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const mutation = useResetPassword();

  const onSubmit = (data: ResetPasswordFormData) => {
    setIsLoading(true);
    mutation.mutate({
      email: defaultEmail,
      otp: data.otp,
      newPassword: data.newPassword
    }, {
      onSuccess: () => {
        toast.success('Mật khẩu của bạn đã được đặt lại thành công!');
        router.push('/login');
      },
      onError: (error: any) => {
        const errorMsg = typeof error.response?.data === 'string'
          ? error.response?.data
          : error.response?.data?.message || error.message;
        toast.error('Có lỗi xảy ra: ' + errorMsg);
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column - Image Banner */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1434389678369-182cb1451001?auto=format&fit=crop&q=80&w=1200")' }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/40 to-black/80" />

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
              ThriftSwap
            </span>
          </Link>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Mobile Background Elements (hidden on desktop) */}
        <div className="lg:hidden absolute top-0 right-0 -z-10 w-[600px] h-[600px] opacity-20 blur-3xl rounded-full bg-gradient-to-tr from-primary to-primary/40 translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
        <div className="lg:hidden absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] opacity-20 blur-3xl rounded-full bg-gradient-to-tr from-primary/60 to-transparent -translate-x-1/2 translate-y-1/3 pointer-events-none"></div>

        <div className="w-full max-w-[420px] relative z-10">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <Link href="/" className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shadow-sm">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </Link>
            <span className="text-2xl font-black tracking-tight text-neutral-900">
              Thrift<span className="text-primary">Swap</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mb-2">
              Đặt lại mật khẩu
            </h1>
            <p className="text-neutral-500 text-lg">Mã OTP đã được gửi đến: <strong className="text-neutral-700">{defaultEmail}</strong></p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2 group">
              <Label className="text-neutral-700 font-semibold group-focus-within:text-primary transition-colors">Mã xác nhận (OTP)</Label>
              <Input
                placeholder="Nhập mã 6 số"
                maxLength={6}
                {...register('otp')}
                className={`h-14 bg-neutral-50/50 border-neutral-200 focus:bg-white text-base text-center tracking-widest font-bold text-xl rounded-2xl transition-all duration-300 ${errors.otp ? 'border-red-500 ring-1 ring-red-500/20' : 'hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10'}`}
              />
              {errors.otp && <p className="text-red-500 text-sm font-medium animate-in slide-in-from-top-1 text-center">{errors.otp.message}</p>}
            </div>

            <div className="space-y-2 group">
              <Label className="text-neutral-700 font-semibold group-focus-within:text-primary transition-colors">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register('newPassword')}
                  className={`h-14 bg-neutral-50/50 border-neutral-200 focus:bg-white text-base pr-12 rounded-2xl transition-all duration-300 ${errors.newPassword ? 'border-red-500 ring-1 ring-red-500/20' : 'hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-sm font-medium animate-in slide-in-from-top-1">{errors.newPassword.message}</p>}
            </div>

            <div className="space-y-2 group">
              <Label className="text-neutral-700 font-semibold group-focus-within:text-primary transition-colors">Xác nhận mật khẩu mới</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`h-14 bg-neutral-50/50 border-neutral-200 focus:bg-white text-base pr-12 rounded-2xl transition-all duration-300 ${errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500/20' : 'hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm font-medium animate-in slide-in-from-top-1">{errors.confirmPassword.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/25 text-lg font-bold transition-all hover:shadow-xl hover:-translate-y-0.5 mt-6"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Đổi mật khẩu <ArrowRight size={20} className="ml-2" /></>
              )}
            </Button>
          </form>

          <div className="text-center mt-10">
            <p className="text-neutral-500 font-medium text-base">
              <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">
                Quay lại đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
