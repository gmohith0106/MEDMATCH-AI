'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Search,
  Bot,
  Truck,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { getArchitectureOrders, FinalArchitectureOrder } from '@/lib/api';
import { getAlgorandExplorerUrl, formatAlgorandTxId } from '@/lib/x402';

export default function OrdersPage() {
  const [orders, setOrders] = useState<FinalArchitectureOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    try {
      const list = await getArchitectureOrders();
      setOrders(list);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      (o.itemName || o.item).toLowerCase().includes(q) ||
      (o.supplierName || o.supplier).toLowerCase().includes(q) ||
      (o.reasoning || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn font-sans">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl border border-[#be185d]/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#cbd5e1] text-slate-900 border border-[#ec4899]">
              Layer 1 â€” Autonomous Procurement Orders
            </span>
            <span className="text-xs text-slate-300 font-mono">Plain-English Audit Trail</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Procurement Orders & Reasoning Log
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Transparent log of every supply order executed by the autonomous agent with AI reasoning and inline verified Algorand TestNet transaction links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadOrders}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#ec4899] text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/procurement"
            className="px-4 py-2 rounded-xl bg-[#cbd5e1] hover:bg-[#ec4899] text-slate-900 text-xs font-black transition flex items-center gap-1.5 shadow-xs"
          >
            <Bot className="w-3.5 h-3.5 text-slate-900" />
            <span>Trigger Agent</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#be185d] shadow-sm">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Filter orders by item, supplier name, or AI reasoning..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading && orders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2 bg-white rounded-2xl border border-[#be185d]">
            <RefreshCw className="w-5 h-5 animate-spin text-pink-600" />
            <span>Loading orders log...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-[#be185d] text-xs">
            No procurement orders found matching search criteria.
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const txId = ord.txn_id || 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA';
            const explorerUrl = ord.explorer_url || getAlgorandExplorerUrl(txId);

            return (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-[#be185d] shadow-sm hover:border-[#ec4899] transition p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#be185d] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#cbd5e1] text-slate-900 flex items-center justify-center font-bold">
                      <ShoppingBag className="w-4 h-4 text-slate-900" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {ord.itemName || ord.item}
                      </h3>
                      <div className="text-[11px] text-slate-500">
                        Order #{ord.id} â€¢ {new Date(ord.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{ord.status}</span>
                    </span>

                    {/* Inline Lora Explorer Proof Link */}
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-bold bg-[#fce7f3] hover:bg-[#cbd5e1] text-slate-900 border border-[#be185d] transition"
                      title="Inspect confirmed Layer-1 transaction on Lora Algorand Explorer"
                    >
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Tx: {formatAlgorandTxId(txId, 6)}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* Plain-English AI Reasoning */}
                <div className="p-3.5 rounded-xl bg-[#fce7f3] border border-[#be185d] space-y-1">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-pink-600" />
                    <span>Agent Procurement Rationale</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {ord.reasoning}
                  </p>
                </div>

                {/* Order Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Selected Supplier:</span>
                    <div className="font-bold text-slate-800 truncate">{ord.supplierName || ord.supplier}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Order Quantity:</span>
                    <div className="font-bold text-slate-800">{ord.qty.toLocaleString()} units</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Unit Price:</span>
                    <div className="font-bold text-slate-800">${ord.unitPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Procurement:</span>
                    <div className="font-black text-slate-900">${ord.total_price.toFixed(2)} USD</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

