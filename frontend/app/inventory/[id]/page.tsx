'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import { DemandChart } from '@/components/inventory/DemandChart';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  ArrowLeft,
  Bot,
  AlertTriangle,
} from 'lucide-react';

export default function InventoryItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { inventory } = useDemo();

  const id = params?.id as string;
  const item = inventory.find((i) => i.id === id) || inventory[0];

  const handleAskAgent = () => {
    router.push('/agent');
  };

  const isCritical = item.status === 'Critical';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="p-2 rounded-btn bg-white hover:bg-[#fff5f7] text-[#24324a] border border-[#ffc8d3] transition-colors shadow-soft"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-badge bg-[#fff5f7] text-[#24324a] border border-[#ffc8d3] uppercase">
                {item.category}
              </span>
              <StatusBadge status={item.status} size="sm" />
            </div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#24324a] mt-0.5">
              {item.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAskAgent}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white font-bold text-xs transition-all shadow-soft active:scale-98"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>ASK PROCUREMENT AGENT</span>
          </button>
        </div>
      </div>

      {/* 5 Clinical Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-card p-5 border border-[#ffc8d3] shadow-card">
          <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider block mb-1">
            Current Stock
          </span>
          <span className="font-heading font-extrabold text-2xl text-[#24324a]">
            {item.currentStock.toLocaleString()}
          </span>
          <p className="text-[11px] text-[#667085] mt-1">{item.unit} available</p>
        </div>

        <div className="bg-white rounded-card p-5 border border-[#ffc8d3] shadow-card">
          <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider block mb-1">
            Daily Usage
          </span>
          <span className="font-heading font-extrabold text-2xl text-[#24324a]">
            {item.dailyUsage}
          </span>
          <p className="text-[11px] text-[#667085] mt-1">units / day burn rate</p>
        </div>

        <div className="bg-white rounded-card p-5 border border-[#ffc8d3] shadow-card">
          <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider block mb-1">
            7-Day Demand
          </span>
          <span className="font-heading font-extrabold text-2xl text-[#24324a]">
            {item.predictedDemand7d}
          </span>
          <p className="text-[11px] text-[#667085] mt-1">projected consumption</p>
        </div>

        <div className="bg-white rounded-card p-5 border border-[#ffc8d3] shadow-card">
          <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider block mb-1">
            Days Remaining
          </span>
          <span
            className={`font-heading font-extrabold text-2xl ${
              item.daysRemaining <= 4
                ? 'text-[#e3577c]'
                : 'text-[#24324a]'
            }`}
          >
            {item.daysRemaining}
          </span>
          <p className="text-[11px] text-[#667085] mt-1">before safety breach</p>
        </div>

        <div className="bg-white rounded-card p-5 border border-[#ffc8d3] shadow-card">
          <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider block mb-1">
            Expected Shortage
          </span>
          <span
            className={`font-heading font-extrabold text-2xl ${
              item.expectedShortage > 0 ? 'text-[#e3577c]' : 'text-[#24324a]'
            }`}
          >
            {item.expectedShortage > 0 ? `${item.expectedShortage} units` : 'None'}
          </span>
          <p className="text-[11px] text-[#667085] mt-1">
            {item.expectedShortage > 0 ? 'deficit in 7 days' : 'adequately buffered'}
          </p>
        </div>
      </div>

      {/* Demand Forecast Recharts Panel */}
      <div className="bg-white rounded-card p-6 sm:p-8 border border-[#ffc8d3] shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ffc8d3]">
          <div>
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#24324a]">
              Inventory vs Forecasted Demand
            </h3>
            <p className="text-xs text-[#667085] font-medium">
              Daily trajectory showing projected stock exhaustion against safety threshold ({item.reorderPoint} units)
            </p>
          </div>

          <span className="text-[11px] font-semibold text-[#24324a] bg-[#fff5f7] px-3 py-1 rounded-badge border border-[#ffc8d3]">
            Model: 7-Day Moving Average
          </span>
        </div>

        {/* Chart */}
        <DemandChart data={item.historicalDemand} reorderPoint={item.reorderPoint} />
      </div>

      {/* Critical Shortage Warning Banner */}
      {isCritical && (
        <div className="rounded-card p-6 bg-[#fff5f7] border border-[#ffc8d3] shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-btn bg-[#e3577c] text-white mt-0.5">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-sm text-[#24324a]">
                Imminent Shortage Risk: {item.expectedShortage} units deficit projected
              </h4>
              <p className="text-xs text-[#667085] font-medium mt-0.5">
                Current stock will exhaust in <strong className="text-[#24324a]">{item.daysRemaining} days</strong>. Autonomous supplier ranking and order dispatch is recommended.
              </p>
            </div>
          </div>

          <button
            onClick={handleAskAgent}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white font-bold text-xs transition-all shadow-soft active:scale-98 whitespace-nowrap"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>Launch Agent For {item.name}</span>
          </button>
        </div>
      )}
    </div>
  );
}
