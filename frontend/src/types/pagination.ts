// Shared pagination type used across multiple features
export interface PageResponse<T> {
  content: T[];

  // Spring Boot <= 3.2 format
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
  last?: boolean;
  first?: boolean;
  pageable?: {
    pageNumber: number;
    pageSize: number;
  };

  // Spring Boot >= 3.3 format
  page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
