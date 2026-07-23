export interface Voucher {
  id: string;
  code: string;
  sellerId?: string;
  type: 'FIXED_AMOUNT' | 'PERCENTAGE';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  quantity: number;
  usedQuantity: number;
  usageLimitPerUser: number;
  expiryDate: string;
  active: boolean;
  isActive?: boolean;
  createdAt: string;
}

export interface CreateVoucherDTO {
  code: string;
  type: 'FIXED_AMOUNT' | 'PERCENTAGE';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  quantity: number;
  usageLimitPerUser: number;
  expiryDate: string;
}

export interface VoucherUsage {
  id: string;
  voucherId: string;
  userId: string;
  userUsername?: string;
  username?: string;
  userEmail?: string;
  email?: string;
  orderId: string;
  productTitle?: string;
  discountAmount: number;
  usedAt: string;
}
