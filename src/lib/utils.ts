import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Indian Rupee (INR) currency
 * Examples:
 * 25000 -> "₹25,000"
 * 125000 -> "₹1,25,000"
 * 1000000 -> "₹10,00,000"
 */
export function formatINR(amount: number, showDecimals = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  }).format(absAmount);

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format a number as a percentage string
 * Example: 28.5714 -> "28.57%"
 */
export function formatPercentage(value: number | null, decimals = 1): string {
  if (value === null || isNaN(value)) {
    return 'N/A';
  }
  return `${value.toFixed(decimals)}%`;
}

/**
 * Clean input string to a valid number, preserving sign for negative numbers
 */
export function parseCleanNumber(val: string): number {
  if (!val || typeof val !== 'string') return 0;
  const trimmed = val.trim();
  const isNegative = trimmed.startsWith('-');
  const digitsAndDot = trimmed.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(digitsAndDot);
  if (isNaN(parsed)) return 0;
  return isNegative ? -parsed : parsed;
}

