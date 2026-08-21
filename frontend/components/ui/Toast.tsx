'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useDemo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-[#24324a]" />;
        let toastClass = 'bg-white text-[#24324a] border-[#ffc8d3]';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-[#94d4f8]" />;
          toastClass = 'bg-white text-[#24324a] border-[#94d4f8]';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-[#e27094]" />;
          toastClass = 'bg-white text-[#24324a] border-[#e27094]';
        } else if (toast.type === 'alert') {
          icon = <AlertCircle className="w-4 h-4 text-[#e3577c]" />;
          toastClass = 'bg-white text-[#24324a] border-[#e3577c]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-btn shadow-modal border ${toastClass} animate-slide-up transition-all`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex-shrink-0">{icon}</div>
              <p className="text-xs font-bold leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 p-1 rounded transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
