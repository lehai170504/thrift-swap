import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { liveApi } from '../api/liveApi';
import { toast } from 'sonner';

export const useStartLiveSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (auctionSessionId: string) => liveApi.startLiveSession(auctionSessionId),
    onSuccess: (data) => {
      queryClient.setQueryData(['liveSession', data.auctionSessionId], data);
      toast.success('Đã bắt đầu phiên Livestream');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể bắt đầu phiên Livestream');
    },
  });
};

export const useEndLiveSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ auctionSessionId, endAuction }: { auctionSessionId: string, endAuction?: boolean }) =>
      liveApi.endLiveSession(auctionSessionId, endAuction),
    onSuccess: (data) => {
      queryClient.setQueryData(['liveSession', data.auctionSessionId], data);
      toast.success('Phiên Livestream đã kết thúc');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể kết thúc phiên Livestream');
    },
  });
};

export const useLiveSession = (auctionSessionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['liveSession', auctionSessionId],
    queryFn: () => liveApi.getLiveSession(auctionSessionId),
    enabled: !!auctionSessionId && enabled,
    retry: false, // Don't retry if not found, it just means no active live
  });
};

export const useActiveLiveAuctions = () => {
  return useQuery({
    queryKey: ['activeLiveAuctions'],
    queryFn: () => liveApi.getActiveLiveAuctions(),
  });
};

export const useAuctionDepositStatus = (productId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['auctionDeposit', productId],
    queryFn: () => liveApi.getDepositStatus(productId),
    enabled: !!productId && enabled,
  });
};

export const usePlaceAuctionDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => liveApi.placeDeposit(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['auctionDeposit', productId] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Đặt cọc thành công! Bạn đã có thể tham gia trả giá.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể đặt cọc. Vui lòng kiểm tra số dư ví.');
    },
  });
};
