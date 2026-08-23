'use client';

import React, { useState } from 'react';
import { X402PaymentRecord } from '@/types/payment';
import { formatAlgorandAddress, getAlgorandExplorerUrl } from '@/lib/x402';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';

interface TransactionDetailModalProps {
  payment: X402PaymentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailModal({
  payment,
  isOpen,
  onClose,
}: TransactionDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !payment) return null;

  const copyToClipboard = (text?: string, field?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field || 'default');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAYMENT_SETTLED':
      case 'PAYMENT_VERIFIED':
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-400/10 text-slate-500 dark:text-slate-400 border border-slate-400/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Settled On-Chain
          </span>
        );
      case 'PAYMENT_SUBMITTED':
      case 'PAYMENT_VERIFYING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Verifying Round
          </span>
        );
      case 'PAYMENT_REQUIRED':
      case 'PAYMENT_PENDING':
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Payment Required
          </span>
        );
      case 'PAYMENT_CONFIGURATION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Configuration Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
            {status}
          </span>
        );
    }
  };

  const explorerUrl = payment.explorerUrl || getAlgorandExplorerUrl(payment.transactionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-gradient-to-r from-pink-50/50 via-white to-blue-50/30 dark:from-pink-950/20 dark:via-zinc-900 dark:to-blue-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                x402 Micropayment Record
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Payment ID: {payment.paymentId || payment.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(payment.status)}
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-xs font-medium text-zinc-400">Amount</p>
              <p className="text-base font-bold text-zinc-900 dark:text-white mt-0.5">
                ${payment.amount?.toFixed(2) || '0.001'} USD
              </p>
              <p className="text-[11px] text-pink-600 dark:text-pink-400 font-mono font-medium">
                {payment.amount} {payment.asset || 'ALGO'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400">Protocol</p>
              <p className="text-base font-bold text-zinc-900 dark:text-white mt-0.5 uppercase">
                {payment.protocol}
              </p>
              <p className="text-[11px] text-zinc-500 font-medium">HTTP 402 Exact</p>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400">Network</p>
              <p className="text-base font-bold text-zinc-900 dark:text-white mt-0.5">
                Algorand
              </p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">TestNet</p>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400">Confirmed Round</p>
              <p className="text-base font-bold text-zinc-900 dark:text-white mt-0.5 font-mono">
                {payment.confirmedRound || payment.blockNumber ? `#${payment.confirmedRound || payment.blockNumber}` : 'Pending'}
              </p>
              <p className="text-[11px] text-zinc-500 font-medium">Lora confirmation round</p>
            </div>
          </div>

          {/* Transaction Hash & Explorer Link */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Algorand Transaction ID
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-mono text-xs text-blue-700 dark:text-blue-300 truncate select-all">
                  {payment.transactionId || 'Awaiting on-chain transaction submission'}
                </span>
              </div>
              {payment.transactionId && (
                <button
                  onClick={() => copyToClipboard(payment.transactionId, 'tx')}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 rounded-md transition-colors shrink-0"
                >
                  {copiedField === 'tx' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Addresses: Sender & Receiver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Sender Address (Agent Escrow)
              </label>
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <div className="font-mono text-xs text-zinc-800 dark:text-zinc-200 truncate pr-2" title={payment.senderAddress}>
                  {payment.senderAddress ? formatAlgorandAddress(payment.senderAddress, 8) : 'Not available'}
                </div>
                {payment.senderAddress && (
                  <button
                    onClick={() => copyToClipboard(payment.senderAddress, 'sender')}
                    className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded transition-colors"
                  >
                    {copiedField === 'sender' ? (
                      <Check className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Receiver Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Receiver Address (Oracle Provider)
              </label>
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <div className="font-mono text-xs text-zinc-800 dark:text-zinc-200 truncate pr-2" title={payment.receiverAddress}>
                  {payment.receiverAddress ? formatAlgorandAddress(payment.receiverAddress, 8) : 'Not available'}
                </div>
                {payment.receiverAddress && (
                  <button
                    onClick={() => copyToClipboard(payment.receiverAddress, 'receiver')}
                    className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded transition-colors"
                  >
                    {copiedField === 'receiver' ? (
                      <Check className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Service & Timestamps */}
          <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Protected Resource
              </span>
              <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">
                {payment.resource || '/api/paid/supplier-intelligence'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Created At</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'Not available'}
              </span>
            </div>

            {payment.verifiedAt && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 dark:text-zinc-400">Verified At</span>
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  {new Date(payment.verifiedAt).toLocaleString()}
                </span>
              </div>
            )}

            {payment.notes && (
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-600 dark:text-zinc-400">
                <strong className="font-semibold text-zinc-700 dark:text-zinc-300">Notes: </strong>
                {payment.notes}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            {payment.transactionId && explorerUrl ? (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/30 rounded-lg transition-colors"
              >
                <span>Verify confirmation on Lora</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-xs text-zinc-400 italic">
                Explorer link available upon on-chain confirmation
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
