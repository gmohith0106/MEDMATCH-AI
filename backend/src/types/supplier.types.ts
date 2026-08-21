export interface Supplier {
  id: string;
  supplierId?: string;
  name: string;
  category: string;
  location: string;
  pricePerUnit: number;
  unitPrice?: number;
  deliveryDays: number;
  deliveryTime?: number;
  reliabilityScore: number;
  reliability?: number;
  availabilityScore: number;
  availability?: number | string;
  quality?: number;
  active?: boolean;
  products?: string[];
  overallScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierAnalysis {
  id: string;
  supplierId: string;
  supplierName: string;
  inventoryId: string;
  hospitalId: string;
  priceScore: number;
  deliveryScore: number;
  reliabilityScore: number;
  availabilityScore: number;
  overallScore: number;
  rank: number;
  unitPrice: number;
  deliveryDays: number;
  deliveryTime?: number;
  quality?: number;
  createdAt: string;
}
