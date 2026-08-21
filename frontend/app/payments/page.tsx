'use client';

import React from 'react';
import { PaymentTable } from '@/components/payments/PaymentTable';
import { CreditCard, ShieldCheck } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-[#DDE9E2] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
              <CreditCard className="w-3.5 h-3.5" />
              x402 Micropayments
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Algorand TestNet</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Payments</h1>
          <p className="text-xs text-slate-600 max-w-2xl mt-0.5">
            Verified supplier-intelligence payments made by MedMatch.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E8F1EC]/60 border border-[#DDE9E2] text-xs font-semibold text-slate-700 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Server-Side Signer • Zero Browser Keys</span>
        </div>
      </div>

      {/* Main Table & Stats */}
      <PaymentTable />
    </div>
  );
}
