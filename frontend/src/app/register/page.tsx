/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { registerApi, googleLoginApi, loginApi } from '@/lib/api/auth';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { registerSchema, RegisterFormData } from '@/features/auth/schemas';
import { useCategories } from '@/features/products/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CategoryIcon } from '@/components/ui/category-icon';
import { Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const { data: categories } = useCategories();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regStep, setRegStep] = useState(1);
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        router.replace('/admin');
      } else {
        router.replace('/products');
      }
    }
  }, [user, router]);

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { interests: [] }
  });

  const selectedInterests = watch('interests') || [];

  const toggleInterest = (categoryId: string) => {
    const current = [...selectedInterests];
    if (current.includes(categoryId)) {
      setValue('interests', current.filter(id => id !== categoryId));
    } else {
      setValue('interests', [...current, categoryId]);
    }
  };

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data);
      router.push('/products');
    }
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (_, variables) => {
      toast.success('Đăng ký thành công! Đang tự động đăng nhập...');
      loginMutation.mutate({ email: variables.email, password: variables.password });
    },
    onError: (error: any) => {
      const errorMsg = typeof error.response?.data === 'string'
        ? error.response?.data
        : error.response?.data?.message || error.message;
      toast.error('Đăng ký thất bại: ' + errorMsg);
      setIsLoading(false);
      setRegStep(1);
    }
  });

  const onRegister = (data: RegisterFormData) => {
    setIsLoading(true);
    registerMutation.mutate(data);
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

  const handleNextStep = async () => {
    let isValid = false;
    if (regStep === 1) {
      isValid = await trigger(['email', 'username', 'password', 'confirmPassword']);
    } else if (regStep === 2) {
      isValid = await trigger(['fullName', 'phone', 'address']);
    }
    if (isValid) setRegStep(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Full-Screen Registration Form */}
      <div className="w-full flex flex-col relative overflow-hidden bg-white">
        {/* Header Branding */}
        <div className="p-6 sm:pt-10 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-neutral-900">Thrift<span className="text-primary">Swap</span></span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-12 xl:p-20 relative">
          <div className="max-w-4xl mx-auto relative h-full flex flex-col justify-center min-h-[500px] overflow-x-hidden">

            {/* Header */}
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">Tạo tài khoản mới</h2>
              <p className="text-neutral-500">
                {regStep === 1 && "Nhập thông tin cơ bản để bắt đầu."}
                {regStep === 2 && "Một vài thông tin liên hệ của bạn."}
                {regStep === 3 && "Bạn thường quan tâm đến loại sản phẩm nào?"}
              </p>
            </div>

            {/* Stepper */}
            <div className="flex justify-center items-center gap-2 mb-10">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-500 ${regStep === step
                    ? 'bg-primary text-white shadow-md scale-110'
                    : regStep > step
                      ? 'bg-primary/20 text-primary'
                      : 'bg-neutral-100 text-neutral-400'
                    }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-500 ${regStep > step ? 'bg-primary/50' : 'bg-neutral-100'}`} />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onRegister)} className="relative w-full overflow-hidden pb-4">
              <div
                className="flex w-[300%] transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${(regStep - 1) * (100 / 3)}%)` }}
              >
                {/* Step 1: Account Info */}
                <div className="w-1/3 px-2 h-full">
                  <div className="max-w-md mx-auto space-y-5">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="Nhập địa chỉ email" {...register('email')} className={`h-12 bg-neutral-50 border-neutral-200 focus:bg-white ${errors.email ? 'border-red-500' : ''}`} />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Tên đăng nhập</Label>
                      <Input placeholder="Tên hiển thị duy nhất" {...register('username')} className={`h-12 bg-neutral-50 border-neutral-200 focus:bg-white ${errors.username ? 'border-red-500' : ''}`} />
                      {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Mật khẩu</Label>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...register('password')} className={`h-12 bg-neutral-50 border-neutral-200 focus:bg-white pr-10 ${errors.password ? 'border-red-500' : ''}`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Xác nhận</Label>
                        <div className="relative">
                          <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...register('confirmPassword')} className={`h-12 bg-neutral-50 border-neutral-200 focus:bg-white pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`} />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Personal Info */}
                <div className="w-1/3 px-2 h-full">
                  <div className="max-w-md mx-auto space-y-5">
                    <div className="space-y-2">
                      <Label>Họ và tên</Label>
                      <Input placeholder="Vd: Nguyễn Văn A" {...register('fullName')} className={`h-12 bg-neutral-50 border-neutral-200 focus:bg-white ${errors.fullName ? 'border-red-500' : ''}`} />
                      {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Số điện thoại</Label>
                      <Input placeholder="Vd: 0912345678" {...register('phone')} className={`h-12 bg-neutral-50 border-neutral-200 focus:bg-white ${errors.phone ? 'border-red-500' : ''}`} />
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Địa chỉ giao hàng</Label>
                      <Input placeholder="Nhập địa chỉ nhận hàng mặc định" {...register('address')} className={`h-12 bg-neutral-50 border-neutral-200 focus:bg-white ${errors.address ? 'border-red-500' : ''}`} />
                      {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Step 3: Categories */}
                <div className="w-1/3 px-2 h-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-2">
                    {categories?.map((cat) => {
                      const isSelected = selectedInterests.includes(cat.id);
                      return (
                        <div
                          key={cat.id}
                          onClick={() => toggleInterest(cat.id)}
                          className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${isSelected
                            ? 'border-primary bg-primary/5 shadow-sm scale-[1.02]'
                            : 'border-neutral-100 bg-white hover:border-primary/40 hover:bg-neutral-50'
                            }`}
                        >
                          <CategoryIcon name={cat.icon} className={`w-8 h-8 mb-3 transition-colors ${isSelected ? 'text-primary' : 'text-neutral-400 group-hover:text-primary/70'}`} />
                          <span className={`text-sm font-semibold text-center transition-colors ${isSelected ? 'text-primary' : 'text-neutral-700'}`}>
                            {cat.name}
                          </span>
                          {isSelected && (
                            <div className="absolute top-3 right-3 text-primary animate-in zoom-in duration-300 shadow-sm rounded-full">
                              <CheckCircle2 size={20} className="fill-primary text-white" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </form>

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-4 w-full max-w-md">
                {regStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRegStep(prev => prev - 1)}
                    className="flex-shrink-0 w-14 h-14 rounded-2xl border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                )}

                {regStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 h-14 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl shadow-lg text-lg font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Tiếp tục <ArrowRight size={20} className="ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={handleSubmit(onRegister)}
                    disabled={isLoading}
                    className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/25 text-lg font-bold transition-all hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Khám phá ngay"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {regStep === 1 && (
              <div className="text-center mt-8">
                <div className="mt-8 flex items-center justify-center space-x-4 max-w-md mx-auto">
                  <div className="h-px bg-neutral-200 flex-1"></div>
                  <span className="text-sm font-medium text-neutral-400">HOẶC ĐĂNG KÝ VỚI</span>
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

                <p className="text-neutral-500 font-medium mt-8">
                  Đã có tài khoản?{' '}
                  <Link href="/login" className="text-primary font-bold hover:underline">
                    Đăng nhập
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
