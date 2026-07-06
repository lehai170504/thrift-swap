import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProduct, getCategories, getProductById, getProducts, searchProducts, getRelatedProducts, deleteProduct, ProductSearchParams } from '../api/productsApi';
import { CreateProductRequest } from '@/types/product';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};

export const useProducts = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['products', { page, size }],
    queryFn: () => getProducts(page, size),
  });
};

export const useSearchProducts = (params: ProductSearchParams) => {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: () => searchProducts(params),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useRelatedProducts = (id: string, categoryId: string) => {
  return useQuery({
    queryKey: ['products', 'related', id, categoryId],
    queryFn: () => getRelatedProducts(id, categoryId),
    enabled: !!id && !!categoryId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: () => {
      toast.success('Đăng sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      const errorMessage = typeof error.response?.data === 'string'
        ? error.response?.data
        : error.response?.data?.message || error.message || 'Lỗi không xác định khi tạo sản phẩm';
      toast.error(`Đăng bán thất bại: ${errorMessage}`);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      const errorMessage = typeof error.response?.data === 'string'
        ? error.response?.data
        : error.response?.data?.message || error.message || 'Không thể xóa sản phẩm lúc này';
      toast.error(`Lỗi: ${errorMessage}`);
    },
  });
};
