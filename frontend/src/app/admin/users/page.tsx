'use client';

import { useAdminUsers, useBanUser, useUnbanUser } from '@/features/admin/hooks/useAdminUsers';
import { UserResponse } from '@/lib/api/admin';
import { Users, User, Shield, Mail, Phone, MoreHorizontal, Lock, CheckCircle, Ban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AdminUsersPage() {
  const [page, setPage] = useState(0);
  const size = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: usersData, isLoading } = useAdminUsers(page, size, debouncedSearchTerm);
  const banMutation = useBanUser();
  const unbanMutation = useUnbanUser();

  const handleBan = (id: string, username: string) => {
    banMutation.mutate(id, {
      onSuccess: () => toast.success(`Đã khóa tài khoản ${username}`),
      onError: () => toast.error('Không thể khóa tài khoản. Vui lòng thử lại.')
    });
  };

  const handleUnban = (id: string, username: string) => {
    unbanMutation.mutate(id, {
      onSuccess: () => toast.success(`Đã kích hoạt tài khoản ${username}`),
      onError: () => toast.error('Không thể kích hoạt tài khoản. Vui lòng thử lại.')
    });
  };

  const users: UserResponse[] = (usersData as any)?.content || [];
  const totalPages = (usersData as any)?.totalPages || 1;
  const totalElements = (usersData as any)?.totalElements || 0;

  if (isLoading) return <div className="p-8 text-center text-neutral-500 font-medium">Đang tải danh sách người dùng...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900">Quản lý người dùng</h1>
            <p className="text-neutral-500 text-sm">Tổng cộng <span className="font-bold text-neutral-700">{totalElements}</span> tài khoản</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Lọc username hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full md:w-64 rounded-xl bg-white border-neutral-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left table-fixed">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[28%]" />
            <col className="w-[14%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[8%]" />
          </colgroup>
          <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-100">
            <tr>
              <th className="px-5 py-4 font-bold">Người dùng</th>
              <th className="px-5 py-4 font-bold">Liên hệ</th>
              <th className="px-5 py-4 font-bold whitespace-nowrap">Ngày tham gia</th>
              <th className="px-5 py-4 font-bold text-center">Vai trò</th>
              <th className="px-5 py-4 font-bold text-center">Trạng thái</th>
              <th className="px-5 py-4 font-bold text-center">•••</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.map((user) => (
              <tr key={user.id} className={`hover:bg-neutral-50/50 transition-colors ${!user.isActive ? 'opacity-60' : ''}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border shrink-0 text-sm ${user.isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-neutral-100 text-neutral-400 border-neutral-200'}`}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-neutral-900 truncate">{user.username}</div>
                      <div className="text-xs text-neutral-500 truncate">{user.fullName || 'Chưa cập nhật tên'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1 text-xs text-neutral-600 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Mail className="w-3 h-3 shrink-0 text-neutral-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 shrink-0 text-neutral-400" />
                      <span>{user.phone || 'Chưa có SĐT'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-neutral-500 whitespace-nowrap text-xs">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-5 py-4 text-center">
                  {user.role === 'ADMIN' ? (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]">
                      <Shield className="w-2.5 h-2.5 mr-1" /> Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      <User className="w-2.5 h-2.5 mr-1" /> User
                    </Badge>
                  )}
                </td>
                <td className="px-5 py-4 text-center">
                  {user.isActive ? (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px]">
                      <CheckCircle className="w-2.5 h-2.5 mr-1" /> Hoạt động
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-[10px]">
                      <Ban className="w-2.5 h-2.5 mr-1" /> Đã khóa
                    </Badge>
                  )}
                </td>
                <td className="px-5 py-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors mx-auto">
                      <MoreHorizontal className="h-4 w-4 text-neutral-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {user.isActive ? (
                        <DropdownMenuItem
                          className="cursor-pointer font-medium text-red-600 focus:text-red-700 focus:bg-red-50"
                          onClick={() => handleBan(user.id, user.username)}
                          disabled={banMutation.isPending}
                        >
                          <Lock className="mr-2 h-4 w-4" /> Khóa tài khoản
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="cursor-pointer font-medium text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
                          onClick={() => handleUnban(user.id, user.username)}
                          disabled={unbanMutation.isPending}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Kích hoạt lại
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-12 text-center text-neutral-500 font-medium">
            Không tìm thấy người dùng nào.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-xl"
          >
            Trang trước
          </Button>
          <span className="text-sm font-medium text-neutral-600">
            Trang {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="rounded-xl"
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}
