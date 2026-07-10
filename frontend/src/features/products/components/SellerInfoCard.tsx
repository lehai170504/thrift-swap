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
    <div className="flex items-center gap-4 py-4 border-y border-neutral-100 my-4">
      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
        <User className="w-6 h-6 text-neutral-400" />
      </div>
      <div>
        <div className="text-sm text-neutral-500">Người bán</div>
        <Link href={`/users/${sellerName}`} className="font-semibold text-neutral-900 hover:text-primary hover:underline transition-colors block">
          {sellerName}
        </Link>
      </div>
      <div className="ml-auto flex flex-col items-end gap-2">
        <div className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-medium">
          <ShieldCheck className="w-4 h-4 mr-1" /> Đã xác thực
        </div>
        {!isSeller && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-full border-primary text-primary hover:bg-primary/10"
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
