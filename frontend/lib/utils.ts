import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'critical':
    case 'failed':
    case 'error':
    case 'shortage':
      return {
        bg: 'bg-[#fff5f7]',
        border: 'border-[#ffc8d3]',
        text: 'text-[#e3577c]',
        badgeBg: 'bg-[#fff5f7]',
        badgeText: 'text-[#e3577c]',
        dot: 'bg-[#e3577c]',
      };
    case 'warning':
    case 'needs attention':
    case 'attention':
    case 'simulated':
    case 'pending':
      return {
        bg: 'bg-[#fff5f7]',
        border: 'border-[#ffc8d3]',
        text: 'text-[#e27094]',
        badgeBg: 'bg-[#fff5f7]',
        badgeText: 'text-[#e27094]',
        dot: 'bg-[#e27094]',
      };
    case 'healthy':
    case 'stable':
    case 'active':
    case 'completed':
    case 'approved':
    case 'verified':
    case 'online':
      return {
        bg: 'bg-[#ffffff]',
        border: 'border-[#94d4f8]',
        text: 'text-[#24324a]',
        badgeBg: 'bg-[#ffffff]',
        badgeText: 'text-[#24324a]',
        dot: 'bg-[#94d4f8]',
      };
    default:
      return {
        bg: 'bg-[#ffffff]',
        border: 'border-[#ffc8d3]',
        text: 'text-[#24324a]',
        badgeBg: 'bg-[#ffffff]',
        badgeText: 'text-[#24324a]',
        dot: 'bg-[#94d4f8]',
      };
  }
}
