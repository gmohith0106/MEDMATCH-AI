'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Building2,
  Mail,
  ShieldCheck,
  Save,
  CheckCircle2,
  ArrowLeft,
  Hospital,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDemo } from '@/context/DemoContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const { hospitalSettings, updateHospitalSettings, addToast } = useDemo();

  const [firstName, setFirstName] = useState(user?.firstName || 'Robert');
  const [lastName, setLastName] = useState(user?.lastName || 'Reynolds');
  const [email, setEmail] = useState(user?.email || 'procurement@citycare.org');
  const [department, setDepartment] = useState('Central Procurement & Pharmacy');
  const [hospitalName, setHospitalName] = useState(hospitalSettings.name || 'CityCare Metropolitan Hospital');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalSettings({ name: hospitalName });
    setIsSaved(true);
    addToast('Profile and institutional preferences updated successfully', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto pb-12">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            User Profile & Clinical Identity
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your hospital role, authorized clinical parameters, and institutional settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-[#DDE9E2] p-6 sm:p-8 shadow-sm space-y-6">
        {/* Avatar & Role Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-teal-400 font-black text-2xl flex items-center justify-center shadow-sm">
            {user?.avatarInitials || 'RR'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Dr. {firstName} {lastName}
            </h2>
            <p className="text-xs text-slate-500">Clinical Director of Procurement</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 uppercase">
              AUTHORIZED PROCUREMENT SIGNATORY
            </span>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 bg-white outline-none text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 bg-white outline-none text-slate-900"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-slate-800">Official Medical Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 bg-white outline-none text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 bg-white outline-none text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">Hospital Institution</label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 bg-white outline-none text-slate-900"
            />
          </div>
        </div>

        {/* Institutional Governance Notice */}
        <div className="p-4 rounded-lg bg-[#E8F1EC]/40 border border-[#DDE9E2] space-y-1.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Human-in-the-Loop Governance</span>
          </div>
          <p className="text-slate-600 text-[11px]">
            All clinical purchase orders and replenishment contracts require explicit authorized human approval before execution.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Changes Saved' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
