import { SupplierService } from '../src/services/supplier.service';
import { Supplier } from '../src/types/supplier.types';

describe('Supplier Service - Multi-factor Scoring & Ranking', () => {
  const suppliers: Supplier[] = [
    {
      id: 'supp-1',
      name: 'MediSupply',
      category: 'Medical Supplies',
      location: 'Bengaluru',
      pricePerUnit: 9.5,
      deliveryDays: 2,
      reliabilityScore: 98,
      availabilityScore: 96,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'supp-2',
      name: 'HealthSource',
      category: 'Medical Supplies',
      location: 'Hyderabad',
      pricePerUnit: 10.2,
      deliveryDays: 3,
      reliabilityScore: 95,
      availabilityScore: 94,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'supp-3',
      name: 'CareMed Logistics',
      category: 'Medical Supplies',
      location: 'Chennai',
      pricePerUnit: 8.9,
      deliveryDays: 6,
      reliabilityScore: 82,
      availabilityScore: 80,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  it('should rank suppliers correctly based on weighted scores', () => {
    const scored = SupplierService.scoreSuppliers(suppliers, 'hospital-citycare-001', 'inv-n95-masks-001');

    expect(scored).toHaveLength(3);
    // Rank 1 should have highest overallScore
    expect(scored[0]!.rank).toBe(1);
    expect(scored[0]!.overallScore).toBeGreaterThanOrEqual(scored[1]!.overallScore);
    expect(scored[1]!.overallScore).toBeGreaterThanOrEqual(scored[2]!.overallScore);

    // Verify MediSupply scores top due to strong delivery (2 days) + reliability (98%) + availability (96%)
    expect(scored[0]!.supplierName).toBe('MediSupply');
  });

  it('should return empty list when no suppliers provided', () => {
    const scored = SupplierService.scoreSuppliers([], 'hospital-citycare-001', 'inv-n95-masks-001');
    expect(scored).toEqual([]);
  });
});
