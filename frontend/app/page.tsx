'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  ShieldCheck,
  Bot,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Database,
  Coins,
  UserCheck,
  Search,
  Eye,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { RealisticHealthcareHero3D } from '@/components/three/RealisticHealthcareHero3D';
import { WalletConnectButton } from '@/components/blockchain/WalletConnectButton';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-slate-900 selection:bg-pink-500 selection:text-white flex flex-col font-sans relative overflow-hidden">
      {/* Subtle blurred ambient background shapes (Pale Sage & Soft Silver) */}
      <div className="absolute top-10 left-1/4 w-[480px] h-[480px] bg-[#cbd5e1]/35 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#f1f5f9]/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-10 w-[450px] h-[450px] bg-[#f8fafc]/45 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. TOP HEADER NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#cbd5e1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-pink-500 transition-colors">
              <span className="font-sans font-black">M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 tracking-tight leading-none group-hover:text-pink-700 transition-colors">
                MedMatch AI
              </span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">
                Hospital Procurement Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#overview" className="hover:text-pink-700 transition-colors">
              Overview
            </a>
            <a href="#features" className="hover:text-pink-700 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-pink-700 transition-colors">
              How It Works
            </a>
            <a href="#security" className="hover:text-pink-700 transition-colors">
              Security
            </a>
          </nav>

          {/* Primary CTA */}
          <div className="flex items-center gap-3">
            <WalletConnectButton />
            
            <AgentWalletDisplay />

            <Link
              href="/dashboard"
              className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <section id="overview" className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-[#cbd5e1] bg-gradient-to-b from-[#ffffff] via-[#f1f5f9]/40 to-[#f8fafc]/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Value Proposition & Hero Copy */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 text-pink-800 border border-[#cbd5e1] shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                  <span>Autonomous Hospital Supply Intelligence</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Smarter Hospital Procurement with AI
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                  MedMatch AI helps hospitals predict shortages, find better suppliers, and make faster procurement decisions.
                </p>

                {/* Supporting Line */}
                <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto lg:mx-0">
                  The platform can securely access paid supplier intelligence through x402 payments on Algorand Testnet.
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm transition-all shadow-md shadow-pink-700/10 hover:shadow-lg active:scale-[0.98]"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="#how-it-works"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-[#cbd5e1] transition-colors shadow-xs"
                  >
                    <span>See How It Works</span>
                  </a>
                </div>

                {/* Micro Trust Indicators */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-pink-600" />
                    <span>Predictive Burn Forecasting</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-pink-600" />
                    <span>Automated x402 Micropayments</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-pink-600" />
                    <span>Human Approval Governance</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Realistic 3D Interactive Healthcare Hero Visual */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-2xl bg-gradient-to-b from-[#f1f5f9]/60 to-[#cbd5e1]/50 p-2 sm:p-4 border border-[#cbd5e1] shadow-xl shadow-slate-900/5 overflow-hidden">
                  <RealisticHealthcareHero3D />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FEATURE SECTION */}
        <section id="features" className="py-16 sm:py-24 bg-transparent border-b border-[#cbd5e1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-pink-800 uppercase tracking-widest bg-[#f1f5f9] px-2.5 py-1 rounded border border-[#cbd5e1]">
                Core Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                What MedMatch AI Does
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Automated clinical inventory monitoring, supplier evaluation, and autonomous micropayment rails built for healthcare teams.
              </p>
            </div>

            {/* 6 Clean White Feature Cards over Soft Green-Silver Canvas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-6 border border-[#cbd5e1] hover:border-pink-400 hover:shadow-md transition-all shadow-xs group">
                <div className="w-12 h-12 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center mb-5 group-hover:bg-pink-600 group-hover:text-white transition-colors border border-pink-100">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Predict Supply Shortages
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  MedMatch studies inventory usage and predicts which medical supplies may run low.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-6 border border-[#cbd5e1] hover:border-pink-400 hover:shadow-md transition-all shadow-xs group">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-100">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Smart Procurement Support
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The platform helps procurement teams identify what needs to be purchased and when.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-6 border border-[#cbd5e1] hover:border-pink-400 hover:shadow-md transition-all shadow-xs group">
                <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-5 group-hover:bg-slate-500 group-hover:text-white transition-colors border border-slate-200">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Supplier Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  MedMatch compares suppliers using price, delivery time, availability, quality, and reliability.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-xl p-6 border border-[#cbd5e1] hover:border-pink-400 hover:shadow-md transition-all shadow-xs group">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-indigo-100">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Secure x402 Payments
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The AI agent can securely pay for premium supplier information when it is needed.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-xl p-6 border border-[#cbd5e1] hover:border-pink-400 hover:shadow-md transition-all shadow-xs group">
                <div className="w-12 h-12 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center mb-5 group-hover:bg-pink-600 group-hover:text-white transition-colors border border-pink-100">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Algorand Settlement
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Payments are settled on Algorand Testnet and can be independently verified.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-xl p-6 border border-[#cbd5e1] hover:border-pink-400 hover:shadow-md transition-all shadow-xs group">
                <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors border border-amber-100">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Human Approval
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The AI recommends the best option, while hospital staff make the final decision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-16 sm:py-24 bg-[#f1f5f9]/30 border-b border-[#cbd5e1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-pink-800 uppercase tracking-widest bg-white px-2.5 py-1 rounded border border-[#cbd5e1]">
                Process Roadmap
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                How MedMatch Works
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                A simple 5-step process from initial inventory scan to human-approved order execution.
              </p>
            </div>

            {/* 5-Step Process Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Step 1 */}
              <div className="bg-white rounded-xl p-5 border border-[#cbd5e1] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-full bg-[#f1f5f9] text-pink-800 font-bold text-xs flex items-center justify-center border border-[#cbd5e1]">
                      1
                    </span>
                    <Database className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Monitor Inventory</h3>
                  <p className="text-xs text-slate-600">MedMatch checks current medical supply levels.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl p-5 border border-[#cbd5e1] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-full bg-[#f1f5f9] text-pink-800 font-bold text-xs flex items-center justify-center border border-[#cbd5e1]">
                      2
                    </span>
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Predict Demand</h3>
                  <p className="text-xs text-slate-600">The system estimates future demand using recent usage.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-xl p-5 border border-[#cbd5e1] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-full bg-[#f1f5f9] text-pink-800 font-bold text-xs flex items-center justify-center border border-[#cbd5e1]">
                      3
                    </span>
                    <Eye className="w-4 h-4 text-rose-500" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Detect Risk</h3>
                  <p className="text-xs text-slate-600">It identifies possible shortages before stock runs out.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-xl p-5 border border-[#cbd5e1] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-full bg-[#f1f5f9] text-pink-800 font-bold text-xs flex items-center justify-center border border-[#cbd5e1]">
                      4
                    </span>
                    <Search className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Find the Best Supplier</h3>
                  <p className="text-xs text-slate-600">The platform accesses supplier intelligence and compares available options.</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-white rounded-xl p-5 border border-[#cbd5e1] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-full bg-[#f1f5f9] text-pink-800 font-bold text-xs flex items-center justify-center border border-[#cbd5e1]">
                      5
                    </span>
                    <UserCheck className="w-4 h-4 text-slate-500" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Recommend for Approval</h3>
                  <p className="text-xs text-slate-600">Hospital staff receive a clear procurement recommendation and make the final decision.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. WHY MEDMATCH SECTION */}
        <section className="py-16 sm:py-24 bg-transparent border-b border-[#cbd5e1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-pink-800 uppercase tracking-widest bg-[#f1f5f9] px-2.5 py-1 rounded border border-[#cbd5e1]">
                Hospital Value
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                Why MedMatch AI
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Designed to give clinical procurement teams speed, clarity, and control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Value Card 1 */}
              <div className="bg-white rounded-xl p-8 border border-[#cbd5e1] shadow-xs flex flex-col items-start">
                <div className="w-10 h-10 rounded-lg bg-pink-600 text-white flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Faster Decisions</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Reduce the time needed to identify shortages and compare suppliers.
                </p>
              </div>

              {/* Value Card 2 */}
              <div className="bg-white rounded-xl p-8 border border-[#cbd5e1] shadow-xs flex flex-col items-start">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-4">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Better Visibility</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Understand inventory risks before they become critical.
                </p>
              </div>

              {/* Value Card 3 */}
              <div className="bg-white rounded-xl p-8 border border-[#cbd5e1] shadow-xs flex flex-col items-start">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Smarter Procurement</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Use data and AI to support better supplier decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. X402 + ALGORAND SECTION */}
        <section className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest bg-pink-950/80 px-2.5 py-1 rounded border border-pink-800">
                Transparent Micropayments
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Secure AI Payments
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                When MedMatch needs premium supplier information, it can make a secure x402 payment using USDC on Algorand Testnet.
              </p>
            </div>

            {/* Simple Visual Flow */}
            <div className="mt-12 max-w-4xl mx-auto bg-slate-950/60 rounded-2xl p-6 sm:p-8 border border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center text-center">
                {/* Node 1 */}
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                  <Bot className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                  <p className="font-bold text-xs text-white">AI Agent</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Detects Need</p>
                </div>

                {/* Arrow */}
                <div className="hidden sm:flex justify-center text-pink-400">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Node 2 */}
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                  <Zap className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <p className="font-bold text-xs text-white">x402 Payment</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Micropayment Protocol</p>
                </div>

                {/* Arrow */}
                <div className="hidden sm:flex justify-center text-pink-400">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Node 3 */}
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                  <Coins className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                  <p className="font-bold text-xs text-white">Algorand</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">USDC Settlement</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center mt-4 pt-4 border-t border-slate-800/80 max-w-xl mx-auto">
                {/* Node 4 */}
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                  <Database className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="font-bold text-xs text-white">Supplier Intelligence</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Unlocked Oracle</p>
                </div>

                {/* Arrow */}
                <div className="hidden sm:flex justify-center text-pink-400">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Node 5 */}
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                  <UserCheck className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                  <p className="font-bold text-xs text-white">Recommendation</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Staff Decision</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. TRUST / SECURITY SECTION */}
        <section id="security" className="py-16 sm:py-24 bg-transparent border-b border-[#cbd5e1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-pink-800 uppercase tracking-widest bg-[#f1f5f9] px-2.5 py-1 rounded border border-[#cbd5e1]">
                Hospital Governance
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                Designed with Security in Mind
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Enterprise security standards protecting hospital operations and private keys.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Security Point 1 */}
              <div className="bg-white rounded-xl p-6 border border-[#cbd5e1] shadow-xs flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center mb-4 border border-pink-100">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Server-Side Credentials</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Private wallet credentials stay on the server.
                  </p>
                </div>
              </div>

              {/* Security Point 2 */}
              <div className="bg-white rounded-xl p-6 border border-[#cbd5e1] shadow-xs flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4 border border-blue-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Zero Frontend Secrets</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sensitive information is not exposed in the frontend.
                  </p>
                </div>
              </div>

              {/* Security Point 3 */}
              <div className="bg-white rounded-xl p-6 border border-[#cbd5e1] shadow-xs flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 border border-indigo-100">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Public Verification</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Payments can be verified on Algorand.
                  </p>
                </div>
              </div>

              {/* Security Point 4 */}
              <div className="bg-white rounded-xl p-6 border border-[#cbd5e1] shadow-xs flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-4 border border-slate-200">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Human In The Loop</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Final procurement decisions remain with people.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. CALL TO ACTION (CTA) */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-[#f1f5f9]/60 to-[#cbd5e1]/70 border-b border-[#cbd5e1]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Ready to Explore MedMatch AI?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              See how intelligent forecasting, supplier analysis, and secure payments work together in one platform.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-base transition-all shadow-lg shadow-pink-700/20 active:scale-[0.98]"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER */}
      <footer className="bg-[#ffffff] py-12 border-t border-[#cbd5e1] text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-pink-600 flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">MedMatch AI</p>
              <p className="text-slate-500 text-xs">AI-powered hospital procurement platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-500">
            <a href="#overview" className="hover:text-slate-900 transition-colors">
              Overview
            </a>
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AgentWalletDisplay() {
  const [balance, setBalance] = React.useState<number>(0);
  const agentAddress = "IWOSB3QY3C3OUMV74HMWCY4HN76DBP4EN2SEMAKYK4U4LEINNT64RZFNCU";

  React.useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(`https://testnet-idx.algonode.cloud/v2/accounts/${agentAddress}`);
        const data = await res.json();
        const assets = data.account?.assets || [];
        const usdcAsset = assets.find((a: any) => a['asset-id'] === 10458941);
        if (usdcAsset) {
          setBalance(usdcAsset.amount / 1000000);
        }
      } catch (e) {
        console.error('Agent wallet fetch error', e);
      }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent border border-slate-300 text-xs font-semibold transition">
      <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
      <span className="text-slate-500 font-medium">Agent Wallet:</span>
      <span className="text-slate-700 font-bold">{balance.toFixed(2)} USDC</span>
    </div>
  );
}
