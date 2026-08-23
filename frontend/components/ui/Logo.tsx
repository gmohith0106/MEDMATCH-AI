'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'mobile';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  dark?: boolean;
}

export function Logo({ variant = 'full', size = 'md', className = '', onClick, dark = false }: LogoProps) {
  const isIconOnly = variant === 'icon';
  const sizeClass = size === 'sm' ? 'w-6 h-6 text-sm' : size === 'lg' ? 'w-10 h-10 text-xl' : 'w-8 h-8 text-base';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 group select-none cursor-pointer ${className}`}
    >
      {/* Brand Icon: Pink Emblem with Sky Blue Accent */}
      <div className={`${sizeClass} rounded-lg bg-[#e3577c] flex items-center justify-center shadow-soft flex-shrink-0 group-hover:scale-105 transition-transform`}>
        <span className="text-white font-black tracking-tighter font-sans">M</span>
      </div>

      {!isIconOnly && (
        <div className="flex items-center gap-1.5">
          <span
            className={`font-sans font-bold ${
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-[17px]'
            } tracking-tight ${dark ? 'text-white' : 'text-[#24324a]'}`}
          >
            MedMatch AI
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#94d4f8] text-[#24324a] uppercase tracking-wider">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
