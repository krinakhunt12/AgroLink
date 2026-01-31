
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProductForm } from '../components/farmer/ProductForm';
import { ArrowLeft, Sprout, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AddProduct: React.FC = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const navigate = useNavigate();
    const { user } = useAuth();

    const isVerified = user?.isVerified;

    return (
        <div className="bg-bg-base min-h-screen py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10">
                    <button
                        onClick={() => navigate('/farmer/dashboard')}
                        className="flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-[10px] mb-6 cursor-pointer hover:underline"
                    >
                        <ArrowLeft size={16} /> {t('common:common.back')}
                    </button>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-text-primary tracking-tight">
                                {t('dashboard.addNew')}
                            </h1>
                            <p className="text-text-muted text-lg max-w-xl">
                                {t('dashboard.subtitle')}
                            </p>
                        </div>
                        <div className="bg-brand-primary/10 p-4 rounded-lg hidden md:block border border-brand-primary/10">
                            <Sprout size={32} className="text-brand-primary" />
                        </div>
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
                                To ensure marketplace integrity, only <strong>Verified Farmers</strong> can create new crop listings.
                                Please complete your profile verification in settings to unlock this feature.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/farmer/profile')}
                            className="bg-status-warning text-white px-8 py-3 rounded-md font-black uppercase tracking-widest text-xs hover:bg-status-warning/90 transition-all shadow-lg shadow-status-warning/20"
                        >
                            Complete Verification
                        </button>
                    </div>
                ) : (
                    <div className="bg-white border border-border-base rounded-lg p-8 shadow-sm">
                        <ProductForm />
                    </div>
                )}
            </div>
        </div>
    );
};


export default AddProduct;
