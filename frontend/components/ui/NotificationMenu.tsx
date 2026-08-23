'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import { Bell, AlertTriangle, Sparkles, CreditCard, ShieldAlert, Check, ChevronRight } from 'lucide-react';

export function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationRead, markAllNotificationsRead } = useDemo();
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical_inventory':
        return <AlertTriangle className="w-4 h-4 text-[#e3577c]" />;
      case 'approval_required':
        return <Sparkles className="w-4 h-4 text-[#e27094]" />;
      case 'payment_complete':
        return <CreditCard className="w-4 h-4 text-[#94d4f8]" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-[#24324a]" />;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-btn hover:bg-[#fff5f7] text-[#24324a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffc8d3]"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5 text-[#24324a]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#e3577c] text-white font-bold text-[9px] flex items-center justify-center border-2 border-white shadow-soft">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-card shadow-modal border border-[#ffc8d3] p-4 z-50 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#ffc8d3]">
            <div>
              <h4 className="font-heading font-bold text-sm text-[#24324a]">Notifications</h4>
              <p className="text-[11px] text-[#667085]">Live system events and agent triggers</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] font-semibold text-[#e3577c] hover:text-[#e27094] flex items-center gap-1 transition-colors"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="py-2 max-h-80 overflow-y-auto space-y-2 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#667085]">
                No active notifications
              </div>
            ) : (
              notifications.map((notif) => {
                let cardBg = notif.read
                  ? 'bg-white border-[#ffc8d3] text-[#667085]'
                  : notif.type === 'critical_inventory'
                  ? 'bg-[#fff5f7] border-[#e3577c] text-[#24324a]'
                  : notif.type === 'approval_required'
                  ? 'bg-[#fff5f7] border-[#e27094] text-[#24324a]'
                  : 'bg-[#fff5f7] border-[#94d4f8] text-[#24324a]';

                return (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-3 rounded-btn border transition-all cursor-pointer ${cardBg}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-btn bg-white shadow-soft flex-shrink-0 mt-0.5 border border-[#ffc8d3]">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold truncate text-[#24324a]">{notif.title}</span>
                          <span className="text-[10px] text-[#667085] flex-shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#24324a] mt-0.5 leading-snug">{notif.message}</p>
                        {notif.actionUrl && (
                          <Link
                            href={notif.actionUrl}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-[#e3577c] bg-white hover:bg-[#fff5f7] px-2.5 py-0.5 rounded-badge border border-[#ffc8d3] transition-colors shadow-soft"
                          >
                            {notif.actionLabel || 'View Detail'}
                            <ChevronRight className="w-3 h-3 text-[#e3577c]" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-[#ffc8d3] text-center">
            <Link
              href="/activity"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-[#e3577c] hover:underline"
            >
              View Full Activity Audit Timeline
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
