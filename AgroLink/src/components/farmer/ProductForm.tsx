
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Sparkles, IndianRupee, Save } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { Button } from '../ui/button';
import { CATEGORIES } from '../../constants';
import type { Product } from '../../types';
import { useToast } from '../Toast';
import { useNavigate } from 'react-router-dom';

interface ProductFormProps {
    product?: Product | null;
    isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, isEdit = false }) => {
    const { t } = useTranslation(['dashboard', 'common', 'products']);
    const { createProduct, updateProduct, isCreating, isUpdating } = useProducts();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        category: CATEGORIES[0],
        price: '',
        unit: 'per 20kg',
        description: '',
        image: null as File | null,
        existingImageUrl: '',
        isNegotiable: true
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price.toString(),
                unit: product.unit,
                description: product.description || '',
                image: null,
                existingImageUrl: product.image,
                isNegotiable: product.isNegotiable || false
            });
        }
    }, [product]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price || (!formData.image && !formData.existingImageUrl)) {
            showToast(t('dashboard.form.validation'), 'error');
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('category', formData.category);
        data.append('price', formData.price);
        data.append('unit', formData.unit);
        data.append('description', formData.description);
        data.append('isNegotiable', String(formData.isNegotiable));
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (isEdit && product) {
                await updateProduct({ id: product._id || '', data: data });
            } else {
                await createProduct(data);
            }
            navigate('/farmer/dashboard');
        } catch (error) {
            // Handled in hook
        }
    };

    const [aiAdvice, setAiAdvice] = useState<string>('');
    const [loadingAi, setLoadingAi] = useState(false);

    const fetchAiAdvice = async () => {
        if (!formData.name) return;
        setLoadingAi(true);
        setTimeout(() => {
            setAiAdvice(t('dashboard.aiPriceSuggestion'));
            setLoadingAi(false);
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
            {/* Form Sections */}
            <div className="bg-bg-surface border border-border-base rounded-md divide-y divide-border-base shadow-sm">
                {/* Photo Section */}
                <div className="p-6 space-y-4">
                    <label className="text-sm font-semibold text-text-primary">
                        {t('dashboard.form.photo')}
                    </label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-md h-64 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer overflow-hidden relative group ${formData.image || formData.existingImageUrl ? 'border-brand-primary/50 bg-brand-primary/5' : 'border-border-base text-text-muted hover:border-brand-primary/20 hover:bg-bg-muted/50'}`}
                    >
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

                        {(formData.image || formData.existingImageUrl) ? (
                            <div className="w-full h-full relative">
                                <img
                                    src={formData.image ? URL.createObjectURL(formData.image) : formData.existingImageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-bold uppercase tracking-widest">{t('dashboard.clickToChange')}</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Camera size={32} className="text-text-muted" />
                                <p className="text-sm font-medium text-text-muted">{t('dashboard.uploadImage')}</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-primary">{t('dashboard.form.cropName')}</label>
                            <input
                                type="text"
                                placeholder={t('dashboard.form.placeholderName')}
                                className="w-full px-4 py-2 bg-bg-surface border border-border-base rounded-md focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm font-medium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-primary">{t('dashboard.form.category')}</label>
                            <select
                                className="w-full px-4 py-2 bg-bg-surface border border-border-base rounded-md focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm font-medium cursor-pointer"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{t('common:categories.items.' + cat)}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-text-primary">{t('dashboard.form.price')}</label>
                            <button
                                type="button"
                                onClick={fetchAiAdvice}
                                disabled={loadingAi}
                                className="text-xs font-semibold text-brand-primary flex items-center gap-1.5 hover:underline"
                            >
                                <Sparkles size={14} /> {t('dashboard.form.aiAdvice')}
                            </button>
                        </div>

                        {aiAdvice && (
                            <div className="p-4 bg-status-warning/5 border border-status-warning/10 rounded-md text-sm text-status-warning-dark">
                                {aiAdvice}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                                    <IndianRupee size={16} />
                                </span>
                                <input
                                    type="number"
                                    placeholder="1200"
                                    className="w-full pl-8 pr-4 py-2 bg-bg-surface border border-border-base rounded-md focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm font-medium"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <select
                                className="px-4 py-2 bg-bg-surface border border-border-base rounded-md outline-none text-sm font-medium cursor-pointer"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            >
                                <option value="per 20kg">{t('dashboard.form.units.per20kg')}</option>
                                <option value="per kg">{t('dashboard.form.units.perKg')}</option>
                                <option value="per piece">{t('dashboard.form.units.perPiece')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary">{t('dashboard.form.description')}</label>
                        <textarea
                            className="w-full px-4 py-2 bg-bg-surface border border-border-base rounded-md focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm font-medium min-h-[120px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder={t('dashboard.form.descriptionPlaceholder')}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isNegotiable"
                            checked={formData.isNegotiable}
                            onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                            className="h-4 w-4 rounded border-border-base text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                        <label htmlFor="isNegotiable" className="text-sm font-medium text-text-secondary cursor-pointer">
                            {t('dashboard.form.negotiable')}
                        </label>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-border-base pt-6">
                <Button
                    type="button"
                    variant="ghost"
                    className="text-text-muted font-semibold"
                    onClick={() => navigate('/farmer/dashboard')}
                >
                    {t('dashboard.cancel')}
                </Button>
                <Button
                    type="submit"
                    isLoading={isCreating || isUpdating}
                    className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold px-8 shadow-sm"
                >
                    <Save size={18} className="mr-2" />
                    {isEdit ? t('dashboard.updateListing') : t('dashboard.form.submit')}
                </Button>
            </div>
        </form>
    );
};

