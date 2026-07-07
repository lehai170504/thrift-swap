import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface AiRequest {
  productName: string;
  condition: string;
}

interface AiResponse {
  data: string;
}

export const useGenerateDescription = () => {
  return useMutation({
    mutationFn: async (data: AiRequest) => {
      const response = await axios.post<AiResponse>('/ai/generate-description', data);
      return response.data.data;
    },
  });
};

export const useSuggestPrice = () => {
  return useMutation({
    mutationFn: async (data: AiRequest) => {
      const response = await axios.post<AiResponse>('/ai/suggest-price', data);
      return response.data.data;
    },
  });
};
