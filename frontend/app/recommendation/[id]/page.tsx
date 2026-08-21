'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  Building,
  TrendingUp,
  Package,
  Layers,
  Clock,
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';
import { formatUsd } from '@/lib/utils';

export default function RecommendationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast, createProcurementOrder } = useDemo();
  const id = params?.id as string;

  const rec = {
    id: id || 'rec-001',
    itemName: 'N95 Respirator Masks',
    itemSku: 'MED-N95-3M-01',
    recommendedQuantity: 300,
    currentStock: 48,
    dailyUsage: 42,
    daysRemaining: 1,
    supplierName: 'Surgical Innovators Ltd',
    unitPrice: 1.45,
    estimatedTotal: 435,
    urgency: 'HIGH',
    status: 'PENDING_APPROVAL',
    confidenceScore: 0.98,
    createdAt: new Date().toISOString(),
    rationale: 'Current stock of N95 respirators will exhaust within 24-36 hours due to rising respiratory admissions. Surgical Innovators Ltd offers guaranteed 2-day delivery at competitive pricing ($1.45/unit).',
    inventoryEvidence: 'Current stock: 48 units against safety threshold of 100 units. Burn rate: 42 units/day.',
    demandEvidence: '7-day forecasted consumption: 294 units based on trailing hospital emergency intake.',
    supplierEvidence: 'Surgical Innovators Ltd: 98% reliability score, ISO 13485 certified, 2-day delivery SLA.',
  };

  const handleApprove = async () => {
    await createProcurementOrder({
      itemName: rec.itemName,
      category: 'Protective Equipment',
      quantity: rec.recommendedQuantity,
      unit: 'Boxes (50 ct)',
      unitPrice: rec.unitPrice,
      estimatedCost: rec.estimatedTotal,
      supplierName: rec.supplierName,
      deliveryDays: 2,
      status: 'Approved',
      notes: rec.rationale,
    });
    addToast(`Approved procurement order for ${rec.itemName}. Order created successfully!`, 'success');
    router.push('/procurement');
  };

  const handleReject = () => {
    addToast(`Recommendation for ${rec.itemName} rejected.`, 'info');
    router.push('/recommendation');
  };


  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/recommendation"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#e3577c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Recommendations Workspace</span>
        </Link>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white rounded-lg border border-[#ffc8d3] p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#ffc8d3]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#fff5f7] border border-[#ffc8d3] text-[#e3577c] flex items-center justify-center font-bold shadow-soft flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#24324a] tracking-tight">
                  AI Recommendation: {rec.itemName}
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3]">
                  98% AI CONFIDENCE
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-0.5">
                Generated {new Date(rec.createdAt || Date.now()).toLocaleDateString()} &bull; Requires Human Procurement Approval
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReject}
              className="px-4 py-2 rounded border border-[#ffc8d3] bg-white hover:bg-[#fff5f7] text-xs font-bold text-[#24324a] shadow-soft transition-colors"
            >
              Reject
            </button>
            <button
              onClick={handleApprove}
              className="px-5 py-2 rounded bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold shadow-soft transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Order</span>
            </button>
          </div>
        </div>

        {/* Executive Rationale Summary */}
        <div className="p-4 rounded-lg bg-[#fff5f7] border border-[#ffc8d3] space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#e3577c]">
            Clinical & Logistics Rationale
          </h3>
          <p className="text-xs text-[#24324a] leading-relaxed font-medium">
            {rec.rationale || 'Stock exhaustion imminent. Reordering 300 units from verified supplier restores safety inventory above standard clinical operating margins.'}
          </p>
        </div>

        {/* 3 Pillars of Evidence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* 1. Inventory Evidence */}
          <div className="p-4 rounded-lg border border-[#ffc8d3] bg-white space-y-2 shadow-soft">
            <div className="flex items-center gap-2 text-[#e3577c] font-bold">
              <Package className="w-4 h-4" />
              <span>1. Inventory Telemetry</span>
            </div>
            <p className="text-[#667085] text-[11px] leading-relaxed">
              {rec.inventoryEvidence || `Current stock: ${rec.currentStock || 48} units. Daily burn rate: ${rec.dailyUsage || 42} units/day. Days remaining: ${rec.daysRemaining || 1} day.`}
            </p>
          </div>

          {/* 2. Demand Evidence */}
          <div className="p-4 rounded-lg border border-[#ffc8d3] bg-white space-y-2 shadow-soft">
            <div className="flex items-center gap-2 text-[#0F5B6E] font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>2. Demand Signal Forecast</span>
            </div>
            <p className="text-[#667085] text-[11px] leading-relaxed">
              {rec.demandEvidence || '7-day predicted demand: 294 units calculated using 3-year historical hospital trailing ingress heuristics.'}
            </p>
          </div>

          {/* 3. Supplier Evidence */}
          <div className="p-4 rounded-lg border border-[#ffc8d3] bg-white space-y-2 shadow-soft">
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <Building className="w-4 h-4" />
              <span>3. Supplier Intelligence</span>
            </div>
            <p className="text-[#667085] text-[11px] leading-relaxed">
              {rec.supplierEvidence || `${rec.supplierName || 'Surgical Innovators Ltd'}: Verified Tier-1 status, 98% reliability rating, 2-day lead time.`}
            </p>
          </div>
        </div>

        {/* Order Economics Breakdown */}
        <div className="p-4 rounded border border-[#ffc8d3] bg-white text-xs space-y-2">
          <div className="font-bold text-[#24324a] uppercase tracking-wider text-[11px]">
            PROPOSED PURCHASE ORDER SPECIFICATION
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <span className="text-[#667085] block text-[11px]">Recommended Quantity</span>
              <span className="font-bold text-sm text-[#24324a]">{rec.recommendedQuantity || 300} units</span>
            </div>
            <div>
              <span className="text-[#667085] block text-[11px]">Contracted Unit Price</span>
              <span className="font-bold text-sm text-[#24324a]">{formatUsd(rec.unitPrice || 1.45)}</span>
            </div>
            <div>
              <span className="text-[#667085] block text-[11px]">Estimated Total Cost</span>
              <span className="font-bold text-sm text-[#e3577c]">{formatUsd(rec.estimatedTotal || 435)}</span>
            </div>
            <div>
              <span className="text-[#667085] block text-[11px]">Target Supplier</span>
              <span className="font-bold text-sm text-[#24324a]">{rec.supplierName || 'Surgical Innovators Ltd'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
