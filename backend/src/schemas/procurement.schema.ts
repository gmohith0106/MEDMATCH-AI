import { z } from 'zod';

export const createProcurementSchema = z.object({
  recommendationId: z.string().min(1, 'Recommendation ID is required'),
  supplierId: z.string().min(1, 'Supplier ID is required'),
  inventoryId: z.string().min(1, 'Inventory ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  estimatedCost: z.number().positive('Estimated cost must be positive')
});
