'use client';

import React, { useState } from 'react';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import { LiveAlgorandTransactions } from '@/components/blockchain/LiveAlgorandTransactions';
import { Activity, Radio, Layers } from 'lucide-react';

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState<'agent' | 'algorand' | 'all'>('all');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-[#24324a] tracking-tight">
            Agent Activity & Blockchain Telemetry
          </h2>
          <p className="text-xs text-[#667085] font-medium mt-0.5">
            Real-time telemetry and audit logs of autonomous agent actions, x402 payments, and live Algorand TestNet consensus blocks.
          </p>
        </div>

        {/* View switcher tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'all'
                ? 'bg-pink-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Combined</span>
          </button>
          <button
            onClick={() => setActiveTab('agent')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'agent'
                ? 'bg-pink-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Agent Logs</span>
          </button>
          <button
            onClick={() => setActiveTab('algorand')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'algorand'
                ? 'bg-pink-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live On-Chain Feed</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'agent' && <ActivityTimeline />}

      {activeTab === 'algorand' && (
        <LiveAlgorandTransactions
          title="Live Algorand TestNet Transactions"
          subtitle="Real-time on-chain transactions and block consensus stream."
          limit={15}
        />
      )}

      {activeTab === 'all' && (
        <div className="space-y-6">
          <LiveAlgorandTransactions
            title="Live Algorand TestNet Consensus Feed"
            subtitle="Real-time on-chain block transactions synced with Algorand consensus."
            limit={6}
          />
          <ActivityTimeline />
        </div>
      )}
    </div>
  );
}
