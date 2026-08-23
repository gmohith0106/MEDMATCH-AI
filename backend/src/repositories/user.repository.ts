import fs from 'fs';
import path from 'path';
import { rtdb, hasDatabaseCredentials } from '../config/firebase';
import { UserProfile, StaffStatus } from '../types/auth.types';
import { MemoryStore } from './memory-store';
import { getCurrentIsoDate } from '../utils/dates';
import { logger } from '../utils/logger';

export class UserRepository {
  private ref = rtdb.ref('users');
  private memStore = MemoryStore.getInstance();
  private filePath = path.resolve(process.cwd(), 'data', 'users.json');

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const list: UserProfile[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          list.forEach((u) => {
            if (u.uid) {
              this.memStore.users.set(u.uid, u);
            }
          });
          logger.debug(`[UserRepository] Loaded ${list.length} user records from disk`);
        }
      }
    } catch (err) {
      logger.warn('[UserRepository] Failed to read users.json from disk', err);
    }
  }

  private saveToDisk(): void {
    try {
      const dataDir = path.dirname(this.filePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const list = Array.from(this.memStore.users.values());
      fs.writeFileSync(this.filePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      logger.warn('[UserRepository] Failed to save users.json to disk', err);
    }
  }

  async findById(uid: string): Promise<UserProfile | null> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.child(uid).once('value');
        if (snapshot.exists()) {
          return snapshot.val() as UserProfile;
        }
      } catch (err) {
        logger.warn(`[UserRepository] RTDB read error for uid ${uid}`, err);
      }
    }
    return this.memStore.users.get(uid) || null;
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    const normalizedEmail = email.toLowerCase().trim();
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.orderByChild('email').equalTo(normalizedEmail).once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const firstKey = Object.keys(val)[0];
          if (firstKey) return val[firstKey] as UserProfile;
        }
      } catch (err) {
        logger.warn(`[UserRepository] RTDB query error for email ${normalizedEmail}`, err);
      }
    }
    const memUsers = Array.from(this.memStore.users.values());
    return memUsers.find((u) => u.email?.toLowerCase().trim() === normalizedEmail) || null;
  }

  async findAll(): Promise<UserProfile[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: UserProfile[] = Object.values(val);
          list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          return list;
        }
      } catch (err) {
        logger.warn('[UserRepository] RTDB list error', err);
      }
    }
    const list = Array.from(this.memStore.users.values());
    list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return list;
  }

  async findAllByHospital(hospitalNameOrId: string): Promise<UserProfile[]> {
    const all = await this.findAll();
    return all.filter(
      (u) =>
        u.hospitalName === hospitalNameOrId ||
        u.hospitalId === hospitalNameOrId ||
        u.hospitalName === 'CityCare General Hospital'
    );
  }

  async create(user: UserProfile): Promise<UserProfile> {
    const profile: UserProfile = {
      ...user,
      status: user.status || 'ACTIVE',
      createdAt: user.createdAt || getCurrentIsoDate(),
      updatedAt: user.updatedAt || getCurrentIsoDate(),
      lastLoginAt: user.lastLoginAt || getCurrentIsoDate()
    };

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(profile.uid).set(profile);
      } catch (err) {
        logger.warn(`[UserRepository] RTDB write error for uid ${profile.uid}`, err);
      }
    }

    this.memStore.users.set(profile.uid, profile);
    this.saveToDisk();
    return profile;
  }

  async save(user: UserProfile): Promise<UserProfile> {
    return this.create(user);
  }

  async update(uid: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const existing = await this.findById(uid);
    if (!existing) return null;

    const updated: UserProfile = {
      ...existing,
      ...updates,
      updatedAt: getCurrentIsoDate()
    };

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(uid).update(updated);
      } catch (err) {
        logger.warn(`[UserRepository] RTDB update error for uid ${uid}`, err);
      }
    }

    this.memStore.users.set(uid, updated);
    this.saveToDisk();
    return updated;
  }

  async setStatus(uid: string, status: StaffStatus): Promise<UserProfile | null> {
    return this.update(uid, { status });
  }
}
