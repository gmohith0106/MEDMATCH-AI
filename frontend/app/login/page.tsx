'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const {
    signInWithEmail,
    signInWithGoogle,
    isLoading,
    authError,
    authSuccess,
    clearAuthMessages,
  } = useAuth();

  const [email, setEmail] = useState('admin@citycare.hospital');
  const [password, setPassword] = useState('HospitalAdmin2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);
    clearAuthMessages();

    if (!email.trim()) {
      setFieldError('Please enter your hospital email address.');
      return;
    }
    if (!password) {
      setFieldError('Please enter your password.');
      return;
    }

    const ok = await signInWithEmail({ email, password });
    if (ok) {
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    setFieldError(null);
    clearAuthMessages();
    const result = await signInWithGoogle();
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F3] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Subtle ambient background glow */}
      <div className="absolute top-12 left-1/4 w-[420px] h-[420px] bg-[#DDE9E2]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-12 right-1/4 w-[420px] h-[420px] bg-[#E8F1EC]/60 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#DDE9E2] shadow-xl shadow-slate-900/5 p-8 sm:p-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md shadow-teal-600/20">
            <span className="font-sans font-black">M</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">MEDMATCH AI</h1>
          <p className="text-sm font-semibold text-teal-800">Hospital Staff Login</p>
          <p className="text-xs text-slate-500">Authorized Clinical & Supply Chain Personnel Only</p>
        </div>

        {/* Error / Success Notifications */}
        {authError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-relaxed">{authError}</span>
          </div>
        )}

        {authSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{authSuccess}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hospital Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@hospital.org"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 bg-slate-50/50 hover:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-3.5 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 bg-slate-50/50 hover:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldError && <p className="text-xs text-rose-600 mt-1 font-medium">{fieldError}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition-all shadow-md shadow-teal-700/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            or
          </span>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-[#DDE9E2] text-sm font-bold transition-all shadow-xs active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer Security Note */}
        <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 border-t border-slate-100">
          <Lock className="w-3.5 h-3.5 text-teal-600" />
          <span>Access Restricted to Authorized Hospital Staff</span>
        </div>
      </div>
    </div>
  );
}
