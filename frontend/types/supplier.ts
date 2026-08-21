export interface SupplierScoreBreakdown {
  priceScore: number; // 40% weight
  deliveryScore: number; // 30% weight
  reliabilityScore: number; // 30% weight
  totalScore: number;
}

export interface Supplier {
  id: string;
  name: string;
  logo?: string;
  unitPrice: number; // in ₹
  deliveryDays: number;
  reliabilityPercent: number;
  overallScore: number;
  isRecommended: boolean;
  scoreBreakdown: SupplierScoreBreakdown;
  availability: 'Immediate' | '2-Day Dispatch' | 'Standard' | 'Constrained';
  location: string;
  catalogItems: {
    itemId: string;
    itemName: string;
    price: number;
    inStock: number;
  }[];
  notes: string;
  strengths: string[];
}

export interface SupplierComparisonMatrix {
  itemId: string;
  itemName: string;
  weights: {
    price: number; // 0.40
    delivery: number; // 0.30
    reliability: number; // 0.30
  };
  suppliers: Supplier[];
}
