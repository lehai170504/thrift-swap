import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string | undefined | null) {
  if (amount === undefined || amount === null) return '0 ₫';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0 ₫';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
}

export const preventInvalidNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
    e.preventDefault();
  }
};

/**
 * Extracts a readable error message from an API error object.
 * Handles Axios errors gracefully, extracting backend error messages.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractError(error: any, defaultMessage: string = 'Có lỗi xảy ra'): string {
  if (!error) return defaultMessage;

  if (error.response?.data) {
    if (typeof error.response.data === 'string') {
      return error.response.data;
    }
    if (typeof error.response.data.message === 'string') {
      return error.response.data.message;
    }
    if (typeof error.response.data.error === 'string') {
      return error.response.data.error;
    }
  }

  if (typeof error.message === 'string') {
    return error.message;
  }

  return defaultMessage;
}
