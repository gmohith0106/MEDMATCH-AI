'use client';

import React, { useState } from 'react';
import {
  Cpu,
  RotateCcw,
  Save,
  Database,
  Building2,
  Truck,
  Plus,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
  Layers,
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

export default function SettingsPage() {
  const { hospitalSettings, updateHospitalSettings, addToast } = useDemo();

  // Model Configuration State
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [forecastHorizon, setForecastHorizon] = useState(90);
  const [volatilityWeighting, setVolatilityWeighting] = useState('Medium');
  const [activeTab, setActiveTab] = useState<'model' | 'profile'>('model');
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');

  // Hospital Profile Form State
  const [formState, setFormState] = useState({
    name: hospitalSettings.name,
    department: hospitalSettings.department,
    procurementManager: hospitalSettings.procurementManager,
    safetyThresholdDays: hospitalSettings.safetyThresholdDays,
    autoApprovalThresholdInr: hospitalSettings.autoApprovalThresholdInr,
  });

  const handleResetDefaults = () => {
    setConfidenceThreshold(85);
    setForecastHorizon(90);
    setVolatilityWeighting('Medium');
    addToast('Model configuration reset to baseline defaults', 'info');
  };

  const handleDeployChanges = () => {
    addToast('Clinical intelligence model configuration deployed successfully!', 'success');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalSettings(formState);
    addToast('Hospital profile updated successfully!', 'success');
  };

  const volatilityLevels = ['Low', 'Medium', 'High'];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded flex items-center justify-center text-[#8B1538]">
              <Cpu className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">
              Model Configuration
            </h1>
          </div>
          <p className="text-xs text-[#64748B] font-medium mt-1">
            Advanced tuning parameters for the clinical intelligence engine. Adjust sensitivities and monitor connected data streams.
          </p>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-2 px-3.5 py-2 rounded text-xs font-semibold uppercase tracking-wider text-[#1E293B] bg-white border border-[#EAE2E4] hover:bg-[#FAF8F8] shadow-soft transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
            <span>RESET DEFAULTS</span>
          </button>

          <button
            onClick={handleDeployChanges}
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#8B1538] hover:bg-[#73112E] shadow-soft transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-white" />
            <span>DEPLOY CHANGES</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[#EAE2E4]">
        <button
          onClick={() => setActiveTab('model')}
          className={`pb-2.5 text-xs font-semibold transition-colors relative ${
            activeTab === 'model'
              ? 'text-[#8B1538]'
              : 'text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          Model Parameters & Data Streams
          {activeTab === 'model' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B1538]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-2.5 text-xs font-semibold transition-colors relative ${
            activeTab === 'profile'
              ? 'text-[#8B1538]'
              : 'text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          Hospital Profile & Governance
          {activeTab === 'profile' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B1538]" />
          )}
        </button>
      </div>

      {activeTab === 'model' ? (
        /* Main 2-Column Grid (Image 1) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Sliders & Metrics (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Shortage Detection Sensitivity */}
            <div className="bg-white rounded-lg border border-[#EAE2E4] p-6 shadow-soft space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1E293B]">
                    Shortage Detection Sensitivity
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Adjusts the threshold for triggering early-warning alerts on critical supplies.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 text-[11px] font-semibold text-[#8B1538] bg-[#FCE7EC] rounded-full">
                  Active
                </span>
              </div>

              {/* Slider Component */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#64748B] uppercase tracking-wider text-[11px]">
                    CONFIDENCE THRESHOLD
                  </span>
                  <span className="font-bold text-sm text-[#8B1538]">
                    {confidenceThreshold}%
                  </span>
                </div>

                <div className="pt-1">
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-[#64748B] mt-2">
                    <span>Loose (More Alerts)</span>
                    <span>Strict (Fewer Alerts)</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics Subcard */}
              <div className="pt-4 border-t border-[#F3ECEE]">
                <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-3">
                  MODEL PERFORMANCE METRICS
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#EDF2FA] rounded-md p-3.5 border border-[#DCE4F2]">
                    <div className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">
                      PRECISION
                    </div>
                    <div className="text-lg font-extrabold text-[#1E293B] mt-1">
                      94.2%
                    </div>
                  </div>

                  <div className="bg-[#EDF2FA] rounded-md p-3.5 border border-[#DCE4F2]">
                    <div className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">
                      RECALL
                    </div>
                    <div className="text-lg font-extrabold text-[#1E293B] mt-1">
                      88.7%
                    </div>
                  </div>

                  <div className="bg-[#EDF2FA] rounded-md p-3.5 border border-[#DCE4F2]">
                    <div className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">
                      F1 SCORE
                    </div>
                    <div className="text-lg font-extrabold text-[#1E293B] mt-1">
                      0.91
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Demand Spikes Forecasting */}
            <div className="bg-white rounded-lg border border-[#EAE2E4] p-6 shadow-soft space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1E293B]">
                    Demand Spikes Forecasting
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Controls the look-ahead horizon and volatility weighting for seasonal/sudden demand changes.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 text-[11px] font-semibold text-[#8B1538] bg-[#FCE7EC] rounded-full">
                  Active
                </span>
              </div>

              {/* Forecast Horizon Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#64748B] uppercase tracking-wider text-[11px]">
                    FORECAST HORIZON
                  </span>
                  <span className="font-semibold text-xs text-[#1E293B]">
                    {forecastHorizon} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="30"
                  value={forecastHorizon}
                  onChange={(e) => setForecastHorizon(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Volatility Weighting Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#64748B] uppercase tracking-wider text-[11px]">
                    VOLATILITY WEIGHTING
                  </span>
                  <span className="font-semibold text-xs text-[#1E293B]">
                    {volatilityWeighting}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={volatilityLevels.indexOf(volatilityWeighting)}
                  onChange={(e) => setVolatilityWeighting(volatilityLevels[Number(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Connected Data Sources (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg border border-[#EAE2E4] p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#8B1538]/10 text-[#8B1538] flex items-center justify-center">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Connected Data Sources
                </h3>
              </div>

              {/* Source Items */}
              <div className="space-y-3 pt-1">
                {/* 1. Epic EHR */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#EAE2E4] hover:border-[#8B1538]/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#0F5B6E] text-white flex items-center justify-center">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E293B]">
                        Epic EHR Integration
                      </h4>
                      <p className="text-[11px] text-[#64748B]">
                        Last sync: 2 mins ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Healthy</span>
                  </div>
                </div>

                {/* 2. Oracle Inventory ERP */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#EAE2E4] hover:border-[#8B1538]/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#9E1C44] text-white flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E293B]">
                        Oracle Inventory ERP
                      </h4>
                      <p className="text-[11px] text-[#64748B]">
                        Last sync: 15 mins ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Healthy</span>
                  </div>
                </div>

                {/* 3. Supplier API Gateway */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#EAE2E4] hover:border-[#8B1538]/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#E3577C] text-white flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E293B]">
                        Supplier API Gateway
                      </h4>
                      <p className="text-[11px] text-[#64748B]">
                        Last sync: 1 hr ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Degraded</span>
                  </div>
                </div>
              </div>

              {/* Add Data Source Button */}
              <button
                onClick={() => setShowAddSourceModal(true)}
                className="w-full py-2.5 px-4 rounded-lg border-2 border-dashed border-[#EAE2E4] hover:border-[#8B1538] text-xs font-semibold text-[#1E293B] hover:text-[#8B1538] flex items-center justify-center gap-2 transition-all mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>ADD DATA SOURCE</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Hospital Profile & Settings Tab */
        <div className="space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-lg border border-[#EAE2E4] p-6 shadow-soft space-y-6 max-w-3xl">
            <div className="pb-3 border-b border-[#EAE2E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#8B1538]" />
                <h3 className="text-base font-bold text-[#1E293B]">
                  Hospital Organization Profile
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                  Hospital Entity Name
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded border border-[#EAE2E4] text-xs text-[#1E293B] focus:border-[#8B1538] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                  Clinical Logistics Department
                </label>
                <input
                  type="text"
                  value={formState.department}
                  onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded border border-[#EAE2E4] text-xs text-[#1E293B] focus:border-[#8B1538] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                  Authorized Procurement Director
                </label>
                <input
                  type="text"
                  value={formState.procurementManager}
                  onChange={(e) => setFormState({ ...formState, procurementManager: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded border border-[#EAE2E4] text-xs text-[#1E293B] focus:border-[#8B1538] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                  Safety Buffer Target (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formState.safetyThresholdDays}
                  onChange={(e) => setFormState({ ...formState, safetyThresholdDays: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded border border-[#EAE2E4] text-xs text-[#1E293B] focus:border-[#8B1538] bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE2E4] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 rounded text-xs font-bold text-white bg-[#8B1538] hover:bg-[#73112E] shadow-soft transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Data Source Modal */}
      {showAddSourceModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-modal border border-[#EAE2E4] max-w-md w-full p-6 space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-[#1E293B]">
              Connect New Clinical Data Stream
            </h3>
            <p className="text-xs text-[#64748B]">
              Select and authenticate a hospital FHIR endpoint, ERP gateway, or direct supplier inventory feed.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1">Source Name</label>
                <input
                  type="text"
                  placeholder="e.g., Cerner Millenium FHIR API"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#EAE2E4] text-xs text-[#1E293B]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1">Integration Type</label>
                <select className="w-full px-3 py-2 rounded border border-[#EAE2E4] text-xs text-[#1E293B]">
                  <option>FHIR R4 / EHR Ingress</option>
                  <option>SAP S/4HANA Healthcare ERP</option>
                  <option>McKesson Medical-Surgical EDI 850</option>
                  <option>OpenFDA Recall Feed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE2E4]">
              <button
                onClick={() => setShowAddSourceModal(false)}
                className="px-3.5 py-1.5 text-xs text-[#64748B] hover:text-[#1E293B]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddSourceModal(false);
                  addToast(`Connection initiated for ${newSourceName || 'New Data Source'}`, 'success');
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#8B1538] hover:bg-[#73112E] rounded"
              >
                Authenticate & Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
