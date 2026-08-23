'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  KeyRound,
  ArrowLeft,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function ForgotPasswordPage() {
  const { sendPasswordReset, isLoading, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const res = await sendPasswordReset(email);
    if (res.success) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto pt-6">
        <Logo />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-[#ffc8d3] shadow-card space-y-6">
          {submitted ? (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-[#fff5f7] text-[#94d4f8] flex items-center justify-center mx-auto border border-[#94d4f8]">
                <CheckCircle2 className="w-6 h-6 text-[#94d4f8]" />
              </div>
              <h2 className="font-heading font-extrabold text-xl text-[#24324a]">
                Reset link sent
              </h2>
              <p className="text-xs text-[#667085] leading-relaxed">
                Check your inbox for password reset instructions sent to <strong className="text-[#24324a]">{email}</strong>.
              </p>
              <div className="pt-4 border-t border-[#ffc8d3]">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-btn bg-[#e3577c] text-white text-xs font-bold shadow-soft hover:bg-[#e27094]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-btn bg-[#fff5f7] text-[#e3577c] flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5 text-[#e3577c]" />
                </div>
                <div>
                  <h1 className="font-heading font-extrabold text-xl text-[#24324a] tracking-tight">
                    Reset your password
                  </h1>
                  <p className="text-xs text-[#667085] font-medium mt-0.5">
                    Enter your work email to receive reset instructions.
                  </p>
                </div>
              </div>

              {authError && (
                <div className="p-3.5 rounded-btn bg-[#fff5f7] border border-[#ffc8d3] text-xs font-medium text-[#e3577c] flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-[#e3577c] flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#24324a] uppercase tracking-wider mb-1.5">
                    Work Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="r.reynolds@citycare.org"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-input border border-[#ffc8d3] text-xs text-[#24324a] placeholder-[#667085] focus:outline-none focus:border-[#e27094] bg-white"
                    />
                    <Mail className="w-4 h-4 text-[#667085] absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold transition-all shadow-soft active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending reset link...</span>
                    </>
                  ) : (
                    <span>SEND RESET LINK</span>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-[#ffc8d3] text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#24324a] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-[11px] text-[#667085] flex items-center justify-center gap-1.5 pb-4">
        <ShieldCheck className="w-3.5 h-3.5 text-[#94d4f8]" />
        <span>MedMatch Enterprise Identity &bull; Preview Mode</span>
      </div>
    </div>
  );
}
