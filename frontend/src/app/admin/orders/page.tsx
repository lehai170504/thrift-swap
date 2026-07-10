'use client';

import { useState, useEffect } from 'react';
import { useAdminOrders } from '@/features/admin/hooks/useAdminOrders';
import { Order } from '@/features/orders/api/orderApi';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Package, Clock } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AdminOrdersPage() {
  const [page, setPage] = useState(0);
  const size = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: ordersData, isLoading } = useAdminOrders(page, size, debouncedSearchTerm);

  const orders: Order[] = (ordersData as any)?.content || [];
  const totalPages = (ordersData as any)?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="container py-8 max-w-5xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-500">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Chờ thanh toán</Badge>;
      case 'PAID':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Đã thanh toán (Escrow)</Badge>;
      case 'SHIPPED':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Đang giao hàng</Badge>;
      case 'DISPUTED':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Đang khiếu nại</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Đã hoàn thành</Badge>;
      case 'CANCELED':
        return <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-300">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900">Quản lý Đơn hàng</h1>
            <p className="text-neutral-500 text-sm">Theo dõi toàn bộ các giao dịch trên hệ thống Thriftly</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Lọc mã đơn, sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full md:w-64 rounded-xl bg-white border-neutral-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 font-bold">Mã ĐH & Sản phẩm</th>
                <th className="px-6 py-4 font-bold">Người mua & Bán</th>
                <th className="px-6 py-4 font-bold">Giá trị</th>
                <th className="px-6 py-4 font-bold">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-right">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {order.productImageUrl ? (
                        <img src={order.productImageUrl} alt={order.productTitle} className="w-12 h-12 rounded-xl object-cover bg-neutral-100 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-neutral-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-neutral-900 max-w-[200px] truncate" title={order.productTitle}>{order.productTitle}</div>
                        <div className="text-xs text-neutral-400 font-mono mt-0.5">#{order.id.substring(0, 8).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1.5 text-blue-700 font-medium">
                        <span className="w-10 text-neutral-400 font-normal">Mua:</span> {order.buyerName}
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <span className="w-10 text-neutral-400 font-normal">Bán:</span> {order.sellerName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary">{formatCurrency(order.totalAmount)}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right text-neutral-500 whitespace-nowrap text-xs flex flex-col items-end gap-1">
                    <span className="font-medium text-neutral-700">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="p-8 text-center text-neutral-500">
            Hệ thống chưa có đơn hàng nào.
          </div>
        )}
      </div>

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
