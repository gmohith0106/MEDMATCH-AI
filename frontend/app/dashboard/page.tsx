'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import {
  Package,
  AlertTriangle,
  AlertOctagon,
  Bot,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Building2,
} from 'lucide-react';
import { getAlgorandExplorerUrl, formatAlgorandAddress } from '@/lib/x402';

export default function DashboardOverviewPage() {
  const router = useRouter();
  const {
    inventory,
    procurements,
    payments,
    selectTargetItemPreset,
  } = useDemo();

  // Calculate Metrics
  const totalItems = inventory.length || 5;
  const criticalItems = inventory.filter((item) => item.status === 'Critical').length || 2;
  const predictedShortages = inventory.filter((item) => item.status !== 'Healthy').length || 3;
  const activeRecommendations = procurements.filter((p) => p.status === 'Pending').length || 1;

  // Latest verified payment
  const latestPayment = payments.find(
    (p) => p.status === 'PAYMENT_SETTLED' || p.status === 'PAYMENT_VERIFIED' || p.status === 'VERIFIED'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Overview */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Autonomous Monitoring Active
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">CityCare General Hospital</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Hospital Procurement Command Center</h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Real-time clinical stock tracking, predictive shortage analysis, and autonomous x402-enabled supplier intelligence on Algorand TestNet.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/procurement"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Bot className="w-4 h-4" />
            <span>Launch Procurement Agent</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4 Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Inventory Items */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inventory Items</span>
            <div className="p-2 rounded-md bg-slate-100 text-slate-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalItems}</span>
            <span className="text-xs font-medium text-slate-500">Tracked SKUs</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">100% active hospital wards</p>
        </div>

        {/* Metric 2: Predicted Shortages */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Predicted Shortages</span>
            <div className="p-2 rounded-md bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">{predictedShortages}</span>
            <span className="text-xs font-medium text-slate-500">within 7 days</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Based on projected consumption</p>
        </div>

        {/* Metric 3: Critical Shortages */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Critical Shortages</span>
            <div className="p-2 rounded-md bg-rose-50 text-rose-600">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{criticalItems}</span>
            <span className="text-xs font-medium text-rose-600">&lt; 3 days stock</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Requires immediate replenishment</p>
        </div>

        {/* Metric 4: Active Procurement Recommendations */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Recommendations</span>
            <div className="p-2 rounded-md bg-teal-50 text-teal-600">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-teal-700">{activeRecommendations}</span>
            <span className="text-xs font-medium text-slate-500">Awaiting Approval</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">AI-evaluated with supplier intelligence</p>
        </div>
      </div>

      {/* Main Grid: Critical Inventory Risks + Latest Recommendation & Verified Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Critical Inventory Risks Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Critical Supply Shortage Risks</h3>
              <p className="text-xs text-slate-500">High-priority supplies approaching exhaustion</p>
            </div>
            <Link
              href="/inventory"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>View Full Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-3.5">Medical Item</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Stock / Demand</th>
                  <th className="px-4 py-3.5">Expected Deficit</th>
                  <th className="px-4 py-3.5">Risk</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Primary Story Row: Surgical Gloves */}
                <tr className="hover:bg-slate-50/80 transition-colors bg-rose-50/20">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>
                      <p className="font-semibold text-slate-900">Surgical Gloves (Sterile, Latex-Free)</p>
                      <p className="text-xs text-slate-500">SKU: SURG-GLV-002 • 1,250 boxes available</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">PPE & Surgical</td>
                  <td className="px-4 py-3.5 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">1,250</span> / 2,900
                  </td>
                  <td className="px-4 py-3.5 text-xs font-bold text-rose-600">
                    -1,650 boxes
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-700">
                      CRITICAL
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => {
                        selectTargetItemPreset('gloves');
                        router.push('/procurement');
                      }}
                      className="px-3 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
                    >
                      Procure
                    </button>
                  </td>
                </tr>

                {/* Secondary Row: N95 Masks */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>
                      <p className="font-semibold text-slate-900">N95 Respirator Masks</p>
                      <p className="text-xs text-slate-500">SKU: N95-MSK-001 • 120 boxes available</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">Respiratory PPE</td>
                  <td className="px-4 py-3.5 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">120</span> / 294
                  </td>
                  <td className="px-4 py-3.5 text-xs font-bold text-rose-600">
                    -174 boxes
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-700">
                      CRITICAL
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => {
                        selectTargetItemPreset('n95');
                        router.push('/procurement');
                      }}
                      className="px-3 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
                    >
                      Procure
                    </button>
                  </td>
                </tr>

                {/* Third Row: IV Sets */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>
                      <p className="font-semibold text-slate-900">Sterile IV Infusion Sets</p>
                      <p className="text-xs text-slate-500">SKU: IV-SET-004 • 85 sets available</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">Consumables</td>
                  <td className="px-4 py-3.5 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">85</span> / 154
                  </td>
                  <td className="px-4 py-3.5 text-xs font-semibold text-amber-600">
                    -69 sets
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">
                      WARNING
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => {
                        selectTargetItemPreset('saline');
                        router.push('/procurement');
                      }}
                      className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Procure
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Latest Procurement Recommendation + Verified Payment */}
        <div className="space-y-6">
          {/* Latest Recommendation Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                LATEST AI RECOMMENDATION
              </span>
              <span className="text-xs text-slate-400">Surgical Gloves</span>
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-900">MediSupply Healthcare Solutions</h4>
              <p className="text-xs text-slate-500 mt-0.5">Top-Ranked Supplier (Score: 94.6 / 100)</p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100 text-xs">
              <div>
                <span className="text-slate-500">Order Quantity:</span>
                <p className="font-bold text-slate-900">1,650 boxes</p>
              </div>
              <div>
                <span className="text-slate-500">Unit Price:</span>
                <p className="font-bold text-slate-900">$1.85 / pair</p>
              </div>
              <div>
                <span className="text-slate-500">Est. Lead Time:</span>
                <p className="font-bold text-slate-900">2 Days (Before Stockout)</p>
              </div>
              <div>
                <span className="text-slate-500">Reliability Score:</span>
                <p className="font-bold text-emerald-600">99.2% Verified</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
              <strong className="text-slate-900">AI Rationale:</strong> Meets the critical 1,650 box deficit with 2-day delivery window prior to stockout deadline, verified ISO sterile certification, and volume pricing.
            </p>

            <div className="pt-1">
              <Link
                href="/procurement"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                <span>Review & Approve Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Verified Payment Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                Latest Verified Micropayment
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                VERIFIED
              </span>
            </div>

            {latestPayment ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Resource:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[180px]">
                    /api/paid/supplier-intelligence
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Settled Amount:</span>
                  <span className="font-bold text-slate-900">0.02 USDC</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Settlement Network:</span>
                  <span className="font-medium text-slate-700">Algorand TestNet</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono text-slate-700 truncate max-w-[140px]">
                    {latestPayment.transactionId ? formatAlgorandAddress(latestPayment.transactionId, 6) : 'Settled'}
                  </span>
                </div>

                {latestPayment.transactionId && !latestPayment.transactionId.startsWith('mock-') && (
                  <a
                    href={getAlgorandExplorerUrl(latestPayment.transactionId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-teal-700 transition-colors"
                  >
                    <span>View on Lora TestNet Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded border border-dashed border-slate-200">
                <p>No verified payments yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Payments record automatically during autonomous agent runs.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
