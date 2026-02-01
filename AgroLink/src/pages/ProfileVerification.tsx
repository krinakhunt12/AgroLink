import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import {
    ShieldCheck,
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { usersAPI } from '../services/api';

/**
 * ProfileVerification Component with Full i18n Support
 * 
 * Dedicated page for farmers to complete profile verification.
 * This page is accessible to logged-in but unverified farmers.
 * 
 * Verification Requirements:
 * 1. Government ID (Aadhaar/PAN/Voter ID/Driving License)
 * 2. Land ownership proof
 * 3. Address verification
 * 4. Farm details (optional)
 * 
 * i18n Features:
 * - All UI text is translatable (English, Gujarati, Hindi)
 * - Error messages are localized
 * - Form labels and placeholders support multiple languages
 * - Language selection persists across sessions
 * - Dynamic updates when language changes
 */
const ProfileVerification: React.FC = () => {
    // i18n hook - 'verification' namespace contains all verification-related translations
    const { t } = useTranslation(['verification', 'common']);
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();

    // Form state management
    const [formData, setFormData] = useState({
        govtIdType: 'aadhaar',
        govtIdNumber: '',
        landOwnershipProof: null as File | null,
        govtIdProof: null as File | null,
        address: '',
        farmSize: '',
        primaryCrops: ''
    });

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    /**
     * Handle file upload for verification documents
     * Validates file size and type before accepting
     */
    const handleFileChange = (field: 'landOwnershipProof' | 'govtIdProof') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError(t('verification:verification.errors.fileTooLarge'));
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                setError(t('verification:verification.errors.invalidFileType'));
                return;
            }

            setFormData(prev => ({ ...prev, [field]: file }));
            setError('');
        }
    };

    /**
     * Handle form submission for verification
     * Validates all required fields and submits to backend
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setUploading(true);

        try {
            // Validate required fields with localized error messages
            if (!formData.govtIdNumber) {
                throw new Error(t('verification:verification.errors.idNumberRequired'));
            }
            if (!formData.govtIdProof) {
                throw new Error(t('verification:verification.errors.idProofRequired'));
            }
            if (!formData.landOwnershipProof) {
                throw new Error(t('verification:verification.errors.landProofRequired'));
            }
            if (!formData.address) {
                throw new Error(t('verification:verification.errors.addressRequired'));
            }

            // Create FormData for file upload
            const data = new FormData();
            data.append('govtIdType', formData.govtIdType);
            data.append('govtIdNumber', formData.govtIdNumber);
            data.append('address', formData.address);
            data.append('farmSize', formData.farmSize);
            data.append('primaryCrops', formData.primaryCrops);

            if (formData.govtIdProof) {
                data.append('govtIdProof', formData.govtIdProof);
            }
            if (formData.landOwnershipProof) {
                data.append('landOwnershipProof', formData.landOwnershipProof);
            }

            // Submit verification request to backend
            await usersAPI.submitVerification(data);

            // Refresh user data to get updated verification status
            await refreshUser();

            setSuccess(true);

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/farmer/dashboard');
            }, 2000);

        } catch (err: any) {
            setError(err.message || t('verification:verification.errors.submissionFailed'));
        } finally {
            setUploading(false);
        }
    };

    // If already verified, redirect to dashboard
    if (user?.isVerified) {
        navigate('/farmer/dashboard');
        return null;
    }

    return (
        <div className="min-h-screen bg-bg-base py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/farmer/dashboard')}
                        className="flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-[10px] mb-6 cursor-pointer hover:underline"
                    >
                        <ArrowLeft size={16} /> {t('common:common.back')}
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center">
                            <ShieldCheck size={32} className="text-brand-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">
                                {t('verification:verification.title')}
                            </h1>
                            <p className="text-text-muted mt-1">
                                {t('verification:verification.subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                        <div className="flex gap-3">
                            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900">
                                <p className="font-semibold mb-1">{t('verification:verification.whyRequired')}</p>
                                <p>{t('verification:verification.whyRequiredText')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={24} className="text-green-600" />
                            <div>
                                <h3 className="font-bold text-green-900">
                                    {t('verification:verification.successTitle')}
                                </h3>
                                <p className="text-sm text-green-700 mt-1">
                                    {t('verification:verification.successMessage')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex gap-3">
                            <AlertCircle size={20} className="text-red-600" />
                            <p className="text-sm text-red-900">{error}</p>
                        </div>
                    </div>
                )}

                {/* Verification Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-border-base p-8 space-y-6">
                    {/* Government ID Section */}
                    <div>
                        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <FileText size={20} />
                            {t('verification:verification.governmentId.title')}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    {t('verification:verification.governmentId.idType')} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.govtIdType}
                                    onChange={(e) => setFormData(prev => ({ ...prev, govtIdType: e.target.value }))}
                                    className="w-full px-4 py-2 border border-border-base rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    required
                                >
                                    <option value="aadhaar">{t('verification:verification.governmentId.types.aadhaar')}</option>
                                    <option value="pan">{t('verification:verification.governmentId.types.pan')}</option>
                                    <option value="voter">{t('verification:verification.governmentId.types.voter')}</option>
                                    <option value="driving">{t('verification:verification.governmentId.types.driving')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    {t('verification:verification.governmentId.idNumber')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.govtIdNumber}
                                    onChange={(e) => setFormData(prev => ({ ...prev, govtIdNumber: e.target.value }))}
                                    placeholder={t('verification:verification.governmentId.idNumberPlaceholder')}
                                    className="w-full px-4 py-2 border border-border-base rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    {t('verification:verification.governmentId.uploadProof')} <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-border-base rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                                    <Upload size={32} className="mx-auto text-text-muted mb-2" />
                                    <p className="text-sm text-text-muted mb-2">
                                        {formData.govtIdProof ? formData.govtIdProof.name : t('verification:verification.governmentId.uploadText')}
                                    </p>
                                    <p className="text-xs text-text-muted">{t('verification:verification.governmentId.fileFormat')}</p>
                                    <input
                                        type="file"
                                        onChange={handleFileChange('govtIdProof')}
                                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                                        className="hidden"
                                        id="govtIdProof"
                                        required
                                    />
                                    <label
                                        htmlFor="govtIdProof"
                                        className="inline-block mt-3 px-4 py-2 bg-brand-primary text-white rounded-md cursor-pointer hover:bg-brand-primary/90 transition-colors text-sm font-medium"
                                    >
                                        {t('verification:verification.governmentId.chooseFile')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Land Ownership Section */}
                    <div>
                        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <FileText size={20} />
                            {t('verification:verification.landOwnership.title')}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    {t('verification:verification.landOwnership.uploadProof')} <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-border-base rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                                    <Upload size={32} className="mx-auto text-text-muted mb-2" />
                                    <p className="text-sm text-text-muted mb-2">
                                        {formData.landOwnershipProof ? formData.landOwnershipProof.name : t('verification:verification.landOwnership.uploadText')}
                                    </p>
                                    <p className="text-xs text-text-muted">{t('verification:verification.governmentId.fileFormat')}</p>
                                    <input
                                        type="file"
                                        onChange={handleFileChange('landOwnershipProof')}
                                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                                        className="hidden"
                                        id="landOwnershipProof"
                                        required
                                    />
                                    <label
                                        htmlFor="landOwnershipProof"
                                        className="inline-block mt-3 px-4 py-2 bg-brand-primary text-white rounded-md cursor-pointer hover:bg-brand-primary/90 transition-colors text-sm font-medium"
                                    >
                                        {t('verification:verification.governmentId.chooseFile')}
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    {t('verification:verification.landOwnership.farmSize')}
                                </label>
                                <input
                                    type="number"
                                    value={formData.farmSize}
                                    onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
                                    placeholder={t('verification:verification.landOwnership.farmSizePlaceholder')}
                                    className="w-full px-4 py-2 border border-border-base rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    step="0.1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    {t('verification:verification.landOwnership.primaryCrops')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.primaryCrops}
                                    onChange={(e) => setFormData(prev => ({ ...prev, primaryCrops: e.target.value }))}
                                    placeholder={t('verification:verification.landOwnership.primaryCropsPlaceholder')}
                                    className="w-full px-4 py-2 border border-border-base rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            {t('verification:verification.address.title')} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            placeholder={t('verification:verification.address.placeholder')}
                            rows={3}
                            className="w-full px-4 py-2 border border-border-base rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={uploading || success}
                            className="w-full bg-brand-primary text-white py-3 rounded-md font-bold uppercase tracking-widest text-sm hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    {t('verification:verification.buttons.submitting')}
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 size={20} />
                                    {t('verification:verification.buttons.submitted')}
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={20} />
                                    {t('verification:verification.buttons.submit')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileVerification;
