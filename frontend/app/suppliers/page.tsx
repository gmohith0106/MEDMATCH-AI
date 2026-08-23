'use client';

import React from 'react';
import Link from 'next/link';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Star,
  Clock,
  DollarSign,
  Package,
  Award,
  Bot,
  ArrowRight,
} from 'lucide-react';

export default function SuppliersPage() {
  const suppliers = [
    {
      id: 'sup-medisupply-01',
      name: 'MediSupply Healthcare Solutions',
      recommended: true,
      unitPrice: '$1.85 / box',
      availability: '5,000+ units in stock',
      deliveryTime: '2 Days (Guaranteed)',
      reliability: '99.2%',
      quality: 'FDA / ISO 13485 Certified',
      overallScore: 94.6,
      fulfillmentHistory: '99.8% On-Time (1,420 orders)',
      catalog: 'Surgical Gloves, N95 Masks, Sterile Drape Packs',
    },
    {
      id: 'sup-healthsource-02',
      name: 'HealthSource Direct',
      recommended: false,
      unitPrice: '$1.98 / box',
      availability: '2,500 units in stock',
      deliveryTime: '3 Days',
      reliability: '95.0%',
      quality: 'CE Medical Mark, ISO 9001',
      overallScore: 91.2,
      fulfillmentHistory: '96.5% On-Time (890 orders)',
      catalog: 'Exam Gloves, Syringes, Infusion Sets',
    },
    {
      id: 'sup-caremed-03',
      name: 'CareMed Logistics',
      recommended: false,
      unitPrice: '$1.75 / box',
      availability: '1,200 units (Limited)',
      deliveryTime: '4 Days',
      reliability: '89.5%',
      quality: 'ISO 9001 Certified',
      overallScore: 87.4,
      fulfillmentHistory: '91.2% On-Time (620 orders)',
      catalog: 'Generic PPE, Scalpels, Bandages',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-pink-700 border border-pink-200">
              <Truck className="w-3.5 h-3.5" />
              Verified Clinical Suppliers
            </span>
            <span className="text-xs text-slate-400">â€¢</span>
            <span className="text-xs text-slate-500 font-medium">3 Contracted Partners</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Supplier Directory & Performance Scoring</h2>
          <p className="text-xs text-slate-600 max-w-2xl mt-0.5">
            Evaluates medical suppliers across unit cost, stock availability, emergency delivery times, reliability ratings, and regulatory quality compliance.
          </p>
        </div>

        <Link
          href="/procurement"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors shadow-sm self-start md:self-auto"
        >
          <Bot className="w-4 h-4" />
          <span>Launch Procurement</span>
        </Link>
      </div>

      {/* 3 Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className={`bg-white rounded-lg border p-5 shadow-sm space-y-4 flex flex-col justify-between ${
              supplier.recommended ? 'border-pink-500 ring-1 ring-pink-500' : 'border-slate-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {supplier.recommended ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-pink-600 text-white">
                    <Star className="w-3 h-3 fill-current" />
                    TOP RECOMMENDED
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
                    Contracted Supplier
                  </span>
                )}
                <span className="text-xs font-black text-pink-700">
                  {supplier.overallScore} / 100
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{supplier.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{supplier.catalog}</p>
              </div>

              <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Unit Price (Gloves):</span>
                  <span className="font-bold text-slate-900">{supplier.unitPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stock Availability:</span>
                  <span className="font-semibold text-slate-600">{supplier.availability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Lead Time:</span>
                  <span className="font-semibold text-slate-900">{supplier.deliveryTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Historical Reliability:</span>
                  <span className="font-bold text-slate-500">{supplier.reliability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Certifications:</span>
                  <span className="font-medium text-slate-700">{supplier.quality}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>{supplier.fulfillmentHistory}</span>
              <ShieldCheck className="w-4 h-4 text-pink-600" />
            </div>
          </div>
        ))}
      </div>

      {/* Focused Comparison Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">Comprehensive Supplier Evaluation Table</h3>
          <p className="text-xs text-slate-500">Multi-criteria scoring model weighing reliability, speed, and unit economics</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Supplier</th>
                <th className="px-4 py-3.5 text-right">Unit Price</th>
                <th className="px-4 py-3.5 text-center">Availability</th>
                <th className="px-4 py-3.5 text-center">Delivery Time</th>
                <th className="px-4 py-3.5 text-center">Reliability</th>
                <th className="px-4 py-3.5 text-center">Quality / Compliance</th>
                <th className="px-4 py-3.5 text-right">Overall Score</th>
                <th className="px-5 py-3.5 text-center">Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((s) => (
                <tr
                  key={s.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    s.recommended ? 'bg-pink-50/30' : ''
                  }`}
                >
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{s.name}</span>
                      {s.recommended && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-600 text-white">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-slate-900">{s.unitPrice}</td>
                  <td className="px-4 py-3.5 text-center font-medium text-slate-800">{s.availability}</td>
                  <td className="px-4 py-3.5 text-center font-semibold text-slate-900">{s.deliveryTime}</td>
                  <td className="px-4 py-3.5 text-center font-bold text-slate-500">{s.reliability}</td>
                  <td className="px-4 py-3.5 text-center text-xs text-slate-700">{s.quality}</td>
                  <td className="px-4 py-3.5 text-right font-black text-pink-700 text-sm">
                    {s.overallScore} / 100
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {s.recommended ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-pink-100 text-pink-800">
                        Top Choice
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
                        Qualified Backup
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
