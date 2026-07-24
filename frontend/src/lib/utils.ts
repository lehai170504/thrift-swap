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

export function formatNotificationMessage(message: string): string {
  if (!message) return '';
  return message.replace(/([\d.,]+)\s*(đ|vnd|vnđ)(?![a-zA-Zàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ])/gi, (match, rawAmount) => {
    let clean = rawAmount.replace(/\.0+$/, '');
    if (/\d+\.\d{3}/.test(clean)) {
      clean = clean.replace(/\./g, '');
    }
    clean = clean.replace(/,/g, '');

    const amount = parseFloat(clean);
    if (isNaN(amount)) return match;
    return formatCurrency(amount);
  });
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

/**
 * Converts an array of objects into a CSV string and triggers a browser download.
 */
export function downloadCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  // Add BOM for Excel UTF-8 compatibility
  const csvString = '\uFEFF' + csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
