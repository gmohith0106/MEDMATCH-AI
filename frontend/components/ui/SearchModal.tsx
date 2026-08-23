'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import {
  Search,
  PackageSearch,
  Building2,
  ClipboardCheck,
  CreditCard,
  TrendingUp,
  Bot,
  Activity,
  X,
  ChevronRight,
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Inventory' | 'Suppliers' | 'Procurement' | 'Payments' | 'Agent' | 'Forecast';
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, inventory, suppliers, procurements, payments } = useDemo();
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  const allItems: SearchResultItem[] = [
    { id: 'route-agent', title: 'MedMatch Procurement Agent', subtitle: '9-step autonomous workflow runner', category: 'Agent', href: '/agent', icon: Bot },
    { id: 'route-recom', title: 'AI Procurement Recommendation', subtitle: 'MediSupply N95 Masks recommendation', category: 'Agent', href: '/recommendation', icon: Bot },
    { id: 'route-forecast', title: 'Demand Forecast', subtitle: '7-day predictive consumption curves', category: 'Forecast', href: '/forecast', icon: TrendingUp },
    { id: 'route-activity', title: 'Live Agent Activity Timeline', subtitle: 'Audit log of events and settlements', category: 'Agent', href: '/activity', icon: Activity },
    
    ...inventory.map((item) => ({
      id: `inv-${item.id}`,
      title: item.name,
      subtitle: `${item.currentStock} ${item.unit} (${item.status} - ${item.daysRemaining} days left)`,
      category: 'Inventory' as const,
      href: `/inventory/${item.id}`,
      icon: PackageSearch,
    })),

    ...suppliers.map((sup) => ({
      id: `sup-${sup.id}`,
      title: sup.name,
      subtitle: `Score: ${sup.overallScore} | ${sup.deliveryDays}-Day Delivery | â‚¹${sup.unitPrice}/unit`,
      category: 'Suppliers' as const,
      href: '/suppliers',
      icon: Building2,
    })),

    ...procurements.map((req) => ({
      id: `req-${req.id}`,
      title: `${req.requestId}: ${req.itemName}`,
      subtitle: `${req.quantity} units from ${req.supplierName} (Status: ${req.status})`,
      category: 'Procurement' as const,
      href: `/procurement/${req.id}`,
      icon: ClipboardCheck,
    })),

    ...payments.map((pay) => {
      const amount = pay.amount ?? pay.amountUsd ?? 0.001;
      const tx = pay.transactionId ? ` (${pay.transactionId})` : '';
      return {
        id: `pay-${pay.id}`,
        title: `${pay.paymentId || pay.id} - ${pay.service || 'Supplier Intelligence'}`,
        subtitle: `$${amount.toFixed(2)} via ${pay.protocol || 'x402'} on ${pay.network || 'Algorand TestNet'}${tx}`,
        category: 'Payments' as const,
        href: '/payments',
        icon: CreditCard,
      };
    }),
  ];


  const filtered = query.trim() === ''
    ? allItems.slice(0, 8)
    : allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (href: string) => {
    setIsSearchOpen(false);
    router.push(href);
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#24324a]/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-card shadow-modal border border-[#ffc8d3] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input */}
        <div className="p-4 border-b border-[#ffc8d3] flex items-center gap-3 bg-[#fff5f7]">
          <Search className="w-5 h-5 text-[#667085] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search items, suppliers, requests, payments, or agent runs... (Press Esc to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsSearchOpen(false);
              if (e.key === 'Enter' && filtered.length > 0) handleSelect(filtered[0].href);
            }}
            className="w-full bg-transparent text-[#24324a] placeholder-[#667085] text-sm font-medium focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-btn hover:bg-white text-[#667085] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto flex-1 custom-scrollbar space-y-1 bg-white">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#667085]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  className="flex items-center justify-between p-3 rounded-btn hover:bg-[#fff5f7] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-btn bg-[#fff5f7] text-[#24324a] group-hover:bg-white transition-colors flex-shrink-0 border border-[#ffc8d3]">
                      <Icon className="w-4 h-4 text-[#e3577c]" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#24324a]">{item.title}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-badge bg-[#fff5f7] text-[#24324a] border border-[#ffc8d3]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#667085] truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#667085] group-hover:text-[#24324a] flex-shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#ffc8d3] bg-[#fff5f7] flex items-center justify-between text-[11px] text-[#667085]">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded-badge bg-white border border-[#ffc8d3] text-[10px] font-mono text-[#24324a]">â†µ</kbd>
            <span>to select</span>
            <kbd className="px-1.5 py-0.5 rounded-badge bg-white border border-[#ffc8d3] text-[10px] font-mono text-[#24324a]">esc</kbd>
            <span>to close</span>
          </div>
          <span>MedMatch Global Discovery</span>
        </div>
      </div>
    </div>
  );
}
