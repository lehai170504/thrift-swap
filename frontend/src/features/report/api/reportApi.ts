import api from '@/lib/axios';
import { SubmitReportRequest, ReportResponse } from '../types/report';

export const reportApi = {
  submitReport: async (data: SubmitReportRequest): Promise<ReportResponse> => {
    const response = await api.post('/reports', data);
    return response.data;
  },
};
