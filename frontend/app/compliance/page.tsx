'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Download,
  Building,
  FlaskConical,
  Server,
  Bot,
  RotateCw,
  Check,
  Clock,
  Eye,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

export default function CompliancePage() {
  const { addToast } = useDemo();
  const [selectedAuditItem, setSelectedAuditItem] = useState<any | null>(null);

  const handleExportReport = () => {
    addToast('Generating ISO 13485 & HIPAA Audit Readiness Comprehensive PDF Report...', 'info');
  };

  const auditActivities = [
    {
      id: 'aud-1',
      date: '2023-10-24',
      title: 'HIPAA BAA Renewal',
      subtitle: 'Cloud Provider Azure',
      status: 'Verified',
      statusType: 'verified',
    },
    {
      id: 'aud-2',
      date: '2023-10-23',
      title: 'ISO 13485 Clause 7.3',
      subtitle: 'Design & Development Input',
      status: 'Verified',
      statusType: 'verified',
    },
    {
      id: 'aud-3',
      date: '2023-10-22',
      title: 'QMS Document Control Update',
      subtitle: 'SOP-045 Revision C',
      status: 'Pending Review',
      statusType: 'pending',
    },
    {
      id: 'aud-4',
      date: '2023-10-20',
      title: 'Annual Security Training',
      subtitle: 'Engineering Team Completion',
      status: 'Verified',
      statusType: 'verified',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">
            Compliance Hub
          </h1>
          <p className="text-xs text-[#64748B] font-medium mt-1">
            Continuous ISO 13485 & HIPAA monitoring and audit readiness.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold text-[#8B1538] bg-white border border-[#EAE2E4] hover:bg-[#FAF8F8] shadow-soft transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#8B1538]" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Top Grid: Circular Health Chart + 2x2 Hub Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Global Compliance Health (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-[#EAE2E4] p-6 shadow-soft flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-[#1E293B] mb-6">
            Global Compliance Health
          </h3>

          {/* SVG Donut Circle Gauge */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-[#F3ECEE]"
                strokeWidth="9"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Maroon Progress Circle (98%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-[#8B1538]"
                strokeWidth="9"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.98)}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Gauge Inner Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
                98%
              </span>
              <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase mt-0.5">
                VERIFIED STATUS
              </span>
            </div>
          </div>
        </div>

        {/* Right 2x2 Grid of Hub Status Cards (8 Cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Boston Hub */}
          <div className="bg-white rounded-lg border border-[#EAE2E4] p-5 shadow-soft space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#E0F2FE] text-[#0F5B6E] flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">Boston Hub</h4>
                  <p className="text-xs text-[#64748B]">ISO 13485 Core</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-semibold text-[#0F5B6E] border border-[#BAE6FD] bg-[#F0F9FF] rounded flex items-center gap-1">
                <Check className="w-3 h-3" /> Active
              </span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#64748B]">Audit Readiness</span>
                <span className="text-[#1E293B]">100%</span>
              </div>
              <div className="w-full bg-[#EAE2E4] h-2 rounded-full overflow-hidden">
                <div className="bg-[#0F5B6E] h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          {/* 2. Seattle R&D */}
          <div className="bg-white rounded-lg border border-[#EAE2E4] p-5 shadow-soft space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#FCE7EC] text-[#8B1538] flex items-center justify-center">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">Seattle R&D</h4>
                  <p className="text-xs text-[#64748B]">HIPAA Environment</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-semibold text-[#8B1538] bg-[#FCE7EC] rounded flex items-center gap-1">
                Review
              </span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#64748B]">Audit Readiness</span>
                <span className="text-[#1E293B]">92%</span>
              </div>
              <div className="w-full bg-[#EAE2E4] h-2 rounded-full overflow-hidden">
                <div className="bg-[#8B1538] h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>

          {/* 3. EU Data Center */}
          <div className="bg-white rounded-lg border border-[#EAE2E4] p-5 shadow-soft space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#E0F2FE] text-[#0F5B6E] flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">EU Data Center</h4>
                  <p className="text-xs text-[#64748B]">GDPR / ISO 27001</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-semibold text-[#0F5B6E] border border-[#BAE6FD] bg-[#F0F9FF] rounded flex items-center gap-1">
                <Check className="w-3 h-3" /> Active
              </span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#64748B]">Audit Readiness</span>
                <span className="text-[#1E293B]">99%</span>
              </div>
              <div className="w-full bg-[#EAE2E4] h-2 rounded-full overflow-hidden">
                <div className="bg-[#0F5B6E] h-full rounded-full" style={{ width: '99%' }} />
              </div>
            </div>
          </div>

          {/* 4. MedMatch AI Engine */}
          <div className="bg-white rounded-lg border border-[#EAE2E4] p-5 shadow-soft space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#8B1538] text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">MedMatch AI Engine</h4>
                  <p className="text-xs text-[#64748B]">Algorithmic Bias Audit</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-semibold text-[#8B1538] bg-[#FCE7EC] rounded flex items-center gap-1">
                <RotateCw className="w-3 h-3 animate-spin text-[#8B1538]" /> Scanning
              </span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#64748B]">Confidence Score</span>
                <span className="text-[#1E293B]">96%</span>
              </div>
              <div className="w-full bg-[#EAE2E4] h-2 rounded-full overflow-hidden">
                <div className="bg-[#8B1538] h-full rounded-full" style={{ width: '96%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Audit Activity */}
      <div className="bg-white rounded-lg border border-[#EAE2E4] shadow-soft overflow-hidden">
        <div className="p-5 border-b border-[#EAE2E4] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1E293B]">
            Recent Audit Activity
          </h3>
          <button
            onClick={() => addToast('Displaying full multi-year compliance telemetry log', 'info')}
            className="text-xs font-semibold text-[#8B1538] hover:underline"
          >
            View All
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F8] border-b border-[#EAE2E4] text-[#64748B] uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Requirement</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2E4]">
              {auditActivities.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAF8F8] transition-colors">
                  <td className="py-3.5 px-5 text-[#64748B] font-mono whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-[#1E293B]">{row.title}</span>
                    <span className="text-[#64748B]"> - {row.subtitle}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    {row.statusType === 'verified' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold text-[#0F5B6E] bg-[#E0F2FE] border border-[#BAE6FD]">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold text-[#8B1538] bg-[#FCE7EC]">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {row.statusType === 'pending' ? (
                      <button
                        onClick={() => setSelectedAuditItem(row)}
                        className="text-xs font-bold text-[#8B1538] hover:underline"
                      >
                        Review
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedAuditItem(row)}
                        className="text-[#64748B] hover:text-[#1E293B] p-1 rounded hover:bg-white transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedAuditItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-modal border border-[#EAE2E4] max-w-lg w-full p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#EAE2E4] pb-3">
              <h3 className="text-base font-bold text-[#1E293B]">
                {selectedAuditItem.title}
              </h3>
              <span className="text-xs text-[#64748B] font-mono">{selectedAuditItem.date}</span>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed">
              Standard operating procedure documentation has undergone automated algorithmic validation and compliance checks for <strong>{selectedAuditItem.subtitle}</strong>.
            </p>

            <div className="p-3 bg-[#FAF8F8] rounded border border-[#EAE2E4] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Auditor:</span>
                <span className="font-semibold text-[#1E293B]">MedMatch Continuous Audit Bot</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Framework:</span>
                <span className="font-semibold text-[#1E293B]">ISO 13485:2016 Medical Devices QMS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Sign-off Authority:</span>
                <span className="font-semibold text-[#1E293B]">Dr. Robert Reynolds</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE2E4]">
              <button
                onClick={() => setSelectedAuditItem(null)}
                className="px-3.5 py-1.5 text-xs text-[#64748B] hover:text-[#1E293B]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedAuditItem(null);
                  addToast(`Audit item ${selectedAuditItem.title} verified and signed off.`, 'success');
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#8B1538] hover:bg-[#73112E] rounded"
              >
                Sign & Validate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
