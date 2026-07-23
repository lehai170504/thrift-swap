export interface Notification {
  id: string;
  recipientId: string;
  message: string;
  type: 'AUCTION_WON' | 'AUCTION_OUTBID' | 'ORDER_CREATED' | 'ORDER_PAID' | 'ORDER_SHIPPED' | 'ESCROW_RELEASED' | 'ORDER_DISPUTED' | 'SYSTEM' | 'AUCTION_START';
  relatedEntityId: string;
  isRead: boolean;
  createdAt: string;
}
