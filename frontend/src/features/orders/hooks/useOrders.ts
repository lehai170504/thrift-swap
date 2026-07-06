import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { orderApi } from '@/lib/api/orders';

export const useMyOrders = () => {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderApi.getMyOrders(),
  });
};

export const useMySales = () => {
  return useQuery({
    queryKey: ['my-sales'],
    queryFn: () => orderApi.getMySales(),
  });
};

export const useCreateBuyNowOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.createBuyNowOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });
};

export const usePayOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.payOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};

export const useConfirmReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.confirmReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};

export const useEndAuction = () => {
  return useMutation({
    mutationFn: orderApi.endAuction,
  });
};

export const useDisputeOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string, reason: string }) => orderApi.disputeOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-sales'] });
    },
  });
};

export const useShipOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, trackingCode }: { orderId: string; trackingCode: string }) => 
      orderApi.shipOrder(orderId, trackingCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-sales'] });
    },
  });
};

export const useDisputedOrders = (page = 0, size = 10, search = '') => {
  return useQuery({
    queryKey: ['disputed-orders', page, size, search],
    queryFn: () => orderApi.getDisputedOrders(page, size, search),
    placeholderData: keepPreviousData
  });
};

export const useResolveDispute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, winner }: { orderId: string, winner: 'BUYER' | 'SELLER' }) => orderApi.resolveDispute(orderId, winner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputed-orders'] });
    },
  });
};
