import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reportApi } from '../api/reportApi';
import { extractError } from '@/lib/utils';

export function useReport() {
  const submitReport = useMutation({
    mutationFn: reportApi.submitReport,
    onSuccess: () => {
      toast.success('Đã gửi báo cáo vi phạm. Cảm ơn bạn đã đóng góp!');
    },
    onError: (error) => {
      toast.error(extractError(error, 'Không thể gửi báo cáo lúc này'));
    },
  });

  return {
    submitReport,
  };
}
