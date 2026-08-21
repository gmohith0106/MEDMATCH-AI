'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Bot, ArrowUpRight, AlertTriangle, Eye, Upload } from 'lucide-react';

export function CriticalTable() {
  const router = useRouter();
  const { inventory } = useDemo();

  const criticalItems = inventory.slice(0, 5);

  const handleAskAgent = () => {
    router.push('/agent');
  };

  return (
    <div className="bg-white rounded-card border border-[#ffc8d3] shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#ffc8d3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-extrabold text-lg text-[#24324a]">
              Critical Medical Inventory
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-badge bg-[#fff5f7] text-[#24324a] border border-[#ffc8d3]">
              Live Audit
            </span>
          </div>
          <p className="text-xs text-[#667085] font-medium mt-0.5">
            Supplies approaching or below their recommended safety threshold.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAskAgent}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold transition-all shadow-soft active:scale-98"
          >
            <Bot className="w-3.5 h-3.5 text-white" />
            <span>Run Procurement Agent</span>
          </button>

          <Link
            href="/inventory"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-btn bg-[#ffc8d3] hover:bg-[#e27094] hover:text-white text-[#e3577c] text-xs font-bold transition-colors"
          >
            <span>All Supplies</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#fff5f7] text-[#24324a] font-bold border-b border-[#ffc8d3] uppercase text-[10px] tracking-wider">
              <th className="py-3.5 px-6">Item</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-right">Current Stock</th>
              <th className="py-3.5 px-4 text-right">Daily Usage</th>
              <th className="py-3.5 px-4 text-center">Days Remaining</th>
              <th className="py-3.5 px-4 text-right">Predicted Demand</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ffc8d3] text-[#24324a] bg-white">
            {criticalItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-xs text-[#667085]">
                  <p className="font-bold text-[#24324a] mb-1">No inventory data available</p>
                  <p className="mb-3">Connect your hospital ERP or import CSV SKU records to track inventory.</p>
                  <Link
                    href="/inventory/import"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#e3577c] text-white font-bold text-xs shadow-soft"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import Hospital Inventory</span>
                  </Link>
                </td>
              </tr>
            ) : (
              criticalItems.map((item) => {
                const isUrgent = item.status === 'Critical';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#fff5f7] transition-colors group"
                  >
                    <td className="py-4 px-6 font-bold text-xs text-[#24324a]">
                      <Link
                        href={`/inventory/${item.id}`}
                        className="hover:underline flex items-center gap-2"
                      >
                        {item.name}
                        {isUrgent && (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#e3577c] flex-shrink-0" />
                        )}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-[#667085] font-medium">{item.category}</td>
                    <td className="py-4 px-4 text-right font-bold text-[#24324a]">
                      {item.currentStock.toLocaleString()}{' '}
                      <span className="text-[10px] font-normal text-[#667085]">{item.unit}</span>
                    </td>
                    <td className="py-4 px-4 text-right text-[#24324a] font-medium">
                      {item.dailyUsage}/day
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`font-mono font-bold ${
                          item.daysRemaining <= 3
                            ? 'text-[#e3577c]'
                            : item.daysRemaining <= 7
                            ? 'text-[#e27094]'
                            : 'text-[#24324a]'
                        }`}
                      >
                        {item.daysRemaining}d
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-[#24324a] font-medium">
                      {item.predictedDemand7d}{' '}
                      <span className="text-[10px] text-[#667085]">/ 7d</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Link
                        href={`/inventory/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#e3577c] hover:underline"
                      >
                        <span>Details</span>
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
