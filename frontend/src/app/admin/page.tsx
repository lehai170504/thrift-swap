'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LayoutDashboard, Users, ShoppingBag, Wallet, TrendingUp } from 'lucide-react';
import { useAdminDashboard } from '@/features/admin/hooks/useAdminDashboard';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function AdminDashboardPage() {
  const { totalUsers, totalOrders, totalWithdrawals, totalEscrow, chartData } = useAdminDashboard();

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Tổng quan hệ thống</h1>
        <p className="text-muted-foreground mt-1">Theo dõi các chỉ số quan trọng của Thriftly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-border shadow-lg bg-background/50 backdrop-blur-xl rounded-[24px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Ký Quỹ Hệ Thống</CardTitle>
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[16px] flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(totalEscrow)}</div>
            <div className="flex items-center text-xs text-emerald-400 font-medium mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Đang lưu trữ an toàn</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border shadow-lg bg-background/50 backdrop-blur-xl rounded-[24px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tổng Đơn Hàng</CardTitle>
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-[16px] flex items-center justify-center text-blue-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalOrders}</div>
            <div className="flex items-center text-xs text-blue-400 font-medium mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+15% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border shadow-lg bg-background/50 backdrop-blur-xl rounded-[24px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Thành Viên</CardTitle>
            <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-[16px] flex items-center justify-center text-orange-400">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalUsers}</div>
            <div className="flex items-center text-xs text-orange-400 font-medium mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Tăng trưởng ổn định</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border shadow-lg bg-background/50 backdrop-blur-xl rounded-[24px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Yêu Cầu Rút Tiền</CardTitle>
            <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 rounded-[16px] flex items-center justify-center text-rose-400">
              <LayoutDashboard className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalWithdrawals}</div>
            <div className="flex items-center text-xs text-rose-400 font-medium mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Cần xử lý ngay</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="glass border-border shadow-lg bg-background/50 backdrop-blur-xl rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Biểu Đồ Doanh Thu Ước Tính</CardTitle>
            <CardDescription className="text-muted-foreground">Thống kê 6 tháng gần nhất</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} dx={-10} tickFormatter={(value) => `${value / 1000000}M`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(value: any) => [`${formatCurrency(value)}`, 'Doanh thu']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border shadow-lg bg-background/50 backdrop-blur-xl rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Lượng Đơn Hàng Mới</CardTitle>
            <CardDescription className="text-muted-foreground">Số đơn hàng được tạo qua các tháng</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} dx={-10} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(value: any) => [`${value} đơn`, 'Đơn hàng']}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
