'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  ShieldCheck,
  Building2,
  LogOut,
  User as UserIcon,
  X,
  Briefcase,
  Mail,
  Hospital,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Header({ onOpenMobile }: { onOpenMobile?: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (pathname === '/' || pathname === '/dashboard') return 'Hospital Overview';
    if (pathname.startsWith('/inventory')) return 'Inventory Management';
    if (pathname.startsWith('/forecast')) return 'Demand Forecasting';
    if (pathname.startsWith('/procurement') || pathname.startsWith('/agent')) return 'Autonomous Procurement';
    if (pathname.startsWith('/suppliers')) return 'Supplier Directory';
    if (pathname.startsWith('/payments')) return 'Payments & Settlements';
    if (pathname.startsWith('/staff')) return 'Staff Management';
    if (pathname.startsWith('/recommendation')) return 'Clinical Recommendations';
    return 'MedMatch AI';
  };

  const roleLabels: Record<string, string> = {
    ADMIN: 'Hospital Admin',
    PROCUREMENT_STAFF: 'Procurement Staff',
    INVENTORY_STAFF: 'Inventory Staff',
    MANAGER: 'Clinical Manager'
  };

  const currentRoleLabel = user?.role ? roleLabels[user.role] || user.role : 'Hospital Staff';

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 font-sans">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          {onOpenMobile && (
            <button
              onClick={onOpenMobile}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">{getPageTitle()}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Automated Clinical Supply & Procurement Intelligence</p>
          </div>
        </div>

        {/* Right: Hospital Status, User Profile */}
        <div className="flex items-center gap-4">
          {/* Active Network Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Algorand TestNet</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">0.02 USDC Micropayments</span>
          </div>

          {/* User Profile Trigger */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.avatarInitials || 'ST'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">
                  {user?.name || user?.displayName || 'Hospital Staff'}
                </p>
                <p className="text-[11px] text-teal-700 font-medium mt-0.5">{currentRoleLabel}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user?.name || user?.displayName || 'Hospital Staff'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'staff@hospital.org'}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <span className="font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {currentRoleLabel}
                    </span>
                    <span className="text-slate-500 truncate ml-1">{user?.department || 'General'}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left"
                >
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  <span>View Staff Profile</span>
                </button>

                <button
                  onClick={async () => {
                    setProfileDropdownOpen(false);
                    if (signOut) await signOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left mt-0.5"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Staff Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#DDE9E2] shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  {user?.avatarInitials || 'ST'}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Hospital Staff Profile</h2>
                  <p className="text-xs text-slate-500">Authorized Personnel Record</p>
                </div>
              </div>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <UserIcon className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold text-slate-900 text-sm">
                    {user?.name || user?.displayName || 'Staff Member'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-teal-600" />
                  <span>{user?.email || 'staff@hospital.org'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Hospital</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{user?.hospitalName || 'CityCare General Hospital'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Department</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{user?.department || 'Procurement & Logistics'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Assigned Role</p>
                  <p className="font-bold text-teal-700 mt-0.5">{currentRoleLabel}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Account Status</p>
                  <p className="font-bold text-emerald-700 mt-0.5">● {user?.status || 'ACTIVE'}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
