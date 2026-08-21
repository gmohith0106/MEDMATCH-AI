'use client';

import React, { useState } from 'react';
import { ForecastItem } from '@/types/forecast';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Info, ShieldCheck } from 'lucide-react';

export function ForecastCard({ forecast }: { forecast: ForecastItem }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-white rounded-card p-5 border border-[#ffc8d3] shadow-card hover:border-[#e27094] transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
              {forecast.category}
            </span>
            <h4 className="font-heading font-extrabold text-sm text-[#24324a] leading-snug">
              {forecast.itemName}
            </h4>
          </div>
          <StatusBadge status={forecast.urgency} size="sm" />
        </div>

        {/* Model Disclaimer Badge */}
        <div className="relative mb-3">
          <div
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-badge bg-[#fff5f7] border border-[#ffc8d3] text-[10px] font-bold text-[#24324a] cursor-pointer hover:bg-white transition-colors"
          >
            <Info className="w-3 h-3 text-[#667085]" />
            <span>AI Predictive Model</span>
          </div>

          {showTooltip && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-white text-[#24324a] p-2.5 rounded-card shadow-modal border border-[#ffc8d3] text-[11px] z-30 animate-fadeIn font-normal">
              <p className="font-medium text-[#667085] leading-tight">
                Demand forecast computed using 30-day moving average consumption rates and clinical ward burn velocities.
              </p>
            </div>
          )}
        </div>

        {/* Metric stats */}
        <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-btn bg-[#fff5f7] border border-[#ffc8d3] text-xs">
          <div>
            <span className="text-[10px] text-[#667085] block font-medium">Current Stock</span>
            <span className="font-heading font-bold text-sm text-[#24324a]">
              {forecast.currentStock.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#667085] block font-medium">7-Day Demand</span>
            <span className="font-heading font-bold text-sm text-[#24324a]">
              {forecast.projectedDemand7d.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#667085] block font-medium">Daily Burn Rate</span>
            <span className="font-semibold text-xs text-[#24324a]">
              {forecast.dailyUsage} / day
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#667085] block font-medium">Deficit Risk</span>
            <span
              className={`font-bold text-xs ${
                forecast.expectedShortage > 0 ? 'text-[#e3577c]' : 'text-[#667085]'
              }`}
            >
              {forecast.expectedShortage > 0
                ? `-${forecast.expectedShortage} units`
                : 'Balanced'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer horizon */}
      <div className="pt-2 border-t border-[#ffc8d3] flex items-center justify-between text-[11px]">
        <span className="text-[#667085] font-medium">
          Risk Horizon: <strong className="text-[#24324a]">{forecast.riskHorizonDays} days</strong>
        </span>
        <span className="font-bold text-[#24324a] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#94d4f8]" />
          {forecast.confidenceScore}% Model Fit
        </span>
      </div>
    </div>
  );
}
