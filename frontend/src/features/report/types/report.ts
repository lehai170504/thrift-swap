export type ReportStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';

export interface ReportResponse {
  id: string;
  reporterId: string;
  reporterUsername: string;
  reportedProductId: string;
  reportedProductTitle: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

export interface SubmitReportRequest {
  productId: string;
  reason: string;
}
