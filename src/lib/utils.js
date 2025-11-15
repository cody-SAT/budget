import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Our old formatting helpers, now in a shared file
export const formatLargeNumber = (value) => { if (typeof value !== 'number' || value === null || !isFinite(value)) return '$0M'; const valInMillions = value; if (Math.abs(valInMillions) >= 1000) return `$${(valInMillions / 1000).toFixed(1)}B`; return `$${valInMillions.toFixed(0)}M`; };
export const formatNumber = (value) => { if (typeof value !== 'number' || value === null || !isFinite(value)) return '0'; return new Intl.NumberFormat('en-US').format(value); };
export const formatPercent = (value) => { if (typeof value !== 'number' || value === null || !isFinite(value)) return '0.0%'; return `${(value * 100).toFixed(1)}%`; };
export const formatRatio = (value) => { if (typeof value !== 'number' || value === null || !isFinite(value)) return '0.00x'; return `${value.toFixed(2)}x`; };
export const formatCurrency = (value) => { if (typeof value !== 'number' || value === null || !isFinite(value)) return '$0'; return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value); };
