'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Coins,
  ArrowLeft,
  ExternalLink,
  Bot,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';
import { formatUsd } from '@/lib/utils';
import { formatAlgorandAddress } from '@/lib/x402';

export default function PaymentProcessingPage() {
  const router = useRouter();
  const { addToast } = useDemo();

  const [step, setStep] = useState<'402_CHALLENGE' | 'SUBMITTING' | 'VERIFYING' | 'SETTLED'>('402_CHALLENGE');
  const [txId, setTxId] = useState<string>('WXYZ7492842JFKALGORANDTESTNETTXN7489');

  const handlePay = () => {
    setStep('SUBMITTING');
    addToast('Broadcasting 0.02 ALGO payment transaction to Algorand TestNet...', 'info');

    setTimeout(() => {
      setStep('VERIFYING');
      addToast('Algorand node confirmed transaction. Verifying via x402 facilitator...', 'info');

      setTimeout(() => {
        setStep('SETTLED');
        addToast('Payment verified & settled on Algorand TestNet!', 'success');
      }, 1500);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link
          href="/payments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#e3577c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Payments Ledger</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-[#ffc8d3] p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ffc8d3]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#fff5f7] border border-[#ffc8d3] text-[#e3577c] flex items-center justify-center font-bold shadow-soft flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#24324a] tracking-tight">
                  x402 Micropayment Terminal
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3] uppercase">
                  ALGORAND TESTNET
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-0.5">
                Pay-per-query autonomous settlement for verified hospital oracle intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* 402 Challenge Specification */}
        <div className="p-4 rounded-lg bg-[#fff5f7] border border-[#ffc8d3] space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#24324a] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#e3577c]" />
              <span>HTTP 402 Payment Challenge Specification</span>
            </span>
            <span className="text-[10px] font-mono text-[#667085]">Resource: /api/paid/supplier-intelligence</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <span className="text-[#667085] block text-[10px] uppercase font-bold">Required Amount</span>
              <span className="font-bold text-[#24324a] text-sm">0.02 ALGO</span>
              <span className="text-[10px] text-[#667085] block">($0.02 USD)</span>
            </div>
            <div>
              <span className="text-[#667085] block text-[10px] uppercase font-bold">Asset Type</span>
              <span className="font-bold text-[#24324a] text-sm">Native ALGO</span>
            </div>
            <div>
              <span className="text-[#667085] block text-[10px] uppercase font-bold">Facilitator</span>
              <span className="font-bold text-[#24324a] text-sm">x402 Exact</span>
            </div>
            <div>
              <span className="text-[#667085] block text-[10px] uppercase font-bold">Network</span>
              <span className="font-bold text-[#24324a] text-sm">Algorand TestNet</span>
            </div>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded border border-[#ffc8d3] bg-white">
            <span className="font-bold text-[#24324a]">1. Receive HTTP 402 Challenge</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Ready
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded border border-[#ffc8d3] bg-white">
            <span className="font-bold text-[#24324a]">2. Sign & Broadcast Algorand Transaction</span>
            {step === 'SUBMITTING' ? (
              <span className="text-[#e3577c] font-bold flex items-center gap-1 animate-pulse">
                <Clock className="w-4 h-4" /> Broadcasting...
              </span>
            ) : step === 'VERIFYING' || step === 'SETTLED' ? (
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Broadcast Complete
              </span>
            ) : (
              <span className="text-[#667085]">Awaiting Confirmation</span>
            )}
          </div>

          <div className="flex items-center justify-between p-3.5 rounded border border-[#ffc8d3] bg-white">
            <span className="font-bold text-[#24324a]">3. Facilitator On-Chain Verification & Settlement</span>
            {step === 'VERIFYING' ? (
              <span className="text-[#e3577c] font-bold flex items-center gap-1 animate-pulse">
                <Clock className="w-4 h-4" /> Verifying On-Chain...
              </span>
            ) : step === 'SETTLED' ? (
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Verified & Settled
              </span>
            ) : (
              <span className="text-[#667085]">Pending</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#ffc8d3] flex justify-end gap-3">
          {step === 'SETTLED' ? (
            <div className="flex gap-2">
              <Link
                href={`/payments/${encodeURIComponent(txId)}`}
                className="px-4 py-2 rounded bg-white border border-[#ffc8d3] text-xs font-bold text-[#24324a] hover:bg-[#fff5f7] shadow-soft"
              >
                View Transaction Details
              </Link>
              <Link
                href={`/payments/${encodeURIComponent(txId)}/receipt`}
                className="px-5 py-2 rounded bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold shadow-soft"
              >
                View Printable Receipt
              </Link>
            </div>
          ) : (
            <button
              disabled={step !== '402_CHALLENGE'}
              onClick={handlePay}
              className="px-6 py-2.5 rounded bg-[#e3577c] hover:bg-[#e27094] disabled:opacity-50 text-white text-xs font-bold shadow-soft transition-all"
            >
              Authorize & Settle 0.02 ALGO
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
