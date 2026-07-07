// Shared pagination type used across multiple features
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
  pageable?: {
    pageNumber: number;
    pageSize: number;
  };
}
