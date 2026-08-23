'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Printer,
  ArrowLeft,
  Package,
  Building2,
  CreditCard,
  AlertCircle,
  Loader2,
  ArrowRight,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { getPaymentById, payPendingPayment, checkPaymentStatus } from '@/lib/api';
import { formatAlgorandAddress, getAlgorandExplorerUrl, formatUsdcAmount, isAlgorandTxId } from '@/lib/x402';
import { X402PaymentRecord } from '@/types/payment';

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const transactionIdParam = (params?.transactionId as string) || '';

  const [payment, setPayment] = useState<X402PaymentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const loadData = async () => {
    if (!transactionIdParam) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const record = await getPaymentById(transactionIdParam);
      if (record) {
        setPayment(record);
      }
    } catch (err) {
      console.warn('Failed to load payment detail', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [transactionIdParam]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePayNow = async () => {
    if (!payment || isProcessing) return;
    setIsProcessing(true);
    setFeedback({ text: 'Processing 0.001 USDC payment on Algorand TestNet...', type: 'info' });

    try {
      const result = await payPendingPayment(payment.id);
      if (result && (result.status === 'VERIFIED' || result.status === 'PAYMENT_SETTLED' || result.verified)) {
        setFeedback({ text: 'Payment verified & settled on-chain!', type: 'success' });
      } else if (result?.status === 'SETTLEMENT_PENDING') {
        setFeedback({ text: 'Transaction submitted. Awaiting confirmation round...', type: 'info' });
      } else if (result?.status === 'PAYMENT_REQUIRED') {
        setFeedback({ text: result.errorMessage || 'Payer signer configuration required in backend', type: 'error' });
      }
      await loadData();
    } catch (err: any) {
      console.warn('Payment execution note:', err);
      setFeedback({ text: err?.message || 'Payment execution completed.', type: 'info' });
      await loadData();
    } finally {
      setIsProcessing(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleCheckStatus = async () => {
    if (!payment || isProcessing) return;
    setIsProcessing(true);
    setFeedback({ text: 'Checking status on Algorand TestNet...', type: 'info' });

    try {
      const result = await checkPaymentStatus(payment.id);
      if (result && (result.status === 'VERIFIED' || result.status === 'PAYMENT_SETTLED' || result.verified)) {
        setFeedback({ text: 'Confirmed & verified on Algorand TestNet!', type: 'success' });
      } else if (result?.status === 'SETTLEMENT_PENDING') {
        setFeedback({ text: 'Transaction is currently awaiting block round consensus.', type: 'info' });
      } else if (result?.status === 'FAILED') {
        setFeedback({ text: 'Transaction failed or dropped by consensus pool.', type: 'error' });
      }
      await loadData();
    } catch (err: any) {
      console.warn('Status check note:', err);
      await loadData();
    } finally {
      setIsProcessing(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-xs text-slate-600 font-medium">Loading payment details...</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="max-w-lg mx-auto my-12 bg-white rounded-xl border border-[#cbd5e1] p-8 text-center space-y-4 shadow-sm">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Payment Record Not Found</h2>
        <p className="text-xs text-slate-600">
          The requested payment record could not be found in the ledger.
        </p>
        <div className="pt-2">
          <Link
            href="/payments"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Payments</span>
          </Link>
        </div>
      </div>
    );
  }

  const isVerified = payment.status === 'PAYMENT_SETTLED' || payment.status === 'PAYMENT_VERIFIED' || payment.status === 'VERIFIED';
  const isSettlementPending = payment.status === 'SETTLEMENT_PENDING' || payment.status === 'PAYMENT_SUBMITTED' || payment.status === 'PAYMENT_VERIFYING';
  const isPaymentRequired = payment.status === 'PAYMENT_REQUIRED' || (!isVerified && !isSettlementPending && payment.status !== 'FAILED');
  const isFailed = payment.status === 'PAYMENT_FAILED' || payment.status === 'FAILED';

  const loraUrl = getAlgorandExplorerUrl(payment.transactionId);
  const formattedDate = payment.settledAt || payment.createdAt
    ? new Date(payment.settledAt || payment.createdAt!).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    : 'Recent';

  const productName = payment.productName || payment.product?.name || 'Surgical Gloves (Sterile, Latex-Free)';
  const supplierName = payment.supplierName || payment.supplier?.name || 'MediSupply Healthcare Solutions';

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto pb-12">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/payments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Payments</span>
        </Link>

        <div className="flex items-center gap-2">
          {loraUrl && isAlgorandTxId(payment.transactionId) && isVerified && (
            <a
              href={loraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#cbd5e1] bg-white text-xs font-semibold text-teal-700 hover:bg-teal-50 shadow-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
              <span>View on Lora</span>
            </a>
          )}

          {isVerified && (
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Alert if any */}
      {feedback && (
        <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
          feedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : feedback.type === 'error'
            ? 'bg-rose-50 text-rose-800 border border-rose-200'
            : 'bg-teal-50 text-teal-800 border border-teal-200'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : feedback.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          ) : (
            <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Status Header Card */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs flex-shrink-0 ${
              isVerified
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : isSettlementPending
                ? 'bg-sky-50 text-sky-600 border border-sky-200'
                : isFailed
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-amber-50 text-amber-600 border border-amber-200'
            }`}>
              {isVerified ? (
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              ) : isSettlementPending ? (
                <Clock className="w-7 h-7" />
              ) : isFailed ? (
                <AlertCircle className="w-7 h-7" />
              ) : (
                <CreditCard className="w-7 h-7" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {isVerified
                    ? 'Payment Verified & Settled'
                    : isSettlementPending
                    ? 'Payment Confirming'
                    : isFailed
                    ? 'Payment Failed'
                    : 'Payment Required'}
                </h1>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  isVerified
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isSettlementPending
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : isFailed
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {isVerified ? 'VERIFIED' : isSettlementPending ? 'CONFIRMING' : isFailed ? 'FAILED' : 'PAYMENT REQUIRED'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isVerified
                  ? 'Settled on Algorand TestNet via x402 protocol'
                  : isSettlementPending
                  ? 'Submitted to Algorand TestNet. Awaiting consensus confirmation.'
                  : isFailed
                  ? 'Payment could not be completed.'
                  : 'Micropayment required to unlock real-time supplier intelligence.'}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-2xl font-black text-slate-900">
              {formatUsdcAmount(payment.amount)}
            </div>
            <div className="text-xs font-bold text-teal-700">
              0.001 USDC Micropayment
            </div>
          </div>
        </div>

        {/* Product & Supplier Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Product */}
          <div className="p-4 rounded-lg bg-[#f1f5f9]/40 border border-[#cbd5e1] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Package className="w-3.5 h-3.5 text-teal-700" />
              <span>Target Product</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">{productName}</p>
            <p className="text-[11px] text-slate-500">Autonomous Clinical Procurement</p>
          </div>

          {/* Supplier */}
          <div className="p-4 rounded-lg bg-[#f1f5f9]/40 border border-[#cbd5e1] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-teal-700" />
              <span>Recommended Supplier</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">{supplierName}</p>
            <p className="text-[11px] text-slate-500">Tier-1 Certified Healthcare Vendor</p>
          </div>
        </div>

        {/* Simple Transaction & Date Summary */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-semibold">Hospital:</span>
            <span className="font-bold text-slate-900">{(payment as any).hospitalName || payment.hospitalId || 'CityCare General Hospital'}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-semibold">Date & Time:</span>
            <span className="font-medium text-slate-900">{formattedDate}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-semibold">Asset & Amount:</span>
            <span className="font-bold text-teal-800">0.001 USDC</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-semibold">Settlement Network:</span>
            <span className="font-medium text-slate-900">Algorand Testnet</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-semibold">Payment Facilitator:</span>
            <span className="font-medium text-slate-900">GoPlausible x402 Facilitator</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Transaction ID:</span>
            <div className="flex items-center gap-2 font-mono text-slate-900 font-bold">
              <span>
                {payment.transactionId && isAlgorandTxId(payment.transactionId)
                  ? formatAlgorandAddress(payment.transactionId, 8)
                  : isVerified
                  ? 'Confirmed on TestNet'
                  : '—'}
              </span>
              {payment.transactionId && isAlgorandTxId(payment.transactionId) && (
                <button
                  onClick={() => copyToClipboard(payment.transactionId || '', 'Transaction ID')}
                  className="p-1 text-slate-400 hover:text-slate-700"
                  title="Copy full transaction ID"
                >
                  {copiedField === 'Transaction ID' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Button Section per Status */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Link
            href="/payments"
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold text-center transition-colors"
          >
            Back to Payments
          </Link>

          {isPaymentRequired && (
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing on Algorand...</span>
                </>
              ) : (
                <>
                  <span>Pay 0.001 USDC</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          {isSettlementPending && (
            <button
              onClick={handleCheckStatus}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking TestNet...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Check Status</span>
                </>
              )}
            </button>
          )}

          {isFailed && (
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Retrying...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Payment</span>
                </>
              )}
            </button>
          )}

          {isVerified && loraUrl && isAlgorandTxId(payment.transactionId) && (
            <a
              href={loraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <span>View on Lora TestNet Explorer</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
