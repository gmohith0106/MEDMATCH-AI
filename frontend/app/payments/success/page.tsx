'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLatestPayment } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function PaymentSuccessRedirectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function redirect() {
      try {
        const latest = await getLatestPayment();
        if (latest && latest.id) {
          router.replace(`/payments/success/${latest.id}`);
          return;
        }
      } catch {
        // fallback
      }
      setLoading(false);
    }
    redirect();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-xs text-slate-600 font-medium">Locating recent payment record...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-xl border border-[#DDE9E2] p-8 text-center space-y-4">
      <h2 className="text-base font-bold text-slate-900">No Recent Payment Found</h2>
      <p className="text-xs text-slate-600">
        Run the autonomous procurement agent to access premium supplier intelligence and settle on Algorand TestNet.
      </p>
      <div className="pt-2">
        <Link
          href="/procurement"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
        >
          <span>Open Procurement Agent</span>
        </Link>
      </div>
    </div>
  );
}
