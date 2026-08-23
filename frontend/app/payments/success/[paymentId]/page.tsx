'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getPaymentById } from '@/lib/api';
import { formatUsdcAmount, formatAlgorandAddress, getAlgorandExplorerUrl } from '@/lib/x402';
import { X402PaymentRecord } from '@/types/payment';
import {
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  CreditCard,
  Package,
  Building2,
  Clock,
  ShieldCheck,
  RotateCcw,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = (params?.paymentId as string) || '';

  const [payment, setPayment] = useState<X402PaymentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPayment() {
      if (!paymentId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const record = await getPaymentById(paymentId);
        if (record) {
          setPayment(record);
        } else {
          setError('Payment record not found.');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load transaction details.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPayment();
  }, [paymentId]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-xs text-slate-600 font-medium">Verifying transaction settlement on Algorand TestNet...</p>
      </div>
    );
  }

  // If payment failed or was not settled, show failure state
  const isSettled = payment && (payment.status === 'PAYMENT_SETTLED' || payment.status === 'PAYMENT_VERIFIED' || payment.status === 'VERIFIED');

  if (!payment || !isSettled) {
    return (
      <div className="max-w-xl mx-auto my-8 bg-white rounded-xl border border-[#cbd5e1] shadow-sm p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Payment Not Settled</h2>
        <p className="text-xs text-slate-600">
          {payment?.status === 'PAYMENT_SIGNER_NOT_CONFIGURED' || payment?.status === 'PAYMENT_CONFIGURATION_REQUIRED'
            ? 'Payment service is not configured yet. Payer wallet credentials are required in the backend environment.'
            : error || 'This payment has not completed on-chain settlement yet.'}
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/procurement"
            className="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
          >
            Return to Procurement
          </Link>
          <Link
            href="/payments"
            className="px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            View Payments
          </Link>
        </div>
      </div>
    );
  }

  const loraUrl = getAlgorandExplorerUrl(payment.transactionId);
  const formattedTime = payment.settledAt || payment.createdAt
    ? new Date(payment.settledAt || payment.createdAt!).toLocaleString()
    : 'Recent';

  const product = payment.product || {
    name: payment.productName || 'Surgical Gloves (Sterile, Latex-Free)',
    requiredQuantity: payment.requiredQuantity || 1650,
    currentStock: payment.currentStock || 1250,
    forecastDemand: payment.forecastDemand || 2900,
    expectedDeficit: payment.expectedDeficit || 1650
  };

  const supplier = payment.supplier || {
    name: payment.supplierName || 'MediSupply Healthcare Solutions',
    unitPrice: payment.supplierUnitPrice || 1.85,
    deliveryTime: payment.supplierDeliveryDays || 2,
    reliability: payment.supplierReliability || 99.2,
    score: payment.supplierScore || 94.6,
    availability: '5,000+ units in stock'
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* 1. Header Banner & Success Indicator */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-8 shadow-sm text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            x402 Micropayment Settled
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Payment Successful</h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
            Supplier intelligence payment was successfully settled on Algorand TestNet.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="text-2xl font-black text-slate-900">
            {formatUsdcAmount(payment.amount)}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
            Algorand TestNet
          </span>
        </div>
      </div>

      {/* 2. Three Clean Cards: Product Details, Supplier Details, Blockchain Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Details Card */}
        <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-teal-600" />
              Medical Supply Item
            </span>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Shortage Target
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900">{product.name}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Automated clinical replenishment analysis</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-2.5 rounded-lg bg-[#f1f5f9]/40 border border-[#cbd5e1]">
              <span className="text-slate-500 text-[11px]">Required Qty</span>
              <p className="font-bold text-slate-900 mt-0.5">{product.requiredQuantity?.toLocaleString()} units</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#f1f5f9]/40 border border-[#cbd5e1]">
              <span className="text-slate-500 text-[11px]">Current Stock</span>
              <p className="font-bold text-slate-900 mt-0.5">{product.currentStock?.toLocaleString()} units</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#f1f5f9]/40 border border-[#cbd5e1]">
              <span className="text-slate-500 text-[11px]">7-Day Forecast</span>
              <p className="font-bold text-slate-900 mt-0.5">{product.forecastDemand?.toLocaleString()} units</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#f1f5f9]/40 border border-[#cbd5e1]">
              <span className="text-slate-500 text-[11px]">Expected Deficit</span>
              <p className="font-bold text-rose-600 mt-0.5">-{product.expectedDeficit?.toLocaleString()} units</p>
            </div>
          </div>
        </div>

        {/* Supplier Details Card */}
        <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              Supplier Intelligence
            </span>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Ranked #1
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900">{supplier.name}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Score: {supplier.score} / 100 • Verified SLA</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-2.5 rounded-lg bg-[#f1f5f9]/40 border border-[#cbd5e1]">
              <span className="text-slate-500 text-[11px]">Unit Price</span>
              <p className="font-bold text-slate-900 mt-0.5">${supplier.unitPrice?.toFixed(2)}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#f1f5f9]/40 border border-[#cbd5e1]">
              <span className="text-slate-500 text-[11px]">Delivery Time</span>
              <p className="font-bold text-emerald-700 mt-0.5">{supplier.deliveryTime || supplier.deliveryDays} Days (Safe)</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#f1f5f9]/40 border border-[#cbd5e1]">
              <span className="text-slate-500 text-[11px]">Reliability</span>
              <p className="font-bold text-slate-900 mt-0.5">{supplier.reliability}% Verified</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#f1f5f9]/40 border border-[#cbd5e1]">
              <span className="text-slate-500 text-[11px]">Stock Status</span>
              <p className="font-bold text-emerald-700 mt-0.5">Immediate Dispatch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Details Card */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
              Blockchain Settlement Telemetry
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed on TestNet
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-mono text-slate-900 font-bold truncate max-w-[200px]">
                {payment.transactionId || 'Confirmed'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Payment Time:</span>
              <span className="text-slate-800">{formattedTime}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Service:</span>
              <span className="font-semibold text-slate-800 text-[11px]">Supplier Intelligence Stream</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Network:</span>
              <span className="font-medium text-slate-800">Algorand TestNet</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Asset & Amount:</span>
              <span className="font-bold text-slate-900">{formatUsdcAmount(payment.amount)} (USDC)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Payer Address:</span>
              <span className="font-mono text-slate-700 truncate max-w-[180px]">
                {formatAlgorandAddress(payment.payerPublicAddress || payment.senderAddress, 6)}
              </span>
            </div>
          </div>
        </div>

        {/* View on Lora Button */}
        {loraUrl && (
          <div className="pt-2">
            <a
              href={loraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-[#cbd5e1] bg-[#ffffff] hover:bg-[#f1f5f9] text-teal-800 text-xs font-bold transition-colors"
            >
              <span>View On-Chain Confirmation on Lora Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* 3. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Link
          href="/payments"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg border border-[#cbd5e1] bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors shadow-sm"
        >
          <span>View Payment History</span>
        </Link>

        <Link
          href="/procurement"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-sm"
        >
          <span>Continue to Recommendation</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
