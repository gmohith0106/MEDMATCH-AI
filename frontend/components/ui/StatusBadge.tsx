'use client';

import React from 'react';
import { cn, getStatusColor } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Zap } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ status, showIcon = true, size = 'sm', className }: StatusBadgeProps) {
  const styles = getStatusColor(status);

  const getIcon = () => {
    switch (status.toLowerCase()) {
      case 'critical':
      case 'failed':
      case 'error':
        return <AlertCircle className="w-3 h-3 text-[#e3577c]" />;
      case 'warning':
      case 'needs attention':
      case 'attention':
      case 'pending':
        return <AlertTriangle className="w-3 h-3 text-[#e27094]" />;
      case 'healthy':
      case 'stable':
      case 'completed':
      case 'approved':
      case 'verified':
      case 'online':
        return <CheckCircle2 className="w-3 h-3 text-[#94d4f8]" />;
      case 'simulated':
        return <Zap className="w-3 h-3 text-[#24324a]" />;
      default:
        return <Clock className="w-3 h-3 text-[#667085]" />;
    }
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-bold rounded-badge gap-1',
    md: 'text-xs px-2.5 py-1 font-bold rounded-badge gap-1.5',
    lg: 'text-sm px-3 py-1.5 font-bold rounded-btn gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center tracking-wide uppercase font-semibold border',
        styles.badgeBg,
        styles.badgeText,
        styles.border,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && getIcon()}
      <span>{status}</span>
    </span>
  );
}
