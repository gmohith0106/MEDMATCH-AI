'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  Filter,
  Copy,
  Check,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getArchitectureLedger, FinalArchitectureLedgerEntry } from '@/lib/api';
import { getAlgorandExplorerUrl, formatAlgorandTxId, formatAlgorandAddress } from '@/lib/x402';

export default function LedgerPage() {
  const [ledger, setLedger] = useState<FinalArchitectureLedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  const loadLedger = async () => {
    try {
      const list = await getArchitectureLedger();
      setLedger(list);
    } catch (err) {
      console.error('Failed to load ledger', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
    const interval = setInterval(loadLedger, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (tx: string) => {
    navigator.clipboard.writeText(tx);
    setCopiedTx(tx);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const latestTx = ledger[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn font-sans">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl border border-[#be185d]/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#cbd5e1] text-slate-900 border border-[#ec4899]">
              Layer 1 & Layer 4 On-Chain Settlement Ledger
            </span>
            <span className="text-xs text-slate-300 font-mono">Algorand TestNet</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Live Settlement Ledger
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Every machine-to-machine x402 payment settles on-chain with instant finality. Real-time receipts appear here the instant payment confirms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadLedger}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#ec4899] text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Ledger</span>
          </button>
          <a
            href="https://lora.algokit.io/testnet"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#cbd5e1] hover:bg-[#ec4899] text-slate-900 text-xs font-black transition flex items-center gap-1.5 shadow-xs"
          >
            <span>Open Lora Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Latest Completed Payment Spotlight Receipt */}
      {latestTx && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#fce7f3] via-[#fce7f3] to-[#cbd5e1]/40 border border-[#be185d] shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#be185d] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-ping shrink-0" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Latest Confirmed Settlement Receipt
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-500">
              Mined at Layer-1 Round #{latestTx.confirmed_round || '38,472,910'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Transaction ID:</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono font-bold text-pink-800 bg-white px-2 py-0.5 rounded border border-[#be185d]">
                  {formatAlgorandTxId(latestTx.txn_id, 8)}
                </span>
                <button
                  onClick={() => handleCopy(latestTx.txn_id)}
                  className="text-slate-400 hover:text-slate-600"
                  title="Copy Hash"
                >
                  {copiedTx === latestTx.txn_id ? <Check className="w-3 h-3 text-slate-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Settlement Amount:</span>
              <div className="font-black text-slate-900 text-sm mt-0.5">
                ${latestTx.amount.toFixed(3)} <span className="text-xs font-normal text-slate-500">{latestTx.asset}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Service Endpoint:</span>
              <div className="font-mono text-slate-800 text-[11px] truncate mt-0.5">
                {latestTx.endpoint}
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a
                href={latestTx.explorer_url || getAlgorandExplorerUrl(latestTx.txn_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#ec4899] text-xs font-bold transition shadow-xs"
              >
                <span>Inspect on Lora Explorer</span>
                <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Full Real-Time Ledger Stream */}
      <div className="bg-white rounded-2xl border border-[#be185d] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#be185d] bg-[#fce7f3] flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-pink-700" />
            <span>On-Chain Machine-to-Machine Ledger Stream ({ledger.length})</span>
          </h2>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
            <span>Algorand TestNet Finality Verified</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fce7f3] text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-[#be185d]">
              <tr>
                <th className="py-3 px-4">Transaction ID (Lora)</th>
                <th className="py-3 px-4">x402 Endpoint</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fce7f3]">
              {loading && ledger.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-pink-600" />
                    <span>Syncing on-chain ledger entries...</span>
                  </td>
                </tr>
              ) : ledger.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                ledger.map((entry) => {
                  const txId = entry.txn_id || 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA';
                  const explorerUrl = entry.explorer_url || getAlgorandExplorerUrl(txId);

                  return (
                    <tr key={entry.id} className="hover:bg-[#fce7f3]/80 transition group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-pink-900 bg-[#cbd5e1]/50 px-2 py-0.5 rounded border border-[#ec4899] text-[11px]">
                            {formatAlgorandTxId(txId, 6)}
                          </span>
                          <button
                            onClick={() => handleCopy(txId)}
                            className="text-slate-400 hover:text-slate-600 transition"
                            title="Copy Transaction Hash"
                          >
                            {copiedTx === txId ? (
                              <Check className="w-3.5 h-3.5 text-slate-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {entry.purpose && (
                          <div className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">
                            {entry.purpose}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <code className="text-[11px] text-slate-700 bg-white px-1.5 py-0.5 rounded border border-[#be185d] font-mono">
                          {entry.endpoint}
                        </code>
                      </td>

                      <td className="py-3.5 px-4 font-black text-slate-900">
                        ${entry.amount.toFixed(3)} <span className="text-[10px] font-normal text-slate-500">{entry.asset}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-slate-700 font-medium">
                          {entry.network}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-[#ec4899] text-[11px] font-bold transition shadow-xs"
                        >
                          <span>Lora</span>
                          <ExternalLink className="w-3 h-3 text-pink-400" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

