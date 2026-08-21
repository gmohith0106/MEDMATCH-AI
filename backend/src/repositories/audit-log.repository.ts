import { rtdb, hasDatabaseCredentials } from '../config/firebase';
import { AuditLog, AuditAction } from '../types/audit.types';
import { getCurrentIsoDate } from '../utils/dates';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export class AuditLogRepository {
  private ref = rtdb.ref('auditLogs');
  private memLogs: Map<string, AuditLog> = new Map();

  async log(entry: {
    userId: string;
    userName: string;
    action: AuditAction | string;
    entityType: AuditLog['entityType'];
    entityId: string;
    details?: Record<string, unknown>;
  }): Promise<AuditLog> {
    const id = `audit-${uuidv4().substring(0, 12)}`;
    const record: AuditLog = {
      id,
      userId: entry.userId,
      userName: entry.userName,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      details: entry.details,
      createdAt: getCurrentIsoDate()
    };

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(id).set(record);
      } catch (err) {
        logger.warn(`[AuditLogRepository] RTDB write error for ${id}`, err);
      }
    }

    this.memLogs.set(id, record);
    logger.info(`[AUDIT] [${record.action}] by ${record.userName} (${record.userId}) on ${record.entityType}:${record.entityId}`);
    return record;
  }

  async findRecent(limit = 100): Promise<AuditLog[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.limitToLast(limit).once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: AuditLog[] = Object.values(val);
          list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          return list;
        }
      } catch (err) {
        logger.warn('[AuditLogRepository] RTDB query error', err);
      }
    }
    const list = Array.from(this.memLogs.values());
    list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return list.slice(0, limit);
  }
}

export const auditService = new AuditLogRepository();
