import api from '@/lib/axios';
import { Category, CreateProductRequest, Product } from '@/features/products/types/product';
import { PageResponse } from '@/types/pagination';

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data;
};

export const createProduct = async (data: CreateProductRequest): Promise<Product> => {
  const response = await api.post('/products', data);
  return response.data;
};

export interface ProductSearchParams {
  query?: string;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sellType?: string;
  location?: string;
  sortBy?: string;
  direction?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export const getProducts = async (page = 0, size = 20): Promise<PageResponse<Product>> => {
  const response = await api.get('/products', { params: { page, size } });
  return response.data;
};

export const searchProducts = async (params: ProductSearchParams): Promise<PageResponse<Product>> => {
  const queryParams: any = { ...params };
  if (params.categoryIds && params.categoryIds.length > 0) {
    queryParams.categoryIds = params.categoryIds.join(',');
  }
  const response = await api.get('/products/search', { params: queryParams });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getRelatedProducts = async (id: string, categoryId: string): Promise<Product[]> => {
  const response = await api.get(`/products/${id}/related`, { params: { categoryId } });
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const updateProduct = async (id: string, data: CreateProductRequest): Promise<Product> => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const boostProduct = async (id: string) => {
  const response = await api.post(`/products/${id}/boost`);
  return response.data;
};

export const getProductsBySeller = async (username: string): Promise<Product[]> => {
  const response = await api.get(`/products/seller/${username}`);
  return response.data;
};
