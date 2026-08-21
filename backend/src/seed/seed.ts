import { rtdb } from '../config/firebase';
import { hospitalsSeed } from './hospitals.seed';
import { inventorySeed, inventoryUsageSeed } from './inventory.seed';
import { suppliersSeed } from './suppliers.seed';
import { logger } from '../utils/logger';
import { getCurrentIsoDate } from '../utils/dates';
import { UserProfile } from '../types/auth.types';

export const initialStaffSeed: UserProfile[] = [
  {
    uid: 'staff-admin-001',
    name: 'Dr. Sarah Jenkins',
    displayName: 'Dr. Sarah Jenkins',
    email: 'admin@citycare.hospital',
    role: 'ADMIN',
    department: 'Hospital Administration',
    hospitalName: 'CityCare General Hospital',
    hospitalId: 'hospital-citycare-001',
    status: 'ACTIVE',
    createdAt: getCurrentIsoDate(),
    updatedAt: getCurrentIsoDate(),
    lastLoginAt: getCurrentIsoDate()
  },
  {
    uid: 'staff-procurement-001',
    name: 'Marcus Vance',
    displayName: 'Marcus Vance',
    email: 'procurement@citycare.hospital',
    role: 'PROCUREMENT_STAFF',
    department: 'Procurement & Logistics',
    hospitalName: 'CityCare General Hospital',
    hospitalId: 'hospital-citycare-001',
    status: 'ACTIVE',
    createdAt: getCurrentIsoDate(),
    updatedAt: getCurrentIsoDate(),
    lastLoginAt: getCurrentIsoDate()
  },
  {
    uid: 'staff-inventory-001',
    name: 'Elena Rostova',
    displayName: 'Elena Rostova',
    email: 'inventory@citycare.hospital',
    role: 'INVENTORY_STAFF',
    department: 'Central Medical Supply',
    hospitalName: 'CityCare General Hospital',
    hospitalId: 'hospital-citycare-001',
    status: 'ACTIVE',
    createdAt: getCurrentIsoDate(),
    updatedAt: getCurrentIsoDate(),
    lastLoginAt: getCurrentIsoDate()
  },
  {
    uid: 'staff-manager-001',
    name: 'Dr. Arthur Pendelton',
    displayName: 'Dr. Arthur Pendelton',
    email: 'manager@citycare.hospital',
    role: 'MANAGER',
    department: 'Clinical Supply Operations',
    hospitalName: 'CityCare General Hospital',
    hospitalId: 'hospital-citycare-001',
    status: 'ACTIVE',
    createdAt: getCurrentIsoDate(),
    updatedAt: getCurrentIsoDate(),
    lastLoginAt: getCurrentIsoDate()
  }
];

export async function seedDatabase(): Promise<void> {
  logger.info('🌱 Starting MedMatch Realtime Database seeding...');

  try {
    const updates: Record<string, any> = {};

    // 1. Seed Staff Users
    for (const staff of initialStaffSeed) {
      updates[`users/${staff.uid}`] = staff;
    }
    logger.info(`✓ Queued ${initialStaffSeed.length} staff user(s)`);

    // 2. Seed Hospitals
    for (const hospital of hospitalsSeed) {
      updates[`hospitals/${hospital.id}`] = hospital;
    }
    logger.info(`✓ Queued ${hospitalsSeed.length} hospital(s)`);

    // 3. Seed Inventory Items
    for (const item of inventorySeed) {
      const enrichedItem = {
        ...item,
        productName: item.name,
        recentUsage: item.dailyUsage,
        predictedDemand: Math.round(item.dailyUsage * 14),
        shortageQuantity: Math.max(0, Math.round(item.dailyUsage * 14) - item.currentStock),
        riskLevel: item.status,
        stockoutDate: item.daysRemaining ? new Date(Date.now() + item.daysRemaining * 86400000).toISOString().split('T')[0] : null
      };
      updates[`inventory/${item.id}`] = enrichedItem;
    }
    logger.info(`✓ Queued ${inventorySeed.length} inventory item(s)`);

    // 4. Seed Usage History
    for (const usage of inventoryUsageSeed) {
      updates[`inventoryUsage/${usage.id}`] = usage;
    }
    logger.info(`✓ Queued ${inventoryUsageSeed.length} usage record(s)`);

    // 5. Seed Suppliers
    for (const supplier of suppliersSeed) {
      const enrichedSupplier = {
        ...supplier,
        unitPrice: supplier.pricePerUnit,
        deliveryTime: supplier.deliveryDays,
        reliability: supplier.reliabilityScore,
        availability: supplier.availabilityScore,
        active: true
      };
      updates[`suppliers/${supplier.id}`] = enrichedSupplier;
    }
    logger.info(`✓ Queued ${suppliersSeed.length} supplier(s)`);

    // Commit all updates to Firebase Realtime Database
    await rtdb.ref().update(updates);
    logger.info('✅ MedMatch Realtime Database seeding completed successfully!');
  } catch (error) {
    logger.error('❌ Database seeding failed', error);
    throw error;
  }
}

// Run directly if called from command line
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
