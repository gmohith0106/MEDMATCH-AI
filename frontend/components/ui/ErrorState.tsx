'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="bg-white rounded-card p-8 border border-[#e3577c] shadow-soft text-center flex flex-col items-center justify-center max-w-md mx-auto my-8">
      <div className="w-12 h-12 rounded-btn bg-[#fff5f7] text-[#e3577c] flex items-center justify-center mb-3 border border-[#ffc8d3]">
        <AlertCircle className="w-6 h-6 text-[#e3577c]" />
      </div>
      <h3 className="font-heading font-extrabold text-base text-[#24324a] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#667085] mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold transition-all shadow-soft active:scale-98"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
