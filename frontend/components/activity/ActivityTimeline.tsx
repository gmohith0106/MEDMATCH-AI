'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Sparkles,
  ClipboardCheck,
  UserCheck,
  PackageSearch,
  TrendingUp,
  Coins,
  Search,
} from 'lucide-react';

const iconLookup: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Sparkles,
  ClipboardCheck,
  UserCheck,
  PackageSearch,
  TrendingUp,
  Coins,
};

export function ActivityTimeline() {
  const { activities } = useDemo();
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');

  const categories = ['all', 'agent', 'procurement', 'payment', 'inventory', 'forecast'];

  const filtered = activities.filter((act) => {
    const matchesCat = filterCategory === 'all' || act.category === filterCategory;
    const matchesSearch =
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      act.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white rounded-card p-4 sm:p-5 border border-[#ffc8d3] shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-btn text-xs font-bold capitalize transition-all whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-[#e3577c] text-white shadow-soft'
                  : 'bg-[#ffc8d3] hover:bg-[#e27094] hover:text-white text-[#e3577c]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity stream..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-input border border-[#ffc8d3] text-xs text-[#24324a] placeholder-[#667085] focus:outline-none focus:border-[#e27094] bg-white"
          />
        </div>
      </div>

      {/* Main Timeline Card */}
      <div className="bg-white rounded-card p-6 sm:p-8 border border-[#ffc8d3] shadow-card space-y-6">
        <div className="pb-4 border-b border-[#ffc8d3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-btn bg-[#e3577c] text-white">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#24324a]">
                Chronological Activity Stream
              </h3>
              <p className="text-xs text-[#667085] font-medium">
                Live audit trail of autonomous signals, payments, and human authorizations
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-[#667085] flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#94d4f8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#94d4f8]"></span>
            </span>
            Real-time Feed
          </span>
        </div>

        {/* Timeline Events */}
        <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#ffc8d3]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#667085]">
              No activity records found matching query.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = iconLookup[item.iconName] || Activity;

              let iconColor = 'text-[#94d4f8]';
              let badgeBg = 'bg-[#fff5f7] text-[#24324a] border border-[#ffc8d3]';

              if (item.status === 'alert') {
                iconColor = 'text-[#e3577c]';
                badgeBg = 'bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3]';
              } else if (item.status === 'warning') {
                iconColor = 'text-[#e27094]';
                badgeBg = 'bg-[#fff5f7] text-[#e27094] border border-[#ffc8d3]';
              }

              return (
                <div key={item.id} className="relative flex items-start gap-4 text-xs">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-1 bg-white rounded-full p-1 border border-[#ffc8d3] shadow-soft z-10">
                    <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                  </div>

                  {/* Card */}
                  <div className="flex-1 p-4 rounded-btn bg-[#fff5f7] border border-[#ffc8d3] hover:border-[#e27094] transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-extrabold text-xs sm:text-sm text-[#24324a]">
                          {item.title}
                        </h4>
                        {item.badgeText && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-badge uppercase ${badgeBg}`}>
                            {item.badgeText}
                          </span>
                        )}
                      </div>

                      <span className="font-mono text-[10px] font-semibold text-[#667085]">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#24324a] font-normal leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
