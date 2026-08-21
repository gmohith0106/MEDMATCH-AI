export type UserRole = 'ADMIN' | 'PROCUREMENT_STAFF' | 'INVENTORY_STAFF' | 'MANAGER';

export type StaffStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  hospitalName: string;
  hospitalId?: string;
  status: StaffStatus;
  avatarInitials: string;
  createdAt: string;
  lastLoginAt?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  organization?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateStaffInput {
  name: string;
  email: string;
  department: string;
  role: UserRole;
  password: string;
  hospitalName?: string;
}
