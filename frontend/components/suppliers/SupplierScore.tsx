'use client';

import React from 'react';
import { Supplier } from '@/types/supplier';
import { Info, BarChart3 } from 'lucide-react';

export function SupplierScore({ suppliers }: { suppliers: Supplier[] }) {
  return (
    <div className="bg-white rounded-card p-6 border border-[#ffc8d3] shadow-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ffc8d3]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-btn bg-[#e3577c] text-white">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-extrabold text-base text-[#24324a]">
              Supplier Evaluation Model
            </h4>
            <p className="text-xs text-[#667085] font-medium">
              Multi-criteria decision analysis weighting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-[#24324a]">
          <span className="px-2.5 py-1 rounded-badge bg-[#fff5f7] border border-[#ffc8d3]">
            Price: <strong>40%</strong>
          </span>
          <span className="px-2.5 py-1 rounded-badge bg-[#fff5f7] border border-[#ffc8d3]">
            Delivery: <strong>30%</strong>
          </span>
          <span className="px-2.5 py-1 rounded-badge bg-[#fff5f7] border border-[#ffc8d3]">
            Reliability: <strong>30%</strong>
          </span>
        </div>
      </div>

      {/* Model explanation disclaimer */}
      <div className="p-3 rounded-btn bg-[#fff5f7] border border-[#ffc8d3] text-xs text-[#667085] flex items-center gap-2">
        <Info className="w-4 h-4 text-[#667085] flex-shrink-0" />
        <p>
          Multi-criteria decision model objectively weighs unit costs, lead-time requirements against hospital emergency depletion horizons, and ISO reliability track records.
        </p>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 pt-1">
        {suppliers.map((supplier) => {
          const isRec = supplier.isRecommended;

          return (
            <div key={supplier.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#24324a] flex items-center gap-1.5">
                  {supplier.name}
                  {isRec && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-badge bg-[#e3577c] text-white uppercase">
                      #1 Match
                    </span>
                  )}
                </span>
                <span className="font-heading font-extrabold text-sm text-[#e3577c]">
                  {supplier.overallScore.toFixed(1)}{' '}
                  <span className="text-[11px] font-normal text-[#667085]">/ 100</span>
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full h-3 rounded-full bg-[#fff5f7] overflow-hidden p-0.5 border border-[#ffc8d3]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isRec ? 'bg-[#e3577c]' : 'bg-[#94d4f8]'
                  }`}
                  style={{ width: `${supplier.overallScore}%` }}
                />
              </div>

              {/* Breakdown sub-labels */}
              <div className="flex items-center justify-between text-[10px] text-[#667085] font-medium px-1">
                <span>Price (40%): {supplier.scoreBreakdown.priceScore.toFixed(0)}</span>
                <span>Delivery (30%): {supplier.scoreBreakdown.deliveryScore.toFixed(0)}</span>
                <span>Reliability (30%): {supplier.scoreBreakdown.reliabilityScore.toFixed(0)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
