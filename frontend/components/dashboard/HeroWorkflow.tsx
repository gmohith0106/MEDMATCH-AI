'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import {
  Bot,
  Building2,
  PackageSearch,
  TrendingUp,
  CreditCard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';


export function HeroWorkflow() {
  const router = useRouter();
  const { startAgentRun } = useDemo();

  const handleRunAgent = () => {
    router.push('/agent');
  };

  const flowNodes = [
    { label: 'Hospital Inventory', icon: PackageSearch, color: 'text-[#94d4f8]', bg: 'bg-white' },
    { label: 'AI Demand Forecast', icon: TrendingUp, color: 'text-[#9ddcfd]', bg: 'bg-white' },
    { label: 'Supplier Intelligence', icon: ShieldCheck, color: 'text-[#e27094]', bg: 'bg-white' },
    { label: 'Algorand Settlement', icon: CreditCard, color: 'text-[#e3577c]', bg: 'bg-white' },
    { label: 'AI Recommendation', icon: Sparkles, color: 'text-[#e3577c]', bg: 'bg-white' },
  ];

  return (
    <div className="relative rounded-panel overflow-hidden bg-white p-6 sm:p-9 border border-[#ffc8d3] shadow-card">
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Mission & CTAs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-badge bg-[#fff5f7] border border-[#ffc8d3] text-xs font-bold text-[#24324a] shadow-soft">
            <span className="w-2 h-2 rounded-full bg-[#94d4f8]" />
            <span>Autonomous Healthcare Procurement</span>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#24324a] tracking-tight leading-[1.15]">
            Procurement decisions,
            <br />
            <span className="text-[#e3577c]">before shortages become emergencies.</span>
          </h2>

          <p className="text-sm text-[#667085] font-normal leading-relaxed max-w-xl">
            MedMatch analyzes hospital inventory, forecasts clinical consumption demand, evaluates suppliers across price and SLA, and coordinates procurement intelligence through an autonomous agent.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleRunAgent}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white font-bold text-xs sm:text-sm shadow-soft transition-all active:scale-98"
            >
              <Bot className="w-4 h-4 text-white" />
              <span>RUN PROCUREMENT AGENT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/hospitals"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-btn bg-[#94d4f8] hover:bg-[#9ddcfd] text-[#24324a] font-bold text-xs sm:text-sm transition-all"
            >
              <Building2 className="w-4 h-4 text-[#24324a]" />
              <span>HOSPITAL DIRECTORY (30K)</span>
            </Link>
          </div>
        </div>


        {/* Right Column: Connected Workflow Pipeline */}
        <div className="lg:col-span-6">
          <div className="bg-[#fff5f7] rounded-card p-5 border border-[#ffc8d3] shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-[#ffc8d3] mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e27094]" />
                <span className="text-xs font-bold text-[#24324a] uppercase tracking-wider">
                  Connected Workflow Pipeline
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-badge bg-white text-[#24324a] border border-[#ffc8d3]">
                Algorand + x402
              </span>
            </div>

            {/* Workflow steps chain */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
              {flowNodes.map((node, index) => {
                const Icon = node.icon;
                return (
                  <div key={node.label} className="relative flex flex-col items-center text-center group">
                    <div
                      className={`w-full p-3 rounded-btn border border-[#ffc8d3] shadow-soft flex flex-col items-center gap-1.5 transition-transform group-hover:-translate-y-0.5 ${node.bg}`}
                    >
                      <div className="p-2 rounded-badge bg-[#fff5f7] border border-[#ffc8d3]">
                        <Icon className={`w-4 h-4 ${node.color}`} />
                      </div>
                      <span className="text-[11px] font-bold text-[#24324a] leading-tight line-clamp-2">
                        {node.label}
                      </span>
                    </div>

                    {index < flowNodes.length - 1 && (
                      <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#667085] font-bold">
                        →
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom status tagline */}
            <div className="mt-4 pt-3 border-t border-[#ffc8d3] flex items-center justify-between text-[11px] text-[#667085] font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#e27094]" />
                <span>Zero manual spreadsheet tracking required</span>
              </div>
              <span className="text-[#24324a] font-bold">100% Autonomous Pipeline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
