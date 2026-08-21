'use client';

import React from 'react';
import { ShieldCheck, TrendingUp, Clock, PackageCheck } from 'lucide-react';

export function RationaleScorecard() {
  const pillars = [
    {
      title: 'Price Evaluation',
      status: 'Strong',
      metric: '₹9.50 / unit',
      badgeClass: 'bg-white text-[#24324a] border border-[#ffc8d3]',
      description: 'Competitive tier-1 volume pricing yielding ₹420 hospital budget savings vs market median.',
      icon: TrendingUp,
    },
    {
      title: 'Delivery Lead Time',
      status: 'Strong',
      metric: '2 Days Lead Time',
      badgeClass: 'bg-white text-[#24324a] border border-[#ffc8d3]',
      description: 'Crucially clears the 2.9-day safety stock exhaustion horizon. 4 days faster than CareMed Logistics.',
      icon: Clock,
    },
    {
      title: 'Historical Reliability',
      status: 'Strong',
      metric: '98.0% SLA Fulfilled',
      badgeClass: 'bg-white text-[#24324a] border border-[#ffc8d3]',
      description: 'ISO 13485 audited supply line with flawless cold-chain and dry-pack dispatch track records.',
      icon: ShieldCheck,
    },
    {
      title: 'Live Stock Availability',
      status: 'Strong',
      metric: '5,000 Boxes on Hand',
      badgeClass: 'bg-white text-[#24324a] border border-[#ffc8d3]',
      description: 'Verified via x402 micropayment query on Algorand TestNet with instant warehouse lock.',
      icon: PackageCheck,
    },
  ];

  return (
    <div className="bg-white rounded-card p-6 sm:p-8 border border-[#ffc8d3] shadow-card space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e27094]" />
          <h3 className="font-heading font-extrabold text-lg text-[#24324a]">
            Why MedMatch selected this supplier
          </h3>
        </div>
        <p className="text-xs text-[#667085] font-normal leading-relaxed max-w-3xl">
          Based on predictive inventory trajectory analysis and validated supplier SLA benchmarks, the recommended supplier provides the optimal balance of acquisition cost, delivery lead-time, and emergency stockout mitigation.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <div
              key={pillar.title}
              className="p-4 rounded-btn bg-[#fff5f7] border border-[#ffc8d3] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-extrabold text-[#24324a]">
                    {pillar.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-badge uppercase tracking-wider bg-white text-[#24324a] border border-[#ffc8d3]">
                    {pillar.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-btn bg-white shadow-soft text-[#e27094]">
                    <Icon className="w-4 h-4 text-[#e27094]" />
                  </div>
                  <span className="font-heading font-bold text-xs text-[#24324a]">
                    {pillar.metric}
                  </span>
                </div>

                <p className="text-[11px] text-[#667085] leading-snug">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transparent AI explanation statement */}
      <div className="p-4 rounded-btn bg-[#fff5f7] border border-[#ffc8d3] flex items-start gap-3 text-xs text-[#24324a]">
        <ShieldCheck className="w-5 h-5 text-[#94d4f8] flex-shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold text-[#24324a] mb-0.5">
            Transparent Decision Rationale
          </h5>
          <p className="text-[11px] text-[#667085] leading-relaxed">
            MedMatch AI does not automatically select the lowest nominal cost vendor if the lead time introduces clinical stockout risks. Although CareMed offers ₹8.90/unit, their 6-day lead time exceeds the 2.9-day hospital safety horizon. MediSupply was selected as the optimal multi-criteria solution.
          </p>
        </div>
      </div>
    </div>
  );
}
