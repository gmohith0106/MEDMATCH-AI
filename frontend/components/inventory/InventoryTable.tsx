'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import { Search, Bot, AlertTriangle, AlertOctagon, CheckCircle2, ArrowRight } from 'lucide-react';

export function InventoryTable() {
  const router = useRouter();
  const { inventory, selectTargetItemPreset } = useDemo();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  // Map inventory items with calculated demand/deficit values
  const tableData = [
    {
      id: 'surgical-gloves',
      presetKey: 'gloves',
      name: 'Surgical Gloves (Sterile, Latex-Free)',
      category: 'PPE & Surgical',
      unit: 'boxes',
      currentStock: 1250,
      predictedDemand: 2900,
      expectedDeficit: 1650,
      risk: 'CRITICAL',
      stockoutDate: 'In 2.8 days',
    },
    {
      id: 'n95-masks',
      presetKey: 'n95',
      name: 'N95 Respirator Masks (NIOSH Certified)',
      category: 'PPE & Surgical',
      unit: 'boxes',
      currentStock: 120,
      predictedDemand: 294,
      expectedDeficit: 174,
      risk: 'CRITICAL',
      stockoutDate: 'In 2.9 days',
    },
    {
      id: 'iv-cannula-20g',
      presetKey: 'saline',
      name: 'Sterile IV Infusion Sets & Cannulas',
      category: 'Consumables',
      unit: 'sets',
      currentStock: 85,
      predictedDemand: 154,
      expectedDeficit: 69,
      risk: 'WARNING',
      stockoutDate: 'In 3.9 days',
    },
    {
      id: 'syringes-10ml',
      presetKey: 'syringes',
      name: 'Sterile Disposable Syringes 10ml',
      category: 'Consumables',
      unit: 'boxes',
      currentStock: 210,
      predictedDemand: 266,
      expectedDeficit: 56,
      risk: 'WARNING',
      stockoutDate: 'In 5.5 days',
    },
    {
      id: 'antibiotic-vials',
      presetKey: 'n95',
      name: 'Antibiotic Vials (Ceftriaxone 1g)',
      category: 'Pharmaceuticals',
      unit: 'vials',
      currentStock: 340,
      predictedDemand: 280,
      expectedDeficit: 0,
      risk: 'HEALTHY',
      stockoutDate: '8.5+ days (Safe)',
    },
  ];

  const filteredItems = tableData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesRisk = riskFilter === 'All' || item.risk === riskFilter;
    return matchesSearch && matchesCategory && matchesRisk;
  });

  const categories = ['All', 'PPE & Surgical', 'Consumables', 'Pharmaceuticals'];
  const risks = ['All', 'CRITICAL', 'WARNING', 'HEALTHY'];

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medical item or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {risks.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Item</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5 text-right">Current Stock</th>
                <th className="px-4 py-3.5 text-right">Predicted Demand (7d)</th>
                <th className="px-4 py-3.5 text-right">Expected Deficit</th>
                <th className="px-4 py-3.5 text-center">Risk</th>
                <th className="px-4 py-3.5 text-center">Stockout Date</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isCritical = item.risk === 'CRITICAL';
                const isWarning = item.risk === 'WARNING';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.unit}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">{item.category}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-slate-900">
                      {item.currentStock.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-700">
                      {item.predictedDemand.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold">
                      {item.expectedDeficit > 0 ? (
                        <span className="text-rose-600">-{item.expectedDeficit.toLocaleString()}</span>
                      ) : (
                        <span className="text-slate-500">0 (Surplus)</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {isCritical && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertOctagon className="w-3 h-3 text-rose-600" />
                          CRITICAL
                        </span>
                      )}
                      {isWarning && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          WARNING
                        </span>
                      )}
                      {!isCritical && !isWarning && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-slate-500" />
                          HEALTHY
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center text-xs font-medium text-slate-600">
                      {item.stockoutDate}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          selectTargetItemPreset(item.presetKey);
                          router.push('/procurement');
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                          isCritical
                            ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Procure</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
