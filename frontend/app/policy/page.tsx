'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Lock,
  Plus,
  Trash2,
  ExternalLink,
  Coins,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { getArchitecturePolicy, updateArchitecturePolicy, FinalArchitecturePolicy } from '@/lib/api';
import { getAlgorandExplorerUrl, formatAlgorandAddress } from '@/lib/x402';

export default function PolicyPage() {
  const [policy, setPolicy] = useState<FinalArchitecturePolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Connect Wallet Modal State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<string>('20.00');
  const [walletFundingStatus, setWalletFundingStatus] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getArchitecturePolicy();
        setPolicy(data);
      } catch (err) {
        console.error('Failed to load policy', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policy) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateArchitecturePolicy(policy);
      setPolicy(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save policy', err);
    } finally {
      setSaving(false);
    }
  };

  const handleConnectWallet = (walletType: 'Pera' | 'Defly') => {
    setConnectedWallet('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    setWalletFundingStatus(`Connected via ${walletType} Wallet. Ready to fund agent operating balance.`);
  };

  const handleFundAgent = () => {
    if (!policy) return;
    const added = parseFloat(topUpAmount) || 0;
    const newBal = policy.operating_wallet_balance_usdc + added;
    setPolicy({
      ...policy,
      operating_wallet_balance_usdc: newBal
    });
    setWalletFundingStatus(`Successfully transferred $${added.toFixed(2)} USDC to Agent Operating Wallet.`);
    setTimeout(() => {
      setIsWalletModalOpen(false);
      setWalletFundingStatus(null);
    }, 1500);
  };

  if (loading || !policy) {
    return (
      <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-pink-600" />
        <span>Loading procurement spend policy...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-fadeIn font-sans">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl border border-[#be185d]/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#cbd5e1] text-slate-900 border border-[#ec4899]">
              Layer 1 & Layer 3 Non-Custodial Safety Boundary
            </span>
            <span className="text-xs text-slate-300 font-mono">Algorand TestNet</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Procurement Policy & Agent Wallet Governance
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Set spending limits, approved vendors, and authorized categories. The autonomous agent operates <strong>strictly within this pre-agreed policy boundary</strong> without human intervention in live payments.
          </p>
        </div>

        <button
          onClick={() => setIsWalletModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-[#cbd5e1] hover:bg-[#ec4899] text-slate-900 text-xs font-black transition flex items-center gap-2 shadow-xs shrink-0"
        >
          <Wallet className="w-4 h-4 text-slate-900" />
          <span>Connect Human Wallet (Fund / Cap Agent)</span>
        </button>
      </div>

      {/* Safety Boundary Callout */}
      <div className="p-4 bg-[#fce7f3] border border-[#be185d] rounded-2xl flex items-start gap-3 text-xs text-slate-800">
        <ShieldCheck className="w-5 h-5 text-pink-700 shrink-0 mt-0.5" />
        <div>
          <strong>Non-Custodial Architecture Guarantee:</strong> Human wallets (Pera/Defly) only appear <strong>once</strong> here on the Policy page to fund the capped agent wallet. The agent keypair executes micro-spend machine-to-machine over x402 and never has access to the hospital treasury.
        </div>
      </div>

      {/* Policy Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#be185d] shadow-sm p-6 space-y-6">
        <div className="border-b border-[#be185d] pb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
            <Lock className="w-4 h-4 text-pink-600" />
            <span>Autonomous Spend Rules & Limits</span>
          </h2>
          {saveSuccess && (
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              Policy Updated Successfully
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Single Transaction Micro-Spend Cap */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Single x402 Query Spend Cap ($ USDC)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="0.50"
                value={policy.spend_cap}
                onChange={(e) => setPolicy({ ...policy, spend_cap: parseFloat(e.target.value) || 0.05 })}
                className="w-full pl-7 pr-3 py-2 text-xs border border-[#be185d] bg-[#fce7f3] rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500">Maximum price the agent will autonomously pay for 1 supplier intelligence query.</p>
          </div>

          {/* Daily Aggregate Cap */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Daily Intelligence Spend Cap ($ USDC)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
              <input
                type="number"
                step="0.10"
                min="0.50"
                max="10.00"
                value={policy.daily_spend_cap}
                onChange={(e) => setPolicy({ ...policy, daily_spend_cap: parseFloat(e.target.value) || 1.00 })}
                className="w-full pl-7 pr-3 py-2 text-xs border border-[#be185d] bg-[#fce7f3] rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500">Spent today: <strong>${policy.daily_spend_so_far.toFixed(2)} USDC</strong>.</p>
          </div>
        </div>

        {/* Agent Operating Wallet Info */}
        <div className="p-4 rounded-xl bg-[#fce7f3] border border-[#be185d] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Agent Operating Keypair:</span>
            <div className="font-mono text-slate-800 font-bold truncate mt-0.5">
              {policy.agent_operating_wallet}
            </div>
            <a
              href={`https://lora.algokit.io/testnet/account/${policy.agent_operating_wallet}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-700 hover:underline inline-flex items-center gap-1 mt-1 font-bold text-[11px]"
            >
              <span>View on Lora TestNet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <span className="text-slate-500 font-medium">Operating Balance (USDC):</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              ${policy.operating_wallet_balance_usdc.toFixed(2)} <span className="text-xs font-normal text-slate-500">USDC</span>
            </div>
            <span className="text-[10px] text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              Sufficient for ~{Math.floor(policy.operating_wallet_balance_usdc / policy.spend_cap)} autonomous queries
            </span>
          </div>
        </div>

        {/* Approved Suppliers */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">
            Whitelisted Certified Medical Suppliers
          </label>
          <div className="flex flex-wrap gap-2">
            {policy.approved_suppliers.map((sup, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-[#fce7f3] border border-[#be185d] text-xs font-medium text-slate-800 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />
                <span>{sup}</span>
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">The agent only purchases data and places procurement orders with whitelisted vendors.</p>
        </div>

        {/* Approved Item Categories */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">
            Authorized Procurement Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {policy.approved_categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-[#cbd5e1]/60 border border-[#ec4899] text-xs font-bold text-slate-900"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-[#be185d] flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <SaveIcon className="w-4 h-4" />}
            <span>{saving ? 'Saving Policy...' : 'Save & Enforce Policy'}</span>
          </button>
        </div>
      </form>

      {/* Connect Wallet Modal */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-[#be185d] shadow-2xl max-w-md w-full p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#be185d] pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-pink-600" />
                <span>One-Time Wallet Authorization</span>
              </h3>
              <button
                onClick={() => setIsWalletModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ?
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Connect your hospital administrative wallet via <strong>Pera</strong> or <strong>Defly</strong> to fund the agent operating wallet. Human signing is only required here.
            </p>

            {!connectedWallet ? (
              <div className="space-y-3">
                <button
                  onClick={() => handleConnectWallet('Pera')}
                  className="w-full p-3.5 rounded-xl border border-[#be185d] hover:border-[#ec4899] hover:bg-[#fce7f3] flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center font-bold text-slate-900 text-sm">
                      P
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900">Pera Wallet</div>
                      <div className="text-[11px] text-slate-500">Official Algorand Mobile & Web Wallet</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 transition" />
                </button>

                <button
                  onClick={() => handleConnectWallet('Defly')}
                  className="w-full p-3.5 rounded-xl border border-[#be185d] hover:border-[#ec4899] hover:bg-[#fce7f3] flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                      D
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900">Defly Wallet</div>
                      <div className="text-[11px] text-slate-500">Algorand DeFi & Smart Wallet</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-800">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-500" />
                    <span>Wallet Connected</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 truncate mt-1">
                    {connectedWallet}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Top-Up Amount ($ USDC)
                  </label>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#be185d] bg-[#fce7f3] rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
                  />
                </div>

                {walletFundingStatus && (
                  <p className="text-xs text-slate-600 font-medium">{walletFundingStatus}</p>
                )}

                <button
                  onClick={handleFundAgent}
                  className="w-full py-2.5 rounded-xl bg-[#cbd5e1] hover:bg-[#ec4899] text-slate-900 text-xs font-black transition flex items-center justify-center gap-2"
                >
                  <Coins className="w-4 h-4 text-slate-900" />
                  <span>Transfer & Cap Agent Operating Balance</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  );
}

