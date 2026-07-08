'use client';

import { AdminTransactionResponse } from '@/lib/api/admin';
import { useAdminWithdrawals, useApproveWithdrawal, useRejectWithdrawal } from '@/features/admin/hooks/useAdminWithdrawals';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Banknote, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AdminWithdrawalsPage() {
  const [page, setPage] = useState(0);
  const size = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: withdrawalsData, isLoading } = useAdminWithdrawals(page, size, debouncedSearchTerm);

  const withdrawals: AdminTransactionResponse[] = (withdrawalsData as any)?.content || [];
  const totalPages = (withdrawalsData as any)?.totalPages || 1;

  const approveMutation = useApproveWithdrawal();
  const rejectMutation = useRejectWithdrawal();

  const handleApprove = (id: string) => {
    if (confirm('Bạn đã CHUYỂN KHOẢN cho User này chưa? Bấm OK sẽ trừ tiền trong ví của họ vĩnh viễn!')) {
      approveMutation.mutate(id, {
        onSuccess: () => toast.success('Đã duyệt yêu cầu rút tiền thành công!'),
        onError: () => toast.error('Có lỗi xảy ra khi duyệt'),
      });
    }
  };

  const handleReject = (id: string) => {
    if (confirm('Từ chối yêu cầu này? Tiền sẽ được hoàn lại vào ví của User.')) {
      rejectMutation.mutate(id, {
        onSuccess: () => toast.success('Đã từ chối và hoàn tiền lại cho user!'),
        onError: () => toast.error('Có lỗi xảy ra khi từ chối'),
      });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-neutral-500 font-medium">Đang tải danh sách rút tiền...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <Banknote className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900">Duyệt Rút Tiền</h1>
            <p className="text-neutral-500 text-sm">Quản lý các yêu cầu rút tiền của người dùng. Vui lòng chuyển khoản trước khi duyệt.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-bold flex items-center gap-2 text-sm whitespace-nowrap">
            <Clock className="w-4 h-4" />
            {withdrawals.length} Yêu cầu
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Lọc User hoặc nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full md:w-64 rounded-xl bg-white border-neutral-200"
            />
          </div>
        </div>
      </div>

      {withdrawals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-200 mb-4" />
            <h3 className="text-xl font-bold text-neutral-800">Tuyệt vời!</h3>
            <p>Hiện không có yêu cầu rút tiền nào đang chờ duyệt.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {withdrawals.map((req) => (
            <Card key={req.id} className="overflow-hidden border-orange-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-orange-50/50 p-4 border-b border-orange-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border text-orange-500 font-bold">
                    {req.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">User: {req.username}</h3>
                    <p className="text-xs text-muted-foreground">Yêu cầu lúc: {new Date(req.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-orange-600">
                    {formatCurrency(req.amount)}
                  </p>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-2 bg-blue-50 text-blue-800 p-4 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold mb-1">Thông tin chuyển khoản:</p>
                        <p className="text-lg font-mono tracking-tight bg-white px-2 py-1 rounded border inline-block mb-2">
                          {req.description}
                        </p>
                        <p className="text-xs opacity-80">
                          * Admin vui lòng copy thông tin trên để chuyển khoản thủ công cho User qua App Ngân hàng.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px] justify-center">
                    <Button
                      className="w-full h-12 text-md font-bold"
                      onClick={() => handleApprove(req.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Đã chuyển khoản (Duyệt)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                      onClick={() => handleReject(req.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Từ chối & Hoàn tiền
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
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
