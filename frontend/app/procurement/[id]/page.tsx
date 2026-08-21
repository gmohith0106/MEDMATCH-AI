'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ClipboardCheck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Building,
  User,
  Calendar,
  DollarSign,
  Truck,
  Printer,
  FileCheck,
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';
import { formatUsd } from '@/lib/utils';

export default function ProcurementDetailPage() {
  const params = useParams();
  const { procurements, addToast } = useDemo();
  const id = params?.id as string;

  const order = procurements.find((p) => p.id === id) || procurements[0] || {
    id: 'po-101',
    poNumber: 'PO-88231',
    itemName: 'Surgical Steel Scalpels (Box 50)',
    quantity: 150,
    unitPrice: 28.50,
    totalAmount: 4275,
    supplierName: 'Surgical Innovators Ltd',
    department: 'Surgery & Operating Theater',
    requestedBy: 'Dr. Robert Reynolds',
    approvedBy: 'Procurement Board / Dr. Marcus Vance',
    status: 'Completed',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    deliveryEta: 'Delivered',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Back button */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/procurement"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#e3577c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Procurement Orders</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-white border border-[#ffc8d3] text-xs font-semibold text-[#24324a] hover:bg-[#fff5f7] shadow-soft transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-[#e3577c]" />
          <span>Print Purchase Order</span>
        </button>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-lg border border-[#ffc8d3] p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ffc8d3]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#fff5f7] border border-[#ffc8d3] text-[#e3577c] flex items-center justify-center font-bold shadow-soft flex-shrink-0">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#24324a] tracking-tight">
                  Purchase Order #{order.requestId || order.id}
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#E0F2FE] text-[#0F5B6E] border border-[#BAE6FD]">
                  {order.status || 'Completed'}
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-0.5">
                {order.category} &bull; Created {new Date(order.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-2xl font-black text-[#24324a]">
              {formatUsd(order.estimatedCost || 4275)}
            </div>
            <p className="text-xs text-[#667085] font-medium">Total Contracted Value</p>
          </div>
        </div>


        {/* Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded bg-[#fff5f7] border border-[#ffc8d3]">
            <span className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
              Item & SKU
            </span>
            <span className="font-bold text-[#24324a] text-sm block truncate">
              {order.itemName || 'Surgical Steel Scalpels'}
            </span>
            <p className="text-[11px] text-[#667085] mt-0.5">{order.quantity || 150} Units</p>
          </div>

          <div className="p-4 rounded bg-[#fff5f7] border border-[#ffc8d3]">
            <span className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
              Supplier Partner
            </span>
            <span className="font-bold text-[#24324a] text-sm block truncate">
              {order.supplierName || 'Surgical Innovators Ltd'}
            </span>
            <p className="text-[11px] text-[#0F5B6E] font-semibold mt-0.5">Tier-1 Direct</p>
          </div>

          <div className="p-4 rounded bg-[#fff5f7] border border-[#ffc8d3]">
            <span className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
              Request ID
            </span>
            <span className="font-bold text-[#24324a] text-sm block truncate">
              {order.requestId || 'REQ-001'}
            </span>
            <p className="text-[11px] text-[#667085] mt-0.5">Clinical Order</p>
          </div>

          <div className="p-4 rounded bg-[#fff5f7] border border-[#ffc8d3]">
            <span className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
              Approved By
            </span>
            <span className="font-bold text-[#24324a] text-sm block truncate">
              {order.approvedBy || 'Dr. Marcus Vance'}
            </span>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Dual-Signature Verified</p>
          </div>
        </div>


        {/* Order Lifecycle Stepper */}
        <div className="p-5 rounded border border-[#ffc8d3] bg-white space-y-4 text-xs">
          <h3 className="font-bold text-[#24324a] uppercase tracking-wider text-[11px]">
            ORDER LIFECYCLE & AUDIT TRAIL
          </h3>

          <div className="space-y-4 pt-1">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#E0F2FE] text-[#0F5B6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between font-bold text-[#24324a]">
                  <span>1. AI Shortage Signal & Recommendation Generated</span>
                  <span className="text-[#667085] font-mono">Completed</span>
                </div>
                <p className="text-[#667085] text-[11px]">Autonomous agent detected 48-hour burn rate threshold breach.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#E0F2FE] text-[#0F5B6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between font-bold text-[#24324a]">
                  <span>2. Human Authorization & Approval</span>
                  <span className="text-[#667085] font-mono">Approved</span>
                </div>
                <p className="text-[#667085] text-[11px]">Procurement Director validated supplier SLA, unit pricing, and clinical budget.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#E0F2FE] text-[#0F5B6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between font-bold text-[#24324a]">
                  <span>3. Electronic Order Dispatch & Fulfillment</span>
                  <span className="text-[#0F5B6E] font-mono font-semibold">Delivered</span>
                </div>
                <p className="text-[#667085] text-[11px]">Direct EDI shipment confirmed at Central Medical Receiving Dock 4.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
