'use client';

import { useEffect, useState } from 'react';
import { orderApi } from '@/features/orders/api/orderApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Loader2, TrendingUp, Package, DollarSign,
  ShoppingBag, Star, AlertCircle, CalendarDays,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import Link from 'next/link';

import { DashboardSkeleton, DashboardInnerSkeleton } from '@/components/ui/loading-skeletons';

export default function SellerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [filterDays, setFilterDays] = useState(30);

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString('vi-VN', options));

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getSellerAnalytics(filterDays);
        setData(res);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filterDays]);

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const pieData = [
    { name: 'Hoàn thành', value: data?.completedOrders || 0, color: '#10b981' },
    { name: 'Đang xử lý', value: data?.pendingOrders || 0, color: '#f59e0b' },
    { name: 'Đã hủy', value: data?.canceledOrders || 0, color: '#ef4444' },
  ].filter(item => item.value > 0);

  return (
    <div className="container px-4 sm:px-6 py-8 max-w-7xl mx-auto space-y-8 min-h-[60vh] animate-in fade-in zoom-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Tổng quan gian hàng
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center">
            <CalendarDays className="w-4 h-4 mr-2" />
            {currentDate}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterDays === 1 ? "default" : "outline"}
            className={filterDays === 1 ? "bg-primary shadow-lg" : "glass"}
            onClick={() => setFilterDays(1)}
          >
            Hôm nay
          </Button>
          <Button
            variant={filterDays === 7 ? "default" : "outline"}
            className={filterDays === 7 ? "bg-primary shadow-lg" : "glass"}
            onClick={() => setFilterDays(7)}
          >
            7 ngày qua
          </Button>
          <Button
            variant={filterDays === 30 ? "default" : "outline"}
            className={filterDays === 30 ? "bg-primary shadow-lg" : "glass"}
            onClick={() => setFilterDays(30)}
          >
            30 ngày qua
          </Button>
          <Button
            variant={filterDays === 0 ? "default" : "outline"}
            className={filterDays === 0 ? "bg-primary shadow-lg" : "glass"}
            onClick={() => setFilterDays(0)}
          >
            Tất cả
          </Button>
        </div>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary drop-shadow-lg" />
          </div>
        )}
        <div className={`space-y-8 transition-all duration-300 ${loading ? 'opacity-40 pointer-events-none blur-[2px]' : 'opacity-100 blur-0'}`}>
          {/* To-Do List Section */}
          <Card className="glass border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                Việc cần làm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-border">
                <Link href="/seller/orders?status=PAID" className="flex flex-col items-center justify-center p-4 hover:bg-muted/50 rounded-lg transition-colors group">
                  <span className="text-3xl font-bold text-blue-500 group-hover:scale-110 transition-transform">{data?.waitingForShipmentOrders || 0}</span>
                  <span className="text-sm text-muted-foreground mt-2 font-medium">Chờ Giao Hàng</span>
                </Link>
                <Link href="/seller/orders?status=RETURNING" className="flex flex-col items-center justify-center p-4 hover:bg-muted/50 rounded-lg transition-colors group">
                  <span className="text-3xl font-bold text-red-500 group-hover:scale-110 transition-transform">{data?.returnRequests || 0}</span>
                  <span className="text-sm text-muted-foreground mt-2 font-medium">Yêu cầu trả hàng</span>
                </Link>
                <Link href="/seller/products?status=OUT_OF_STOCK" className="flex flex-col items-center justify-center p-4 hover:bg-muted/50 rounded-lg transition-colors group">
                  <span className="text-3xl font-bold text-amber-500 group-hover:scale-110 transition-transform">{data?.outOfStockProducts || 0}</span>
                  <span className="text-sm text-muted-foreground mt-2 font-medium">Sản phẩm hết hàng</span>
                </Link>
                <Link href="/seller/products" className="flex flex-col items-center justify-center p-4 hover:bg-muted/50 rounded-lg transition-colors group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-3xl font-bold text-emerald-500 group-hover:scale-110 transition-transform">{data?.activeAuctions || 0}</span>
                  <span className="text-sm text-muted-foreground mt-2 font-medium">Phiên đấu giá (Live)</span>
                  <span className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Main Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass border-primary/10 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Doanh Thu</CardTitle>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(data?.totalRevenue || 0)}</div>
                <p className="text-xs text-emerald-500 mt-2 flex items-center font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Tăng 12% so với kỳ trước
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-primary/10 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Đơn Hàng</CardTitle>
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{data?.totalOrders || 0}</div>
                <p className="text-xs text-emerald-500 mt-2 flex items-center font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Tăng 5% so với kỳ trước
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-primary/10 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sản Phẩm Đang Bán</CardTitle>
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{data?.activeProducts || 0}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Sản phẩm đang hiển thị
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-primary/10 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Đánh Giá Trung Bình</CardTitle>
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Star className="h-4 w-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-bold text-foreground">{data?.averageRating ? data.averageRating.toFixed(1) : '0.0'}</div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= (data?.averageRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Dựa trên các đánh giá nhận được
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts & Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Revenue Chart */}
            <Card className="glass border-primary/10 lg:col-span-2 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Biểu Đồ Doanh Thu</CardTitle>
                <Badge variant="outline" className="font-normal text-muted-foreground">
                  {filterDays === 0 ? "Tất cả" : `${filterDays} Ngày Gần Nhất`}
                </Badge>
              </CardHeader>
              <CardContent className="h-[350px]">
                {data?.revenueChart && data.revenueChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.revenueChart} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => val.substring(5)}
                        dy={10}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value / 1000}k`}
                        dx={-10}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                        formatter={(value: any) => [formatCurrency(value as number), 'Doanh thu']}
                        labelFormatter={(label) => `Ngày: ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-2">
                    <TrendingUp className="w-8 h-8 opacity-20" />
                    <span>Chưa có dữ liệu doanh thu</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right Column: Order Ratio Pie Chart */}
            <Card className="glass border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Tỉ Lệ Đơn Hàng</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#e2e8f0' }}
                        labelStyle={{ color: '#94a3b8' }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry: any) => <span className="text-sm font-medium text-foreground ml-1">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-2">
                    <Package className="w-8 h-8 opacity-20" />
                    <span>Chưa có dữ liệu đơn hàng</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}
