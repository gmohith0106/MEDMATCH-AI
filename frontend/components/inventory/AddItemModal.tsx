'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { InventoryCategory } from '@/types/inventory';
import { X, PackagePlus, AlertCircle } from 'lucide-react';

export function AddItemModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addInventoryItem } = useDemo();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryCategory>('Protective Equipment');
  const [currentStock, setCurrentStock] = useState('');
  const [dailyUsage, setDailyUsage] = useState('');
  const [reorderPoint, setReorderPoint] = useState('');
  const [unit, setUnit] = useState('boxes');
  const [unitCost, setUnitCost] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide an item name.');
      return;
    }
    if (!currentStock || isNaN(Number(currentStock)) || Number(currentStock) < 0) {
      setError('Please provide a valid current stock number.');
      return;
    }
    if (!dailyUsage || isNaN(Number(dailyUsage)) || Number(dailyUsage) <= 0) {
      setError('Please provide a valid daily burn rate.');
      return;
    }
    if (!reorderPoint || isNaN(Number(reorderPoint)) || Number(reorderPoint) < 0) {
      setError('Please provide a valid reorder safety threshold.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addInventoryItem({
        name: name.trim(),
        category,
        currentStock: Number(currentStock),
        dailyUsage: Number(dailyUsage),
        reorderPoint: Number(reorderPoint),
        unit: unit.trim() || 'units',
        unitCost: unitCost ? Number(unitCost) : 12.50,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#24324a]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-card w-full max-w-lg shadow-modal border border-[#ffc8d3] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#ffc8d3] flex items-center justify-between bg-[#fff5f7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-btn bg-[#e3577c] text-white flex items-center justify-center shadow-soft">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-[#24324a]">
                Add Inventory Item
              </h3>
              <p className="text-xs text-[#667085] font-medium">
                Register a new medical supply or clinical consumable SKU
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-btn text-[#667085] hover:text-[#24324a] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          {error && (
            <div className="p-3 rounded-btn bg-[#fff5f7] border border-[#ffc8d3] text-xs font-semibold text-[#e3577c] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#e3577c] flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Clinical Quick Templates */}
          <div className="space-y-1.5 pb-2 border-b border-[#ffc8d3]">
            <label className="block text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              âš¡ Quick Fill Presets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'N95 Respirator Masks', category: 'Protective Equipment', stock: '120', usage: '42', reorder: '150', unit: 'boxes', cost: '9.50' },
                { name: 'Nitrile Exam Gloves', category: 'Protective Equipment', stock: '80', usage: '25', reorder: '100', unit: 'boxes', cost: '14.00' },
                { name: 'Sterile 5ml Syringes', category: 'Consumables', stock: '250', usage: '65', reorder: '200', unit: 'units', cost: '0.85' },
                { name: 'Normal Saline IV 500ml', category: 'Medication', stock: '45', usage: '18', reorder: '60', unit: 'bottles', cost: '2.20' },
              ].map((tmpl) => (
                <button
                  key={tmpl.name}
                  type="button"
                  onClick={() => {
                    setName(tmpl.name);
                    setCategory(tmpl.category as InventoryCategory);
                    setCurrentStock(tmpl.stock);
                    setDailyUsage(tmpl.usage);
                    setReorderPoint(tmpl.reorder);
                    setUnit(tmpl.unit);
                    setUnitCost(tmpl.cost);
                  }}
                  className="px-2 py-1 rounded-badge text-[11px] font-semibold bg-[#fff5f7] hover:bg-[#ffc8d3] text-[#24324a] border border-[#ffc8d3] transition-colors"
                >
                  + {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24324a] uppercase tracking-wider mb-1.5">
              Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Surgical Face Shields, Sterile Syringes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-input border border-[#ffc8d3] text-xs text-[#24324a] placeholder-[#667085] focus:outline-none focus:border-[#e27094] bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24324a] uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InventoryCategory)}
                className="w-full px-3.5 py-2.5 rounded-input border border-[#ffc8d3] text-xs text-[#24324a] focus:outline-none focus:border-[#e27094] bg-white"
              >
                <option value="Protective Equipment">Protective Equipment</option>
                <option value="Consumables">Consumables</option>
                <option value="Medication">Medication</option>
                <option value="Surgical Supplies">Surgical Supplies</option>
                <option value="Diagnostic">Diagnostic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24324a] uppercase tracking-wider mb-1.5">
                Unit Type
              </label>
              <input
                type="text"
                placeholder="e.g. boxes, vials, packs"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-input border border-[#ffc8d3] text-xs text-[#24324a] placeholder-[#667085] focus:outline-none focus:border-[#e27094] bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#24324a] uppercase tracking-wider mb-1.5">
                Current Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="250"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-input border border-[#ffc8d3] text-xs text-[#24324a] focus:outline-none focus:border-[#e27094] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24324a] uppercase tracking-wider mb-1.5">
                Daily Usage *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="30"
                value={dailyUsage}
                onChange={(e) => setDailyUsage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-input border border-[#ffc8d3] text-xs text-[#24324a] focus:outline-none focus:border-[#e27094] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24324a] uppercase tracking-wider mb-1.5">
                Reorder Point *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="150"
                value={reorderPoint}
                onChange={(e) => setReorderPoint(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-input border border-[#ffc8d3] text-xs text-[#24324a] focus:outline-none focus:border-[#e27094] bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24324a] uppercase tracking-wider mb-1.5">
              Unit Cost (â‚¹)
            </label>
            <input
              type="number"
              step="0.10"
              min="0"
              placeholder="15.00"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-input border border-[#ffc8d3] text-xs text-[#24324a] focus:outline-none focus:border-[#e27094] bg-white"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#ffc8d3] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-btn bg-[#ffc8d3] hover:bg-[#e27094] hover:text-white text-[#e3577c] text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-btn bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold transition-all shadow-soft disabled:opacity-50"
            >
              {isSubmitting ? 'Adding Item...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
