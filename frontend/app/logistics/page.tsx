'use client';

import React, { useState } from 'react';
import {
  Plane,
  ShieldCheck,
  AlertTriangle,
  Search,
  Download,
  Plus,
  Check,
  Radio,
  Clock,
  Compass,
  ArrowRight,
  FileText,
  Thermometer,
  Droplets,
  Layers,
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

export default function LogisticsPage() {
  const { addToast } = useDemo();
  const [searchQuery, setSearchQuery] = useState('');
  const [routeFilter, setRouteFilter] = useState<'cold' | 'standard'>('cold');
  const [showManifestModal, setShowManifestModal] = useState(false);
  const [showNewShipmentModal, setShowNewShipmentModal] = useState(false);

  const handleExportReport = () => {
    addToast('Generating Global Supply Chain & In-Transit Telemetry Report...', 'info');
  };

  const handleIntervene = () => {
    addToast('Intervention request transmitted to Global Logistics Desk & Carrier Operations.', 'info');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header & Search Bar (Image 4) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">
            Global Logistics
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <p className="text-xs text-[#64748B] font-medium">
              Live Tracking Network Active
            </p>
          </div>
        </div>

        {/* Search & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search shipments, POs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-[#EAE2E4] text-xs text-[#1E293B] bg-white focus:border-[#8B1538] focus:outline-none"
            />
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-semibold text-[#1E293B] bg-white border border-[#EAE2E4] hover:bg-[#FAF8F8] shadow-soft transition-colors"
          >
            <span>Export Report</span>
          </button>

          <button
            onClick={() => setShowNewShipmentModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-white bg-[#8B1538] hover:bg-[#73112E] shadow-soft transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Shipment</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: IN TRANSIT */}
        <div className="bg-white rounded-lg border border-[#EAE2E4] p-5 shadow-soft flex items-start justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              IN TRANSIT
            </div>
            <div className="text-3xl font-extrabold text-[#1E293B] mt-1.5">
              1,482
            </div>
            <div className="text-[11px] font-medium text-[#8B1538] mt-1 flex items-center gap-1">
              <span>↑ 12% vs last week</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded bg-[#E0F2FE] text-[#0F5B6E] flex items-center justify-center">
            <Plane className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: CUSTOMS CLEARANCES */}
        <div className="bg-white rounded-lg border border-[#EAE2E4] p-5 shadow-soft flex items-start justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              CUSTOMS CLEARANCES
            </div>
            <div className="text-3xl font-extrabold text-[#1E293B] mt-1.5">
              345
            </div>
            <div className="text-[11px] font-medium text-[#64748B] mt-1 flex items-center gap-1">
              <span>✓ 98% clearing on time</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded bg-[#E0F2FE] text-[#0F5B6E] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: AI DELAY RISK ASSESSMENT (Burgundy Accent Card) */}
        <div className="bg-white rounded-lg border border-[#EAE2E4] p-5 shadow-soft flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#8B1538] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-[#8B1538]" />
            <span>AI DELAY RISK ASSESSMENT</span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-[#8B1538]">24</span>
            <span className="text-xs text-[#64748B]">Shipments at risk (&gt;24h)</span>
          </div>

          <p className="text-[11px] text-[#64748B] leading-relaxed mt-1">
            Weather anomalies detected over North Atlantic corridor. Rerouting recommendations available for 14 active flights carrying cold-chain oncology supplies.
          </p>

          <button
            onClick={() => addToast('Rerouting options calculated for 14 North Atlantic flights.', 'info')}
            className="text-[11px] font-bold text-[#8B1538] hover:underline flex items-center gap-1 mt-2 self-start"
          >
            <span>View Recommended Routes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Split View (Image 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Global Active Routes Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-[#EAE2E4] shadow-soft overflow-hidden flex flex-col">
          {/* Map Header & Filter Toggles */}
          <div className="p-4 border-b border-[#EAE2E4] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1E293B]">
              Global Active Routes
            </h3>
            <div className="flex items-center gap-1 bg-[#FAF8F8] p-1 rounded border border-[#EAE2E4]">
              <button
                onClick={() => setRouteFilter('cold')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                  routeFilter === 'cold'
                    ? 'bg-[#E0F2FE] text-[#0F5B6E] border border-[#BAE6FD]'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                Cold Chain Active
              </button>
              <button
                onClick={() => setRouteFilter('standard')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                  routeFilter === 'standard'
                    ? 'bg-[#E0F2FE] text-[#0F5B6E] border border-[#BAE6FD]'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                Standard
              </button>
            </div>
          </div>

          {/* Interactive World Map SVG Visualization */}
          <div className="relative w-full h-[380px] bg-[#E2E6F5]/80 overflow-hidden flex items-center justify-center">
            {/* World Map Background Vector */}
            <svg className="w-full h-full" viewBox="0 0 600 340">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#D5DCF0" strokeWidth="0.6" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Continents Outlines / Landmarks (Soft Blue-Gray) */}
              {/* North America */}
              <path
                d="M 60 70 Q 110 50 160 80 Q 180 120 150 160 Q 110 180 80 140 Z"
                fill="#CBD5E1"
                opacity="0.6"
              />
              {/* South America */}
              <path
                d="M 140 180 Q 170 200 160 260 Q 130 280 120 220 Z"
                fill="#CBD5E1"
                opacity="0.6"
              />
              {/* Europe */}
              <path
                d="M 260 70 Q 320 60 340 110 Q 300 130 270 100 Z"
                fill="#CBD5E1"
                opacity="0.6"
              />
              {/* Africa */}
              <path
                d="M 280 130 Q 340 140 330 230 Q 290 250 270 180 Z"
                fill="#CBD5E1"
                opacity="0.6"
              />
              {/* Asia */}
              <path
                d="M 350 70 Q 480 60 500 140 Q 440 190 360 140 Z"
                fill="#CBD5E1"
                opacity="0.6"
              />

              {/* Waypoint Dots */}
              <circle cx="150" cy="115" r="4" fill="#0F5B6E" /> {/* JFK */}
              <circle cx="295" cy="95" r="4" fill="#0F5B6E" />  {/* FRA */}
              <circle cx="450" cy="140" r="3.5" fill="#0F5B6E" opacity="0.6" /> {/* SIN */}
              <circle cx="330" cy="210" r="3.5" fill="#0F5B6E" opacity="0.6" /> {/* CPT */}

              {/* Transatlantic Active Cold Chain Route Arc (FRA -> JFK) */}
              <path
                d="M 295 95 Q 220 50 150 115"
                fill="none"
                stroke="#8B1538"
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />

              {/* Active Flight Node Pin on Mid-Atlantic Route */}
              <g transform="translate(230, 72)">
                <circle cx="0" cy="0" r="8" fill="#8B1538" opacity="0.25" className="animate-ping" />
                <circle cx="0" cy="0" r="5" fill="#8B1538" />
                {/* Active Tag Label: MEG-882 */}
                <rect x="-24" y="8" width="48" height="18" rx="3" fill="#FFFFFF" stroke="#8B1538" strokeWidth="1" />
                <text x="0" y="21" textAnchor="middle" className="text-[9px] font-extrabold fill-[#8B1538] font-mono">
                  MEG-882
                </text>
              </g>

              {/* Secondary Flight Route Arc */}
              <path
                d="M 295 95 Q 370 100 450 140"
                fill="none"
                stroke="#0F5B6E"
                strokeWidth="1.8"
                strokeDasharray="3 3"
                opacity="0.7"
              />
            </svg>
          </div>
        </div>

        {/* Right Card: CRITICAL SHIPMENT FOCUS (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-[#EAE2E4] p-6 shadow-soft space-y-6 flex flex-col justify-between">
          <div>
            {/* Header with On Time Badge */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  CRITICAL SHIPMENT FOCUS
                </div>
                <h3 className="text-xl font-black text-[#1E293B] mt-1 tracking-tight font-mono">
                  #MEG-882
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Vaccine Adjuvants (Cold Chain 2-8°C)
                </p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-semibold text-[#0F5B6E] bg-[#E0F2FE] border border-[#BAE6FD] rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F5B6E]" />
                On Time
              </span>
            </div>

            {/* Route Bar & ETA */}
            <div className="pt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#1E293B]">Origin: FRA</span>
                <span className="text-[11px] font-bold text-[#8B1538]">ETA: 12h 15m</span>
                <span className="text-[#1E293B]">Dest: JFK</span>
              </div>
              {/* Progress Gradient Track */}
              <div className="w-full bg-[#EAE2E4] h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#0F5B6E] via-[#9E1C44] to-[#8B1538] h-full rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            {/* Live Stepper Timeline */}
            <div className="pt-6 space-y-5">
              {/* Step 1: Customs Cleared */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E0F2FE] text-[#0F5B6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#1E293B]">
                      Customs Cleared
                    </h4>
                    <span className="text-[10px] text-[#64748B] font-mono">08:00z</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Frankfurt Airport (FRA)
                  </p>
                </div>
              </div>

              {/* Step 2: In Flight - Optimal Conditions (Live) */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#8B1538] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Plane className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-[#FAF8F8] p-3 rounded-lg border border-[#EAE2E4] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-[#8B1538]">
                        In Flight - Optimal Conditions
                      </h4>
                      <span className="px-1.5 py-0.5 text-[9px] font-extrabold text-[#8B1538] bg-[#FCE7EC] rounded">
                        Live
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    Temperature maintaining steady at 4.2°C. Tailwinds increasing arrival probability.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-[#1E293B] bg-white border border-[#EAE2E4] rounded flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-[#0F5B6E]" /> Temp: 4.2°C
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-[#1E293B] bg-white border border-[#EAE2E4] rounded flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-[#0F5B6E]" /> Hum: 45%
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3: Arrival & Ground Transfer */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-[#CBD5E1] flex items-center justify-center flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#64748B]">
                      Arrival & Ground Transfer
                    </h4>
                    <span className="text-[10px] text-[#64748B] font-mono">Est 21:15z</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    JFK Logistics Center Terminal 4
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Intervene & View Manifest */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#F3ECEE]">
            <button
              onClick={handleIntervene}
              className="flex-1 py-2 rounded text-xs font-semibold text-[#1E293B] bg-white border border-[#EAE2E4] hover:bg-[#FAF8F8] shadow-soft transition-colors"
            >
              Intervene
            </button>
            <button
              onClick={() => setShowManifestModal(true)}
              className="flex-1 py-2 rounded text-xs font-semibold text-white bg-[#8B1538] hover:bg-[#73112E] shadow-soft transition-colors"
            >
              View Manifest
            </button>
          </div>
        </div>
      </div>

      {/* Manifest Modal */}
      {showManifestModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-modal border border-[#EAE2E4] max-w-lg w-full p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#EAE2E4] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Air Waybill & Cargo Manifest: #MEG-882
                </h3>
                <p className="text-xs text-[#64748B]">Carrier: Lufthansa Cargo / Flight LH8220</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold text-[#0F5B6E] bg-[#E0F2FE] rounded">
                COLD CHAIN
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#FAF8F8] rounded border border-[#EAE2E4] space-y-1">
                <div className="flex justify-between"><span className="text-[#64748B]">Commodity:</span><span className="font-semibold">Vaccine Adjuvant Sterile Liquid (QS-21)</span></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Quantity:</span><span className="font-semibold">2,500 Vials (10 Crates)</span></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Thermal Tolerance:</span><span className="font-semibold text-[#8B1538]">+2.0°C to +8.0°C</span></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Consignee:</span><span className="font-semibold">CityCare Metropolitan Hospital</span></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE2E4]">
              <button
                onClick={() => setShowManifestModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#8B1538] hover:bg-[#73112E] rounded"
              >
                Close Manifest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Shipment Modal */}
      {showNewShipmentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-modal border border-[#EAE2E4] max-w-md w-full p-6 space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-[#1E293B]">
              Dispatch New Critical Medical Cargo
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Tracking / PO Ref</label>
                <input type="text" placeholder="PO-88235" className="w-full px-3 py-2 rounded border border-[#EAE2E4]" />
              </div>
              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Origin Facility</label>
                <input type="text" placeholder="Frankfurt Logistics Hub (FRA)" className="w-full px-3 py-2 rounded border border-[#EAE2E4]" />
              </div>
              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Handling Protocol</label>
                <select className="w-full px-3 py-2 rounded border border-[#EAE2E4]">
                  <option>Cold Chain (2°C - 8°C)</option>
                  <option>Cryogenic (-80°C Dry Ice)</option>
                  <option>Ambient Controlled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE2E4]">
              <button onClick={() => setShowNewShipmentModal(false)} className="px-3 py-1.5 text-xs text-[#64748B]">Cancel</button>
              <button
                onClick={() => {
                  setShowNewShipmentModal(false);
                  addToast('New shipment dispatched into active global tracking network.', 'success');
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#8B1538] hover:bg-[#73112E] rounded"
              >
                Dispatch Shipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
