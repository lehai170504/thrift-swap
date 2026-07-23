'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Trophy, TrendingDown, Package, Wallet, Truck, CheckCircle, AlertTriangle, Info, Play, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMyNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead, useDeleteNotification, useDeleteAllNotifications } from '@/features/notifications/hooks/useNotifications';
import { useNotificationSocket } from '@/features/notifications/hooks/useNotificationSocket';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/features/notifications/types/notification';
import { cn, formatNotificationMessage } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export const NotificationDropdown = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Connect to websocket
  useNotificationSocket(isAuthenticated);

  const { data: notifications = [] } = useMyNotifications(isAuthenticated);
  const { data: unreadCount = 0 } = useUnreadCount(isAuthenticated);
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: deleteAllNotifications } = useDeleteAllNotifications();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);

    // Routing logic based on type
    switch (notification.type) {
      case 'AUCTION_WON':
      case 'ORDER_CREATED':
      case 'ORDER_PAID':
      case 'ORDER_SHIPPED':
      case 'ESCROW_RELEASED':
      case 'ORDER_DISPUTED':
        if (notification.type === 'ORDER_CREATED') {
          router.push('/seller/orders');
        } else {
          router.push('/orders');
        }
        break;
      case 'AUCTION_OUTBID':
      case 'AUCTION_START':
        router.push(`/products/${notification.relatedEntityId}`);
        break;
      default:
        break;
    }
  };

  const handleDeleteSingle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  const handleDeleteAll = () => {
    deleteAllNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'AUCTION_WON': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'AUCTION_OUTBID': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'ORDER_CREATED': return <Package className="w-5 h-5 text-blue-500" />;
      case 'ORDER_PAID': return <Wallet className="w-5 h-5 text-emerald-500" />;
      case 'ORDER_SHIPPED': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'ESCROW_RELEASED': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'ORDER_DISPUTED': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'AUCTION_START': return <Play className="w-5 h-5 text-primary" />;
      default: return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative h-10 w-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 outline-none">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 md:w-96 max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-[24px] glass border-border" align="end">
        <div className="p-4 border-b border-border flex items-center justify-between bg-background/50 sticky top-0 z-10">
          <h3 className="font-heading font-bold text-foreground">Thông báo</h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary hover:text-primary hover:bg-primary/5 h-8 px-2"
                onClick={() => markAllAsRead()}
                title="Đánh dấu tất cả đã đọc"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Đã đọc
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                onClick={handleDeleteAll}
                title="Xóa tất cả thông báo"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Xóa tất cả
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] bg-transparent">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <Bell className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm">Bạn chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "group p-4 border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-background/80 flex gap-3 items-start relative",
                    !notification.isRead ? "bg-primary/10 hover:bg-primary/20" : "bg-transparent"
                  )}
                >
                  <div className="mt-1 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <p className={cn("text-sm mb-1 text-foreground leading-snug", !notification.isRead && "font-bold text-primary")}>
                      {formatNotificationMessage(notification.message)}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 mt-1">
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                    <button
                      onClick={(e) => handleDeleteSingle(e, notification.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                      title="Xóa thông báo này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
