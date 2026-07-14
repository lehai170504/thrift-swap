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
 * Handles the backend JSON format: { timestamp, status, error, message, fieldErrors? }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractError(error: any, defaultMessage: string = 'Có lỗi xảy ra'): string {
  if (!error) return defaultMessage;

  const data = error.response?.data;

  if (data) {
    if (typeof data === 'string') return data;

    if (data.fieldErrors && typeof data.fieldErrors === 'object') {
      const firstFieldError = Object.values(data.fieldErrors)[0];
      if (typeof firstFieldError === 'string') return firstFieldError;
    }

    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
  }

  if (typeof error.message === 'string') return error.message;

  return defaultMessage;
}

/**
 * Extracts all field-level validation errors from a BE MethodArgumentNotValidException response.
 * Returns a Record<fieldName, errorMessage> or null if not a validation error.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractFieldErrors(error: any): Record<string, string> | null {
  const data = error?.response?.data;
  if (data && typeof data === 'object' && data.fieldErrors && typeof data.fieldErrors === 'object') {
    return data.fieldErrors as Record<string, string>;
  }
  return null;
}
