'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Wallet, ShoppingBag, Users, LayoutDashboard, Package } from 'lucide-react';

const menuItems = [
  { name: 'Tổng quan', icon: LayoutDashboard, path: '/admin' },
  { name: 'Quản lý Sản phẩm', icon: Package, path: '/admin/products' },
  { name: 'Quản lý Rút tiền', icon: Wallet, path: '/admin/withdrawals' },
  { name: 'Xử lý Khiếu nại', icon: ShieldAlert, path: '/admin/disputes' },
  { name: 'Quản lý Đơn hàng', icon: ShoppingBag, path: '/admin/orders' },
  { name: 'Quản lý Người dùng', icon: Users, path: '/admin/users' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r border-neutral-200/80 flex flex-col flex-shrink-0 z-20 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 text-2xl font-black mb-10 tracking-tight">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-neutral-100 shadow-sm">
            <img src="/logo.png?v=2" alt="Thriftly Logo" className="w-[120%] h-[120%] object-contain" />
          </div>
          <div className="text-neutral-900 leading-none">
            Thriftly
            <span className="text-neutral-400 block text-[10px] font-bold uppercase tracking-widest mt-1">Admin Portal</span>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path + '/'));
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                >
                  <item.icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-[15px]">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-neutral-100">
        <div className="text-xs text-neutral-400 text-center font-medium">
          Thriftly OS v2.0
        </div>
      </div>
    </aside>
  );
}
