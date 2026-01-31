
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductForm } from '../components/farmer/ProductForm';
import { ArrowLeft, Edit3, Loader2, ShieldAlert } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useAuth } from '../hooks/useAuth';

const EditProduct: React.FC = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: product, isLoading } = useProduct(id || '');
    const { user } = useAuth();

    const isVerified = user?.isVerified;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-brand-primary mx-auto mb-4" />
                    <p className="font-black text-text-muted uppercase tracking-widest text-xs">Loading Product Details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-stone-50 min-h-screen pt-24 pb-40 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/farmer/dashboard')}
                            className="flex items-center gap-2 text-brand-primary font-black uppercase tracking-widest text-[10px] mb-4 hover:translate-x-[-4px] transition-transform"
                        >
                            <ArrowLeft size={16} /> {t('common:nav.back')}
                        </button>
                        <h1 className="text-5xl font-black text-text-primary tracking-tight leading-tight">
                            {t('dashboard.edit')}
                        </h1>
                        <p className="text-text-secondary font-bold text-xl mt-2">
                            Update your product information for better visibility.
                        </p>
                    </div>
                    <div className="bg-brand-primary/10 p-6 rounded-[32px] hidden md:block">
                        <Edit3 size={48} className="text-brand-primary" />
                    </div>
                </header>

                {!isVerified ? (
                    <div className="bg-status-warning/5 border-2 border-dashed border-status-warning/30 rounded-lg p-12 text-center space-y-6">
                        <div className="mx-auto w-20 h-20 bg-status-warning/10 rounded-full flex items-center justify-center text-status-warning">
                            <ShieldAlert size={40} />
                        </div>
                        <div className="max-w-md mx-auto space-y-2">
                            <h2 className="text-xl font-black uppercase text-status-warning tracking-tight">Verification Required</h2>
                            <p className="text-sm text-text-muted leading-relaxed">
                                To protect your listings and the platform, only <strong>Verified Farmers</strong> can modify crop data.
                                Please ensure your verification is complete in settings.
                            </p>
                        </div>
                    </div>
                ) : (
                    <ProductForm product={product} isEdit={true} />
                )}
            </div>
        </div>
    );
};

export default EditProduct;
