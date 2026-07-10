'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/features/auth/hooks/useAuthMutations';
import { loginSchema, LoginFormData } from '@/features/auth/schemas';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
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

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    setIsLoading(true);
    loginMutation.mutate(data, {
      onSuccess: (responseData) => {
        if (responseData.role !== 'ADMIN') {
          toast.error('Truy cập bị từ chối: Tài khoản không có quyền Admin!');
          setIsLoading(false);
          return;
        }
        toast.success('Đăng nhập Quản trị thành công!');
        login(responseData);
      },
      onError: (error: any) => {
        const errorMsg = typeof error.response?.data === 'string'
          ? error.response?.data
          : error.response?.data?.message || error.message;
        toast.error('Đăng nhập thất bại: ' + errorMsg);
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4 relative overflow-hidden">
      {/* Background decoration matching landing page hero */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] opacity-20 blur-3xl rounded-full bg-gradient-to-tr from-primary to-primary/40 translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] opacity-20 blur-3xl rounded-full bg-gradient-to-tr from-primary/60 to-transparent -translate-x-1/2 translate-y-1/3 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/50 backdrop-blur-sm relative z-10">
        <div className="p-8 sm:p-10">
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
              <ShieldAlert className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight text-neutral-900">
                Thriftly Admin
              </h1>
              <p className="text-neutral-500 text-sm mt-1 font-medium">
                Đăng nhập vào hệ thống quản trị
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-neutral-700">Email quản trị</Label>
              <Input
                id="email"
                placeholder="admin@thriftswap.com"
                {...register('email')}
                className={`h-12 focus-visible:ring-primary bg-neutral-50 border-neutral-200 rounded-xl ${errors.email ? 'border-red-500 bg-red-50 focus-visible:ring-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold text-neutral-700">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`h-12 pr-10 focus-visible:ring-primary bg-neutral-50 border-neutral-200 rounded-xl ${errors.password ? 'border-red-500 bg-red-50 focus-visible:ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all font-bold text-base mt-6 rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
            <a href="/" className="text-sm font-medium text-neutral-500 hover:text-primary transition-colors">
              &larr; Quay lại trang chủ User
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
