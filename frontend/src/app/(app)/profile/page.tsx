'use client';

import { useState, useEffect, useRef } from 'react';
import { useProfile, useUpdateProfile, useChangePassword } from '@/features/users/hooks/useUsers';
import { Mail, Phone, Calendar, ShieldCheck, MapPin, Camera, Save, ArrowLeft, Loader2, Map as MapIcon, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { uploadImage } from '@/lib/api/media';
import Link from 'next/link';
import { ProfileSkeleton } from '@/components/ui/loading-skeletons';
import { ShippingInfoForm } from '@/components/ui/ShippingInfoForm';
import { useFollow } from '@/features/users/hooks/useFollow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';



export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const { followerCount, followersList } = useFollow(profile?.username || '');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setAvatarPreview(profile.avatar || null);
    }
  }, [profile]);



  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    let avatarUrl = profile?.avatar;

    try {
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }

      updateMutation.mutate(
        { fullName, phone, address, avatar: avatarUrl },
        {
          onSuccess: () => {
            toast.success('Lưu thông tin thành công!');
            setAvatarFile(null);
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi lưu thông tin');
          }
        }
      );
    } catch (error) {
      toast.error('Lỗi upload ảnh');
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    if (oldPassword === newPassword) {
      toast.error('Mật khẩu mới không được trùng với mật khẩu cũ');
      return;
    }

    changePasswordMutation.mutate(
      { currentPassword: oldPassword, newPassword: newPassword },
      {
        onSuccess: () => {
          toast.success('Đổi mật khẩu thành công!');
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
        onError: (err: any) => {
          const msg = err.response?.data || err.message;
          toast.error('Lỗi: ' + msg);
        }
      }
    );
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) return null;

  const currentAvatar = avatarPreview || profile.avatar;
  const isChanged = fullName !== (profile.fullName || '') ||
    phone !== (profile.phone || '') ||
    address !== (profile.address || '') ||
    avatarFile !== null;

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Banner */}
      <div className="h-56 md:h-72 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

        {/* Banner Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl h-full flex flex-col pt-8 relative z-10">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white rounded-xl w-fit px-3 h-9 text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại trang chủ
            </Button>
          </Link>

          <div className="mt-4 md:mt-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              Hồ sơ cá nhân
            </h1>
            <p className="text-white/80 mt-2 font-medium max-w-lg text-sm md:text-base">
              Quản lý thông tin liên hệ, cập nhật địa chỉ giao hàng và ảnh đại diện để trải nghiệm mua bán an toàn hơn.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">

            {/* Sidebar Left: Profile summary & Nav */}
            <div className="p-8 border-b lg:border-b-0 lg:border-r border-neutral-100 bg-neutral-50/30 flex flex-col items-center">
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center">
                  {currentAvatar ? (
                    <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl font-black text-primary">
                      {profile.username?.substring(0, 2).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-8 h-8 text-white" />
                  <span className="sr-only">Đổi ảnh đại diện</span>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>

              <h2 className="text-2xl font-bold text-neutral-900 text-center">{profile.fullName || profile.username}</h2>
              <p className="text-neutral-500 font-medium mt-1">@{profile.username}</p>

              {profile.role === 'ADMIN' && (
                <div className="mt-3 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold flex items-center shadow-sm">
                  <ShieldCheck className="w-4 h-4 mr-1.5" /> Quản trị viên
                </div>
              )}

              <div className="w-full h-px bg-neutral-200/60 my-8"></div>

              <div className="w-full space-y-4">
                <div className="flex items-center text-sm">
                  <Mail className="w-5 h-5 text-neutral-400 mr-3" />
                  <span className="text-neutral-700 font-medium truncate">{profile.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-5 h-5 text-neutral-400 mr-3" />
                  <span className="text-neutral-700 font-medium">Tham gia {new Date(profile.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>

                <Dialog>
                  <DialogTrigger
                    render={
                      <button className="flex items-center text-sm hover:text-primary transition-colors cursor-pointer w-full text-left" />
                    }
                  >
                    <Users className="w-5 h-5 text-neutral-400 mr-3" />
                    <span className="text-neutral-700 font-medium">
                      {followerCount} Người theo dõi
                    </span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-center">Người theo dõi ({followerCount})</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4 space-y-4">
                      {followersList && followersList.length > 0 ? (
                        followersList.map((follower: any) => (
                          <div key={follower.id} className="flex items-center justify-between gap-4 p-3 hover:bg-neutral-50 rounded-2xl transition-colors border border-transparent hover:border-neutral-100">
                            <Link href={`/users/${follower.username}`} className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 border border-neutral-100">
                                <AvatarImage src={follower.avatar} alt={follower.fullName || follower.username} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                  {(follower.fullName || follower.username || 'U').substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-neutral-900">{follower.fullName || follower.username}</p>
                                <p className="text-sm text-neutral-500">@{follower.username}</p>
                              </div>
                            </Link>
                            <Link href={`/users/${follower.username}`}>
                              <Button variant="outline" size="sm" className="rounded-full px-4 text-xs font-semibold">
                                Xem hồ sơ
                              </Button>
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-neutral-500">
                          <Users className="w-12 h-12 mx-auto text-neutral-200 mb-2" />
                          <p>Chưa có ai theo dõi bạn.</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Main Right: Forms and Map */}
            <div className="p-8 lg:p-12 lg:col-span-2">
              <Tabs defaultValue="info" className="w-full flex flex-col gap-8">
                <TabsList className="w-fit p-1.5 bg-neutral-100/80 rounded-2xl">
                  <TabsTrigger value="info" className="rounded-xl px-8 py-3 text-[15px] font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
                    Thông tin chung
                  </TabsTrigger>
                  <TabsTrigger value="password" className="rounded-xl px-8 py-3 text-[15px] font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
                    Đổi mật khẩu
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="focus-visible:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900">Thông tin liên hệ & Địa chỉ</h2>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <ShippingInfoForm
                      fullName={fullName}
                      onChangeFullName={setFullName}
                      phone={phone}
                      onChangePhone={setPhone}
                      address={address}
                      onChangeAddress={setAddress}
                      showMap={true}
                    />

                    <div className="pt-8 flex justify-end">
                      <Button
                        size="lg"
                        className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                        onClick={handleSave}
                        disabled={updateMutation.isPending || !isChanged}
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5 mr-2" />
                        )}
                        {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="password" className="focus-visible:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2 duration-500">
                  <div className="max-w-md">
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                        <LockKeyhole className="w-5 h-5 text-primary" /> Bảo mật tài khoản
                      </h2>
                      <p className="text-neutral-500 mt-1 text-sm">Bảo vệ tài khoản của bạn bằng cách sử dụng mật khẩu mạnh.</p>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700">Mật khẩu cũ</label>
                        <Input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-neutral-50 border-neutral-200 h-12 rounded-xl focus-visible:ring-primary focus-visible:bg-white transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700">Mật khẩu mới</label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-neutral-50 border-neutral-200 h-12 rounded-xl focus-visible:ring-primary focus-visible:bg-white transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700">Xác nhận mật khẩu mới</label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-neutral-50 border-neutral-200 h-12 rounded-xl focus-visible:ring-primary focus-visible:bg-white transition-colors"
                        />
                      </div>

                      <div className="pt-4">
                        <Button
                          size="lg"
                          className="rounded-xl px-8 h-12 font-bold w-full md:w-auto"
                          onClick={handleChangePassword}
                          disabled={changePasswordMutation.isPending || !oldPassword || !newPassword || !confirmPassword}
                        >
                          {changePasswordMutation.isPending ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
