import { v4 as uuidv4 } from 'uuid';
import { SupplierRepository } from '../repositories/supplier.repository';
import { Supplier, SupplierAnalysis } from '../types/supplier.types';
import { getCurrentIsoDate } from '../utils/dates';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export class SupplierService {
  private repo = new SupplierRepository();

  public static scoreSuppliers(
    suppliers: Supplier[],
    hospitalId: string,
    inventoryId: string
  ): SupplierAnalysis[] {
    if (suppliers.length === 0) return [];

    const minPrice = Math.min(...suppliers.map((s) => s.pricePerUnit));
    const minDelivery = Math.min(...suppliers.map((s) => s.deliveryDays));

    const scored = suppliers.map((s) => {
      // Price score: lowest price gets 100, others scaled relative to minimum
      const priceScore = Math.round((minPrice / s.pricePerUnit) * 1000) / 10;

      // Delivery score: fastest delivery gets 100, others scaled relative to minimum
      const deliveryScore = Math.round((minDelivery / s.deliveryDays) * 1000) / 10;

      const reliabilityScore = s.reliabilityScore;
      const availabilityScore = s.availabilityScore;

      // Weighted overall score
      // price = 40%, delivery = 30%, reliability = 20%, availability = 10%
      const overallScore =
        Math.round(
          (0.4 * priceScore +
            0.3 * deliveryScore +
            0.2 * reliabilityScore +
            0.1 * availabilityScore) *
            10
        ) / 10;

      return {
        id: `sa-${uuidv4().substring(0, 8)}`,
        supplierId: s.id,
        supplierName: s.name,
        inventoryId,
        hospitalId,
        priceScore,
        deliveryScore,
        reliabilityScore,
        availabilityScore,
        overallScore,
        unitPrice: s.pricePerUnit,
        deliveryDays: s.deliveryDays,
        createdAt: getCurrentIsoDate()
      };
    });

    // Rank descending by overallScore
    scored.sort((a, b) => b.overallScore - a.overallScore);

    return scored.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return this.repo.findAll();
  }

  async getSupplierById(id: string): Promise<Supplier> {
    const supplier = await this.repo.findById(id);
    if (!supplier) {
      throw new AppError(`Supplier ${id} not found`, 404, 'RESOURCE_NOT_FOUND');
    }
    return supplier;
  }

  async analyzeSuppliersForInventory(
    hospitalId: string,
    inventoryId: string
  ): Promise<SupplierAnalysis[]> {
    const suppliers = await this.repo.findAll();
    if (suppliers.length === 0) {
      throw new AppError('No suppliers available for analysis', 404, 'RESOURCE_NOT_FOUND');
    }

    const analyses = SupplierService.scoreSuppliers(suppliers, hospitalId, inventoryId);

    // Persist each analysis
    for (const analysis of analyses) {
      await this.repo.saveAnalysis(analysis);
    }

    logger.info(
      `Ranked ${analyses.length} suppliers for inventory ${inventoryId}. Top: ${analyses[0]?.supplierName} (Score: ${analyses[0]?.overallScore})`
    );

    return analyses;
  }
}
