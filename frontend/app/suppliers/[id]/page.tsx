'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Building2,
  ArrowLeft,
  ShieldCheck,
  Star,
  Clock,
  CheckCircle2,
  DollarSign,
  Truck,
  ExternalLink,
  Bot,
  FileCheck,
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';
import { formatUsd } from '@/lib/utils';

export default function SupplierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { suppliers } = useDemo();
  const id = params?.id as string;

  const supplier = suppliers.find((s) => s.id === id) || suppliers[0] || {
    id: 'sup-1',
    name: 'Surgical Innovators Ltd',
    unitPrice: 14.50,
    deliveryDays: 2,
    reliabilityPercent: 98,
    overallScore: 95.4,
    isRecommended: true,
    scoreBreakdown: { priceScore: 92, deliveryScore: 98, reliabilityScore: 98, totalScore: 95.4 },
    availability: '2-Day Dispatch',
    location: 'Boston Logistics Hub, MA',
    catalogItems: [],
    notes: 'Tier-1 Certified Supplier',
    strengths: ['Fast Shipping', 'ISO 13485'],
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/suppliers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#e3577c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Suppliers Directory</span>
        </Link>
      </div>

      {/* Supplier Profile Header */}
      <div className="bg-white rounded-lg border border-[#ffc8d3] p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ffc8d3]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#fff5f7] border border-[#ffc8d3] text-[#e3577c] flex items-center justify-center font-bold shadow-soft">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#24324a] tracking-tight">
                  {supplier.name}
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3]">
                  VERIFIED TIER-1
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-0.5">{supplier.availability} &bull; {supplier.location || 'North America Hub'}</p>
            </div>
          </div>

          <button
            onClick={() => router.push('/agent')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold shadow-soft transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Generate AI Order</span>
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded bg-[#fff5f7] border border-[#ffc8d3]">
            <span className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
              Reliability Score
            </span>
            <span className="text-2xl font-extrabold text-[#24324a]">
              {supplier.reliabilityPercent || 98}%
            </span>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Top 1% in network</p>
          </div>

          <div className="p-4 rounded bg-[#fff5f7] border border-[#ffc8d3]">
            <span className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
              Lead Time
            </span>
            <span className="text-2xl font-extrabold text-[#24324a]">
              {supplier.deliveryDays || 2} Days
            </span>
            <p className="text-[10px] text-[#667085] mt-0.5">Guaranteed SLA</p>
          </div>

          <div className="p-4 rounded bg-[#fff5f7] border border-[#ffc8d3]">
            <span className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
              Overall AI Score
            </span>
            <span className="text-2xl font-extrabold text-[#24324a] flex items-center gap-1">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{supplier.overallScore || 95.4}</span>
            </span>
            <p className="text-[10px] text-[#667085] mt-0.5">Multi-criteria weighted</p>
          </div>

          <div className="p-4 rounded bg-[#fff5f7] border border-[#ffc8d3]">
            <span className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
              Catalog Price
            </span>
            <span className="text-2xl font-extrabold text-[#24324a]">
              {formatUsd(supplier.unitPrice || 14.5)}
            </span>
            <p className="text-[10px] text-[#667085] mt-0.5">Per unit contracted</p>
          </div>
        </div>

        {/* Regulatory Certifications & Public Registries */}
        <div className="p-4 rounded border border-[#ffc8d3] bg-white space-y-3 text-xs">
          <h3 className="font-bold text-[#24324a] uppercase tracking-wider text-[11px] flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#e3577c]" />
            <span>Verified Regulatory Compliance & Certifications</span>
          </h3>

          <div className="flex flex-wrap gap-2 pt-1">
            {['ISO 13485:2016 Certified', 'FDA Medical Device Establishment Registered', 'HIPAA Business Associate Agreement (BAA) Signed', 'Good Distribution Practice (GDP) Verified'].map((cert) => (
              <span
                key={cert}
                className="px-3 py-1 rounded bg-[#fff5f7] text-[#24324a] border border-[#ffc8d3] font-semibold text-[11px] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{cert}</span>
              </span>
            ))}
          </div>

          <div className="pt-2 border-t border-[#ffc8d3]/60 flex justify-between text-[11px] text-[#667085]">
            <span>Data Source: Verified Oracle & Public Healthcare Dataset Registry</span>
            <span>Status: Active & Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

