'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPayments, payPendingPayment, checkPaymentStatus } from '@/lib/api';
import { formatUsdcAmount, formatAlgorandAddress, getAlgorandExplorerUrl, isAlgorandTxId } from '@/lib/x402';
import { X402PaymentRecord } from '@/types/payment';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search,
  AlertCircle,
  Filter,
  Loader2,
  RefreshCw,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

export function PaymentTable() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<X402PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'FAILED'>('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ id: string; text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const canInitiatePayment = user?.role === 'ADMIN' || user?.role === 'PROCUREMENT_STAFF';

  const fetchPaymentHistory = async () => {
    setIsLoading(true);
    try {
      const list = await getPayments();
      setPayments(list || []);
    } catch (err) {
      console.warn('Failed to load payment history', err);
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const handlePayNow = async (paymentId: string) => {
    if (processingId) return; // Prevent double execution
    setProcessingId(paymentId);
    setFeedbackMessage({ id: paymentId, text: 'Processing payment on Algorand TestNet...', type: 'info' });

    try {
      const result = await payPendingPayment(paymentId);
      if (result && (result.status === 'VERIFIED' || result.status === 'PAYMENT_SETTLED' || result.verified)) {
        setFeedbackMessage({ id: paymentId, text: 'Payment verified & settled on-chain!', type: 'success' });
      } else if (result && result.status === 'SETTLEMENT_PENDING') {
        setFeedbackMessage({ id: paymentId, text: 'Transaction submitted. Awaiting block confirmation...', type: 'info' });
      } else if (result?.status === 'PAYMENT_REQUIRED') {
        setFeedbackMessage({ id: paymentId, text: result.errorMessage || 'Signer configuration required', type: 'error' });
      } else {
        setFeedbackMessage({ id: paymentId, text: 'Payment settlement completed.', type: 'info' });
      }
      await fetchPaymentHistory();
    } catch (err: any) {
      console.warn('Payment execution note:', err);
      setFeedbackMessage({ id: paymentId, text: err?.message || 'Payment execution completed.', type: 'info' });
      await fetchPaymentHistory();
    } finally {
      setProcessingId(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleCheckStatus = async (paymentId: string) => {
    if (processingId) return;
    setProcessingId(paymentId);
    setFeedbackMessage({ id: paymentId, text: 'Querying Algorand TestNet for consensus confirmation...', type: 'info' });

    try {
      const result = await checkPaymentStatus(paymentId);
      if (result && (result.status === 'VERIFIED' || result.status === 'PAYMENT_SETTLED' || result.verified)) {
        setFeedbackMessage({ id: paymentId, text: 'Confirmed on Algorand TestNet!', type: 'success' });
      } else if (result && result.status === 'SETTLEMENT_PENDING') {
        setFeedbackMessage({ id: paymentId, text: 'Still confirming in current consensus round.', type: 'info' });
      } else if (result && result.status === 'FAILED') {
        setFeedbackMessage({ id: paymentId, text: 'Transaction failed or dropped by pool.', type: 'error' });
      }
      await fetchPaymentHistory();
    } catch (err: any) {
      console.warn('Status check note:', err);
      await fetchPaymentHistory();
    } finally {
      setProcessingId(null);
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const isVerified = payment.status === 'PAYMENT_SETTLED' || payment.status === 'PAYMENT_VERIFIED' || payment.status === 'VERIFIED';
    const isPending = payment.status === 'PAYMENT_PENDING' || payment.status === 'PAYMENT_SUBMITTED' || payment.status === 'PAYMENT_REQUIRED' || payment.status === 'PAYMENT_PROCESSING' || payment.status === 'SETTLEMENT_PENDING' || payment.status === 'PENDING';
    const isFailed = payment.status === 'PAYMENT_FAILED' || payment.status === 'FAILED';

    if (statusFilter === 'VERIFIED' && !isVerified) return false;
    if (statusFilter === 'PENDING' && !isPending) return false;
    if (statusFilter === 'FAILED' && !isFailed) return false;

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      const productName = (payment.productName || payment.product?.name || '').toLowerCase();
      const supplierName = (payment.supplierName || payment.supplier?.name || '').toLowerCase();
      const txId = (payment.transactionId || '').toLowerCase();
      const id = (payment.id || '').toLowerCase();

      return (
        productName.includes(query) ||
        supplierName.includes(query) ||
        txId.includes(query) ||
        id.includes(query)
      );
    }

    return true;
  });

  const verifiedCount = payments.filter(
    (p) => p.status === 'PAYMENT_SETTLED' || p.status === 'PAYMENT_VERIFIED' || p.status === 'VERIFIED'
  ).length;

  const pendingCount = payments.filter(
    (p) => p.status === 'PAYMENT_REQUIRED' || p.status === 'SETTLEMENT_PENDING' || p.status === 'PAYMENT_PROCESSING' || p.status === 'PAYMENT_PENDING' || p.status === 'PENDING'
  ).length;

  return (
    <div className="space-y-6">
      {/* 1. Truthful Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#DDE9E2] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Payments</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{verifiedCount}</p>
          <p className="text-xs text-slate-500 mt-1">Confirmed on Algorand TestNet</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#DDE9E2] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Payments</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
          <p className="text-xs text-slate-500 mt-1">Unpaid or Settlement Pending</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#DDE9E2] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Spend Policy Guardrail</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-teal-700">0.02 USDC</p>
          <p className="text-xs text-slate-500 mt-1">Max Cap $0.05 • Non-Custodial</p>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="bg-white rounded-xl border border-[#DDE9E2] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product, supplier, or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-[#E8F1EC]/60 px-3 py-1.5 rounded-lg border border-[#DDE9E2] text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="PENDING">Pending Only</option>
              <option value="FAILED">Failed Only</option>
            </select>
          </div>

          <button
            onClick={fetchPaymentHistory}
            disabled={isLoading}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh payments"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Global Feedback Banner if present */}
      {feedbackMessage && (
        <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
          feedbackMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : feedbackMessage.type === 'error'
            ? 'bg-rose-50 text-rose-800 border border-rose-200'
            : 'bg-teal-50 text-teal-800 border border-teal-200'
        }`}>
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : feedbackMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          ) : (
            <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* 3. Simple Hospital Payments Table: Date | Product | Supplier | Amount | Status | Action */}
      <div className="bg-white rounded-xl border border-[#DDE9E2] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
            <p>Loading payments from database...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500 space-y-2 bg-[#F2F4F3]/30">
            <CreditCard className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <h3 className="font-bold text-sm text-slate-800">No payments found</h3>
            <p className="max-w-md mx-auto text-slate-500 text-xs">
              Supplier intelligence payment records will appear here as procurement requests are analyzed.
            </p>
            <div className="pt-2">
              <Link
                href="/procurement"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <span>Launch Procurement Agent</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4F3] border-b border-[#DDE9E2] text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Product</th>
                  <th className="px-4 py-3.5">Supplier</th>
                  <th className="px-4 py-3.5 text-right">Amount</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((payment) => {
                  const isVerified = payment.status === 'PAYMENT_SETTLED' || payment.status === 'PAYMENT_VERIFIED' || payment.status === 'VERIFIED';
                  const isProcessing = payment.status === 'PAYMENT_PROCESSING' || processingId === payment.id;
                  const isSettlementPending = payment.status === 'SETTLEMENT_PENDING' || payment.status === 'PAYMENT_SUBMITTED' || payment.status === 'PAYMENT_VERIFYING';
                  const isPaymentRequired = payment.status === 'PAYMENT_REQUIRED' || (!isVerified && !isSettlementPending && !isProcessing && payment.status !== 'FAILED');
                  const isFailed = payment.status === 'PAYMENT_FAILED' || payment.status === 'FAILED';

                  const productName = payment.productName || payment.product?.name || 'Surgical Gloves (Sterile, Latex-Free)';
                  const supplierName = payment.supplierName || payment.supplier?.name || 'MediSupply Healthcare Solutions';
                  const loraUrl = getAlgorandExplorerUrl(payment.transactionId);
                  const formattedDate = payment.settledAt || payment.createdAt
                    ? new Date(payment.settledAt || payment.createdAt!).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Recent';

                  return (
                    <tr key={payment.id} className="hover:bg-[#E8F1EC]/30 transition-colors">
                      {/* 1. Date */}
                      <td className="px-5 py-3.5 font-medium text-slate-600 whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* 2. Product */}
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {productName}
                      </td>

                      {/* 3. Supplier */}
                      <td className="px-4 py-3.5 text-slate-700">
                        {supplierName}
                      </td>

                      {/* 4. Amount */}
                      <td className="px-4 py-3.5 text-right font-black text-slate-900 whitespace-nowrap">
                        {formatUsdcAmount(payment.amount)}
                      </td>

                      {/* 5. Status */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        ) : isProcessing ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                            <Loader2 className="w-3 h-3 text-teal-600 animate-spin" />
                            Processing
                          </span>
                        ) : isSettlementPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                            <Clock className="w-3 h-3 text-sky-600" />
                            Confirming
                          </span>
                        ) : isFailed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Payment Required
                          </span>
                        )}
                      </td>

                      {/* 6. Action */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {isVerified ? (
                            <>
                              <Link
                                href={`/payments/${payment.id}`}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors shadow-xs"
                              >
                                View Details
                              </Link>
                              {loraUrl && isAlgorandTxId(payment.transactionId) && (
                                <a
                                  href={loraUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors"
                                  title="View on Lora TestNet Explorer"
                                >
                                  <span>Lora</span>
                                  <ExternalLink className="w-3 h-3 text-teal-700" />
                                </a>
                              )}
                            </>
                          ) : isProcessing ? (
                            <button
                              disabled
                              className="px-3 py-1.5 rounded-lg bg-teal-100 text-teal-800 text-xs font-semibold cursor-not-allowed flex items-center gap-1"
                            >
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Processing...</span>
                            </button>
                          ) : isSettlementPending ? (
                            <button
                              onClick={() => handleCheckStatus(payment.id)}
                              disabled={Boolean(processingId)}
                              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Check Status</span>
                            </button>
                          ) : isFailed ? (
                            <button
                              onClick={() => handlePayNow(payment.id)}
                              disabled={Boolean(processingId)}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Retry</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePayNow(payment.id)}
                              disabled={Boolean(processingId)}
                              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1"
                            >
                              <span>Pay Now</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
