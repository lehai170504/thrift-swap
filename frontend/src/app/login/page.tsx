/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { loginApi, googleLoginApi } from '@/lib/api/auth';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { loginSchema, LoginFormData } from '@/features/auth/schemas';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        router.replace('/admin');
      } else {
        router.replace('/products');
      }
    }
  }, [user, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      toast.success('Đăng nhập thành công!');
      login(data);
      router.push('/products');
    },
    onError: (error: any) => {
      const errorMsg = typeof error.response?.data === 'string'
        ? error.response?.data
        : error.response?.data?.message || error.message;
      toast.error('Đăng nhập thất bại: ' + errorMsg);
      setIsLoading(false);
    }
  });

  const onLogin = (data: LoginFormData) => {
    setIsLoading(true);
    loginMutation.mutate(data);
  };

  const googleLoginMutation = useMutation({
    mutationFn: googleLoginApi,
    onSuccess: (data) => {
      toast.success('Đăng nhập Google thành công!');
      login(data);
      router.push('/products');
    },
    onError: (error: any) => {
      toast.error('Đăng nhập Google thất bại: ' + (error.response?.data || error.message));
    }
  });

  const onGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      googleLoginMutation.mutate(credentialResponse.credential);
    }
  };

  const onGoogleLoginError = () => {
    toast.error('Không thể kết nối với Google.');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] opacity-20 blur-3xl rounded-full bg-gradient-to-tr from-primary to-primary/40 translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] opacity-20 blur-3xl rounded-full bg-gradient-to-tr from-primary/60 to-transparent -translate-x-1/2 translate-y-1/3 pointer-events-none"></div>

      <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-white/50">
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <Link href="/" className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
            <ShoppingBag className="h-8 w-8 text-primary" />
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 mb-2">
              Mừng trở lại!
            </h1>
            <p className="text-neutral-500">Đăng nhập để tiếp tục mua sắm</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onLogin)} className="space-y-5">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              {...register('email')}
              className={`h-14 bg-neutral-50 border-neutral-200 focus:bg-white text-base ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Mật khẩu</Label>
              <a href="#" className="text-sm font-medium text-primary hover:underline">Quên mật khẩu?</a>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register('password')}
                className={`h-14 bg-neutral-50 border-neutral-200 focus:bg-white text-base pr-12 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl shadow-lg text-lg font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5 mt-4"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Đăng nhập <ArrowRight size={20} className="ml-2" /></>
            )}
          </Button>
        </form>

        <div className="mt-8 flex items-center justify-center space-x-4">
          <div className="h-px bg-neutral-200 flex-1"></div>
          <span className="text-sm font-medium text-neutral-400">HOẶC ĐĂNG NHẬP VỚI</span>
          <div className="h-px bg-neutral-200 flex-1"></div>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={onGoogleLoginSuccess}
            onError={onGoogleLoginError}
            theme="outline"
            size="large"
            width="100%"
            text="continue_with"
            shape="rectangular"
          />
        </div>

        <div className="text-center mt-8">
          <p className="text-neutral-500 font-medium">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
