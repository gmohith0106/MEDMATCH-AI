import { Supplier } from '../types/supplier.types';
import { getCurrentIsoDate } from '../utils/dates';

const now = getCurrentIsoDate();

export const suppliersSeed: Supplier[] = [
  {
    id: 'supp-medisupply-001',
    name: 'MediSupply',
    category: 'Medical Supplies',
    location: 'Bengaluru Logistics Hub',
    pricePerUnit: 9.5,
    deliveryDays: 2,
    reliabilityScore: 98,
    availabilityScore: 96,
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'supp-healthsource-002',
    name: 'HealthSource',
    category: 'Medical Supplies',
    location: 'Hyderabad Supply Node',
    pricePerUnit: 10.2,
    deliveryDays: 3,
    reliabilityScore: 95,
    availabilityScore: 94,
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'supp-caremed-003',
    name: 'CareMed Logistics',
    category: 'Medical Supplies',
    location: 'Chennai Distribution Center',
    pricePerUnit: 8.9,
    deliveryDays: 6,
    reliabilityScore: 82,
    availabilityScore: 80,
    createdAt: now,
    updatedAt: now
  }
];
