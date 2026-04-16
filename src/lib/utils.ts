import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = '₹'): string {
  if (amount >= 10000000) return `${currency}${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `${currency}${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${currency}${(amount / 1000).toFixed(0)}K`;
  return `${currency}${amount.toLocaleString('en-IN')}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function daysUntil(dateStr: string): number {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = date.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    pending_signature: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    pending_review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    expired: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    terminated: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Active',
    draft: 'Draft',
    pending_signature: 'Pending Signature',
    pending_review: 'Pending Review',
    expired: 'Expired',
    terminated: 'Terminated',
  };
  return labels[status] || status;
}

export function getRiskColor(score: number): string {
  if (score <= 20) return 'text-green-600';
  if (score <= 40) return 'text-yellow-600';
  if (score <= 60) return 'text-orange-500';
  return 'text-red-600';
}

export function getRiskLabel(score: number): string {
  if (score <= 20) return 'Low Risk';
  if (score <= 40) return 'Medium Risk';
  if (score <= 60) return 'High Risk';
  return 'Critical Risk';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}
