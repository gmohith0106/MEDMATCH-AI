'use client';

import React from 'react';
import { Supplier } from '@/types/supplier';
import { Building2, Sparkles, Check, MapPin } from 'lucide-react';
import { formatInr } from '@/lib/utils';

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  const isRecommended = supplier.isRecommended;

  return (
    <div
      className={`rounded-card p-6 border transition-all flex flex-col justify-between ${
        isRecommended
          ? 'bg-white border-2 border-[#e3577c] shadow-card'
          : 'bg-white border border-[#ffc8d3] shadow-card hover:border-[#e27094]'
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-badge bg-[#fff5f7] text-[#24324a] border border-[#ffc8d3] uppercase tracking-wider">
            VERIFIED VENDOR
          </span>

          {isRecommended && (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-badge bg-[#e3577c] text-white tracking-wider uppercase shadow-soft">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              RECOMMENDED
            </span>
          )}
        </div>

        {/* Supplier Identity */}
        <div className="mb-4">
          <h4 className="font-heading font-extrabold text-base text-[#24324a] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#667085]" />
            {supplier.name}
          </h4>
          <p className="text-[11px] text-[#667085] flex items-center gap-1 mt-1 font-medium">
            <MapPin className="w-3 h-3 text-[#667085]" />
            {supplier.location}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-btn bg-[#fff5f7] border border-[#ffc8d3] mb-4 text-center">
          <div>
            <span className="text-[10px] text-[#667085] block font-medium">Unit Price</span>
            <span className="font-heading font-extrabold text-sm text-[#24324a]">
              {formatInr(supplier.unitPrice)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#667085] block font-medium">Lead Time</span>
            <span className="font-heading font-extrabold text-sm text-[#24324a]">
              {supplier.deliveryDays} Days
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#667085] block font-medium">Reliability</span>
            <span className="font-heading font-extrabold text-sm text-[#24324a]">
              {supplier.reliabilityPercent}%
            </span>
          </div>
        </div>

        {/* Overall Score Banner */}
        <div className="flex items-center justify-between p-3 rounded-btn bg-white border border-[#ffc8d3] mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider">
              Overall Score
            </span>
            <p className="text-[10px] text-[#667085]">40% Price / 30% Delivery / 30% Reliability</p>
          </div>
          <span className="font-heading font-extrabold text-xl text-[#e3577c]">
            {supplier.overallScore.toFixed(1)}
            <span className="text-xs font-normal text-[#667085]">/100</span>
          </span>
        </div>

        {/* Strengths list */}
        <div className="space-y-1.5 text-xs text-[#24324a] mb-4">
          {supplier.strengths.map((str, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-[#94d4f8] flex-shrink-0 mt-0.5" />
              <span className="text-[11px] leading-tight font-medium">{str}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes footer */}
      <div className="pt-3 border-t border-[#ffc8d3] text-[11px] text-[#667085] italic leading-snug">
        &ldquo;{supplier.notes}&rdquo;
      </div>
    </div>
  );
}
