'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Search,
  Lock,
  Building2,
  Mail,
  Briefcase,
  X,
  Edit2
} from 'lucide-react';
import { UserRole, StaffStatus } from '@/types/auth';

interface StaffItem {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  hospitalName: string;
  status: StaffStatus;
  createdAt: string;
  updatedAt?: string;
}

export default function StaffManagementPage() {
  const { user, getIdToken } = useAuth();
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State for adding new staff
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDepartment, setNewDepartment] = useState('Procurement & Logistics');
  const [newRole, setNewRole] = useState<UserRole>('PROCUREMENT_STAFF');
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchStaff = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/staff', { headers });
      const data = await res.json();

      if (res.ok && data.success) {
        setStaffList(data.data || []);
      } else {
        setError(data.error?.message || 'Failed to load staff list');
      }
    } catch (err: any) {
      setError('Error connecting to staff management service');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle status toggle (Activate / Deactivate)
  const handleToggleStatus = async (staff: StaffItem) => {
    const nextStatus: StaffStatus = staff.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/staff/${staff.uid}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: nextStatus })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`Staff status updated: ${staff.name} is now ${nextStatus}`);
        setTimeout(() => setSuccess(null), 4000);
        fetchStaff();
      } else {
        setError(data.error?.message || 'Failed to update staff status');
      }
    } catch {
      setError('Failed to update status');
    }
  };

  // Handle creating a new staff member
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newName.trim() || !newEmail.trim() || !newPassword || !newDepartment.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (newPassword.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/staff', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim().toLowerCase(),
          department: newDepartment.trim(),
          role: newRole,
          password: newPassword,
          hospitalName: user?.hospitalName || 'CityCare General Hospital'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`Staff account created for ${newName} (${newRole})`);
        setTimeout(() => setSuccess(null), 4000);
        setIsAddModalOpen(false);
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        fetchStaff();
      } else {
        setFormError(data.error?.message || 'Failed to create staff account');
      }
    } catch {
      setFormError('Network error while provisioning staff');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Non-admin Access Denied check
  if (user && user.role !== 'ADMIN') {
    return (
      <div className="p-8 max-w-4xl mx-auto font-sans">
        <div className="bg-white rounded-2xl border border-amber-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Staff management is restricted exclusively to Hospital Administrators. Contact your administrator if you need role changes.
          </p>
        </div>
      </div>
    );
  }

  const roleBadgeStyles: Record<UserRole, { bg: string; text: string; label: string }> = {
    ADMIN: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', label: 'Hospital Admin' },
    PROCUREMENT_STAFF: { bg: 'bg-pink-50 border-pink-200', text: 'text-pink-700', label: 'Procurement Staff' },
    INVENTORY_STAFF: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Inventory Staff' },
    MANAGER: { bg: 'bg-slate-100 border-slate-300', text: 'text-slate-600', label: 'Clinical Manager' }
  };

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.department && s.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = filterRole === 'ALL' || s.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#cbd5e1] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-50 text-pink-700">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Hospital Staff Management</h1>
          </div>
          <p className="text-xs text-slate-500">
            Provision staff credentials, assign permissions, and manage hospital system access.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all shadow-sm active:scale-98 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New Staff</span>
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-xs font-medium text-slate-700 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800 flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-pink-600 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Role:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-pink-600"
          >
            <option value="ALL">All Roles ({staffList.length})</option>
            <option value="ADMIN">Hospital Admin</option>
            <option value="PROCUREMENT_STAFF">Procurement Staff</option>
            <option value="INVENTORY_STAFF">Inventory Staff</option>
            <option value="MANAGER">Clinical Manager</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-[#cbd5e1] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-pink-600" />
            <span className="text-xs font-semibold">Loading hospital staff records...</span>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No staff records found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Staff Member</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Assigned Role</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStaff.map((staff) => {
                  const roleMeta = roleBadgeStyles[staff.role] || roleBadgeStyles.PROCUREMENT_STAFF;
                  const isActive = staff.status === 'ACTIVE';

                  return (
                    <tr key={staff.uid} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                            {staff.name ? staff.name.slice(0, 2).toUpperCase() : 'ST'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{staff.name}</p>
                            <p className="text-[11px] text-slate-500">{staff.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-700">
                        {staff.department || 'Clinical Operations'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${roleMeta.bg} ${roleMeta.text}`}>
                          {roleMeta.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isActive
                            ? 'bg-slate-100 text-slate-600 border border-slate-300'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-slate-400' : 'bg-rose-500'}`} />
                          <span>{staff.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(staff)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                              isActive
                                ? 'bg-white hover:bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-300'
                            }`}
                          >
                            {isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provision New Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#cbd5e1] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-pink-50 text-pink-700">
                  <UserPlus className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Provision Staff Account</h2>
                  <p className="text-xs text-slate-500">Create login credentials for hospital personnel</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Alexander Price"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-600 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hospital Work Email *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="a.price@citycare.hospital"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-600 bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="Procurement & Logistics"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-600 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    System Role *
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 font-semibold text-slate-800 bg-white focus:outline-none focus:border-pink-600"
                  >
                    <option value="PROCUREMENT_STAFF">Procurement Staff</option>
                    <option value="INVENTORY_STAFF">Inventory Staff</option>
                    <option value="MANAGER">Clinical Manager</option>
                    <option value="ADMIN">Hospital Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Initial Password *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-600 bg-slate-50/50"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold transition-all shadow-sm active:scale-98 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Provisioning...</span>
                    </>
                  ) : (
                    <span>Create Staff Account</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
