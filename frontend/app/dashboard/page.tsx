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
  Layers,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { getAlgorandExplorerUrl, formatAlgorandAddress } from '@/lib/x402';
import { LiveAlgorandTransactions } from '@/components/blockchain/LiveAlgorandTransactions';

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
    <div className="space-y-6 font-sans">
      {/* Top Banner / Hero Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl border border-[#be185d]/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#cbd5e1] text-slate-900 border border-[#ec4899]">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
              Autonomous Monitoring Active
            </span>
            <span className="text-xs text-slate-400">â€¢</span>
            <span className="text-xs text-slate-300 font-medium">CityCare General Hospital</span>
          </div>
          <h2 className="text-xl font-black text-white">Hospital Procurement Command Center</h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Real-time clinical stock tracking, predictive shortage analysis, and autonomous x402-enabled supplier intelligence on Algorand TestNet.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/procurement"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#cbd5e1] hover:bg-[#ec4899] text-slate-900 text-xs font-black transition shadow-xs"
          >
            <Bot className="w-4 h-4 text-slate-900" />
            <span>Launch Procurement Agent</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4 Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Inventory Items */}
        <div className="bg-white rounded-2xl border border-[#be185d] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inventory Items</span>
            <div className="p-2 rounded-xl bg-[#fce7f3] text-slate-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalItems}</span>
            <span className="text-xs font-medium text-slate-500">Tracked SKUs</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">100% active hospital wards</p>
        </div>

        {/* Metric 2: Predicted Shortages */}
        <div className="bg-white rounded-2xl border border-[#be185d] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Predicted Shortages</span>
            <div className="p-2 rounded-xl bg-[#fce7f3] text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{predictedShortages}</span>
            <span className="text-xs font-medium text-slate-500">within 7 days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Based on projected consumption</p>
        </div>

        {/* Metric 3: Critical Shortages */}
        <div className="bg-white rounded-2xl border border-[#be185d] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Shortages</span>
            <div className="p-2 rounded-xl bg-[#cbd5e1] text-rose-600">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600">{criticalItems}</span>
            <span className="text-xs font-bold text-rose-600">&lt; 3 days stock</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requires immediate replenishment</p>
        </div>

        {/* Metric 4: Active Procurement Recommendations */}
        <div className="bg-white rounded-2xl border border-[#be185d] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Orders</span>
            <div className="p-2 rounded-xl bg-[#fce7f3] text-pink-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-pink-800">{activeRecommendations}</span>
            <span className="text-xs font-medium text-slate-500">Auto-Evaluated</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">AI-evaluated with supplier intelligence</p>
        </div>
      </div>

      {/* Main Grid: Critical Inventory Risks + Latest Recommendation & Verified Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Critical Inventory Risks Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#be185d] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#be185d] bg-[#fce7f3] flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Critical Supply Shortage Risks</h3>
              <p className="text-xs text-slate-500">High-priority supplies approaching exhaustion</p>
            </div>
            <Link
              href="/inventory"
              className="text-xs font-bold text-pink-700 hover:text-pink-900 flex items-center gap-1"
            >
              <span>View Full Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fce7f3] border-b border-[#be185d] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Medical Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Stock / Demand</th>
                  <th className="px-4 py-3">Expected Deficit</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fce7f3]">
                {inventory.slice(0, 3).map((item, index) => (
                  <tr key={item.id || index} className={`hover:bg-[#fce7f3] transition-colors ${item.status === 'Critical' ? 'bg-[#cbd5e1]/20' : ''}`}>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-[11px] text-slate-500">SKU: {item.id} â€¢ {item.currentStock} {item.unit} available</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">{item.category}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-700">
                      <span className="font-bold text-slate-900">{item.currentStock}</span> / {item.predictedDemand7d}
                    </td>
                    <td className={`px-4 py-3.5 text-xs font-bold ${item.status === 'Critical' ? 'text-rose-600 font-black' : 'text-amber-600'}`}>
                      {item.expectedShortage > 0 ? `-${item.expectedShortage} ${item.unit}` : 'Healthy'}
                    </td>
                    <td className="px-4 py-3.5">
                      {item.status === 'Critical' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-700">CRITICAL</span>
                      ) : item.status === 'Warning' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-700">WARNING</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600">HEALTHY</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => {
                          const presetKey = item.name.toLowerCase().includes('glove') ? 'gloves' : 
                                            item.name.toLowerCase().includes('n95') ? 'n95' :
                                            item.name.toLowerCase().includes('saline') ? 'saline' : 'syringes';
                          selectTargetItemPreset(presetKey);
                          router.push('/procurement');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${item.status === 'Critical' ? 'bg-[#cbd5e1] hover:bg-[#ec4899] hover:text-white text-slate-900' : 'bg-[#fce7f3] hover:bg-[#cbd5e1] text-slate-800 border border-[#cbd5e1]'}`}
                      >
                        Procure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Latest Procurement Recommendation + Verified Payment */}
        <div className="space-y-6">
          {/* Latest Recommendation Card */}
          <div className="bg-white rounded-2xl border border-[#be185d] p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black text-slate-900 bg-[#cbd5e1] px-2.5 py-1 rounded-full border border-[#ec4899] inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                LATEST AI RECOMMENDATION
              </span>
              <span className="text-[11px] font-bold text-slate-600 bg-[#fce7f3] px-2 py-0.5 rounded border border-[#be185d]">Surgical Gloves</span>
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-900">MediSupply Healthcare Solutions</h4>
              <p className="text-xs text-slate-500 mt-0.5">Top-Ranked Supplier (Score: 94.6 / 100)</p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 border-y border-[#be185d] text-xs">
              <div>
                <span className="text-slate-500 text-[11px]">Order Quantity:</span>
                <p className="font-bold text-slate-900">1,650 boxes</p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Unit Price:</span>
                <p className="font-bold text-slate-900">$1.85 / pair</p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Est. Lead Time:</span>
                <p className="font-bold text-slate-900">2 Days (Pre-Stockout)</p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Reliability Score:</span>
                <p className="font-bold text-slate-600">99.2% Verified</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-[#fce7f3] p-2.5 rounded-xl border border-[#be185d] leading-relaxed">
              <strong className="text-slate-900">AI Rationale:</strong> Meets the critical 1,650 box deficit with 2-day delivery window prior to stockout deadline, verified ISO sterile certification, and volume pricing.
            </p>

            <div className="pt-1">
              <Link
                href="/procurement"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#ec4899] text-xs font-bold transition shadow-xs"
              >
                <span>View Procurement Intelligence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Verified Payment Card */}
          <div className="bg-white rounded-2xl border border-[#be185d] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-pink-600" />
                Latest Verified Micropayment
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-300">
                <CheckCircle2 className="w-3 h-3 text-slate-500" />
                VERIFIED
              </span>
            </div>

            {latestPayment ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#fce7f3]">
                  <span className="text-slate-500">Resource:</span>
                  <span className="font-mono text-slate-800 truncate max-w-[180px]">
                    /api/paid/supplier-intelligence
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#fce7f3]">
                  <span className="text-slate-500">Settled Amount:</span>
                  <span className="font-black text-slate-900">0.001 USDC</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#fce7f3]">
                  <span className="text-slate-500">Settlement Network:</span>
                  <span className="font-semibold text-slate-700">Algorand TestNet</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono text-pink-800 font-bold truncate max-w-[140px]">
                    {latestPayment.transactionId ? formatAlgorandAddress(latestPayment.transactionId, 6) : 'Settled'}
                  </span>
                </div>

                {latestPayment.transactionId && !latestPayment.transactionId.startsWith('mock-') && (
                  <Link
                    href="/ledger"
                    className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#fce7f3] hover:bg-[#cbd5e1] border border-[#be185d] text-xs font-bold text-slate-900 transition"
                  >
                    <span>View in Settlement Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-3 text-center bg-[#fce7f3] rounded-xl border border-[#be185d]">
                <p>No verified payments yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Payments record automatically during autonomous agent runs.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live On-Chain Algorand TestNet Feed */}
      {latestPayment?.transactionId && !latestPayment.transactionId.startsWith('mock-') && (
        <div className="pt-2">
          <LiveAlgorandTransactions
            title="Live On-Chain Algorand TestNet Consensus Stream"
            subtitle="Real-time blockchain transactions mined on Algorand TestNet. Click any hash to verify on Lora Explorer."
            limit={8}
          />
        </div>
      )}
    </div>
  );
}

