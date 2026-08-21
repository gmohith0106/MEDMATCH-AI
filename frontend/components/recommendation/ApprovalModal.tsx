'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import {
  ClipboardCheck,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Truck,
  Loader2,
  X,
} from 'lucide-react';

export function ApprovalModal() {
  const router = useRouter();
  const {
    isApprovalModalOpen,
    setIsApprovalModalOpen,
    confirmApprovalFlow,
    agentState,
  } = useDemo();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isApprovalModalOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await confirmApprovalFlow();
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        setIsApprovalModalOpen(false);
        router.push('/procurement');
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#24324a]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-card w-full max-w-lg shadow-modal border border-[#ffc8d3] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#ffc8d3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-btn bg-[#e3577c] text-white flex items-center justify-center font-bold shadow-soft">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-[#24324a]">
                Approve Procurement Recommendation?
              </h3>
              <p className="text-xs text-[#667085] font-medium">
                Human Procurement Authorization Step
              </p>
            </div>
          </div>
          {!isSubmitting && !isDone && (
            <button
              onClick={() => setIsApprovalModalOpen(false)}
              className="p-1.5 rounded-btn text-[#667085] hover:text-[#24324a] hover:bg-[#fff5f7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-[#24324a]">
          {isDone ? (
            <div className="text-center py-6 space-y-3 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-[#fff5f7] text-[#94d4f8] flex items-center justify-center mx-auto border border-[#94d4f8]">
                <CheckCircle2 className="w-8 h-8 text-[#94d4f8]" />
              </div>
              <h4 className="font-heading font-extrabold text-lg text-[#24324a]">
                Procurement Request Created
              </h4>
              <p className="text-xs text-[#24324a] font-medium">
                Request ID: <strong className="text-[#e3577c]">{agentState.procurementRequestId || 'REQ-001'}</strong>
                <br />
                Status: <strong className="text-[#24324a]">Human Approval Recorded</strong>
              </p>
              <p className="text-[11px] text-[#667085]">
                Redirecting to Procurement Requests pipeline...
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-[#667085] leading-relaxed">
                Please review the autonomous procurement recommendation parameters before issuing the purchase authorization.
              </p>

              {/* Order summary card */}
              <div className="p-4 rounded-btn bg-[#fff5f7] border border-[#ffc8d3] space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#ffc8d3]">
                  <span className="text-[#667085] font-semibold">Medical Item:</span>
                  <span className="font-bold text-[#24324a]">
                    {agentState.recommendationResult?.itemName || agentState.targetItem.name}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#ffc8d3]">
                  <span className="text-[#667085] font-semibold">Order Quantity:</span>
                  <span className="font-bold text-[#24324a]">
                    {agentState.recommendationResult?.quantity || agentState.targetItem.recommendedQty} units
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#ffc8d3]">
                  <span className="text-[#667085] font-semibold">Matched Supplier:</span>
                  <span className="font-bold text-[#24324a] flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#667085]" />
                    {agentState.recommendationResult?.supplierName || 'Verified Supplier'} (Score: {agentState.recommendationResult?.supplierScore || 94.6}/100)
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#ffc8d3]">
                  <span className="text-[#667085] font-semibold">Estimated Cost:</span>
                  <span className="font-heading font-extrabold text-base text-[#24324a]">
                    ₹{(agentState.recommendationResult?.totalCost || 1900).toLocaleString()}{' '}
                    <span className="text-[11px] font-normal text-[#667085]">
                      (₹{agentState.recommendationResult?.unitPrice?.toFixed(2)}/unit &bull; Est. Savings: ₹{agentState.recommendationResult?.estimatedSavings})
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#667085] font-semibold">Delivery Timeframe:</span>
                  <span className="font-bold text-[#24324a] flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#e27094]" />
                    {agentState.recommendationResult?.deliveryDays || 2} Days ({agentState.recommendationResult?.reliability || 98}% SLA Reliability)
                  </span>
                </div>
              </div>

              {/* Safety notice */}
              <div className="p-3 rounded-btn bg-[#fff5f7] border border-[#ffc8d3] text-[11px] text-[#667085] flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#94d4f8] flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-[#24324a]">Enterprise Governance Guard:</strong> Authorizing this recommendation generates an official procurement request <span className="font-mono font-semibold text-[#e3577c]">REQ-001</span> with immutable ERP logging.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#ffc8d3] flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsApprovalModalOpen(false)}
                  className="px-4 py-2.5 rounded-btn bg-[#ffc8d3] hover:bg-[#e27094] hover:text-white text-[#e3577c] text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirm}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold transition-all shadow-soft active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Recording Authorization...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>CONFIRM APPROVAL</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
