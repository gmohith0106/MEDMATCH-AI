'use client';

import React, { useState, useEffect } from 'react';
import { PaymentConfigStatus } from '@/types/payment';
import { getPaymentConfigStatus } from '@/lib/api';
import { formatAlgorandAddress } from '@/lib/x402';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Server,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
  Wallet
} from 'lucide-react';

export function PaymentConfigBanner() {
  const [config, setConfig] = useState<PaymentConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await getPaymentConfigStatus();
      setConfig(data);
    } catch (err) {
      console.warn('Failed to load payment config status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading && !config) {
    return (
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-1.5">
            <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const isConnected = config?.overallStatus === 'CONNECTED';
  const isConfigRequired = config?.overallStatus === 'CONFIGURATION_REQUIRED';

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isConnected
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
          : isConfigRequired
          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
          : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
      }`}
    >
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              isConnected
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                : isConfigRequired
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
                : 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400'
            }`}
          >
            {isConnected ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isConfigRequired ? (
              <Clock className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Algorand TestNet & x402 Architecture
              </h4>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isConnected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : isConfigRequired
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {isConnected
                  ? 'Active / Verified'
                  : isConfigRequired
                  ? 'Configuration Required'
                  : 'Disconnected'}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              {config?.message ||
                'Decentralized micropayments for autonomous oracle intelligence via HTTP 402 specifications.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title="Refresh network connectivity"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 rounded-lg transition-colors shadow-sm"
          >
            <span>Network Details</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Diagnostic Panel */}
      {isExpanded && config && (
        <div className="px-5 pb-5 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-in slide-in-from-top-2 duration-200">
          <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-pink-500" />
                x402 Protocol
              </span>
              <span className="font-semibold text-emerald-600">Enabled</span>
            </div>
            <p className="font-medium text-zinc-800 dark:text-zinc-200">
              Scheme: {config.x402.scheme}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-blue-500" />
                Algod Node
              </span>
              <span
                className={`font-semibold ${
                  config.algorand.algodConnected ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {config.algorand.algodConnected ? 'Live Algonode' : 'Pending'}
              </span>
            </div>
            <p className="font-medium text-zinc-800 dark:text-zinc-200">
              {config.algorand.network}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-500" />
                Indexer V2
              </span>
              <span
                className={`font-semibold ${
                  config.algorand.indexerConnected ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {config.algorand.indexerConnected ? 'Connected' : 'Pending'}
              </span>
            </div>
            <p className="font-medium text-zinc-800 dark:text-zinc-200">
              On-chain Txn Verifier
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-pink-500" />
                Receiver Escrow
              </span>
              <span
                className={`font-semibold ${
                  config.algorand.receiverAddressConfigured
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                {config.algorand.receiverAddressConfigured ? 'Ready' : 'Config Required'}
              </span>
            </div>
            <p className="font-mono text-[11px] text-zinc-800 dark:text-zinc-200 truncate">
              {formatAlgorandAddress(config.algorand.receiverAddress, 5)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
