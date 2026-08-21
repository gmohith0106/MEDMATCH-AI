'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Sparkles,
  Info,
  Clock,
} from 'lucide-react';

export function AgentActivityLog() {
  const { agentState } = useDemo();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#94d4f8]" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#e3577c]" />;
      case 'payment':
        return <CreditCard className="w-3.5 h-3.5 text-[#e27094]" />;
      case 'recommendation':
        return <Sparkles className="w-3.5 h-3.5 text-[#e3577c]" />;
      default:
        return <Info className="w-3.5 h-3.5 text-[#667085]" />;
    }
  };

  return (
    <div className="bg-white rounded-card p-6 border border-[#ffc8d3] shadow-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#ffc8d3] mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-btn bg-[#e3577c] text-white">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-extrabold text-sm text-[#24324a]">
              LIVE AGENT ACTIVITY
            </h4>
            <p className="text-[10px] text-[#667085] font-medium">
              Autonomous telemetry feed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#667085]">
          {agentState.status === 'running' ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#94d4f8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#94d4f8]"></span>
              </span>
              <span className="text-[#24324a]">Live Stream</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-[#94d4f8]"></span>
              <span className="text-[#667085]">Standby</span>
            </>
          )}
        </div>
      </div>

      {/* Events timeline container */}
      <div className="flex-1 overflow-y-auto max-h-[580px] space-y-3 pr-1 custom-scrollbar">
        {agentState.events.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#667085]">
            <Clock className="w-6 h-6 mx-auto mb-2 text-[#ffc8d3] animate-pulse" />
            Click <strong>&quot;RUN AGENT&quot;</strong> to start the autonomous pipeline execution stream.
          </div>
        ) : (
          agentState.events.map((evt) => (
            <div
              key={evt.id}
              className="flex items-start gap-3 text-xs animate-fadeIn"
            >
              {/* Timestamp */}
              <span className="font-mono text-[10px] text-[#667085] font-semibold pt-0.5 w-16 flex-shrink-0">
                {evt.timestamp}
              </span>

              {/* Icon */}
              <div className="mt-0.5 flex-shrink-0">{getEventIcon(evt.type)}</div>

              {/* Event details */}
              <div className="flex-1 min-w-0 bg-[#fff5f7] p-2.5 rounded-btn border border-[#ffc8d3]">
                <p className="font-bold text-[#24324a] text-[11px] leading-tight">
                  {evt.title}
                </p>
                <p className="text-[11px] text-[#667085] mt-0.5 leading-snug">
                  {evt.detail}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer summary */}
      <div className="mt-4 pt-3 border-t border-[#ffc8d3] flex items-center justify-between text-[10px] text-[#667085] font-medium">
        <span>Gateway: <strong className="text-[#24324a]">Algorand TestNet Verified</strong></span>
        <span>Events Logged: <strong className="text-[#24324a]">{agentState.events.length}</strong></span>
      </div>
    </div>
  );
}
