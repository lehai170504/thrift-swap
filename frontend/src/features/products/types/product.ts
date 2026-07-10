export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
}

export type ProductCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
export type SellType = 'BUY_NOW' | 'AUCTION';
export type ProductStatus = 'ACTIVE' | 'SOLD' | 'CANCELLED';

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  condition: ProductCondition;
  sellType: SellType;
  price: number;
  quantity: number;
  imageUrl?: string;
  videoUrl?: string;
  status: ProductStatus;
  location?: string;
  createdAt: string;
  auctionEndTime?: string;
  boostedUntil?: string;
  currentHighestBid?: number;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  condition: ProductCondition;
  sellType: SellType;
  imageUrl?: string;
  videoUrl?: string;
  location?: string;
  auctionDurationDays?: number;
}
