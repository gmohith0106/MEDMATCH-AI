'use client';

import React from 'react';
import { RecommendationCard } from '@/components/recommendation/RecommendationCard';
import { RationaleScorecard } from '@/components/recommendation/RationaleScorecard';
import { ShieldCheck } from 'lucide-react';

export default function RecommendationPage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-badge bg-[#e3577c] text-white uppercase tracking-wider">
              SYNTHESIZED RECOMMENDATION
            </span>
            <span className="text-xs font-semibold text-[#667085] font-mono">
              Ready for Human Review
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#24324a] tracking-tight mt-1">
            AI Procurement Recommendation
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] font-medium mt-0.5">
            Optimal procurement action based on verified supplier intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-btn bg-white border border-[#ffc8d3] text-xs font-semibold text-[#24324a] shadow-soft">
          <ShieldCheck className="w-4 h-4 text-[#94d4f8]" />
          <span>Non-Autonomous Final Execution</span>
        </div>
      </div>

      {/* Hero Recommendation Card */}
      <RecommendationCard />

      {/* Transparent Rationale Scorecard */}
      <RationaleScorecard />
    </div>
  );
}
