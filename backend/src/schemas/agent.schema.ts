import { z } from 'zod';

export const runAgentSchema = z.object({
  inventoryItemId: z.string().optional(),
  inventoryId: z.string().optional()
});

export const forecastQuerySchema = z.object({
  days: z
    .string()
    .optional()
    .default('7')
    .transform((val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) || parsed <= 0 ? 7 : Math.min(parsed, 90);
    })
});
