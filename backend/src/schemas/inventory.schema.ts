import { z } from 'zod';

export const createInventorySchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters'),
  category: z.string().min(2, 'Category is required'),
  currentStock: z.number().min(0, 'Current stock must be 0 or greater'),
  dailyUsage: z.number().min(0, 'Daily usage must be 0 or greater'),
  reorderPoint: z.number().min(0, 'Reorder point must be 0 or greater'),
  unit: z.string().min(1, 'Unit is required (e.g. boxes, vials, sets)')
});

export const updateInventorySchema = z.object({
  name: z.string().min(2).optional(),
  category: z.string().min(2).optional(),
  currentStock: z.number().min(0).optional(),
  dailyUsage: z.number().min(0).optional(),
  reorderPoint: z.number().min(0).optional(),
  unit: z.string().min(1).optional()
});

export const inventoryQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['CRITICAL', 'WARNING', 'HEALTHY']).optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
});
