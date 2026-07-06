import api from '@/lib/axios';
import { Category, CreateProductRequest, Product } from '@/types/product';
import { PageResponse } from '@/lib/api/products';

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
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sellType?: string;
  page?: number;
  size?: number;
}

export const getProducts = async (page = 0, size = 20): Promise<PageResponse<Product>> => {
  const response = await api.get('/products', { params: { page, size } });
  return response.data;
};

export const searchProducts = async (params: ProductSearchParams): Promise<PageResponse<Product>> => {
  const response = await api.get('/products/search', { params });
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
