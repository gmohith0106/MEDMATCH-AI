import { z } from 'zod';

export const createStaffSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Valid hospital email is required'),
  department: z.string().min(2, 'Department is required'),
  role: z.enum(['ADMIN', 'PROCUREMENT_STAFF', 'INVENTORY_STAFF', 'MANAGER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, PROCUREMENT_STAFF, INVENTORY_STAFF, or MANAGER' })
  }),
  password: z.string().min(6, 'Temporary password must be at least 6 characters'),
  hospitalName: z.string().optional()
});

export const updateStaffSchema = z.object({
  name: z.string().min(2).optional(),
  department: z.string().min(2).optional(),
  role: z.enum(['ADMIN', 'PROCUREMENT_STAFF', 'INVENTORY_STAFF', 'MANAGER']).optional(),
  hospitalName: z.string().optional()
});

export const updateStaffStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    errorMap: () => ({ message: 'Status must be ACTIVE or INACTIVE' })
  })
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type UpdateStaffStatusInput = z.infer<typeof updateStaffStatusSchema>;
