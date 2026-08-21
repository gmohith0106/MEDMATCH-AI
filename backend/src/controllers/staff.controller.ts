import { Request, Response, NextFunction } from 'express';
import { auth, hasDatabaseCredentials } from '../config/firebase';
import { UserRepository } from '../repositories/user.repository';
import { auditService } from '../repositories/audit-log.repository';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';
import { getCurrentIsoDate } from '../utils/dates';
import { UserProfile } from '../types/auth.types';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export class StaffController {
  private static userRepo = new UserRepository();

  public static async listStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalName = req.staff?.hospitalName || 'CityCare General Hospital';
      const staffList = await StaffController.userRepo.findAllByHospital(hospitalName);

      // Sanitize output (ensure no sensitive fields)
      const sanitized = staffList.map((s) => ({
        uid: s.uid,
        name: s.name || s.displayName || 'Staff Member',
        email: s.email,
        role: s.role,
        department: s.department || 'General',
        hospitalName: s.hospitalName || hospitalName,
        status: s.status || 'ACTIVE',
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        lastLoginAt: s.lastLoginAt
      }));

      sendSuccess(res, sanitized);
    } catch (error) {
      next(error);
    }
  }

  public static async createStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, department, role, password, hospitalName } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      // Check if email is already registered
      const existing = await StaffController.userRepo.findByEmail(normalizedEmail);
      if (existing) {
        throw new AppError('A staff member with this email already exists.', 409, 'STAFF_EXISTS');
      }

      let uid = `staff-${uuidv4().substring(0, 8)}`;

      // Attempt to create Firebase Auth user
      try {
        const fbUser = await auth.createUser({
          email: normalizedEmail,
          password: password,
          displayName: name
        });
        uid = fbUser.uid;
      } catch (fbErr: any) {
        if (fbErr.code === 'auth/email-already-exists') {
          throw new AppError('A user with this email already exists in Firebase Auth.', 409, 'STAFF_EXISTS');
        }
        // In local mock / emulator / demo without live service account credentials, generate UID
        logger.warn('[StaffController] Firebase Auth createUser fallback', fbErr.message);
      }

      const targetHospital = hospitalName || req.staff?.hospitalName || 'CityCare General Hospital';

      const newStaff: UserProfile = {
        uid,
        name: name.trim(),
        displayName: name.trim(),
        email: normalizedEmail,
        role,
        department: department.trim(),
        hospitalName: targetHospital,
        hospitalId: req.hospitalId || 'hospital-citycare-001',
        status: 'ACTIVE',
        createdAt: getCurrentIsoDate(),
        updatedAt: getCurrentIsoDate(),
        lastLoginAt: getCurrentIsoDate()
      };

      const saved = await StaffController.userRepo.create(newStaff);

      // Record audit log
      await auditService.log({
        userId: req.staff?.uid || 'admin',
        userName: req.staff?.name || 'Administrator',
        action: 'STAFF_CREATED',
        entityType: 'USER',
        entityId: saved.uid,
        details: { email: saved.email, role: saved.role, department: saved.department }
      });

      sendSuccess(res, {
        uid: saved.uid,
        name: saved.name,
        email: saved.email,
        role: saved.role,
        department: saved.department,
        hospitalName: saved.hospitalName,
        status: saved.status,
        createdAt: saved.createdAt
      }, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async updateStaffStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const staffUid = (Array.isArray(req.params.uid) ? req.params.uid[0] : req.params.uid) || '';
      const { status } = req.body;

      if (!staffUid) {
        throw new AppError('Staff UID is required', 400, 'BAD_REQUEST');
      }

      const existing = await StaffController.userRepo.findById(staffUid);
      if (!existing) {
        throw new AppError('Staff member not found', 404, 'STAFF_NOT_FOUND');
      }

      const updated = await StaffController.userRepo.setStatus(staffUid, status);

      // Record audit log
      await auditService.log({
        userId: req.staff?.uid || 'admin',
        userName: req.staff?.name || 'Administrator',
        action: status === 'INACTIVE' ? 'STAFF_DEACTIVATED' : 'STAFF_ACTIVATED',
        entityType: 'USER',
        entityId: staffUid,
        details: { targetEmail: existing.email, previousStatus: existing.status, newStatus: status }
      });

      sendSuccess(res, {
        uid: updated?.uid,
        name: updated?.name,
        email: updated?.email,
        role: updated?.role,
        department: updated?.department,
        status: updated?.status,
        updatedAt: updated?.updatedAt
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const staffUid = (Array.isArray(req.params.uid) ? req.params.uid[0] : req.params.uid) || '';
      const { name, department, role, hospitalName } = req.body;

      if (!staffUid) {
        throw new AppError('Staff UID is required', 400, 'BAD_REQUEST');
      }

      const existing = await StaffController.userRepo.findById(staffUid);
      if (!existing) {
        throw new AppError('Staff member not found', 404, 'STAFF_NOT_FOUND');
      }

      const updated = await StaffController.userRepo.update(staffUid, {
        ...(name ? { name: name.trim(), displayName: name.trim() } : {}),
        ...(department ? { department: department.trim() } : {}),
        ...(role ? { role } : {}),
        ...(hospitalName ? { hospitalName } : {})
      });

      // Record audit log
      await auditService.log({
        userId: req.staff?.uid || 'admin',
        userName: req.staff?.name || 'Administrator',
        action: 'STAFF_UPDATED',
        entityType: 'USER',
        entityId: staffUid,
        details: { updates: req.body }
      });

      sendSuccess(res, {
        uid: updated?.uid,
        name: updated?.name,
        email: updated?.email,
        role: updated?.role,
        department: updated?.department,
        hospitalName: updated?.hospitalName,
        status: updated?.status,
        updatedAt: updated?.updatedAt
      });
    } catch (error) {
      next(error);
    }
  }
}
