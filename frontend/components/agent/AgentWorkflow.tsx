'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import {
  PackageSearch,
  TrendingUp,
  AlertTriangle,
  Search,
  CreditCard,
  Coins,
  BarChart3,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Loader2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Bot,
  Info,
  Layers,
  Send,
} from 'lucide-react';
import { clinicalPresets } from '@/context/DemoContext';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PackageSearch,
  TrendingUp,
  AlertTriangle,
  Search,
  CreditCard,
  Coins,
  BarChart3,
  Sparkles,
  UserCheck,
};

export function AgentWorkflow() {
  const {
    agentState,
    startAgentRun,
    resetAgentRun,
    activePresetKey,
    selectTargetItemPreset,
    setIsPaymentModalOpen,
    setIsApprovalModalOpen,
  } = useDemo();

  const [customPrompt, setCustomPrompt] = useState(
    'Analyze the available hospital inventory and clinical consumption heuristics to formulate an optimal procurement action.'
  );

  const isRunning = agentState.status === 'running';
  const isCompleted = agentState.status === 'completed';

  const handleRunAgent = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isRunning) return; // Prevent double execution
    startAgentRun();
  };

  return (
    <div className="bg-white rounded-card p-6 sm:p-8 border border-[#ffc8d3] shadow-card space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ffc8d3]">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-heading font-extrabold text-lg text-[#24324a]">
              MedMatch Procurement Agent
            </h3>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-badge bg-[#fff5f7] border border-[#ffc8d3] text-xs font-bold text-[#24324a]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isRunning ? 'bg-[#e3577c] animate-ping' : 'bg-[#94d4f8]'
                }`}
              />
              <span>
                {isRunning
                  ? 'Analyzing...'
                  : isCompleted
                  ? 'Analysis Complete'
                  : 'Idle (Click to Run)'}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#667085] font-medium mt-0.5">
            Autonomous multi-step evidence gathering, oracle pricing verification, and clinical synthesis.
          </p>
        </div>

        {agentState.status !== 'idle' && (
          <button
            onClick={resetAgentRun}
            disabled={isRunning}
            className="px-3.5 py-2 rounded-btn bg-[#ffc8d3] hover:bg-[#e27094] hover:text-white text-[#e3577c] text-xs font-bold transition-colors disabled:opacity-40"
          >
            Reset Analysis
          </button>
        )}
      </div>

      {/* Explicit User Prompt Input Area */}
      <form onSubmit={handleRunAgent} className="p-4 rounded-lg bg-[#fff5f7] border border-[#ffc8d3] space-y-3">
        <label className="block text-xs font-bold text-[#24324a] uppercase tracking-wider">
          Tell MedMatch AI what you want to analyze...
        </label>
        <textarea
          rows={2}
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          disabled={isRunning}
          placeholder="Analyze the available hospital information for my selected criteria..."
          className="w-full p-3 rounded-lg border border-[#ffc8d3] bg-white text-xs text-[#24324a] placeholder-[#667085] outline-none focus:border-[#e3577c] transition-colors"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Preset Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] font-bold text-[#667085] uppercase">Clinical SKU:</span>
            <select
              value={activePresetKey}
              onChange={(e) => selectTargetItemPreset(e.target.value as any)}
              disabled={isRunning}
              className="px-2 py-1 rounded border border-[#ffc8d3] bg-white text-xs font-semibold text-[#24324a] outline-none"
            >
              {Object.entries(clinicalPresets).map(([key, p]) => (
                <option key={key} value={key}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Explicit Run Agent Button */}
          <button
            type="submit"
            disabled={isRunning}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white font-bold text-xs transition-all shadow-soft active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 text-white" />
                <span>Run Agent</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 9 Execution Pipeline Steps */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-[#24324a] border-b border-[#ffc8d3] pb-1.5 flex items-center justify-between">
          <span>Autonomous Evidence & Execution Pipeline</span>
          <span className="text-[10px] text-[#667085] lowercase font-normal">
            {agentState.steps.filter((s) => s.status === 'completed').length} / {agentState.steps.length} steps completed
          </span>
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {agentState.steps.map((step, index) => {
            const Icon = iconMap[step.iconName] || Bot;
            const isCurrent = agentState.currentStepIndex === index && isRunning;
            const isDone = step.status === 'completed';

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-lg border transition-all flex items-start gap-3.5 ${
                  isDone
                    ? 'bg-white border-[#ffc8d3]'
                    : isCurrent
                    ? 'bg-[#fff5f7] border-[#e3577c] shadow-soft'
                    : 'bg-white/60 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`p-2 rounded-md flex-shrink-0 ${
                    isDone
                      ? 'bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3]'
                      : isCurrent
                      ? 'bg-[#e3577c] text-white animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-[#24324a]">
                      Step {step.id}: {step.title}
                    </span>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#e3577c]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#e3577c]">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Processing...</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#667085] font-semibold">Pending</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#667085] mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Synthesis Result Card (Displays after Agent Runs) */}
      {isCompleted && (
        <div className="p-5 rounded-lg bg-white border-2 border-[#e3577c] shadow-card space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#ffc8d3] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#24324a]">
                AI Recommendation Result
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3]">
              TIMESTAMP: {new Date().toLocaleTimeString()}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block">
                RECOMMENDED ACTION
              </span>
              <p className="text-[#24324a] font-semibold mt-0.5 leading-relaxed">
                {agentState.recommendationResult?.rationale || 'Optimal procurement action synthesized.'}
              </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded bg-[#fff5f7] border border-[#ffc8d3] space-y-1">
                <span className="text-[10px] font-bold text-[#667085] uppercase block">
                  Evidence Used
                </span>
                <p className="text-[11px] text-[#24324a]">
                  Current Stock: {agentState.targetItem.currentStock} units &bull; Burn Rate: 42/day &bull; Depletion: &lt;3 days &bull; Supplier SLA: 2-day delivery.
                </p>
              </div>

              <div className="p-3 rounded bg-[#fff5f7] border border-[#ffc8d3] space-y-1">
                <span className="text-[10px] font-bold text-[#667085] uppercase block">
                  Data Sources
                </span>
                <p className="text-[11px] text-[#24324a]">
                  Hospital Directory Dataset &bull; x402 Tier-1 Supplier Oracle &bull; Algorand Settlement Engine
                </p>
              </div>
            </div>

            <div className="p-3 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Limitations & Governance:</strong> Recommendation synthesized strictly from available hospital stock and verified vendor feeds. Requires explicit Human Approval before purchase order creation.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/recommendation"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold shadow-soft transition-colors"
              >
                <span>Review in Recommendations Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
