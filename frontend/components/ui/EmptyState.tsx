'use client';

import React from 'react';
import { PackageOpen, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-card p-12 border border-[#ffc8d3] shadow-soft text-center flex flex-col items-center justify-center max-w-md mx-auto my-8">
      <div className="w-14 h-14 rounded-btn bg-[#fff5f7] text-[#e3577c] flex items-center justify-center mb-4 border border-[#ffc8d3]">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-heading font-extrabold text-base text-[#24324a] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#667085] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold transition-all shadow-soft active:scale-98"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
