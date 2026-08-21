import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response';
import { HospitalRepository } from '../repositories/hospital.repository';
import { UserRepository } from '../repositories/user.repository';
import { auditService } from '../repositories/audit-log.repository';
import { AppError } from '../utils/errors';

export class AuthController {
  private static hospitalRepo = new HospitalRepository();
  private static userRepo = new UserRepository();

  public static async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const staff = req.staff || req.auth?.user;
      if (!staff) {
        throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
      }

      if (staff.status === 'INACTIVE') {
        throw new AppError('Your account is inactive. Contact your hospital administrator.', 403, 'ACCOUNT_INACTIVE');
      }

      const hospitalId = staff.hospitalId || 'hospital-citycare-001';
      const hospital = await AuthController.hospitalRepo.findById(hospitalId);

      sendSuccess(res, {
        user: {
          uid: staff.uid,
          name: staff.name || staff.displayName || 'Staff Member',
          email: staff.email,
          role: staff.role,
          department: staff.department || 'General',
          hospitalName: staff.hospitalName || hospital?.name || 'CityCare General Hospital',
          hospitalId: staff.hospitalId || hospital?.id || 'hospital-citycare-001',
          status: staff.status || 'ACTIVE',
          createdAt: staff.createdAt,
          lastLoginAt: staff.lastLoginAt
        },
        hospital: hospital
          ? {
              id: hospital.id,
              name: hospital.name,
              location: hospital.location
            }
          : {
              id: 'hospital-citycare-001',
              name: staff.hospitalName || 'CityCare General Hospital',
              location: 'Bengaluru'
            }
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const staff = req.staff || req.auth?.user;
      if (!staff) {
        throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
      }

      const updated = await AuthController.userRepo.update(staff.uid, req.body);
      if (!updated) {
        throw new AppError('User profile not found', 404, 'USER_NOT_FOUND');
      }

      await auditService.log({
        userId: staff.uid,
        userName: staff.name || staff.displayName || staff.email,
        action: 'STAFF_UPDATED',
        entityType: 'USER',
        entityId: staff.uid,
        details: { updates: req.body }
      });

      sendSuccess(res, updated);
    } catch (error) {
      next(error);
    }
  }
}
