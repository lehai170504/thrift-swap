/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../axios';

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
}

export interface ProductSearchParams {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sellType?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: string;
}

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getProducts = async (page = 0, size = 20): Promise<PageResponse<any>> => {
  const response = await api.get('/products', { params: { page, size } });
  return response.data;
};

export const searchProducts = async (params: ProductSearchParams): Promise<PageResponse<any>> => {
  const response = await api.get('/products/search', { params });
  return response.data;
};

export const createProduct = async (data: any) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const getProductsBySeller = async (username: string): Promise<any[]> => {
  const response = await api.get(`/products/seller/${username}`);
  return response.data;
};
