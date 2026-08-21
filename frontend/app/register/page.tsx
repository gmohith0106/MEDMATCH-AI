'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';

export default function RegisterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to staff login
    const timer = setTimeout(() => {
      router.push('/login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F2F4F3] flex flex-col justify-center items-center p-4 font-sans text-center">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#DDE9E2] shadow-xl p-8 space-y-5">
        <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-700 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6 text-teal-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Hospital Staff Portal</h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          Public registration is disabled. Staff accounts are provisioned exclusively by your Hospital Administrator.
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to Staff Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
