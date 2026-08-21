import { z } from 'zod';

export const updateHospitalSchema = z.object({
  name: z.string().min(2, 'Hospital name must be at least 2 characters').optional(),
  location: z.string().min(2, 'Location must be at least 2 characters').optional()
});

export const createHospitalSchema = z.object({
  name: z.string().min(2, 'Hospital name is required'),
  location: z.string().min(2, 'Location is required')
});
