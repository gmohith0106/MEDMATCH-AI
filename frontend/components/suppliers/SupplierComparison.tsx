'use client';

import React from 'react';
import { Supplier } from '@/types/supplier';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatInr } from '@/lib/utils';

export function SupplierComparison({ suppliers }: { suppliers: Supplier[] }) {
  const mediSupply = suppliers.find((s) => s.id === 'sup-medisupply') || suppliers[0];
  const healthSource = suppliers.find((s) => s.id === 'sup-healthsource') || suppliers[1];
  const careMed = suppliers.find((s) => s.id === 'sup-caremed') || suppliers[2];

  return (
    <div className="bg-white rounded-card border border-[#ffc8d3] shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#ffc8d3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#24324a]">
              Multi-Supplier Comparison Matrix
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-badge bg-[#fff5f7] text-[#24324a] border border-[#ffc8d3]">
              AI Weighted
            </span>
          </div>
          <p className="text-xs text-[#667085] font-medium mt-0.5">
            Transparent comparison of verified vendor endpoints against a 2.9-day shortage horizon.
          </p>
        </div>

        <span className="text-[11px] font-semibold text-[#667085]">
          Target SKU: <strong className="text-[#24324a]">N95 Respirator Masks</strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#ffc8d3]">
              <th className="py-4 px-6 bg-[#ffc8d3] text-[#24324a] font-bold uppercase text-[10px] tracking-wider w-1/4">
                Evaluation Metric
              </th>

              {/* MediSupply Column (Recommended) */}
              <th className="py-4 px-6 bg-white border-x-2 border-[#e3577c] text-[#24324a] w-1/4">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-sm text-[#24324a]">
                    MediSupply
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-badge bg-[#e3577c] text-white uppercase">
                    RECOMMENDED
                  </span>
                </div>
              </th>

              {/* HealthSource */}
              <th className="py-4 px-6 bg-white text-[#24324a] w-1/4">
                <span className="font-heading font-extrabold text-sm text-[#24324a]">
                  HealthSource
                </span>
              </th>

              {/* CareMed */}
              <th className="py-4 px-6 bg-white text-[#24324a] w-1/4">
                <span className="font-heading font-extrabold text-sm text-[#24324a]">
                  CareMed Logistics
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ffc8d3] text-[#24324a]">
            {/* Price */}
            <tr>
              <td className="py-4 px-6 font-bold bg-[#fff5f7]">Unit Price</td>
              <td className="py-4 px-6 bg-white border-x-2 border-[#e3577c] font-extrabold text-[#24324a]">
                {formatInr(mediSupply?.unitPrice || 9.50)}
              </td>
              <td className="py-4 px-6 font-semibold">{formatInr(healthSource?.unitPrice || 10.20)}</td>
              <td className="py-4 px-6 font-semibold text-[#24324a]">
                {formatInr(careMed?.unitPrice || 8.90)}{' '}
                <span className="text-[10px] font-normal text-[#667085]">(Cheapest)</span>
              </td>
            </tr>

            {/* Delivery */}
            <tr>
              <td className="py-4 px-6 font-bold bg-[#fff5f7]">Delivery Lead Time</td>
              <td className="py-4 px-6 bg-white border-x-2 border-[#e3577c] font-extrabold text-[#24324a]">
                2 Days (Fastest)
              </td>
              <td className="py-4 px-6 font-semibold">3 Days</td>
              <td className="py-4 px-6 font-semibold text-[#e3577c]">
                6 Days (Exceeds Horizon)
              </td>
            </tr>

            {/* Reliability */}
            <tr>
              <td className="py-4 px-6 font-bold bg-[#fff5f7]">Reliability SLA</td>
              <td className="py-4 px-6 bg-white border-x-2 border-[#e3577c] font-extrabold text-[#24324a]">
                98.0% (Verified)
              </td>
              <td className="py-4 px-6 font-semibold">95.0%</td>
              <td className="py-4 px-6 font-semibold text-[#667085]">82.0%</td>
            </tr>

            {/* Availability */}
            <tr>
              <td className="py-4 px-6 font-bold bg-[#fff5f7]">Stock Availability</td>
              <td className="py-4 px-6 bg-white border-x-2 border-[#e3577c] font-bold text-[#24324a]">
                Immediate (5,000 in stock)
              </td>
              <td className="py-4 px-6 font-medium">2-Day Dispatch (3,500 in stock)</td>
              <td className="py-4 px-6 font-medium">Standard (15,000 in stock)</td>
            </tr>

            {/* Horizon Safety */}
            <tr>
              <td className="py-4 px-6 font-bold bg-[#fff5f7]">Stockout Risk Protection</td>
              <td className="py-4 px-6 bg-white border-x-2 border-[#e3577c] font-bold text-[#24324a] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#94d4f8]" />
                Arrives before 2.9d depletion
              </td>
              <td className="py-4 px-6 font-medium text-[#667085]">
                Borderline (Arrives day 3)
              </td>
              <td className="py-4 px-6 font-medium text-[#e3577c] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#e3577c]" />
                High Stockout Risk (3.1 days late)
              </td>
            </tr>

            {/* Overall Score */}
            <tr className="bg-[#fff5f7]">
              <td className="py-5 px-6 font-extrabold text-sm text-[#24324a]">Overall AI Score</td>
              <td className="py-5 px-6 bg-white border-x-2 border-[#e3577c] font-heading font-extrabold text-xl text-[#e3577c]">
                94.6 <span className="text-xs font-semibold text-[#667085]">/ 100</span>
              </td>
              <td className="py-5 px-6 font-heading font-bold text-base text-[#24324a]">
                89.8 <span className="text-xs font-normal text-[#667085]">/ 100</span>
              </td>
              <td className="py-5 px-6 font-heading font-bold text-base text-[#667085]">
                78.4 <span className="text-xs font-normal text-[#667085]">/ 100</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
