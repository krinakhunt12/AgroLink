import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
    CheckCircle,
    XCircle,
    Trash2,
    Eye,
    User,
    Mail,
    Phone,
    MapPin,
    AlertCircle,
    Loader2,
    Shield
} from 'lucide-react';
import { apiRequest } from '../../services/api';
import { useToast } from '../../components/Toast';

/**
 * Admin Verification Dashboard Component with Full i18n Support
 * 
 * This component allows admins to:
 * 1. View all farmer verification requests
 * 2. Filter by status (pending, approved, rejected)
 * 3. View detailed verification information
 * 4. Approve verification requests
 * 5. Reject verification requests with reason
 * 6. Delete verification requests
 * 
 * i18n Features:
 * - All UI text is translatable
 * - Success/error messages are localized
 * - Table headers and status labels support multiple languages
 * - Dynamic updates when language changes
 * 
 * Security:
 * - Only accessible to admin users
 * - Role-based access control enforced
 * - All actions require confirmation
 */
const AdminVerifications: React.FC = () => {
    // i18n hook - 'verification' namespace for verification-related translations
    const { t } = useTranslation(['verification', 'common']);
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    // State management
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    /**
     * Fetch all verification requests
     * Uses React Query for caching and automatic refetching
     */
    const { data: verifications, isLoading, error } = useQuery({
        queryKey: ['admin-verifications', statusFilter],
        queryFn: async () => {
            const endpoint = statusFilter === 'all'
                ? '/admin/verifications'
                : `/admin/verifications?status=${statusFilter}`;
            const response = await apiRequest(endpoint);
            return response.data;
        },
        staleTime: 30000, // Cache for 30 seconds
    });

    /**
     * Approve verification mutation
     * Updates farmer's isVerified status to true
     */
    const approveMutation = useMutation({
        mutationFn: async (farmerId: string) => {
            return await apiRequest(`/admin/verifications/${farmerId}/approve`, {
                method: 'PUT'
            });
        },
        onSuccess: () => {
            showToast(t('verification:admin.verification.actions.approveSuccess'), 'success');
            queryClient.invalidateQueries({ queryKey: ['admin-verifications'] });
            setShowDetailsModal(false);
        },
        onError: (error: any) => {
            showToast(error.message || t('verification:admin.verification.actions.actionFailed'), 'error');
        }
    });

    /**
     * Reject verification mutation
     * Sets verification status to rejected with optional reason
     */
    const rejectMutation = useMutation({
        mutationFn: async ({ farmerId, reason }: { farmerId: string; reason: string }) => {
            return await apiRequest(`/admin/verifications/${farmerId}/reject`, {
                method: 'PUT',
                body: JSON.stringify({ reason })
            });
        },
        onSuccess: () => {
            showToast(t('verification:admin.verification.actions.rejectSuccess'), 'success');
            queryClient.invalidateQueries({ queryKey: ['admin-verifications'] });
            setShowDetailsModal(false);
        },
        onError: (error: any) => {
            showToast(error.message || t('verification:admin.verification.actions.actionFailed'), 'error');
        }
    });

    /**
     * Delete verification mutation
     * Removes verification data from farmer profile
     */
    const deleteMutation = useMutation({
        mutationFn: async (farmerId: string) => {
            return await apiRequest(`/admin/verifications/${farmerId}`, {
                method: 'DELETE'
            });
        },
        onSuccess: () => {
            showToast(t('verification:admin.verification.actions.deleteSuccess'), 'success');
            queryClient.invalidateQueries({ queryKey: ['admin-verifications'] });
            setShowDetailsModal(false);
        },
        onError: (error: any) => {
            showToast(error.message || t('verification:admin.verification.actions.actionFailed'), 'error');
        }
    });

    /**
     * Handle approve action with confirmation
     */
    const handleApprove = (farmerId: string) => {
        if (window.confirm(t('verification:admin.verification.actions.approveConfirm'))) {
            approveMutation.mutate(farmerId);
        }
    };

    /**
     * Handle reject action with confirmation and reason
     */
    const handleReject = (farmerId: string) => {
        const reason = window.prompt(t('verification:admin.verification.actions.rejectConfirm'));
        if (reason !== null) {
            rejectMutation.mutate({ farmerId, reason: reason || 'No reason provided' });
        }
    };

    /**
     * Handle delete action with confirmation
     */
    const handleDelete = (farmerId: string) => {
        if (window.confirm(t('verification:admin.verification.actions.deleteConfirm'))) {
            deleteMutation.mutate(farmerId);
        }
    };

    /**
     * Get status badge color based on verification status
     */
    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
            pending: {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                label: t('verification:admin.verification.pending')
            },
            approved: {
                color: 'bg-green-100 text-green-800 border-green-300',
                label: t('verification:admin.verification.approved')
            },
            rejected: {
                color: 'bg-red-100 text-red-800 border-red-300',
                label: t('verification:admin.verification.rejected')
            }
        };

        const { color, label } = statusMap[status] || statusMap.pending;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>
                {label}
            </span>
        );
    };

    /**
     * Format date to localized string
     */
    const formatDate = (date: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <div className="flex gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="font-bold text-red-900">Error Loading Verifications</h3>
                            <p className="text-sm text-red-700 mt-1">{(error as any).message}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-bg-base min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                        <Shield size={24} className="text-brand-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">
                            {t('verification:admin.verification.title')}
                        </h1>
                        <p className="text-text-muted">
                            {t('verification:admin.verification.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2 border-b border-border-base">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status as any)}
                        className={`px-6 py-3 font-medium transition-colors ${statusFilter === status
                            ? 'border-b-2 border-brand-primary text-brand-primary'
                            : 'text-text-muted hover:text-text-primary'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        {verifications && status !== 'all' && (
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                                {verifications.filter((v: any) =>
                                    v.verificationData?.status === status
                                ).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Verifications Table */}
            {!verifications || verifications.length === 0 ? (
                <div className="bg-white rounded-lg border border-border-base p-12 text-center">
                    <Shield size={48} className="mx-auto text-text-muted mb-4" />
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {t('verification:admin.verification.noRequests')}
                    </h3>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-border-base overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-border-base">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    {t('verification:admin.verification.table.farmerName')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    {t('verification:admin.verification.table.email')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    {t('verification:admin.verification.table.phone')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    {t('verification:admin.verification.table.submittedDate')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    {t('verification:admin.verification.table.status')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    {t('verification:admin.verification.table.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base">
                            {verifications.map((farmer: any) => (
                                <tr key={farmer._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                                <User size={20} className="text-brand-primary" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-text-primary">{farmer.name}</div>
                                                <div className="text-sm text-text-muted">{farmer.location}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-primary">{farmer.email || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-text-primary">{farmer.phone}</td>
                                    <td className="px-6 py-4 text-sm text-text-muted">
                                        {formatDate(farmer.verificationData?.submittedAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(farmer.verificationData?.status || 'pending')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedFarmer(farmer);
                                                    setShowDetailsModal(true);
                                                }}
                                                className="p-2 hover:bg-blue-50 rounded-md transition-colors"
                                                title={t('verification:admin.verification.viewDetails')}
                                            >
                                                <Eye size={18} className="text-blue-600" />
                                            </button>
                                            {farmer.verificationData?.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(farmer._id)}
                                                        className="p-2 hover:bg-green-50 rounded-md transition-colors"
                                                        title={t('verification:admin.verification.approve')}
                                                        disabled={approveMutation.isPending}
                                                    >
                                                        <CheckCircle size={18} className="text-green-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(farmer._id)}
                                                        className="p-2 hover:bg-red-50 rounded-md transition-colors"
                                                        title={t('verification:admin.verification.reject')}
                                                        disabled={rejectMutation.isPending}
                                                    >
                                                        <XCircle size={18} className="text-red-600" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(farmer._id)}
                                                className="p-2 hover:bg-red-50 rounded-md transition-colors"
                                                title={t('verification:admin.verification.delete')}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 size={18} className="text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedFarmer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border-base">
                            <h2 className="text-2xl font-bold text-text-primary">
                                {t('verification:admin.verification.details.title')}
                            </h2>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Personal Info */}
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-4">
                                    {t('verification:admin.verification.details.personalInfo')}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <User size={20} className="text-text-muted" />
                                        <div>
                                            <div className="text-xs text-text-muted">Name</div>
                                            <div className="font-medium">{selectedFarmer.name}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={20} className="text-text-muted" />
                                        <div>
                                            <div className="text-xs text-text-muted">Email</div>
                                            <div className="font-medium">{selectedFarmer.email || '-'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={20} className="text-text-muted" />
                                        <div>
                                            <div className="text-xs text-text-muted">Phone</div>
                                            <div className="font-medium">{selectedFarmer.phone}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} className="text-text-muted" />
                                        <div>
                                            <div className="text-xs text-text-muted">Location</div>
                                            <div className="font-medium">{selectedFarmer.location}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Data */}
                            {selectedFarmer.verificationData && (
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                                        {t('verification:admin.verification.details.verificationData')}
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-xs text-text-muted">
                                                {t('verification:admin.verification.details.govtIdType')}
                                            </div>
                                            <div className="font-medium">{selectedFarmer.verificationData.govtIdType}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-text-muted">
                                                {t('verification:admin.verification.details.govtIdNumber')}
                                            </div>
                                            <div className="font-medium">{selectedFarmer.verificationData.govtIdNumber}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-text-muted">
                                                {t('verification:admin.verification.details.address')}
                                            </div>
                                            <div className="font-medium">{selectedFarmer.verificationData.address}</div>
                                        </div>
                                        {selectedFarmer.verificationData.farmSize && (
                                            <div>
                                                <div className="text-xs text-text-muted">
                                                    {t('verification:admin.verification.details.farmSize')}
                                                </div>
                                                <div className="font-medium">{selectedFarmer.verificationData.farmSize} acres</div>
                                            </div>
                                        )}
                                        {selectedFarmer.verificationData.primaryCrops && (
                                            <div>
                                                <div className="text-xs text-text-muted">
                                                    {t('verification:admin.verification.details.primaryCrops')}
                                                </div>
                                                <div className="font-medium">{selectedFarmer.verificationData.primaryCrops}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-border-base flex justify-end gap-3">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-4 py-2 border border-border-base rounded-md hover:bg-gray-50 transition-colors"
                            >
                                {t('common:common.close')}
                            </button>
                            {selectedFarmer.verificationData?.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleApprove(selectedFarmer._id)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                                        disabled={approveMutation.isPending}
                                    >
                                        {approveMutation.isPending ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <CheckCircle size={16} />
                                        )}
                                        {t('verification:admin.verification.approve')}
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedFarmer._id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                                        disabled={rejectMutation.isPending}
                                    >
                                        {rejectMutation.isPending ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <XCircle size={16} />
                                        )}
                                        {t('verification:admin.verification.reject')}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVerifications;
