
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProductForm } from '../components/farmer/ProductForm';
import { ArrowLeft, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddProduct: React.FC = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const navigate = useNavigate();

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

                <div className="bg-white border border-border-base rounded-lg p-8 shadow-sm">
                    <ProductForm />
                </div>
            </div>
        </div>
    );
};


export default AddProduct;
