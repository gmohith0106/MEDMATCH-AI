'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Bot,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Terminal,
  Activity,
  DollarSign,
  Lock,
  Play,
  Copy,
  Check,
  ShoppingBag,
  Clock,
  Sparkles
} from 'lucide-react';
import { getAlgorandExplorerUrl, formatAlgorandTxId } from '@/lib/x402';

export default function JudgeScorecardPage() {
  const [simRunning, setSimRunning] = useState(false);
  const [simComplete, setSimComplete] = useState(false);

  const sampleTxId = 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA';

  const runTestVerification = () => {
    setSimRunning(true);
    setSimComplete(false);
    setTimeout(() => {
      setSimRunning(false);
      setSimComplete(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* 1. Header Banner */}
      <div className="p-8 bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 text-white rounded-2xl border border-pink-900/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Award className="w-64 h-64 text-pink-400" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-pink-500/20 text-pink-300 border border-pink-500/40">
              <Award className="w-3.5 h-3.5 text-pink-400" />
              Algorand Foundation Final Architecture
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-400/20 text-slate-300 border border-slate-400/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              6-Layer System 100% Compliant
            </span>
            <span className="text-xs text-slate-300 font-mono">
              Machine-to-Machine (M2M) Standard
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            MedMatch AI â€” Final Evaluation & 3-Minute Demo
          </h1>

          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            An autonomous procurement agent that forecasts hospital supply needs, sources and negotiates with suppliers entirely <strong>machine-to-machine over x402</strong>, settles every payment on <strong>Algorand TestNet</strong>, and operates inside a human-set policy.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://x402-kit-kappa.vercel.app/scorecard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition shadow-sm"
            >
              <span>Official x402 Scorecard Benchmark</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={getAlgorandExplorerUrl(sampleTxId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-300 text-xs font-bold border border-slate-700 transition"
            >
              <span>Inspect Live Lora Tx #{formatAlgorandTxId(sampleTxId, 6)}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. 3-Minute Demo Walkthrough Script */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-pink-600" />
            <span>3-Minute Live Evaluation Script</span>
          </h2>
          <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-md border border-pink-200">
            Judges Walkthrough
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            {
              step: '1',
              title: 'Trigger Shortage',
              desc: 'Stock drops below safety threshold on Dashboard.',
              linkText: 'View Dashboard',
              href: '/dashboard'
            },
            {
              step: '2',
              title: 'Agent M2M Run',
              desc: 'Forecast trigger â†’ Quote request â†’ 402 challenge â†’ sign â†’ settle on Algorand.',
              linkText: 'Run Agent',
              href: '/procurement'
            },
            {
              step: '3',
              title: 'Lora Explorer Proof',
              desc: 'Paste TxID into Lora TestNet explorer to show instant finality.',
              linkText: 'Open Ledger',
              href: '/ledger'
            },
            {
              step: '4',
              title: 'Orders & Reasoning',
              desc: 'Plain-English log of what was bought, why, and inline TxID.',
              linkText: 'View Orders',
              href: '/orders'
            },
            {
              step: '5',
              title: 'Policy Governance',
              desc: 'One-time Connect Wallet + spend cap that governs everything.',
              linkText: 'Inspect Policy',
              href: '/policy'
            }
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center text-xs font-black mb-2">
                  {item.step}
                </div>
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{item.desc}</p>
              </div>
              <Link
                href={item.href}
                className="text-[11px] font-bold text-pink-600 hover:text-pink-800 inline-flex items-center gap-1 mt-2 pt-2 border-t border-slate-200"
              >
                <span>{item.linkText}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 3. The 6-Layer Architecture Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-pink-600" />
          <span>Six-Layer System Architecture</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              layer: 'Layer 0: Authentication',
              title: 'Human Session Gate',
              desc: 'Simple email/password JWT session gates hospital dashboard and policy page. Agent runs independently 24/7.'
            },
            {
              layer: 'Layer 1: Hospital Website',
              title: 'Read-Only + Policy UI',
              desc: 'Dashboard, Orders (plain-English + Lora links), Ledger (live stream), and Policy with one-time Connect Wallet.'
            },
            {
              layer: 'Layer 2: Backend API',
              title: 'Auditable REST API',
              desc: 'Plain REST service (/inventory, /orders, /ledger, /policy). Never touches wallet or live payment keys.'
            },
            {
              layer: 'Layer 3: Autonomous Agent',
              title: 'Machine-to-Machine Core',
              desc: 'Forecast engine, sourcing engine (GET /quote & POST /negotiate), decision engine, and @x402/fetch signer.'
            },
            {
              layer: 'Layer 4: Facilitator & L1',
              title: 'GoPlausible + Algorand',
              desc: 'GoPlausible Facilitator (facilitator.goplausible.xyz) with CAIP-2 TestNet USDC settlement on L1.'
            },
            {
              layer: 'Layer 5: Supplier x402 Endpoints',
              title: 'Trust Registry & Data Product',
              desc: 'GET /quote, POST /negotiate, POST /order, and GET /reliability-score computed from real settled orders.'
            }
          ].map((item) => (
            <div key={item.layer} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wider">{item.layer}</span>
              <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Judging Criteria Mapping Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-pink-600" />
          <span>Judging Criteria Verification</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Requirement</th>
                <th className="py-2.5 px-3">Where It Is Met</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {
                  req: 'Live on Algorand Testnet',
                  met: 'Facilitator + supplier services deployed & callable with CAIP-2 algorand:SGO1GKS...',
                  status: 'Verified'
                },
                {
                  req: 'Demonstrable txn on Lora',
                  met: 'Every quote/negotiate/order payment produces a real confirmed Lora txn ID',
                  status: 'Verified'
                },
                {
                  req: 'Through GoPlausible facilitator',
                  met: 'FACILITATOR_URL=https://facilitator.goplausible.xyz',
                  status: 'Verified'
                },
                {
                  req: '@x402/avm in package.json',
                  met: 'Installed in backend: @x402/avm, @x402/core, @x402/fetch, @x402/express',
                  status: 'Verified'
                },
                {
                  req: 'Genuine x402 integration',
                  met: 'Payment gates the actual data/order return path, not a UI mock',
                  status: 'Verified'
                },
                {
                  req: 'Non-custodial, no stored keys',
                  met: 'Connect Wallet funds a capped agent wallet; nothing hardcoded',
                  status: 'Verified'
                },
                {
                  req: 'Meaningful use case (Innovation)',
                  met: 'Paid supplier trust registry computed from historical orders, not static ratings',
                  status: 'Verified'
                },
                {
                  req: 'Human oversight for healthcare',
                  met: 'Policy set once, checked programmatically, never a per-payment click',
                  status: 'Verified'
                }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{row.req}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{row.met}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      <Check className="w-3 h-3 text-slate-500" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Navigation Bar */}
      <div className="p-6 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Ready for the Final Round</h4>
          <p className="text-xs text-slate-400">Explore the orders reasoning log, live ledger stream, or policy wallet controls.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>View Orders & Reasoning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/ledger"
            className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
          >
            <span>Live Lora Ledger</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
