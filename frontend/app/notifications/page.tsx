'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Check,
  Trash2,
  CreditCard,
  Package,
  Bot,
  Truck,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

export default function NotificationsPage() {
  const { notifications, markAllNotificationsRead, addToast } = useDemo();
  const [filter, setFilter] = useState<'all' | 'unread' | 'payment' | 'inventory'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'payment') return n.type === 'payment_complete';
    if (filter === 'inventory') return n.type === 'critical_inventory';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3] uppercase">
              COMMUNICATIONS HUB
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#24324a] tracking-tight mt-1">
            System Notifications & Alerts
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Real-time telemetry, SMS delivery receipts, and autonomous agent settlement logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              markAllNotificationsRead();
              addToast('All notifications marked as read', 'info');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#ffc8d3] bg-white text-xs font-semibold text-[#24324a] hover:bg-[#fff5f7] shadow-soft transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* SMS Gateway Telemetry Info Banner */}
      <div className="p-4 rounded-lg bg-[#fff5f7] border border-[#ffc8d3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-[#e3577c] border border-[#ffc8d3] flex items-center justify-center font-bold">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#24324a]">Clinical SMS Notification Channel</p>
            <p className="text-[#667085]">
              Real status reporting: "SMS service requires configuration" when Twilio API credentials are not provided.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded bg-white text-[11px] font-semibold text-[#667085] border border-[#ffc8d3] whitespace-nowrap">
          Live Verification Active
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#ffc8d3] pb-2 text-xs">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'payment', label: 'x402 Payments' },
          { id: 'inventory', label: 'Stock Alerts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              filter === tab.id
                ? 'bg-[#e3577c] text-white shadow-soft'
                : 'text-[#667085] hover:text-[#24324a] hover:bg-[#fff5f7]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border border-[#ffc8d3] shadow-card overflow-hidden divide-y divide-[#ffc8d3]">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#667085]">
            No notifications matching the selected filter.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                notif.read ? 'bg-white' : 'bg-[#fff5f7]/40'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3] flex items-center justify-center flex-shrink-0 mt-0.5">
                {notif.type === 'payment_complete' ? (
                  <CreditCard className="w-4 h-4" />
                ) : notif.type === 'critical_inventory' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#24324a]">{notif.title}</span>
                  <span className="text-[11px] text-[#667085] font-mono">
                    {notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
                <p className="text-[#667085] leading-relaxed">{notif.message}</p>
                {notif.actionUrl && (
                  <Link
                    href={notif.actionUrl}
                    className="inline-block text-[11px] font-semibold text-[#e3577c] hover:underline pt-1"
                  >
                    {notif.actionLabel || 'View details'} &rarr;
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

