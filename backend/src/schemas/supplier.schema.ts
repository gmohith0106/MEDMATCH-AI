import { z } from 'zod';

export const createSupplierSchema = z.object({
  name: z.string().min(2, 'Supplier name is required'),
  category: z.string().min(2, 'Category is required'),
  location: z.string().min(2, 'Location is required'),
  pricePerUnit: z.number().positive('Price per unit must be greater than 0'),
  deliveryDays: z.number().int().min(1, 'Delivery days must be at least 1'),
  reliabilityScore: z.number().min(0).max(100, 'Reliability score must be between 0 and 100'),
  availabilityScore: z.number().min(0).max(100, 'Availability score must be between 0 and 100')
});

export const updateSupplierSchema = createSupplierSchema.partial();
