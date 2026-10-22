import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { AdminUser, UserStatus, AdminUserQueryParams } from '../../types/admin';

import {
  getUsersApi,
  blockUserApi,
  unblockUserApi,
  activateUserApi,
  deactivateUserApi,
  adminDeleteUserApi,
} from '../../services/adminUserService';
import { UserDetailDrawer } from './UserDetailDrawer';
import { UserAvatar } from './UserAvatar';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';
import {
  Search,
  CheckCircle2,
  Clock,
  Ban,
  Eye,
  UserCheck,
  UserX,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  XCircle,
} from 'lucide-react';


export const AdminUsersPage: React.FC = () => {
  const { user: currentAdmin } = useAuth();

  // Query Params & Filters State
  const [params, setParams] = useState<AdminUserQueryParams>({
    page: 1,
    page_size: 15,
    search: '',
    status: '',
    role: '',
    is_email_verified: '',
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const [searchInput, setSearchInput] = useState('');

  // Response Data State
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState({ page: 1, page_size: 15, total: 0, total_pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Toast Feedback State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // User Detail Drawer State
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    user: AdminUser | null;
    action: 'block' | 'unblock' | 'activate' | 'deactivate' | null;
  }>({ isOpen: false, user: null, action: null });

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<{
    isOpen: boolean;
    user: AdminUser | null;
  }>({ isOpen: false, user: null });

  const [actionSubmitting, setActionSubmitting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Debounced Search Handler
  useEffect(() => {
    const handler = setTimeout(() => {
      setParams((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 350);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch Users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsersApi(params);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve user accounts');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Account Status Action Execution
  const handleExecuteAction = async () => {
    if (!confirmModal.user || !confirmModal.action) return;

    const { user, action } = confirmModal;
    setActionSubmitting(true);

    try {
      let res;
      if (action === 'block') {
        res = await blockUserApi(user.id);
        showToast(res.message || 'User account blocked successfully.');
      } else if (action === 'unblock') {
        res = await unblockUserApi(user.id);
        showToast(res.message || 'User account unblocked successfully.');
      } else if (action === 'activate') {
        res = await activateUserApi(user.id);
        showToast(res.message || 'User account activated successfully.');
      } else if (action === 'deactivate') {
        res = await deactivateUserApi(user.id);
        showToast(res.message || 'User account deactivated successfully.');
      }
      setConfirmModal({ isOpen: false, user: null, action: null });
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to update user status', 'error');
    } finally {
      setActionSubmitting(false);
    }
  };

  const openActionConfirmation = (user: AdminUser, action: 'block' | 'unblock' | 'activate' | 'deactivate') => {
    setConfirmModal({ isOpen: true, user, action });
  };

  const openDeleteConfirmation = (user: AdminUser) => {
    setDeleteTarget({ isOpen: true, user });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget.user) return;
    const target = deleteTarget.user;
    try {
      const res = await adminDeleteUserApi(target.id);
      showToast(res.message || 'User account and profile deleted successfully.');
      setDeleteTarget({ isOpen: false, user: null });
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user account.', 'error');
    }
  };


  const renderStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> ACTIVE
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-200 inline-flex items-center gap-1">
            <Ban className="w-3 h-3" /> BLOCKED
          </span>
        );
      case 'DEACTIVATED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300 inline-flex items-center gap-1">
            <UserX className="w-3 h-3" /> DEACTIVATED
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl shadow-slate-900/10 border backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold animate-toast-bottom-right pointer-events-none ${
            toast.type === 'success'
              ? 'bg-white/95 text-emerald-900 border-emerald-200'
              : 'bg-white/95 text-rose-900 border-rose-200'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}



      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by email, name, or biodata..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#F01472] focus:border-[#F01472] focus:bg-white transition"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={params.status || ''}
              onChange={(e) => setParams((prev) => ({ ...prev, status: e.target.value as any, page: 1 }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#F01472] focus:bg-white cursor-pointer"
            >
              <option value="">Status: All</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PENDING_VERIFICATION">PENDING VERIFICATION</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="DEACTIVATED">DEACTIVATED</option>
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={params.role || ''}
              onChange={(e) => setParams((prev) => ({ ...prev, role: e.target.value as any, page: 1 }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#F01472] focus:bg-white cursor-pointer"
            >
              <option value="">Role: All</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div>
            <select
              value={params.is_email_verified === '' ? '' : params.is_email_verified ? 'true' : 'false'}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  is_email_verified: e.target.value === '' ? '' : e.target.value === 'true',
                  page: 1,
                }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#F01472] focus:bg-white cursor-pointer"
            >
              <option value="">Email: All</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified Only</option>
            </select>
          </div>

          {/* Sort Control */}
          <div>
            <select
              value={`${params.sort_by}:${params.sort_order}`}
              onChange={(e) => {
                const [sort_by, sort_order] = e.target.value.split(':');
                setParams((prev) => ({ ...prev, sort_by, sort_order: sort_order as any, page: 1 }));
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#F01472] focus:bg-white cursor-pointer"
            >
              <option value="created_at:desc">Sort: Joined (Newest)</option>
              <option value="created_at:asc">Sort: Joined (Oldest)</option>
              <option value="full_name:asc">Sort: Name (A-Z)</option>
              <option value="email:asc">Sort: Email (A-Z)</option>
              <option value="status:asc">Sort: Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading && users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#F01472] mx-auto" />
            <p className="text-xs font-mono font-bold">Querying user registry...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">{error}</p>
            <button
              onClick={() => fetchUsers()}
              className="px-4 py-2 rounded-xl bg-[#F01472] text-white font-bold text-xs hover:bg-[#d01062] transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <XCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No matching accounts found</h4>
            <p className="text-xs text-slate-500">Adjust your search parameters to widen the query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">User ID</th>
                  <th className="py-3.5 px-4">Email Status</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const isSelf = currentAdmin?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            photoUrl={u.profile_picture_url}
                            name={u.full_name || u.email}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                              {u.full_name || 'Unnamed User'}
                              {isSelf && (
                                <span className="px-1.5 py-0.2 bg-rose-100 text-[#F01472] text-[9px] font-black rounded border border-rose-200">
                                  YOU
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono truncate">{u.email}</p>
                            {u.biodata_name && (
                              <p className="text-[10px] text-purple-700 font-medium truncate flex items-center gap-1 mt-0.5">
                                <span>📄 Biodata: {u.biodata_name}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.profile_id ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-mono font-bold text-[11px]">
                            {u.profile_id}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.is_email_verified ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">{renderStatusBadge(u.status)}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedUserId(u.id);
                              setDrawerOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                            title="View Account Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {u.status === 'ACTIVE' && !isSelf && (
                            <>
                              <button
                                onClick={() => openActionConfirmation(u, 'block')}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Block User Account"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openActionConfirmation(u, 'deactivate')}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                title="Deactivate User Account"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteConfirmation(u)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Delete User Account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {u.status === 'BLOCKED' && !isSelf && (
                            <>
                              <button
                                onClick={() => openActionConfirmation(u, 'unblock')}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                                title="Unblock User Account"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteConfirmation(u)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Delete User Account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {u.status === 'DEACTIVATED' && !isSelf && (
                            <>
                              <button
                                onClick={() => openActionConfirmation(u, 'activate')}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                                title="Activate User Account"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteConfirmation(u)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Delete User Account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {u.status === 'PENDING_VERIFICATION' && !isSelf && (
                            <button
                              onClick={() => openDeleteConfirmation(u)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete User Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.total > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-mono">
            <div>
              Showing{' '}
              <span className="font-bold text-slate-900">
                {(pagination.page - 1) * pagination.page_size + 1}
              </span>{' '}
              to{' '}
              <span className="font-bold text-slate-900">
                {Math.min(pagination.page * pagination.page_size, pagination.total)}
              </span>{' '}
              of <span className="font-bold text-slate-900">{pagination.total}</span> registered users
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1 || loading}
                onClick={() => setParams((prev) => ({ ...prev, page: prev.page! - 1 }))}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 transition font-bold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800">
                Page {pagination.page} of {pagination.total_pages || 1}
              </span>

              <button
                disabled={pagination.page >= pagination.total_pages || loading}
                onClick={() => setParams((prev) => ({ ...prev, page: prev.page! + 1 }))}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 transition font-bold flex items-center gap-1 cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Drawer */}
      <UserDetailDrawer
        userId={selectedUserId}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onActionClick={(u, action) => {
          setDrawerOpen(false);
          openActionConfirmation(u, action);
        }}
      />

      {/* Confirmation Modal */}
      {confirmModal.isOpen && confirmModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => !actionSubmitting && setConfirmModal({ isOpen: false, user: null, action: null })}
          />
          <div className="bg-white rounded-2xl p-6 max-w-md w-full z-10 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${
                  confirmModal.action === 'block' || confirmModal.action === 'deactivate'
                    ? 'bg-rose-600'
                    : 'bg-emerald-600'
                }`}
              >
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900 capitalize">
                  Confirm {confirmModal.action} User Account
                </h4>
                <p className="text-xs text-slate-500 font-medium">{confirmModal.user.email}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {confirmModal.action === 'block' &&
                'Are you sure you want to BLOCK this account? The user will be unable to log in and all active sessions will be revoked immediately.'}
              {confirmModal.action === 'deactivate' &&
                'Are you sure you want to DEACTIVATE this account? Active sessions will be revoked.'}
              {confirmModal.action === 'unblock' &&
                'Are you sure you want to UNBLOCK this account and restore ACTIVE status? Note: Previously revoked sessions remain invalid.'}
              {confirmModal.action === 'activate' &&
                'Are you sure you want to ACTIVATE this account?'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                disabled={actionSubmitting}
                onClick={() => setConfirmModal({ isOpen: false, user: null, action: null })}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={actionSubmitting}
                onClick={handleExecuteAction}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                  confirmModal.action === 'block' || confirmModal.action === 'deactivate'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {actionSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm {confirmModal.action}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Delete Account Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteTarget.isOpen}
        onClose={() => setDeleteTarget({ isOpen: false, user: null })}
        onConfirm={handleConfirmDelete}
        title="Delete User Account"
        entityType="the user account and associated biodata profile"
        buttonText="Delete Account & Profile"
        confirmValue={
          deleteTarget.user
            ? (deleteTarget.user.full_name || deleteTarget.user.email || deleteTarget.user.biodata_name || '').trim()
            : ''
        }
        profileName={
          deleteTarget.user
            ? (deleteTarget.user.full_name || deleteTarget.user.email || deleteTarget.user.biodata_name || '')
            : ''
        }
        confirmLabel="user name or email"
        requireReason={false}
      />
    </div>
  );
};
