'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, TrendingDown, PiggyBank, Bot } from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

export function KpiCards() {
  const { agentState } = useDemo();

  const kpis = [
    {
      title: 'Inventory Health',
      value: '87%',
      badgeText: 'Stable',
      badgeClass: 'bg-[#fff5f7] text-[#24324a] border border-[#94d4f8]',
      valueColor: 'text-[#24324a]',
      icon: ShieldCheck,
      iconColor: 'text-[#24324a]',
      iconBg: 'bg-[#94d4f8]',
      caption: 'Across 8 tracked hospital categories',
    },
    {
      title: 'Items At Risk',
      value: '6',
      badgeText: 'Needs Attention',
      badgeClass: 'bg-[#fff5f7] text-[#e27094] border border-[#ffc8d3]',
      valueColor: 'text-[#24324a]',
      icon: AlertTriangle,
      iconColor: 'text-[#24324a]',
      iconBg: 'bg-[#9ddcfd]',
      caption: 'Approaching safety reorder limits',
    },
    {
      title: 'Predicted Shortages',
      value: '3',
      badgeText: 'Next 7 Days',
      badgeClass: 'bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3]',
      valueColor: 'text-[#e3577c]',
      icon: TrendingDown,
      iconColor: 'text-white',
      iconBg: 'bg-[#e3577c]',
      caption: 'N95 Masks & IV Sets imminent risk',
    },
    {
      title: 'Potential Savings',
      value: '₹18,450',
      badgeText: 'Estimated',
      badgeClass: 'bg-[#fff5f7] text-[#24324a] border border-[#ffc8d3]',
      valueColor: 'text-[#24324a]',
      icon: PiggyBank,
      iconColor: 'text-white',
      iconBg: 'bg-[#e27094]',
      caption: 'Via autonomous supplier comparison',
    },
    {
      title: 'Agent Status',
      value: agentState.status === 'running' ? 'EXECUTING' : 'ACTIVE',
      badgeText: 'Monitoring',
      badgeClass: 'bg-[#fff5f7] text-[#24324a] border border-[#94d4f8]',
      valueColor: 'text-[#24324a]',
      icon: Bot,
      iconColor: 'text-[#24324a]',
      iconBg: 'bg-[#94d4f8]',
      caption: 'Continuous 24/7 telemetry sync',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.title}
            className="bg-white rounded-card p-5 border border-[#ffc8d3] shadow-card hover:border-[#e27094] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-[#667085] tracking-wide">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-btn ${kpi.iconBg}`}>
                  <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className={`font-heading font-extrabold text-2xl tracking-tight ${kpi.valueColor}`}>
                  {kpi.value}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-badge uppercase tracking-wider ${kpi.badgeClass}`}
                >
                  {kpi.badgeText}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#667085] font-medium pt-2 border-t border-[#ffc8d3]">
              {kpi.caption}
            </p>
          </div>
        );
      })}
    </div>
  );
}
