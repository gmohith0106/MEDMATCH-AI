'use client';

import React from 'react';
import { InventoryTable } from '@/components/inventory/InventoryTable';

export default function InventoryPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Title Banner */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-[#24324a] tracking-tight">
          Medical Inventory
        </h2>
        <p className="text-xs text-[#667085] font-medium mt-0.5">
          Monitor current stock, consumption and projected supply requirements.
        </p>
      </div>

      {/* Main Table with Filters & Search */}
      <InventoryTable />
    </div>
  );
}
