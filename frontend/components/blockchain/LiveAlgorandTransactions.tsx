'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ExternalLink,
  Activity,
  RefreshCw,
  Play,
  Pause,
  Copy,
  Check,
  Shield,
  Layers,
  ArrowUpRight,
  Database,
  Radio,
  FileCode,
  Coins,
  Cpu
} from 'lucide-react';
import { getAlgorandExplorerUrl, formatAlgorandAddress, formatAlgorandTxId } from '@/lib/x402';

export interface AlgorandOnChainTx {
  id: string;
  'confirmed-round': number;
  'round-time': number;
  'tx-type': string;
  sender: string;
  fee: number;
  'payment-transaction'?: {
    amount: number;
    receiver: string;
    'close-amount'?: number;
  };
  'asset-transfer-transaction'?: {
    amount: number;
    'asset-id': number;
    receiver: string;
  };
  'application-transaction'?: {
    'application-id': number;
    'on-completion'?: string;
  };
  note?: string;
  signature?: Record<string, unknown>;
}

interface LiveAlgorandTransactionsProps {
  limit?: number;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export function LiveAlgorandTransactions({
  limit = 12,
  title = 'Live On-Chain Algorand TestNet Feed',
  subtitle = 'Real-time transaction stream verified directly from Algorand TestNet consensus blocks.',
  compact = false,
}: LiveAlgorandTransactionsProps) {
  const [transactions, setTransactions] = useState<AlgorandOnChainTx[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [lastRound, setLastRound] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLiveTransactions = useCallback(async (showLoadingSpinner = false) => {
    if (showLoadingSpinner) {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Primary: Algonode free public Algorand TestNet Indexer
      const url = `https://testnet-idx.algonode.cloud/v2/transactions?limit=${limit}`;
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to reach Algorand Indexer`);
      }

      const data = await response.json();
      if (data && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
        if (data.transactions.length > 0) {
          setLastRound(data.transactions[0]['confirmed-round'] || null);
        }
        setLastUpdated(new Date());
      }
    } catch (err: any) {
      console.warn('[LiveAlgorand] Error querying Algorand Testnet Indexer:', err);
      // Fallback secondary public indexer if primary encounters rate limit
      try {
        const fallbackRes = await fetch(`https://testnet-api.algonode.cloud/v2/transactions?limit=${limit}`);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (fallbackData?.transactions) {
            setTransactions(fallbackData.transactions);
            setLastRound(fallbackData.transactions[0]?.['confirmed-round'] || null);
            setLastUpdated(new Date());
          }
        }
      } catch (fallbackErr) {
        setError('Connecting to Algorand TestNet node...');
      }
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLiveTransactions(true);
  }, [fetchLiveTransactions]);

  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(() => {
        fetchLiveTransactions(false);
      }, 4000); // 4-second polling to match Algorand ~3.3s block finality
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLive, fetchLiveTransactions]);

  const copyToClipboard = (text: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const decodeNote = (base64Note?: string): string => {
    if (!base64Note) return 'â€”';
    try {
      const decoded = atob(base64Note);
      const clean = decoded.replace(/[^\x20-\x7E]/g, '');
      return clean.trim() || 'Binary Payload';
    } catch {
      return 'Encoded Payload';
    }
  };

  const getRelativeTime = (timestampSeconds: number): string => {
    if (!timestampSeconds) return 'recently';
    const now = Math.floor(Date.now() / 1000);
    const diff = Math.max(0, now - timestampSeconds);
    if (diff < 5) return 'just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'PAYMENT') return tx['tx-type'] === 'pay';
    if (filterType === 'ASSET') return tx['tx-type'] === 'axfer';
    if (filterType === 'APP') return tx['tx-type'] === 'appl';
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Banner / Header */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-pink-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <Radio className="w-3 h-3 animate-pulse text-pink-400" />
              Algorand TestNet
            </span>
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-400/20 text-slate-300 border border-slate-400/30">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
                Live Consensus Polling
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Feed Paused
              </span>
            )}
            {lastRound && (
              <span className="text-xs text-slate-400 font-mono">
                Round #{lastRound.toLocaleString()}
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isLive
                ? 'bg-slate-800/50 hover:bg-slate-700/60 text-slate-300 border-slate-600/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={isLive ? 'Pause live polling' : 'Resume live stream'}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLive ? 'Live Feed ON' : 'Resume Feed'}</span>
          </button>

          <button
            onClick={() => fetchLiveTransactions(true)}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-pink-400' : ''}`} />
          </button>

          <a
            href="https://lora.algokit.io/testnet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Lora Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium mr-1">Filter Type:</span>
          {(['ALL', 'PAYMENT', 'ASSET', 'APP'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterType === type
                  ? 'bg-pink-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {type === 'ALL' && 'All Types'}
              {type === 'PAYMENT' && 'ALGO Payments'}
              {type === 'ASSET' && 'ASA / Tokens'}
              {type === 'APP' && 'Smart Contracts'}
            </button>
          ))}
        </div>

        <div className="text-slate-500 text-[11px] flex items-center gap-2">
          <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          <span>â€¢</span>
          <span>Finality: ~3.3s</span>
        </div>
      </div>

      {/* Transaction List / Table */}
      <div className="overflow-x-auto">
        {isLoading && transactions.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin text-pink-600 mb-2" />
            <span>Streaming live transactions from Algorand TestNet...</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            No transactions found for filter "{filterType}".
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">Transaction Hash (Lora Explorer)</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Round</th>
                <th className="py-3 px-3">Age</th>
                <th className="py-3 px-3">Sender</th>
                <th className="py-3 px-3">Receiver / Target</th>
                <th className="py-3 px-4 text-right">Value</th>
                <th className="py-3 px-4">Payload / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
              {filteredTransactions.map((tx) => {
                const txType = tx['tx-type'];
                const round = tx['confirmed-round'];
                const age = getRelativeTime(tx['round-time']);
                const loraUrl = getAlgorandExplorerUrl(tx.id);

                let amountDisplay = 'â€”';
                if (tx['payment-transaction']) {
                  const micro = tx['payment-transaction'].amount;
                  amountDisplay = `${(micro / 1e6).toFixed(4)} ALGO`;
                } else if (tx['asset-transfer-transaction']) {
                  const assetAmount = tx['asset-transfer-transaction'].amount;
                  const assetId = tx['asset-transfer-transaction']['asset-id'];
                  amountDisplay = `${assetAmount} (ASA #${assetId})`;
                }

                const receiverAddress =
                  tx['payment-transaction']?.receiver ||
                  tx['asset-transfer-transaction']?.receiver;

                const appId = tx['application-transaction']?.['application-id'];

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-pink-50/40 transition-colors group"
                  >
                    {/* Tx Hash with direct Lora Link */}
                    <td className="py-3 px-4 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={loraUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-700 hover:text-pink-900 hover:underline inline-flex items-center gap-1 group-hover:text-pink-800"
                          title={`Open ${tx.id} on Lora Algorand Explorer`}
                        >
                          <span>{formatAlgorandTxId(tx.id, 7)}</span>
                          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(tx.id, tx.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy Full Transaction ID"
                        >
                          {copiedId === tx.id ? (
                            <Check className="w-3 h-3 text-slate-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Tx Type Badge */}
                    <td className="py-3 px-3 font-sans">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          txType === 'pay'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : txType === 'appl'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : txType === 'axfer'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {txType === 'pay' && <Coins className="w-2.5 h-2.5" />}
                        {txType === 'appl' && <Cpu className="w-2.5 h-2.5" />}
                        {txType === 'axfer' && <Layers className="w-2.5 h-2.5" />}
                        <span>{txType}</span>
                      </span>
                    </td>

                    {/* Confirmed Round */}
                    <td className="py-3 px-3 text-slate-600">
                      <span className="text-slate-500 text-[11px]">#</span>
                      {round.toLocaleString()}
                    </td>

                    {/* Age */}
                    <td className="py-3 px-3 font-sans text-slate-500 text-[11px] whitespace-nowrap">
                      {age}
                    </td>

                    {/* Sender */}
                    <td className="py-3 px-3">
                      <a
                        href={`https://lora.algokit.io/testnet/account/${tx.sender}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700 hover:text-pink-700 hover:underline"
                        title={tx.sender}
                      >
                        {formatAlgorandAddress(tx.sender, 4)}
                      </a>
                    </td>

                    {/* Receiver / App ID */}
                    <td className="py-3 px-3">
                      {receiverAddress ? (
                        <a
                          href={`https://lora.algokit.io/testnet/account/${receiverAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-700 hover:text-pink-700 hover:underline"
                          title={receiverAddress}
                        >
                          {formatAlgorandAddress(receiverAddress, 4)}
                        </a>
                      ) : appId !== undefined ? (
                        <a
                          href={`https://lora.algokit.io/testnet/application/${appId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-700 hover:text-purple-900 hover:underline font-medium"
                        >
                          App #{appId}
                        </a>
                      ) : (
                        <span className="text-slate-400">â€”</span>
                      )}
                    </td>

                    {/* Value */}
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">
                      {amountDisplay}
                    </td>

                    {/* Note Payload */}
                    <td
                      className="py-3 px-4 font-sans text-slate-500 text-[11px] max-w-[180px] truncate"
                      title={decodeNote(tx.note)}
                    >
                      {decodeNote(tx.note)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-pink-600" />
          <span>All transaction hashes resolve directly on <strong>Lora Algorand Explorer</strong>.</span>
        </div>

        <a
          href="https://lora.algokit.io/testnet"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-700 hover:text-pink-800 font-semibold inline-flex items-center gap-1 hover:underline"
        >
          <span>Explore All TestNet Blocks on Lora</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
