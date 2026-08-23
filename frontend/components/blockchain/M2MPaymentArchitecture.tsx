'use client';

import React, { useState } from 'react';
import {
  Bot,
  Server,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Radio,
  ExternalLink,
  Play,
  RotateCcw,
  Clock,
  Coins,
  Check,
  Copy,
  Terminal,
  Activity
} from 'lucide-react';
import { getAlgorandExplorerUrl, formatAlgorandAddress, formatAlgorandTxId } from '@/lib/x402';

export interface M2MStep {
  id: number;
  title: string;
  sender: string;
  receiver: string;
  protocol: string;
  description: string;
  codeSnippet?: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  latencyMs?: number;
}

export function M2MPaymentArchitecture() {
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [simTxId, setSimTxId] = useState<string>('QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA');
  const [simRound, setSimRound] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const initialSteps: M2MStep[] = [
    {
      id: 1,
      title: 'Autonomous Resource Request',
      sender: 'Machine 1: Hospital AI Agent',
      receiver: 'Machine 2: Supplier Oracle API',
      protocol: 'HTTP/2 GET',
      description: 'The autonomous AI agent detects an inventory deficit and requests protected supplier SLA & stock intelligence.',
      codeSnippet: 'GET /api/paid/supplier-intelligence?category=ppe HTTP/1.1\nHost: api.medmatch.hospital\nUser-Agent: MedMatch-AutonomousAgent/1.0',
      status: 'idle',
    },
    {
      id: 2,
      title: 'HTTP 402 Payment Challenge Issued',
      sender: 'Machine 2: Supplier Oracle Gateway',
      receiver: 'Machine 1: Hospital AI Agent',
      protocol: 'x402 Protocol Header',
      description: 'The resource server intercepts the unauthenticated query and returns standard RFC HTTP 402 challenge.',
      codeSnippet: 'HTTP/1.1 402 Payment Required\nPAYMENT-REQUIRED: eyJzY2hlbWUiOiJleGFjdCIsImFzc2V0IjoiVVNEQyIsImFtb3VudCI6MC4wMiwicmVjZWl2ZXIiOiJBTEdP...==\nContent-Type: application/json',
      status: 'idle',
    },
    {
      id: 3,
      title: 'Automated Spend Policy Evaluation',
      sender: 'Machine 1: Local Policy Engine',
      receiver: 'Machine 1: Server AVM Signer',
      protocol: 'Local Rule Engine',
      description: 'The internal Spend Policy confirms the $0.001 request is strictly under the $0.05 per-query limit and approves without human popup.',
      codeSnippet: '{\n  "decision": "SPEND_POLICY_APPROVED",\n  "amount": 0.001,\n  "maxLimit": 0.05,\n  "dailySpendSoFar": 0.14,\n  "allowedNetwork": "algorand:testnet"\n}',
      status: 'idle',
    },
    {
      id: 4,
      title: 'Autonomous AVM Cryptographic Signing',
      sender: 'Machine 1: Server-Side Signer',
      receiver: 'Machine 3: GoPlausible Facilitator',
      protocol: 'AVM ExactAvmScheme',
      description: 'The server-side wallet constructs and cryptographically signs the Algorand TestNet payment transaction proof.',
      codeSnippet: 'const signer = toClientAvmSigner(process.env.AVM_MNEMONIC);\nconst client = new x402Client();\nclient.register("algorand:testnet", new ExactAvmScheme(signer));\n// PAYMENT-SIGNATURE attached automatically',
      status: 'idle',
    },
    {
      id: 5,
      title: 'Consensus Broadcast & Block Settlement',
      sender: 'Machine 3: GoPlausible Gateway',
      receiver: 'Machine 4: Algorand TestNet',
      protocol: 'Algorand Layer-1 Consensus',
      description: 'The signed transaction is broadcast to Algorand TestNet nodes and finalized within ~3.3 seconds.',
      codeSnippet: 'POST /v2/transactions HTTP/1.1\nHost: testnet-api.algonode.cloud\nTransaction-ID: QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA\nConfirmed-Round: 1',
      status: 'idle',
    },
    {
      id: 6,
      title: 'Intelligence Unlocked & Receipt Delivered',
      sender: 'Machine 2: Supplier Oracle API',
      receiver: 'Machine 1: Hospital AI Agent',
      protocol: 'HTTP/2 200 OK + Settlement Header',
      description: 'Verified SLA pricing matrix and delivery windows are unlocked and returned to the autonomous agent.',
      codeSnippet: 'HTTP/1.1 200 OK\nPAYMENT-RESPONSE: eyJzdGF0dXMiOiJTRVRUTEVEIiwidHJhbnNhY3Rpb25JZCI6IlFPT0JSVlFNWDRIVzVRWjJFR0xRRFExS1JGM1VQM0pLREdLWVBDWE1JNkFWVjM1S1FBIn0=\n{\n  "status": "success",\n  "suppliers": [{ "name": "MediSupply", "leadTimeHours": 18, "stock": 4200 }]\n}',
      status: 'idle',
    },
  ];

  const [steps, setSteps] = useState<M2MStep[]>(initialSteps);

  const runSimulation = async () => {
    if (isRunningSim) return;
    setIsRunningSim(true);
    setSteps(initialSteps);
    setActiveStepIndex(0);

    const latencies = [120, 180, 45, 210, 850, 160];

    for (let i = 0; i < initialSteps.length; i++) {
      setActiveStepIndex(i);
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: 'running' } : s
        )
      );

      // Simulate execution time for step
      await new Promise((r) => setTimeout(r, latencies[i]));

      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: 'completed', latencyMs: latencies[i] } : s
        )
      );
    }

    setIsRunningSim(false);
  };

  const copyTx = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(simTxId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-pink-950 text-white rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                <Cpu className="w-3.5 h-3.5 text-pink-400" />
                M2M Autonomous Protocol
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-400/20 text-slate-300 border border-slate-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                Zero Browser Keys â€¢ Non-Custodial
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white mt-1">
              Machine-to-Machine (M2M) Payment Architecture
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Autonomous micro-spend settlement between the Hospital Procurement AI Agent and the Supplier Intelligence Oracle via standard <strong>x402 Protocol</strong> on <strong>Algorand TestNet</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={runSimulation}
              disabled={isRunningSim}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
            >
              {isRunningSim ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Executing M2M Handshake...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Simulate Live M2M Flow</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Four-Node Machine Architecture Topology */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Node 1: AI Buyer */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 absolute top-4 right-4 animate-pulse" />
          <div className="p-2.5 rounded-lg bg-pink-50 text-pink-700 w-fit mb-3">
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider">Machine 1: Buyer</span>
          <h3 className="text-sm font-bold text-slate-900 mt-0.5">Hospital AI Agent</h3>
          <p className="text-xs text-slate-500 mt-1">
            Evaluates shortage, queries oracle, and signs micro-payments via server-side AVM wallet.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Signer Key:</span>
            <span className="font-mono text-slate-700 font-semibold">Server-Side (AVM)</span>
          </div>
        </div>

        {/* Node 2: Spend Policy Engine */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 w-fit mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Guardrail Engine</span>
          <h3 className="text-sm font-bold text-slate-900 mt-0.5">Spend Policy Validator</h3>
          <p className="text-xs text-slate-500 mt-1">
            Enforces strict per-transaction ($0.05) and daily ($1.00) spend ceilings to prevent runaway autonomous billing.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Limit Rule:</span>
            <span className="font-semibold text-slate-600">Auto-Approve &lt;$0.05</span>
          </div>
        </div>

        {/* Node 3: x402 Facilitator & Algorand */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="p-2.5 rounded-lg bg-sky-50 text-sky-700 w-fit mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Consensus Layer</span>
          <h3 className="text-sm font-bold text-slate-900 mt-0.5">Algorand TestNet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Settles 0.001 USDC on Layer-1 with ~3.3s block finality and cryptographically verifiable receipt.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Finality:</span>
            <span className="font-semibold text-sky-700">~3.3s Instant</span>
          </div>
        </div>

        {/* Node 4: Resource Server */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="p-2.5 rounded-lg bg-slate-100 text-slate-600 w-fit mb-3">
            <Server className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Machine 2: Seller</span>
          <h3 className="text-sm font-bold text-slate-900 mt-0.5">Supplier Oracle API</h3>
          <p className="text-xs text-slate-500 mt-1">
            Serves verified Tier-1 SLA capacity, pricing discounts, and sterile lot certificates upon payment proof.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Endpoint:</span>
            <span className="font-mono text-slate-700 font-semibold">/api/paid/...</span>
          </div>
        </div>
      </div>

      {/* 3. Real-Time M2M Step Execution Trace */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-pink-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Machine-to-Machine Execution Sequence (6-Stage Handshake)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {isRunningSim ? 'Simulating in progress...' : 'Click "Simulate Live M2M Flow" above to trigger'}
          </span>
        </div>

        <div className="p-5 space-y-4">
          {steps.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running';

            return (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? 'border-pink-500 bg-pink-50/40 shadow-xs'
                    : isCompleted
                    ? 'border-slate-300 bg-slate-100/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-slate-500 text-white'
                          : isRunning
                          ? 'bg-pink-600 text-white animate-pulse'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {step.protocol}
                        </span>
                        {step.latencyMs && (
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/60 px-1.5 py-0.5 rounded">
                            {step.latencyMs}ms
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600">{step.description}</p>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 pt-0.5">
                        <span className="text-pink-700 font-semibold">{step.sender}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className="text-slate-700 font-semibold">{step.receiver}</span>
                      </div>
                    </div>
                  </div>

                  {step.codeSnippet && (
                    <div className="md:max-w-md w-full shrink-0">
                      <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                        {step.codeSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmed Settlement Banner */}
        <div className="p-4 bg-slate-900 text-white border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap font-mono">
            <span className="text-slate-400">On-Chain TxID:</span>
            <span className="text-slate-400 font-bold">{formatAlgorandTxId(simTxId, 8)}</span>
            <button
              onClick={copyTx}
              className="p-1 text-slate-400 hover:text-white transition"
              title="Copy Full Transaction ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-slate-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <span className="text-slate-500">â€¢</span>
            <span className="text-slate-300">Round #{simRound.toLocaleString()}</span>
          </div>

          <a
            href={getAlgorandExplorerUrl(simTxId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-300 font-semibold hover:underline"
          >
            <span>Inspect on Lora Algorand Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
