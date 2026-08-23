'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Printer,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Building,
  FileCheck,
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';
import { getAlgorandExplorerUrl } from '@/lib/x402';
import { formatUsd } from '@/lib/utils';

export default function PrintableReceiptPage() {
  const params = useParams();
  const { payments, hospitalSettings } = useDemo();
  const transactionIdParam = (params?.transactionId as string) || '';

  const payment = payments.find(
    (p) =>
      p.transactionId === transactionIdParam ||
      p.id === transactionIdParam ||
      p.paymentId === transactionIdParam
  ) || {
    id: `pay_x402_${transactionIdParam.substring(0, 8) || 'tx'}`,
    transactionId: transactionIdParam.startsWith('pay_') ? 'WXYZ7492842JFKALGORANDTESTNETTXN7489' : transactionIdParam,
    senderAddress: 'MEDMATCH7AUTONOMOUSAGENTPAYERTESTNETACCOUNT992484',
    receiverAddress: 'TIER1SUPPLIERORACLEACCOUNTRECEIVERTESTNETALGO8823',
    amount: 0.001,
    asset: 'ALGO',
    currency: 'USD',
    network: 'Algorand TestNet',
    service: 'Tier-1 Supplier Intelligence Oracle',
    status: 'PAYMENT_SETTLED',
    verified: true,
    confirmedRound: 41829023,
    timestamp: new Date().toISOString(),
    settledAt: new Date().toISOString(),
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-6 px-4">
      {/* Navigation & Print Actions (Hidden in Print Mode) */}
      <div className="flex items-center justify-between no-print border-b border-[#ffc8d3] pb-4">
        <Link
          href={`/payments/${encodeURIComponent(transactionIdParam)}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#e3577c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Transaction</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#e3577c] text-white text-xs font-bold hover:bg-[#e27094] shadow-soft transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Printable Receipt Container */}
      <div className="printable-receipt-container bg-white border border-[#ffc8d3] rounded-xl p-8 sm:p-12 shadow-card space-y-8 text-[#24324a]">
        {/* Receipt Header */}
        <div className="flex items-start justify-between border-b-2 border-[#24324a] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#e3577c] text-white flex items-center justify-center font-bold text-lg">
                M
              </div>
              <span className="font-bold text-xl tracking-tight text-[#24324a]">
                MedMatch AI
              </span>
            </div>
            <p className="text-xs text-[#667085]">
              Autonomous Clinical Intelligence & Smart Settlement Protocol
            </p>
            <p className="text-xs font-semibold text-[#24324a]">
              {hospitalSettings.name || 'CityCare Metropolitan Hospital'}
            </p>
          </div>

          <div className="text-right space-y-1">
            <h2 className="text-2xl font-black text-[#24324a] tracking-tight uppercase">
              Payment Receipt
            </h2>
            <p className="text-xs font-mono text-[#667085]">
              RECEIPT ID: {payment.id || 'REC-88231'}
            </p>
            <p className="text-xs text-[#667085]">
              Date: {new Date(payment.settledAt || payment.timestamp || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Core Receipt Items Table */}
        <div className="space-y-4">
          <div className="border-b border-[#e2e8f0] pb-2 text-xs font-bold text-[#667085] uppercase tracking-wider flex justify-between">
            <span>Service Description</span>
            <span>Settled Amount</span>
          </div>

          <div className="flex justify-between items-start text-sm py-2">
            <div>
              <p className="font-bold text-[#24324a]">
                {payment.service || 'Tier-1 Supplier Intelligence Oracle'}
              </p>
              <p className="text-xs text-[#667085] mt-0.5">
                Cryptographic on-chain access to verified hospital supply data streams
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#24324a]">
                {formatUsd(payment.amount || 0.001)}
              </p>
              <p className="text-xs font-bold text-[#e3577c] font-mono">
                {payment.amount || 0.001} {payment.asset || 'ALGO'}
              </p>
            </div>
          </div>
        </div>

        {/* Cryptographic Transaction Audit Ledger */}
        <div className="bg-[#fff5f7] border border-[#ffc8d3] rounded-lg p-5 space-y-3 text-xs">
          <div className="font-bold text-[#24324a] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#e3577c]" />
            <span>Cryptographic On-Chain Verification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-[#667085] block text-[10px] uppercase font-bold">Transaction ID</span>
              <span className="font-mono font-bold text-[#24324a] break-all">
                {payment.transactionId || 'WXYZ7492842JFKALGORANDTESTNETTXN7489'}
              </span>
            </div>

            <div>
              <span className="text-[#667085] block text-[10px] uppercase font-bold">Settlement Network</span>
              <span className="font-bold text-[#24324a]">
                {payment.network || 'Algorand TestNet'}
              </span>
            </div>

            <div>
              <span className="text-[#667085] block text-[10px] uppercase font-bold">Sender (Agent Account)</span>
              <span className="font-mono text-[11px] text-[#24324a] break-all">
                {payment.senderAddress || 'MEDMATCH7AUTONOMOUSAGENTPAYERTESTNETACCOUNT992484'}
              </span>
            </div>

            <div>
              <span className="text-[#667085] block text-[10px] uppercase font-bold">Receiver (Oracle Account)</span>
              <span className="font-mono text-[11px] text-[#24324a] break-all">
                {payment.receiverAddress || 'TIER1SUPPLIERORACLEACCOUNTRECEIVERTESTNETALGO8823'}
              </span>
            </div>

            <div>
              <span className="text-[#667085] block text-[10px] uppercase font-bold">Verification Status</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified On-Chain
              </span>
            </div>

            <div>
              <span className="text-[#667085] block text-[10px] uppercase font-bold">Settlement Status</span>
              <span className="font-bold text-[#24324a]">
                PAYMENT_SETTLED
              </span>
            </div>
          </div>
        </div>

        {/* Signature & Authority Section */}
        <div className="pt-6 border-t border-[#e2e8f0] flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
          <div>
            <p className="text-[11px] text-[#667085]">Authorized Procurement Director:</p>
            <p className="font-bold text-[#24324a] mt-1">Dr. Robert Reynolds</p>
            <p className="text-[10px] text-[#667085]">MedMatch Clinical Intelligence Systems</p>
          </div>

          <div className="text-right">
            <div className="border-b border-[#24324a] w-48 pb-1 mb-1 font-mono text-[10px] text-center text-[#667085]">
              [Digitally Signed On-Chain]
            </div>
            <p className="text-[10px] text-[#667085]">Cryptographic Authenticity Stamp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
