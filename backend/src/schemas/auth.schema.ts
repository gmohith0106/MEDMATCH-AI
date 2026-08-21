import { z } from 'zod';

export const userRoleSchema = z.enum([
  'PROCUREMENT_MANAGER',
  'SUPPLY_CHAIN_MANAGER',
  'HOSPITAL_ADMIN',
  'OPERATIONS_MANAGER',
  'OTHER'
]);

export const createProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  displayName: z.string().min(1).optional(),
  role: userRoleSchema.default('PROCUREMENT_MANAGER'),
  hospitalName: z.string().min(2, 'Hospital name must be at least 2 characters').optional(),
  hospitalLocation: z.string().min(2, 'Hospital location is required').optional()
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  displayName: z.string().min(1).optional(),
  role: userRoleSchema.optional()
});
