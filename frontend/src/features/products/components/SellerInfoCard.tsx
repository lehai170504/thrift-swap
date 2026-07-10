import { User, ShieldCheck, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/features/chat/store/useChatStore';

interface SellerInfoCardProps {
  sellerName: string;
  sellerId: string;
  isSeller: boolean;
}

export function SellerInfoCard({ sellerName, sellerId, isSeller }: SellerInfoCardProps) {
  const { openChatWith } = useChatStore();

  return (
    <div className="flex w-full items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
        <User className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
        <div className="text-sm text-muted-foreground">Người bán</div>
        <Link href={`/users/${sellerName}`} className="font-semibold text-foreground hover:text-primary hover:underline transition-colors block">
          {sellerName}
        </Link>
      </div>
      <div className="ml-auto flex flex-col items-end gap-2">
        <div className="flex items-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-[24px] text-xs font-bold shadow-sm">
          <ShieldCheck className="w-4 h-4 mr-1" /> Đã xác thực
        </div>
        {!isSeller && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-[24px] border-primary text-primary hover:bg-primary/10 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
            onClick={() => openChatWith({ id: sellerId, username: sellerName, fullName: sellerName, avatar: '' })}
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
            Nhắn tin
          </Button>
        )}
      </div>
    </div>
  );
}
