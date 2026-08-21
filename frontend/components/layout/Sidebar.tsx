'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Bot,
  Truck,
  CreditCard,
  Building2,
  Home,
  Users,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const allNavItems: NavItem[] = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'PROCUREMENT_STAFF', 'INVENTORY_STAFF', 'MANAGER']
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Package,
    roles: ['ADMIN', 'INVENTORY_STAFF', 'MANAGER']
  },
  {
    name: 'Forecasting',
    href: '/forecast',
    icon: TrendingUp,
    roles: ['ADMIN', 'INVENTORY_STAFF', 'MANAGER']
  },
  {
    name: 'Procurement',
    href: '/procurement',
    icon: Bot,
    roles: ['ADMIN', 'PROCUREMENT_STAFF', 'MANAGER']
  },
  {
    name: 'Suppliers',
    href: '/suppliers',
    icon: Truck,
    roles: ['ADMIN', 'PROCUREMENT_STAFF', 'MANAGER']
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: CreditCard,
    roles: ['ADMIN', 'PROCUREMENT_STAFF', 'MANAGER']
  },
  {
    name: 'Staff',
    href: '/staff',
    icon: Users,
    roles: ['ADMIN']
  },
];

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const userRole = user?.role || 'PROCUREMENT_STAFF';

  // Filter items matching user's authenticated staff role
  const visibleNavItems = allNavItems.filter((item) => item.roles.includes(userRole));

  const isItemActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const roleDisplayNames: Record<string, string> = {
    ADMIN: 'Hospital Admin',
    PROCUREMENT_STAFF: 'Procurement Staff',
    INVENTORY_STAFF: 'Inventory Staff',
    MANAGER: 'Clinical Manager'
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-full select-none border-r border-slate-800 z-30 justify-between shrink-0 font-sans">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <Link href="/" className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-sm hover:bg-teal-500 transition-colors">
            <span className="font-sans font-black">M</span>
          </Link>
          <div className="flex flex-col">
            <Link href="/dashboard" className="font-bold text-base tracking-tight text-white leading-tight hover:text-teal-300 transition-colors">
              MedMatch AI
            </Link>
            <span className="text-xs text-slate-400 font-medium">Hospital Staff Portal</span>
          </div>
        </div>

        {/* Hospital Context Indicator */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-400 shrink-0" />
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {user?.hospitalName || 'CityCare General Hospital'}
            </p>
            <p className="text-[10px] text-slate-400">
              {roleDisplayNames[userRole] || userRole}
            </p>
          </div>
        </div>

        {/* Dynamic Role-Based Navigation Items */}
        <nav className="p-3 space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-teal-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Session & Home link */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Landing Page</span>
        </Link>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-teal-300">
            {user?.avatarInitials || 'ST'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">
              {user?.name || user?.displayName || 'Hospital Staff'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {roleDisplayNames[userRole] || userRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
