export type UserRole = 'ADMIN' | 'PROCUREMENT_STAFF' | 'INVENTORY_STAFF' | 'MANAGER';

export type StaffStatus = 'ACTIVE' | 'INACTIVE';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  hospitalName: string;
  hospitalId?: string;
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

export interface AuthContext {
  uid: string;
  email: string;
  name?: string;
  user: UserProfile;
}

export interface SessionData {
  user: UserProfile;
  hospital: {
    id: string;
    name: string;
    location: string;
  } | null;
}

