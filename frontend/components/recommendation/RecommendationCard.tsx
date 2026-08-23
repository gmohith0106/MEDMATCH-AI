'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import {
  Sparkles,
  Building2,
  PiggyBank,
  CheckCircle2,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { formatInr } from '@/lib/utils';

export function RecommendationCard() {
  const { agentState, setIsApprovalModalOpen } = useDemo();
  const rec = agentState.recommendationResult;
  const target = agentState.targetItem;

  return (
    <div className="rounded-card bg-white p-6 sm:p-8 border-2 border-[#e3577c] shadow-card relative overflow-hidden">
      {/* Top Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#e3577c]" />

      {/* Top Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#ffc8d3] relative z-10 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-btn bg-[#e3577c] text-white flex items-center justify-center font-bold shadow-soft">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-badge bg-[#e3577c] text-white uppercase tracking-wider">
                RECOMMENDED SUPPLIER
              </span>
              <span className="text-xs text-[#667085] font-semibold font-mono">
                {agentState.runId || 'RUN-98421'}
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#24324a] mt-0.5">
              {rec?.supplierName || 'MediSupply Healthcare Solutions'}
            </h3>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsApprovalModalOpen(true)}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white font-bold text-sm transition-all shadow-soft active:scale-98 self-start sm:self-auto"
        >
          <UserCheck className="w-4 h-4 text-white" />
          <span>APPROVE PROCUREMENT</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Order Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-[#ffc8d3] relative z-10">
        <div className="p-4 rounded-btn bg-[#fff5f7] border border-[#ffc8d3]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-1">
            Target Item
          </span>
          <h4 className="font-heading font-extrabold text-sm text-[#24324a]">
            {rec?.itemName || target.name}
          </h4>
          <span className="text-[11px] text-[#667085] font-medium">{target.category}</span>
        </div>

        <div className="p-4 rounded-btn bg-[#fff5f7] border border-[#ffc8d3]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-1">
            Order Quantity
          </span>
          <h4 className="font-heading font-extrabold text-lg text-[#24324a]">
            {rec?.quantity || target.recommendedQty} units
          </h4>
          <span className="text-[11px] text-[#667085] font-medium">@ â‚¹{(rec?.unitPrice || 9.50).toFixed(2)} / unit</span>
        </div>

        <div className="p-4 rounded-btn bg-[#fff5f7] border border-[#ffc8d3]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-1">
            Estimated Cost
          </span>
          <h4 className="font-heading font-extrabold text-xl text-[#24324a]">
            â‚¹{(rec?.totalCost || 1900).toLocaleString()}
          </h4>
          <span className="text-[11px] font-bold text-[#e27094] flex items-center gap-1">
            <PiggyBank className="w-3.5 h-3.5 text-[#e27094]" />
            â‚¹{rec?.estimatedSavings || 420} Estimated Savings
          </span>
        </div>

        <div className="p-4 rounded-btn bg-[#fff5f7] border border-[#ffc8d3]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-1">
            Lead Time & SLA
          </span>
          <h4 className="font-heading font-extrabold text-lg text-[#24324a]">
            {rec?.deliveryDays || 2}-Day Delivery
          </h4>
          <span className="text-[11px] text-[#667085] font-medium">{rec?.reliability || 98.0}% Reliability SLA</span>
        </div>
      </div>

      {/* Supplier Score & Delivery Horizon Footer */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 text-xs text-[#24324a]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#94d4f8]" />
          <span className="font-semibold">
            Overall Supplier Score: <strong className="text-[#e3577c] font-extrabold">{rec?.supplierScore || 94.6} / 100</strong>
          </span>
        </div>

        <span className="text-[#667085] font-medium">
          Mitigates projected <strong className="text-[#e3577c]">{target.shortageUnits} units shortage</strong> arriving before safety stock exhaustion.
        </span>
      </div>
    </div>
  );
}
