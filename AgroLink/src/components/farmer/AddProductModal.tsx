
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Sparkles, IndianRupee } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { CATEGORIES } from '../../constants';
import type { Product } from '../../types';
import { useToast } from '../Toast';
// import { generateGeminiAdvice } from '../../services/ai'; // Assuming this exists or will be moved

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit?: Product | null; // If editing
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, productToEdit }) => {
    const { t } = useTranslation(['dashboard', 'common', 'products']);
    const { createProduct, updateProduct, isCreating, isUpdating } = useProducts();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        category: CATEGORIES[0],
        price: '',
        unit: 'per 20kg',
        description: '',
        image: null as File | null,
        existingImageUrl: '', // For editing display
        isNegotiable: true
    });

    // Reset or Populate form on open
    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                setFormData({
                    name: productToEdit.name,
                    category: productToEdit.category,
                    price: productToEdit.price.toString(),
                    unit: productToEdit.unit,
                    description: productToEdit.description || '',
                    image: null,
                    existingImageUrl: productToEdit.image,
                    isNegotiable: productToEdit.isNegotiable || false
                });
            } else {
                setFormData({
                    name: '',
                    category: CATEGORIES[0],
                    price: '',
                    unit: 'per 20kg',
                    description: '',
                    image: null,
                    existingImageUrl: '',
                    isNegotiable: true
                });
            }
        }
    }, [isOpen, productToEdit]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || (!formData.image && !formData.existingImageUrl)) {
            showToast(t('errors:login.fillAll'), 'error');
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
            if (productToEdit) {
                await updateProduct({ id: productToEdit._id || '', data: data });
            } else {
                await createProduct(data);
            }
            onClose();
        } catch (error) {
            // Error handling is inside the hook mutation callbacks
        }
    };

    const [aiAdvice, setAiAdvice] = useState<string>('');
    const [loadingAi, setLoadingAi] = useState(false);

    const fetchAiAdvice = async () => {
        if (!formData.name) return;
        setLoadingAi(true);
        setTimeout(() => {
            setAiAdvice("Based on current market trends, this price seems competitive."); // Placeholder
            setLoadingAi(false);
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 flex flex-col rounded-lg">
                <DialogHeader className="px-6 py-4 border-b border-border-base bg-white shrink-0">
                    <DialogTitle className="text-xl font-bold text-text-primary tracking-tight">
                        {productToEdit ? t('dashboard.edit') : t('dashboard.addNew')}
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-6 py-6 space-y-8">
                    {/* Image Upload */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border border-dashed rounded-lg h-48 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer overflow-hidden relative ${formData.image || formData.existingImageUrl ? 'border-brand-primary bg-brand-primary/5' : 'border-border-base bg-bg-muted/30 hover:bg-bg-muted'}`}
                    >
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

                        {(formData.image || formData.existingImageUrl) ? (
                            <div className="text-center w-full h-full relative group">
                                <img
                                    src={formData.image ? URL.createObjectURL(formData.image) : formData.existingImageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white font-bold text-xs uppercase tracking-widest">Click to change</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white p-3 rounded-full border border-border-base shadow-sm">
                                    <Camera size={24} className="text-text-muted" />
                                </div>
                                <p className="font-bold text-[10px] text-text-muted uppercase tracking-widest">{t('dashboard.form.photo')}</p>
                            </>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">{t('dashboard.form.cropName')}</label>
                            <input
                                type="text"
                                placeholder={t('dashboard.form.placeholderName')}
                                className="w-full bg-bg-muted/30 border border-border-base rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-medium text-sm"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">{t('dashboard.form.category')}</label>
                            <select
                                className="w-full bg-bg-muted/30 border border-border-base rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-medium text-sm cursor-pointer"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-bg-muted/30 p-4 rounded-md border border-border-base">
                            <div className="space-y-1">
                                <p className="font-bold text-sm text-text-primary">{t('dashboard.form.aiAdvice')}</p>
                                <p className="text-xs text-text-muted">Get smart pricing insights</p>
                            </div>
                            <Button variant="secondary" size="sm" onClick={fetchAiAdvice} isLoading={loadingAi} className="h-8 cursor-pointer shadow-sm">
                                <Sparkles size={12} className="mr-1.5" /> Suggest
                            </Button>
                        </div>

                        {aiAdvice && (
                            <div className="bg-brand-primary/5 p-4 rounded-md border border-brand-primary/10 text-xs text-brand-primary">
                                <p className="whitespace-pre-wrap leading-relaxed font-medium">{aiAdvice}</p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-full bg-white border border-border-base rounded-md py-3 pl-10 pr-4 font-bold text-lg focus:ring-2 ring-brand-primary/10 transition-all outline-none"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <select
                                className="bg-bg-muted/50 border border-border-base rounded-md px-4 font-bold focus:ring-2 ring-brand-primary/10 transition-all cursor-pointer text-sm"
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
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">{t('dashboard.form.description')}</label>
                        <textarea
                            className="w-full bg-bg-muted/30 border border-border-base rounded-md px-4 py-3 focus:outline-none focus:ring-2 ring-brand-primary/10 focus:border-brand-primary transition-all font-medium text-sm min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder={t('dashboard.form.descriptionPlaceholder')}
                        />
                    </div>

                    <div className="flex items-center gap-4 bg-bg-muted/20 p-4 rounded-md border border-border-base">
                        <input
                            type="checkbox"
                            checked={formData.isNegotiable}
                            onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                            className="w-5 h-5 rounded border-border-base text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                        <div>
                            <p className="font-bold text-sm text-text-primary uppercase tracking-wide">{t('dashboard.form.negotiable')}</p>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{t('dashboard.form.negotiableDesc')}</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-white border-t border-border-base shrink-0 flex justify-end gap-3 rounded-b-lg">
                    <Button variant="outline" onClick={onClose} disabled={isCreating || isUpdating} className="cursor-pointer">Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit} isLoading={isCreating || isUpdating} className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold cursor-pointer">
                        {productToEdit ? 'Save Changes' : t('dashboard.form.submit')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
