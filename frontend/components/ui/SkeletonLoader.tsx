'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[#fff5f7] rounded-btn',
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-card p-6 border border-[#ffc8d3] shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonLoader className="h-4 w-1/3 bg-[#ffc8d3]/40" />
        <SkeletonLoader className="h-6 w-16 bg-[#ffc8d3]/40" />
      </div>
      <SkeletonLoader className="h-8 w-2/3 bg-[#ffc8d3]/30" />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <SkeletonLoader className="h-12 w-full bg-[#fff5f7]" />
        <SkeletonLoader className="h-12 w-full bg-[#fff5f7]" />
      </div>
    </div>
  );
}
