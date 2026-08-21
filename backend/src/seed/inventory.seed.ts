import { InventoryItem, InventoryUsageRecord } from '../types/inventory.types';
import { InventoryService } from '../services/inventory.service';
import { getCurrentIsoDate, getDateDaysAgo } from '../utils/dates';

const hospitalId = 'hospital-citycare-001';
const now = getCurrentIsoDate();

interface SeedInventoryDef {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  dailyUsage: number;
  reorderPoint: number;
  unit: string;
}

const rawItems: SeedInventoryDef[] = [
  {
    id: 'inv-surgical-gloves-002',
    name: 'Surgical Gloves (Sterile, Latex-Free)',
    category: 'PPE',
    currentStock: 1250,
    dailyUsage: 414,
    reorderPoint: 2500,
    unit: 'boxes'
  },
  {
    id: 'inv-n95-masks-001',
    name: 'N95 Masks',
    category: 'PPE',
    currentStock: 120,
    dailyUsage: 42,
    reorderPoint: 150,
    unit: 'boxes'
  },
  {
    id: 'inv-iv-sets-004',
    name: 'IV Sets & Cannulas',
    category: 'Consumables',
    currentStock: 85,
    dailyUsage: 22,
    reorderPoint: 120,
    unit: 'sets'
  },
  {
    id: 'inv-syringes-003',
    name: 'Syringes (10ml Luer-Lock)',
    category: 'Consumables',
    currentStock: 210,
    dailyUsage: 38,
    reorderPoint: 180,
    unit: 'boxes'
  },
  {
    id: 'inv-antibiotic-vials-005',
    name: 'Antibiotic Vials (Ceftriaxone 1g)',
    category: 'Pharmaceuticals',
    currentStock: 340,
    dailyUsage: 40,
    reorderPoint: 200,
    unit: 'vials'
  }
];

function calculateSeedStatus(currentStock: number, dailyUsage: number): { status: 'CRITICAL' | 'WARNING' | 'HEALTHY'; daysRemaining: number | null } {
  const days = dailyUsage > 0 ? Number((currentStock / dailyUsage).toFixed(1)) : null;
  if (currentStock === 0 || (days !== null && days <= 3)) return { status: 'CRITICAL', daysRemaining: days || 0 };
  if (days !== null && days <= 7) return { status: 'WARNING', daysRemaining: days };
  return { status: 'HEALTHY', daysRemaining: days };
}

export const inventorySeed: InventoryItem[] = rawItems.map((item) => {
  const { status, daysRemaining } = calculateSeedStatus(
    item.currentStock,
    item.dailyUsage
  );

  return {
    id: item.id,
    hospitalId,
    name: item.name,
    category: item.category,
    currentStock: item.currentStock,
    dailyUsage: item.dailyUsage,
    reorderPoint: item.reorderPoint,
    unit: item.unit,
    status,
    daysRemaining,
    createdAt: now,
    updatedAt: now
  };
});

// Generate 7-day realistic usage history for each item
export const inventoryUsageSeed: InventoryUsageRecord[] = rawItems.flatMap((item) => {
  const records: InventoryUsageRecord[] = [];
  let runningStock = item.currentStock + item.dailyUsage * 7;

  for (let day = 7; day >= 1; day--) {
    const usage = Math.round(item.dailyUsage * (0.9 + Math.random() * 0.2));
    runningStock -= usage;

    records.push({
      id: `usage-${item.id}-${day}`,
      inventoryId: item.id,
      hospitalId,
      date: getDateDaysAgo(day),
      quantityUsed: usage,
      remainingStock: Math.max(0, runningStock),
      createdAt: getCurrentIsoDate()
    });
  }

  return records;
});
