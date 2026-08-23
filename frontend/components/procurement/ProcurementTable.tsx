'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  ClipboardCheck,
  Search,
  Eye,
  Building2,
} from 'lucide-react';
import { formatInr } from '@/lib/utils';

export function ProcurementTable() {
  const router = useRouter();
  const { procurements } = useDemo();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filterTabs = ['All', 'Pending', 'Approved', 'Completed', 'Cancelled'];

  const filtered = procurements.filter((req) => {
    const matchesTab = activeTab === 'All' || req.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      req.requestId.toLowerCase().includes(search.toLowerCase()) ||
      req.itemName.toLowerCase().includes(search.toLowerCase()) ||
      req.supplierName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Filters & Search bar */}
      <div className="bg-white rounded-card p-4 sm:p-5 border border-[#ffc8d3] shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-btn text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#e3577c] text-white shadow-soft'
                  : 'bg-[#ffc8d3] hover:bg-[#e27094] hover:text-white text-[#e3577c]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search request ID, item, supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-input border border-[#ffc8d3] text-xs text-[#24324a] placeholder-[#667085] focus:outline-none focus:border-[#e27094] bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-card border border-[#ffc8d3] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#ffc8d3] text-[#24324a] font-bold border-b border-[#ffc8d3] uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-6">Request ID</th>
                <th className="py-3.5 px-4">Medical Supply Item</th>
                <th className="py-3.5 px-4 text-right">Quantity</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4 text-right">Estimated Cost</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffc8d3] text-[#24324a] bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#667085]">
                    <ClipboardCheck className="w-8 h-8 mx-auto text-[#667085] mb-2" />
                    No procurement requests match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => router.push(`/procurement/${req.id}`)}
                    className="hover:bg-[#fff5f7] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 font-mono font-extrabold text-xs text-[#24324a]">
                      <span className="group-hover:underline">{req.requestId}</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#24324a]">{req.itemName}</td>
                    <td className="py-4 px-4 text-right font-semibold text-[#24324a]">
                      {req.quantity.toLocaleString()}{' '}
                      <span className="text-[10px] font-normal text-[#667085]">{req.unit}</span>
                    </td>
                    <td className="py-4 px-4 font-medium text-[#24324a] flex items-center gap-1.5 pt-4">
                      <Building2 className="w-3.5 h-3.5 text-[#667085] flex-shrink-0" />
                      <span className="truncate max-w-[180px]">{req.supplierName}</span>
                    </td>
                    <td className="py-4 px-4 text-right font-heading font-extrabold text-xs text-[#24324a]">
                      {formatInr(req.estimatedCost)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-[#667085] font-medium">{req.createdAt}</td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/procurement/${req.id}`}
                        className="inline-flex items-center gap-1 p-1.5 rounded-btn hover:bg-[#fff5f7] text-[#667085] hover:text-[#24324a] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fff5f7] border-t border-[#ffc8d3] flex items-center justify-between text-xs text-[#667085] font-medium">
          <span>
            Total Requests: <strong className="text-[#24324a]">{procurements.length}</strong>
          </span>
          <span className="text-[11px]">
            Protocol: <strong className="text-[#24324a]">Autonomous Procurement Pipeline</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
