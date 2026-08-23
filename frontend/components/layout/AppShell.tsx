'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { ToastContainer } from '@/components/ui/Toast';

const standaloneRoutes = ['/', '/login', '/register', '/forgot-password'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isStandalone = standaloneRoutes.includes(pathname);

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-canvas text-slate-900 flex flex-col">
        {children}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-slate-900 flex flex-col overflow-hidden">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sleek Sidebar */}
        <div className="hidden lg:block h-full shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Drawer Navigation */}
        <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        {/* Main Application Column */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Top Header */}
          <Header onOpenMobile={() => setMobileNavOpen(true)} />

          {/* Main Scrollable Content Area with unified Soft Green + Light Silver canvas */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-canvas">
            <div className="max-w-7xl mx-auto w-full space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
