export interface ApiErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  errors?: Record<string, string>;
}
