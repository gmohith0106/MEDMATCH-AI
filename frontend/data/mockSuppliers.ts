import { Supplier, SupplierComparisonMatrix } from '@/types/supplier';

export const mockSuppliers: Supplier[] = [
  {
    id: 'sup-medisupply',
    name: 'MediSupply Healthcare Solutions',
    unitPrice: 9.50,
    deliveryDays: 2,
    reliabilityPercent: 98,
    overallScore: 94.6,
    isRecommended: true,
    availability: 'Immediate',
    location: 'Metro Distribution Hub (45 km)',
    scoreBreakdown: {
      priceScore: 92.0, // 40%
      deliveryScore: 97.0, // 30%
      reliabilityScore: 98.0, // 30%
      totalScore: 94.6,
    },
    strengths: [
      'Rapid 48-hour delivery window',
      'High 98% fulfillment reliability',
      'ISO 13485 certified medical warehouse',
      'Direct cold-chain and dry-batch dispatch',
    ],
    notes: 'Optimal balance of fast dispatch and high reliability. Best suited for imminent shortage mitigation.',
    catalogItems: [
      { itemId: 'inv-n95-masks', itemName: 'N95 Respirator Masks', price: 9.50, inStock: 5000 },
      { itemId: 'inv-surgical-gloves', itemName: 'Nitrile Surgical Gloves', price: 11.00, inStock: 12000 },
      { itemId: 'inv-endotracheal', itemName: 'Endotracheal Tubes 7.5mm', price: 45.00, inStock: 800 },
    ],
  },
  {
    id: 'sup-healthsource',
    name: 'HealthSource Prime Logistics',
    unitPrice: 10.20,
    deliveryDays: 3,
    reliabilityPercent: 95,
    overallScore: 89.8,
    isRecommended: false,
    availability: '2-Day Dispatch',
    location: 'Regional Center (120 km)',
    scoreBreakdown: {
      priceScore: 84.0, // 40%
      deliveryScore: 92.0, // 30%
      reliabilityScore: 95.0, // 30%
      totalScore: 89.8,
    },
    strengths: [
      'Verified FDA registered supplier',
      'Stable 3-day regional delivery',
      'Dedicated hospital account management',
    ],
    notes: 'Premium pricing tier with consistent SLA compliance.',
    catalogItems: [
      { itemId: 'inv-n95-masks', itemName: 'N95 Respirator Masks', price: 10.20, inStock: 3500 },
      { itemId: 'inv-iv-sets', itemName: 'IV Infusion Sets', price: 14.20, inStock: 2200 },
      { itemId: 'inv-antibiotic-vials', itemName: 'Ceftriaxone 1g Vials', price: 32.50, inStock: 4000 },
    ],
  },
  {
    id: 'sup-caremed',
    name: 'CareMed Bulk Logistics',
    unitPrice: 8.90,
    deliveryDays: 6,
    reliabilityPercent: 82,
    overallScore: 78.4,
    isRecommended: false,
    availability: 'Standard',
    location: 'National Cargo Depot (650 km)',
    scoreBreakdown: {
      priceScore: 98.0, // 40%
      deliveryScore: 62.0, // 30%
      reliabilityScore: 82.0, // 30%
      totalScore: 78.4,
    },
    strengths: [
      'Lowest unit cost (₹8.90)',
      'High volume wholesale discounts',
      'Broad general consumables catalog',
    ],
    notes: 'Cheapest unit price, but 6-day lead time exceeds current 2.9-day stock depletion horizon. High risk of hospital stockout.',
    catalogItems: [
      { itemId: 'inv-n95-masks', itemName: 'N95 Respirator Masks', price: 8.90, inStock: 15000 },
      { itemId: 'inv-syringes', itemName: 'Safety Syringes 10ml', price: 6.80, inStock: 8000 },
      { itemId: 'inv-saline-500ml', itemName: '0.9% Normal Saline IV Bags', price: 18.00, inStock: 6000 },
    ],
  },
];

export const mockComparisonMatrix: SupplierComparisonMatrix = {
  itemId: 'inv-n95-masks',
  itemName: 'N95 Respirator Masks',
  weights: {
    price: 0.40,
    delivery: 0.30,
    reliability: 0.30,
  },
  suppliers: mockSuppliers,
};
