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
  imageUrl?: string;
  status: ProductStatus;
  createdAt: string;
  auctionEndTime?: string;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  condition: ProductCondition;
  sellType: SellType;
  imageUrl?: string;
  auctionDurationDays?: number;
}
