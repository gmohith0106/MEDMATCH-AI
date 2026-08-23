'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import {
  TrendingUp,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Bot,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function ForecastPage() {
  const router = useRouter();
  const { selectTargetItemPreset } = useDemo();
  const [selectedItem, setSelectedItem] = useState('gloves');

  const forecastData = [
    {
      key: 'gloves',
      name: 'Surgical Gloves (Sterile, Latex-Free)',
      category: 'PPE & Surgical',
      currentStock: 1250,
      dailyBurn: 414,
      forecastDemand: 2900,
      expectedDeficit: 1650,
      confidence: '98.5%',
      stockoutEstimate: '2.8 Days',
      risk: 'CRITICAL',
      chartHistory: [380, 410, 395, 430, 415, 420, 440],
      chartForecast: [415, 425, 430, 440, 450, 460, 470],
    },
    {
      key: 'n95',
      name: 'N95 Respirator Masks (NIOSH)',
      category: 'PPE & Surgical',
      currentStock: 120,
      dailyBurn: 42,
      forecastDemand: 294,
      expectedDeficit: 174,
      confidence: '96.2%',
      stockoutEstimate: '2.9 Days',
      risk: 'CRITICAL',
      chartHistory: [38, 40, 45, 41, 44, 43, 45],
      chartForecast: [43, 44, 46, 47, 48, 50, 52],
    },
    {
      key: 'saline',
      name: 'Sterile IV Infusion Sets & Cannulas',
      category: 'Consumables',
      currentStock: 85,
      dailyBurn: 22,
      forecastDemand: 154,
      expectedDeficit: 69,
      confidence: '94.0%',
      stockoutEstimate: '3.9 Days',
      risk: 'WARNING',
      chartHistory: [18, 20, 22, 21, 24, 23, 25],
      chartForecast: [23, 24, 25, 26, 27, 28, 29],
    },
    {
      key: 'syringes',
      name: 'Sterile Disposable Syringes 10ml',
      category: 'Consumables',
      currentStock: 210,
      dailyBurn: 38,
      forecastDemand: 266,
      expectedDeficit: 56,
      confidence: '95.8%',
      stockoutEstimate: '5.5 Days',
      risk: 'WARNING',
      chartHistory: [35, 36, 40, 38, 39, 41, 40],
      chartForecast: [39, 40, 41, 42, 43, 44, 45],
    },
  ];

  const activeItemData = forecastData.find((f) => f.key === selectedItem) || forecastData[0];

  return (
    <div className="space-y-6">
      {/* Header & Clinical Context */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Predictive Clinical Demand Forecasts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical 7-day consumption modeling based on operating room scheduling, inpatient census, and historical consumption rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Focus SKU:</span>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            {forecastData.map((f) => (
              <option key={f.key} value={f.key}>
                {f.name} ({f.risk})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Clean SVG Line Chart: Usage History vs Forecast Demand */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {activeItemData.name} â€” Historical Consumption vs. 7-Day Projected Demand
              </h3>
              <p className="text-xs text-slate-500">Daily burn rate tracking against remaining stockout margin</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              <span className="text-slate-600">Past 7 Days</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-pink-600" />
              <span className="text-slate-900 font-semibold">Forecast (Next 7 Days)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300" />
              <span className="text-rose-600 font-semibold">Critical Deficit Zone</span>
            </div>
          </div>
        </div>

        {/* SVG Chart Graphic */}
        <div className="relative w-full h-64 pt-2">
          <svg viewBox="0 0 800 240" className="w-full h-full">
            {/* Background Grid */}
            <line x1="60" y1="30" x2="780" y2="30" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="60" y1="80" x2="780" y2="80" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="60" y1="130" x2="780" y2="130" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="60" y1="180" x2="780" y2="180" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="60" y1="210" x2="780" y2="210" stroke="#cbd5e1" strokeWidth="1" />

            {/* Y Axis Labels */}
            <text x="45" y="34" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">500</text>
            <text x="45" y="84" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">375</text>
            <text x="45" y="134" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">250</text>
            <text x="45" y="184" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">125</text>
            <text x="45" y="214" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">0</text>

            {/* Deficit Zone Highlight on right side */}
            <rect x="420" y="30" width="360" height="180" fill="#fff1f2" opacity="0.4" />
            <line x1="420" y1="20" x2="420" y2="210" stroke="#0d9488" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="425" y="25" className="text-[10px] fill-pink-700 font-bold">TODAY (INVENTORY: {activeItemData.currentStock.toLocaleString()})</text>

            {/* Past 7 Days Line (Slate) */}
            <polyline
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              points="80,120 130,105 180,115 230,95 280,105 330,100 380,85 420,75"
            />
            {/* Past Data points */}
            <circle cx="80" cy="120" r="3.5" fill="#64748b" />
            <circle cx="130" cy="105" r="3.5" fill="#64748b" />
            <circle cx="180" cy="115" r="3.5" fill="#64748b" />
            <circle cx="230" cy="95" r="3.5" fill="#64748b" />
            <circle cx="280" cy="105" r="3.5" fill="#64748b" />
            <circle cx="330" cy="100" r="3.5" fill="#64748b" />
            <circle cx="380" cy="85" r="3.5" fill="#64748b" />
            <circle cx="420" cy="75" r="4.5" fill="#0f2744" />

            {/* Forecast Line (Teal) */}
            <polyline
              fill="none"
              stroke="#0d9488"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              points="420,75 480,68 540,60 600,52 660,45 720,38 760,32"
            />
            {/* Forecast Points */}
            <circle cx="480" cy="68" r="3.5" fill="#0d9488" />
            <circle cx="540" cy="60" r="3.5" fill="#0d9488" />
            <circle cx="600" cy="52" r="3.5" fill="#0d9488" />
            <circle cx="660" cy="45" r="3.5" fill="#0d9488" />
            <circle cx="720" cy="38" r="3.5" fill="#0d9488" />
            <circle cx="760" cy="32" r="4.5" fill="#e11d48" />

            {/* X Axis Labels */}
            <text x="80" y="230" textAnchor="middle" className="text-[10px] fill-slate-400">Day -7</text>
            <text x="180" y="230" textAnchor="middle" className="text-[10px] fill-slate-400">Day -5</text>
            <text x="280" y="230" textAnchor="middle" className="text-[10px] fill-slate-400">Day -3</text>
            <text x="380" y="230" textAnchor="middle" className="text-[10px] fill-slate-400">Day -1</text>
            <text x="420" y="230" textAnchor="middle" className="text-[10px] fill-slate-900 font-bold">Now</text>
            <text x="540" y="230" textAnchor="middle" className="text-[10px] fill-slate-600">Day +2</text>
            <text x="660" y="230" textAnchor="middle" className="text-[10px] fill-slate-600">Day +4</text>
            <text x="760" y="230" textAnchor="middle" className="text-[10px] fill-rose-600 font-bold">Day +7</text>
          </svg>
        </div>
      </div>

      {/* Main Forecast Demand Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">Calculated Clinical Demand Projections</h3>
          <p className="text-xs text-slate-500">Comparison of current available inventory versus 7-day projected hospital demand</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Item</th>
                <th className="px-4 py-3.5 text-right">Current Stock</th>
                <th className="px-4 py-3.5 text-right">Daily Consumption</th>
                <th className="px-4 py-3.5 text-right">Forecast Demand (7d)</th>
                <th className="px-4 py-3.5 text-right">Expected Deficit</th>
                <th className="px-4 py-3.5 text-center">Confidence</th>
                <th className="px-4 py-3.5 text-center">Stockout Estimate</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {forecastData.map((item) => {
                const isCritical = item.risk === 'CRITICAL';
                return (
                  <tr key={item.key} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      <div>
                        <p>{item.name}</p>
                        <p className="text-xs text-slate-500 font-normal">{item.category}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-slate-900">
                      {item.currentStock.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-600">
                      {item.dailyBurn} units/day
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-slate-900">
                      {item.forecastDemand.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold">
                      {item.expectedDeficit > 0 ? (
                        <span className="text-rose-600">-{item.expectedDeficit.toLocaleString()}</span>
                      ) : (
                        <span className="text-slate-500">Surplus</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center font-medium text-slate-700">
                      {item.confidence}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        isCritical ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.stockoutEstimate}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          selectTargetItemPreset(item.key);
                          router.push('/procurement');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold transition-colors"
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
