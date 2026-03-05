import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const categoryIcons: Record<string, string> = {
  Cement: 'hammer',
  Dust: 'truck',
  Labor: 'hard-hat',
  Electrical: 'zap',
  Plumbing: 'droplets',
  Painting: 'paintbrush',
  Tiles: 'square',
  Steel: 'layers',
  Sand: 'mountain',
  Bricks: 'blocks',
  Glass: 'window',
  Wood: 'tree-pine',
  default: 'package',
};
