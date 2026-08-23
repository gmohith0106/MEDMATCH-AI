'use client';

import React, { useState } from 'react';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';

export function DemoModeBanner() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative bg-[#e27094] text-white px-4 py-2 border-b border-[#ffc8d3] text-xs flex items-center justify-between z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-badge bg-[#94d4f8] text-[#24324a] font-bold text-[10px] tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-[#24324a]" />
          ACTIVE NETWORK
        </div>
        <span className="hidden sm:inline font-medium text-white/90">
          Autonomous Healthcare Procurement Platform &bull; Algorand TestNet
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div 
          className="relative flex items-center gap-1.5 text-[11px] text-[#9ddcfd] hover:text-white cursor-pointer transition-colors"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <Info className="w-3.5 h-3.5" />
          <span className="underline decoration-dotted underline-offset-2">Network Security</span>

          {showTooltip && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white text-[#24324a] p-3 rounded-card shadow-modal border border-[#ffc8d3] text-xs z-50 animate-fadeIn font-normal">
              <div className="flex items-center gap-1.5 font-bold text-[#24324a] pb-1 border-b border-[#ffc8d3] mb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#e27094]" />
                Zero-Trust Logistics Security
              </div>
              <p className="text-[11px] text-[#667085] leading-relaxed">
                Hospital transactions and supplier settlements are cryptographically signed on-chain via dedicated smart contracts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
