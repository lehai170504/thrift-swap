import { useMutation } from '@tanstack/react-query';
import { uploadImage, uploadVideo } from '@/lib/api/media';
import { toast } from 'sonner';

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file),
    onError: () => {
      toast.error('Lỗi khi tải ảnh lên');
    },
  });
};

export const useUploadVideo = () => {
  return useMutation({
    mutationFn: (file: File) => uploadVideo(file),
    onError: () => {
      toast.error('Lỗi khi tải video lên');
    },
  });
};
