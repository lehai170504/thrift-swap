export interface CheckoutPreviewResponse {
  totalProductPrice: number;
  shippingFee: number;
  productDiscount: number;
  shippingDiscount: number;
  finalPrice: number;
  message?: string;
}

export interface Order {
  id: string;
  buyerId?: string;
  buyerUsername?: string;
  buyerName?: string;
  sellerId?: string;
  sellerUsername?: string;
  sellerName?: string;
  productId: string;
  productTitle?: string;
  productImage?: string;
  productImageUrl?: string;
  price?: number;
  quantity?: number;
  totalAmount: number;
  platformFee?: number;
  status: 'PENDING' | 'PENDING_PAYMENT' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'CANCELED' | 'REFUNDED' | 'DISPUTED' | 'RETURNING' | 'RETURNED';
  shippingCode?: string;
  trackingCode?: string;
  returnTrackingCode?: string;
  disputeReason?: string;
  isReviewed?: boolean;
  reviewRating?: number;
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
}
