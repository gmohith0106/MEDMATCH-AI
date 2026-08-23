'use client';

import React from 'react';
import { ProcurementRequest } from '@/types/procurement';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export function ProcurementTimeline({ request }: { request: ProcurementRequest }) {
  const getTimelineIcon = (step: string, status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-[#e27094]" />;
    if (status === 'current') return <Clock className="w-5 h-5 text-[#e3577c] animate-pulse" />;
    if (status === 'demo_state') return <ShieldCheck className="w-5 h-5 text-[#94d4f8]" />;
    return <Clock className="w-5 h-5 text-[#ffc8d3]" />;
  };

  return (
    <div className="bg-white rounded-card p-6 sm:p-8 border border-[#ffc8d3] shadow-card space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#ffc8d3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
            Audit Trail & Lifecycle
          </span>
          <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#24324a]">
            Procurement Request Timeline &bull; {request.requestId}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-badge bg-[#e3577c] text-white uppercase tracking-wider">
            {request.status}
          </span>
        </div>
      </div>

      {/* Vertical Step Timeline */}
      <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#ffc8d3]">
        {request.timeline.map((evt, index) => {
          const isDemoState = evt.status === 'demo_state';
          const isCompleted = evt.status === 'completed';
          const isCurrent = evt.status === 'current';

          return (
            <div key={index} className="relative flex items-start gap-4 text-xs">
              {/* Dot / Icon */}
              <div className="absolute -left-6 top-0.5 bg-white rounded-full p-0.5 z-10">
                {getTimelineIcon(evt.step, evt.status)}
              </div>

              {/* Card */}
              <div
                className={`flex-1 p-4 rounded-btn border transition-all ${
                  isDemoState
                    ? 'bg-[#fff5f7] border-[#e27094] shadow-soft'
                    : isCompleted
                    ? 'bg-white border-[#ffc8d3]'
                    : isCurrent
                    ? 'bg-[#fff5f7] border-[#e3577c]'
                    : 'bg-white border-[#ffc8d3] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-extrabold text-sm text-[#24324a]">
                      {evt.step}
                    </h4>
                    {isDemoState && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-badge bg-[#fff5f7] text-[#24324a] border border-[#ffc8d3] uppercase">
                        QUEUED
                      </span>
                    )}
                  </div>

                  {evt.timestamp && (
                    <span className="text-[10px] font-medium text-[#667085]">
                      {evt.timestamp}
                    </span>
                  )}
                </div>

                {evt.actor && (
                  <p className="text-[11px] font-semibold text-[#667085] mb-1">
                    Actor: <span className="text-[#24324a]">{evt.actor}</span>
                  </p>
                )}

                {evt.notes && (
                  <p className="text-[11px] text-[#24324a] font-normal leading-relaxed">
                    {evt.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Protocol Guard disclaimer */}
      <div className="p-4 rounded-btn bg-[#fff5f7] border border-[#ffc8d3] text-xs text-[#24324a] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#94d4f8] flex-shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold text-[#24324a]">Automated Order Audit Trail</h5>
          <p className="text-[11px] text-[#667085] leading-snug">
            All procurement authorizations are recorded immutably in the hospital ERP logistics ledger with cryptographic timestamps.
          </p>
        </div>
      </div>
    </div>
  );
}
