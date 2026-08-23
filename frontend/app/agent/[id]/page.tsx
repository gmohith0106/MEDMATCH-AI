'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Bot,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Building,
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

export default function AgentRunDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { agentState } = useDemo();
  const runId = (params?.id as string) || agentState?.runId || 'run-latest';


  const steps = [
    {
      id: 'step-1',
      title: '1. Autonomous Hospital Stock & SKU Telemetry Scan',
      status: 'COMPLETED',
      detail: 'Scanned 14 active pharmaceutical and surgical inventory bins. Identified critical shortage risk in N95 Respirator Masks (48 units remaining vs 100 unit threshold).',
      duration: '420ms',
    },
    {
      id: 'step-2',
      title: '2. Predictive Patient Influx & Demand Signal Modelling',
      status: 'COMPLETED',
      detail: 'Executed 7-day moving average and exponential smoothing models. Trailing respiratory emergency admissions predict 294 units consumed over 7 days.',
      duration: '310ms',
    },
    {
      id: 'step-3',
      title: '3. HTTP 402 Payment Challenge & Algorand Micropayment Settlement',
      status: 'COMPLETED',
      detail: 'Received HTTP 402 from Tier-1 Supplier Oracle endpoint. Settled 0.001 ALGO micropayment non-custodially on Algorand TestNet (TxID: WXYZ7492842JFKALGORANDTESTNETTXN7489).',
      duration: '1,240ms',
      paymentLinked: true,
    },
    {
      id: 'step-4',
      title: '4. Tier-1 Certified Supplier SLA Matrix Retrieval',
      status: 'COMPLETED',
      detail: 'Decrypted verified oracle response. Evaluated 6 certified suppliers across price ($1.45/unit), reliability (98%), and expedited lead time (2 days). Selected Surgical Innovators Ltd.',
      duration: '560ms',
    },
    {
      id: 'step-5',
      title: '5. Multi-Criteria Recommendation Formulation',
      status: 'COMPLETED',
      detail: 'Formulated recommendation REC-001 (Order 300 units N95 Respirators from Surgical Innovators Ltd for $435). Submitted to human procurement review queue.',
      duration: '210ms',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/agent"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#e3577c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AI Agent Console</span>
        </Link>
      </div>

      {/* Main Agent Run Card */}
      <div className="bg-white rounded-lg border border-[#ffc8d3] p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ffc8d3]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#fff5f7] border border-[#ffc8d3] text-[#e3577c] flex items-center justify-center font-bold shadow-soft flex-shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#24324a] tracking-tight">
                  Agent Execution Run: {runId}
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3] uppercase">
                  SUCCESSFUL
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-0.5">
                Autonomous 5-Stage Clinical Intelligence & Smart Procurement Workflow
              </p>
            </div>
          </div>

          <Link
            href="/recommendation"
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold shadow-soft transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>View Generated Recommendation</span>
          </Link>
        </div>

        {/* Execution Timeline Steps */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#24324a]">
            EXECUTION PIPELINE TELEMETRY
          </h3>

          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className="p-4 rounded-lg bg-[#fff5f7] border border-[#ffc8d3] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-[#24324a]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{step.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#667085]">{step.duration}</span>
                </div>
                <p className="text-[#667085] pl-6 text-[11px] leading-relaxed">
                  {step.detail}
                </p>
                {step.paymentLinked && (
                  <div className="pl-6 pt-1">
                    <Link
                      href="/payments"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#e3577c] hover:underline"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Inspect On-Chain Algorand Settlement Record &rarr;</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
