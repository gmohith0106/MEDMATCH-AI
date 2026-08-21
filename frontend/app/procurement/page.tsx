'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemo, clinicalPresets } from '@/context/DemoContext';
import {
  Bot,
  Package,
  TrendingDown,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Building2,
  ArrowRight,
  RefreshCw,
  Check,
  X,
} from 'lucide-react';
import { X402PaymentModal } from '@/components/agent/X402PaymentModal';
import { isAlgorandTxId, getAlgorandExplorerUrl, formatAlgorandAddress, formatUsdcAmount } from '@/lib/x402';



export default function ProcurementPage() {
  const {
    activePresetKey,
    selectTargetItemPreset,
    agentState,
    startAgentRun,
    resetAgentRun,
    payments,
    addToast,
    setIsPaymentModalOpen,
  } = useDemo();

  const [decisionState, setDecisionState] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const selectedPreset = clinicalPresets[activePresetKey] || clinicalPresets.gloves;
  const isRunning = agentState.status === 'running';
  const isCompleted = agentState.status === 'completed';

  // Latest verified payment from agent run
  const activePayment = payments.find((p) => p.status === 'PAYMENT_SETTLED' || p.status === 'PAYMENT_VERIFIED' || p.status === 'VERIFIED');

  const handleApproveOrder = () => {
    setDecisionState('approved');
    addToast(
      `Purchase Order for ${selectedPreset.recommendedQty.toLocaleString()} units of ${selectedPreset.name} approved by Dr. Sarah Jenkins.`,
      'success'
    );
  };

  const handleRejectOrder = () => {
    setDecisionState('rejected');
    addToast('Procurement recommendation rejected and returned to clinical review.', 'info');
  };

  const handleReset = () => {
    setDecisionState('pending');
    resetAgentRun();
  };

  const currentStepNumber = agentState.status === 'idle' ? 0 : agentState.status === 'completed' ? 9 : agentState.currentStepIndex + 1;

  // 9 Clean Agent Steps definition
  const agentTimelineSteps = [
    {
      num: 1,
      title: 'Inventory Analyzed',
      desc: `Current stock of ${selectedPreset.currentStock.toLocaleString()} units cataloged across all hospital departments.`,
      done: currentStepNumber >= 1,
      active: currentStepNumber === 1 && isRunning,
    },
    {
      num: 2,
      title: 'Demand Forecast Generated',
      desc: `7-day projected hospital demand calculated at ${(selectedPreset.currentStock + selectedPreset.shortageUnits).toLocaleString()} units based on burn rates.`,
      done: currentStepNumber >= 2,
      active: currentStepNumber === 2 && isRunning,
    },
    {
      num: 3,
      title: 'Shortage Detected',
      desc: `Deficit of ${selectedPreset.shortageUnits.toLocaleString()} units identified before clinical stockout deadline.`,
      done: currentStepNumber >= 3,
      active: currentStepNumber === 3 && isRunning,
    },
    {
      num: 4,
      title: 'Supplier Intelligence Requested',
      desc: 'Query dispatched to premium supplier intelligence catalog (/api/paid/supplier-intelligence).',
      done: currentStepNumber >= 4,
      active: currentStepNumber === 4 && isRunning,
    },
    {
      num: 5,
      title: 'Payment Required (HTTP 402)',
      desc: 'Resource server returned standard HTTP 402 challenge requiring 0.02 USDC micropayment.',
      done: currentStepNumber >= 5,
      active: currentStepNumber === 5 && isRunning,
    },
    {
      num: 6,
      title: 'Payment Processed on Algorand TestNet',
      desc: 'Spend policy verified within hospital micro-spend limit. Settled 0.02 USDC on Algorand TestNet.',
      done: currentStepNumber >= 6,
      active: currentStepNumber === 6 && isRunning,
    },
    {
      num: 7,
      title: 'Supplier Intelligence Received',
      desc: 'Real-time verified supplier quotes, lead times, batch sterility certificates, and reliability metrics unlocked.',
      done: currentStepNumber >= 7,
      active: currentStepNumber === 7 && isRunning,
    },
    {
      num: 8,
      title: 'Suppliers Evaluated',
      desc: 'Multi-factor ranking executed evaluating price, delivery time, reliability, and stock availability.',
      done: currentStepNumber >= 8,
      active: currentStepNumber === 8 && isRunning,
    },
    {
      num: 9,
      title: 'Recommendation Ready',
      desc: `Optimal supplier identified (${selectedPreset.supplierName}). Awaiting final human approval.`,
      done: currentStepNumber >= 9,
      active: currentStepNumber === 9 && isRunning,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Preset Control */}
      <div className="bg-white rounded-xl border border-[#DDE9E2] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
              <Bot className="w-3.5 h-3.5" />
              Autonomous Procurement Workflow
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Algorand TestNet x402</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Autonomous Shortage Resolution</h1>
          <p className="text-xs text-slate-600 max-w-2xl mt-0.5">
            Detects hospital stock deficits, settles x402 supplier intelligence micropayments on Algorand TestNet, and prepares verified supplier recommendations for human approval.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#E8F1EC]/60 px-3 py-1.5 rounded-lg border border-[#DDE9E2] text-xs">
            <span className="text-slate-500 font-medium">Target SKU:</span>
            <select
              value={activePresetKey}
              onChange={(e) => selectTargetItemPreset(e.target.value as any)}
              disabled={isRunning}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              {Object.entries(clinicalPresets).map(([key, p]) => (
                <option key={key} value={key}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {agentState.status === 'idle' ? (
            <button
              onClick={() => {
                setDecisionState('pending');
                startAgentRun();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Bot className="w-4 h-4" />
              <span>RUN PROCUREMENT AGENT</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Agent Running...' : 'Reset & Re-Run'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Procurement Shortage Summary Banner */}
      <div className="bg-white rounded-xl border border-[#DDE9E2] p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-600" />
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
              Procurement Target Summary
            </h3>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 mr-1" />
            CRITICAL DEFICIT
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Medical Item</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedPreset.name}</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Current Stock</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedPreset.currentStock.toLocaleString()} units</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Forecast Demand (7d)</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{(selectedPreset.currentStock + selectedPreset.shortageUnits).toLocaleString()} units</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Required Order Quantity</span>
            <p className="font-bold text-rose-600 text-sm mt-0.5">+{selectedPreset.recommendedQty.toLocaleString()} units</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Depletion Horizon</span>
            <p className="font-bold text-amber-600 text-sm mt-0.5">&lt; 2.9 Days</p>
          </div>
        </div>
      </div>

      {/* 2-Column Main Workspace: Agent Timeline (Left) & Payment + Recommendation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Agent Progress Timeline (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#DDE9E2] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Autonomous Agent Execution Timeline
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {isRunning ? 'Processing...' : isCompleted ? 'Completed (9/9 Steps)' : 'Standby'}
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {agentTimelineSteps.map((step) => (
              <div
                key={step.num}
                className={`p-3 rounded-lg border transition-all flex items-start gap-3.5 ${
                  step.done
                    ? 'bg-slate-50/70 border-slate-200'
                    : step.active
                    ? 'bg-teal-50/50 border-teal-300 ring-1 ring-teal-400'
                    : 'bg-white border-slate-100 opacity-60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                    step.done
                      ? 'bg-teal-600 text-white'
                      : step.active
                      ? 'bg-teal-500 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step.done ? '✓' : step.num}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-bold ${step.done || step.active ? 'text-slate-900' : 'text-slate-500'}`}>
                      {step.title}
                    </p>
                    {step.done && (
                      <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        Done
                      </span>
                    )}
                    {step.active && (
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded animate-pulse">
                        In Progress...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Clean Payment Summary & Final Human Approval Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Payment Card */}
          <div className="bg-white rounded-xl border border-[#DDE9E2] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                x402 Micropayment Record
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                  currentStepNumber >= 6
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : currentStepNumber === 5
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {currentStepNumber >= 6 ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    PAYMENT VERIFIED
                  </>
                ) : currentStepNumber === 5 ? (
                  <>
                    <Clock className="w-3 h-3 text-amber-600" />
                    PAYMENT REQUIRED
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-slate-400" />
                    STANDBY
                  </>
                )}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold text-slate-800 text-[11px]">Supplier Intelligence Stream</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Amount & Asset:</span>
                <span className="font-bold text-slate-900">0.02 USDC</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Settlement Network:</span>
                <span className="font-medium text-slate-800">Algorand TestNet</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Settlement Protocol:</span>
                <span className="font-medium text-slate-800">x402 Non-Custodial</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono text-slate-800 truncate max-w-[150px]">
                  {activePayment?.transactionId && isAlgorandTxId(activePayment.transactionId)
                    ? formatAlgorandAddress(activePayment.transactionId, 6)
                    : currentStepNumber >= 6
                    ? 'Confirmed on TestNet'
                    : '—'}
                </span>
              </div>

              {/* Payment Required Action Prompt */}
              {currentStepNumber === 5 && agentState.status === 'waiting_payment' && (
                <div className="pt-2 p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900">0.02 USDC Payment Required</span>
                    <span className="text-[11px] text-amber-700 font-medium">HTTP 402</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Supplier intelligence requires micropayment authorization on Algorand TestNet.
                  </p>
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Pay 0.02 USDC</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {activePayment && currentStepNumber >= 6 && (
                <div className="pt-2 space-y-2">
                  <Link
                    href={`/payments/success/${activePayment.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>View Full Settlement Screen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {activePayment.transactionId && isAlgorandTxId(activePayment.transactionId) && (
                    <a
                      href={getAlgorandExplorerUrl(activePayment.transactionId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-teal-700 transition-colors"
                    >
                      <span>View on Lora TestNet Explorer</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recommendation & Human Approval Card */}
          <div className="bg-white rounded-xl border border-[#DDE9E2] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                AI SUPPLIER RECOMMENDATION
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Score: {selectedPreset.supplierScore} / 100
              </span>
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-900">{selectedPreset.supplierName}</h4>
              <p className="text-xs text-slate-500 mt-0.5">Top-Ranked Supplier for Clinical Procurement</p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 bg-[#E8F1EC]/40 rounded-lg p-3 border border-[#DDE9E2] text-xs">
              <div>
                <span className="text-slate-500">Recommended Qty:</span>
                <p className="font-bold text-slate-900">{selectedPreset.recommendedQty.toLocaleString()} units</p>
              </div>
              <div>
                <span className="text-slate-500">Unit Price:</span>
                <p className="font-bold text-slate-900">${selectedPreset.unitPrice.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-slate-500">Estimated Total:</span>
                <p className="font-bold text-slate-900">${selectedPreset.totalCost.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-500">Guaranteed Delivery:</span>
                <p className="font-bold text-emerald-600">{selectedPreset.deliveryDays} Days (Safe)</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Clinical Rationale:</strong> {selectedPreset.rationale}
            </p>

            {/* Human Decision Action Section */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Human Procurement Authority:</span>
                <span className="text-xs text-slate-500">Dr. Sarah Jenkins</span>
              </div>

              {decisionState === 'pending' ? (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handleRejectOrder}
                    className="py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors text-center flex items-center justify-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={handleApproveOrder}
                    className="py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Order</span>
                  </button>
                </div>
              ) : decisionState === 'approved' ? (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ORDER APPROVED — Purchase Order Dispatched to {selectedPreset.supplierName}</span>
                </div>
              ) : (
                <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 flex items-center gap-2 text-xs font-bold text-rose-800">
                  <X className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>ORDER REJECTED — Sent to Clinical Committee Review</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Multi-Factor Supplier Comparison Matrix */}
      <div className="bg-white rounded-xl border border-[#DDE9E2] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Multi-Factor Supplier Evaluation Matrix</h3>
            <p className="text-xs text-slate-500">Unlocked via verified x402 supplier intelligence micropayment</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
            Evaluated for: {selectedPreset.name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F2F4F3] border-b border-[#DDE9E2] text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Supplier</th>
                <th className="px-4 py-3.5 text-right">Unit Price</th>
                <th className="px-4 py-3.5 text-center">Availability</th>
                <th className="px-4 py-3.5 text-center">Delivery Time</th>
                <th className="px-4 py-3.5 text-center">Reliability</th>
                <th className="px-4 py-3.5 text-center">Quality / Compliance</th>
                <th className="px-4 py-3.5 text-right">Overall Score</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Row 1: Top Recommended Supplier */}
              <tr className="bg-teal-50/30 hover:bg-teal-50/60 transition-colors">
                <td className="px-5 py-3.5 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span>{selectedPreset.supplierName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white">
                      TOP RECOMMENDED
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                  ${selectedPreset.unitPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3.5 text-center font-medium text-emerald-700">
                  5,000+ units in stock
                </td>
                <td className="px-4 py-3.5 text-center font-semibold text-slate-900">
                  {selectedPreset.deliveryDays} Days
                </td>
                <td className="px-4 py-3.5 text-center font-bold text-emerald-600">
                  {selectedPreset.reliability}%
                </td>
                <td className="px-4 py-3.5 text-center text-xs text-slate-700">
                  FDA / ISO 13485 Certified
                </td>
                <td className="px-4 py-3.5 text-right font-black text-teal-700 text-sm">
                  {selectedPreset.supplierScore} / 100
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-teal-100 text-teal-800">
                    Selected
                  </span>
                </td>
              </tr>

              {/* Row 2: Alternative Supplier 1 */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-900">HealthSource Direct</td>
                <td className="px-4 py-3.5 text-right text-slate-800 font-semibold">
                  ${(selectedPreset.unitPrice * 1.08).toFixed(2)}
                </td>
                <td className="px-4 py-3.5 text-center text-slate-700">2,500 units in stock</td>
                <td className="px-4 py-3.5 text-center text-slate-800">3 Days</td>
                <td className="px-4 py-3.5 text-center font-medium text-slate-800">95.0%</td>
                <td className="px-4 py-3.5 text-center text-xs text-slate-600">CE Medical Mark</td>
                <td className="px-4 py-3.5 text-right font-bold text-slate-700">91.2 / 100</td>
                <td className="px-5 py-3.5 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs text-slate-600 bg-slate-100">
                    Backup
                  </span>
                </td>
              </tr>

              {/* Row 3: Alternative Supplier 2 */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-900">CareMed Logistics</td>
                <td className="px-4 py-3.5 text-right text-slate-800 font-semibold">
                  ${(selectedPreset.unitPrice * 0.95).toFixed(2)}
                </td>
                <td className="px-4 py-3.5 text-center text-amber-700 font-medium">1,200 units (Limited)</td>
                <td className="px-4 py-3.5 text-center text-slate-800">4 Days</td>
                <td className="px-4 py-3.5 text-center font-medium text-slate-800">89.5%</td>
                <td className="px-4 py-3.5 text-center text-xs text-slate-600">ISO 9001 Certified</td>
                <td className="px-4 py-3.5 text-right font-bold text-slate-700">87.4 / 100</td>
                <td className="px-5 py-3.5 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs text-slate-600 bg-slate-100">
                    Backup
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <X402PaymentModal />
    </div>
  );
}

