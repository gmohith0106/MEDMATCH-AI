'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import { Bot, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

export function ShortageRiskSection() {
  const router = useRouter();
  const { supplyRisks, startAgentRun } = useDemo();

  const handleRunAgent = () => {
    router.push('/agent');
  };

  return (
    <div className="bg-white rounded-card p-6 border border-[#ffc8d3] shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ffc8d3]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-btn bg-[#e3577c] text-white">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-[#24324a]">
              Detected Supply Risks
            </h3>
            <p className="text-xs text-[#667085] font-medium">
              Immediate clinical intervention required to prevent ward stockouts
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAgent}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold transition-all shadow-soft active:scale-98 self-start sm:self-auto"
        >
          <Bot className="w-4 h-4 text-white" />
          <span>Launch Autonomous Agent</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supplyRisks.map((risk) => {
          const isCritical = risk.priority === 'Critical';

          return (
            <div
              key={risk.id}
              className="p-5 rounded-btn bg-[#fff5f7] border border-[#ffc8d3] shadow-soft transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span
                    className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-badge uppercase tracking-wider mb-1 border ${
                      isCritical
                        ? 'bg-white text-[#e3577c] border-[#ffc8d3]'
                        : 'bg-white text-[#24324a] border-[#ffc8d3]'
                    }`}
                  >
                    {risk.priority} Risk
                  </span>
                  <h4 className="font-heading font-extrabold text-base text-[#24324a]">
                    {risk.itemName}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#667085] block font-semibold">
                    Expected Within
                  </span>
                  <span className="font-extrabold text-xs text-[#24324a] flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-[#e27094]" />
                    {risk.expectedWithinDays} Days
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-btn bg-white border border-[#ffc8d3] text-xs mb-4">
                <div>
                  <span className="text-[10px] text-[#667085] block font-medium">
                    Projected Shortage
                  </span>
                  <span className="font-heading font-extrabold text-sm text-[#e3577c]">
                    {risk.projectedShortage} units
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block font-medium">
                    Recommended Order
                  </span>
                  <span className="font-heading font-extrabold text-sm text-[#24324a]">
                    {risk.recommendedOrderQty} units
                  </span>
                </div>
              </div>

              <button
                onClick={handleRunAgent}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold transition-colors shadow-soft"
              >
                <Bot className="w-3.5 h-3.5 text-white" />
                <span>Run Procurement Agent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
