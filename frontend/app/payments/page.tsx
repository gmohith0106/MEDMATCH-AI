'use client';

import React, { useState } from 'react';
import { PaymentTable } from '@/components/payments/PaymentTable';
import { LiveAlgorandTransactions } from '@/components/blockchain/LiveAlgorandTransactions';
import { M2MPaymentArchitecture } from '@/components/blockchain/M2MPaymentArchitecture';
import { McpServerPanel } from '@/components/mcp/McpServerPanel';
import { CreditCard, ShieldCheck, Radio, Activity, Layers, ArrowUpRight, Cpu, Terminal } from 'lucide-react';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'x402' | 'architecture' | 'mcp' | 'live-chain'>('x402');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-pink-700 border border-pink-200">
              <CreditCard className="w-3.5 h-3.5" />
              x402 Micropayments
            </span>
            <span className="text-xs text-slate-400">â€¢</span>
            <span className="text-xs text-slate-500 font-medium">Algorand TestNet</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Payments & On-Chain Telemetry</h1>
          <p className="text-xs text-slate-600 max-w-2xl mt-0.5">
            Verified supplier-intelligence payments and live real-time consensus transactions from Algorand TestNet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <a
            href="https://lora.algokit.io/testnet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 text-xs font-semibold transition"
          >
            <span>Lora Algorand Explorer</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f1f5f9]/60 border border-[#cbd5e1] text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-pink-700" />
            <span>Server-Side Signer â€¢ Zero Browser Keys</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 flex-wrap">
        <button
          onClick={() => setActiveTab('x402')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'x402'
              ? 'bg-pink-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>MedMatch x402 Payments</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'architecture'
              ? 'bg-pink-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-pink-300" />
          <span>M2M Architecture & Live Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('mcp')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'mcp'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-300" />
          <span>MCP Server & Tools</span>
        </button>

        <button
          onClick={() => setActiveTab('live-chain')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'live-chain'
              ? 'bg-pink-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
          </span>
          <Radio className="w-3.5 h-3.5" />
          <span>Live On-Chain Algorand TestNet Feed</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'x402' && (
        <PaymentTable />
      )}

      {activeTab === 'architecture' && (
        <M2MPaymentArchitecture />
      )}

      {activeTab === 'mcp' && (
        <McpServerPanel />
      )}

      {activeTab === 'live-chain' && (
        <LiveAlgorandTransactions
          title="Live On-Chain Algorand TestNet Stream"
          subtitle="Direct live transactions mined on the Algorand TestNet blockchain. Click any transaction hash to inspect on Lora Explorer."
          limit={15}
        />
      )}
    </div>
  );
}
