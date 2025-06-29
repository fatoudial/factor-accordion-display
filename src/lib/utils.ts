import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price in the given currency using the browser's Intl.NumberFormat
 * @param amount - The amount to format (in smallest currency unit, e.g. cents)
 * @param currency - Currency code (default: 'CFA')
 * @returns Formatted price string
 */
export const formatPrice = (amount: number, currency: string = 'CFA'): string => {
  // For CFA, we don't use the standard currency format, just add the currency code at the end
  if (currency === 'CFA') {
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0
    }).format(amount / 100) + ' ' + currency;
  }
  
  // For other currencies, use the standard currency format
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount / 100);
};

/**
 * Formats a date string into a localized date string
 * @param dateString - Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};
