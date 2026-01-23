
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
        unit: 'પ્રતિ 20 કિલો',
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
                    unit: 'પ્રતિ 20 કિલો',
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
            if (productToEdit) {
                await updateProduct({ id: productToEdit._id || '', data: data });
            } else {
                await createProduct(data);
            }
            onClose();
        } catch (error) {
            // Error handling is inside the hook mutation callbacks usually, 
            // but we can add UI specifics here if needed.
        }
    };

    // AI Advice Logic (Moved internally or kept simple)
    const [aiAdvice, setAiAdvice] = useState<string>('');
    const [loadingAi, setLoadingAi] = useState(false);

    // Placeholder for AI Fetch if not imported from hook
    const fetchAiAdvice = async () => {
        if (!formData.name) return;
        setLoadingAi(true);
        // Simulate or call AI service
        setTimeout(() => {
            setAiAdvice("Based on current market trends, this price seems competitive."); // Dump placeholder
            setLoadingAi(false);
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 gap-0 flex flex-col">
                <DialogHeader className="px-6 py-4 border-b border-border-subtle sticky top-0 bg-white z-10 shrink-0">
                    <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
                        {productToEdit ? t('dashboard.edit') : t('dashboard.addNew')}
                    </DialogTitle>
                    {/* Close button is built-in to DialogContent but we can custom style headers */}
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-6 py-6">
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-4 border-dashed rounded-[32px] h-52 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer overflow-hidden relative ${formData.image || formData.existingImageUrl ? 'border-green-500 bg-green-50' : 'border-gray-100 text-gray-400 hover:border-green-200 hover:bg-green-50'}`}
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
                                        <p className="text-white font-bold">બદલવા માટે ક્લિક કરો</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gray-100 p-4 rounded-full group-hover:bg-green-100 group-hover:text-green-700 transition-colors">
                                        <Camera size={32} />
                                    </div>
                                    <p className="font-black text-sm uppercase tracking-widest">{t('dashboard.form.photo')}</p>
                                </>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('dashboard.form.cropName')}</label>
                                <input
                                    type="text"
                                    placeholder={t('dashboard.form.placeholderName')}
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 focus:ring-4 ring-green-500/10 focus:border-green-500 focus:bg-white transition-all font-bold"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('dashboard.form.category')}</label>
                                <select
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 focus:ring-4 ring-green-500/10 focus:border-green-500 focus:bg-white transition-all font-bold"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('dashboard.form.price')}</label>
                                <Button variant="secondary" size="sm" onClick={fetchAiAdvice} isLoading={loadingAi} className="h-8">
                                    <Sparkles size={12} className="mr-1.5" /> {t('dashboard.form.aiAdvice')}
                                </Button>
                            </div>

                            {aiAdvice && (
                                <div className="bg-yellow-50/50 p-6 rounded-3xl border border-yellow-100 text-sm text-yellow-900 animate-in fade-in duration-500 shadow-sm">
                                    <p className="whitespace-pre-wrap leading-relaxed font-medium">{aiAdvice}</p>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <IndianRupee className="absolute left-5 top-4.5 text-gray-300" size={18} />
                                    <input
                                        type="number"
                                        placeholder="1200"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-5 py-4 focus:ring-4 ring-green-500/10 focus:border-green-500 focus:bg-white transition-all font-bold"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <select
                                    className="bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-green-500 transition-all cursor-pointer"
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                >
                                    <option value="પ્રતિ 20 કિલો">{t('dashboard.form.units.per20kg')}</option>
                                    <option value="પ્રતિ કિલો">{t('dashboard.form.units.perKg')}</option>
                                    <option value="પ્રતિ નંગ">{t('dashboard.form.units.perPiece')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('dashboard.form.description')}</label>
                            <textarea
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 focus:ring-4 ring-green-500/10 focus:border-green-500 focus:bg-white transition-all font-bold min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder={t('dashboard.form.descriptionPlaceholder')}
                            />
                        </div>

                        <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100 transition-colors hover:bg-gray-100/50">
                            <input
                                type="checkbox"
                                checked={formData.isNegotiable}
                                onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                                className="w-6 h-6 rounded-lg text-green-700 focus:ring-green-500 border-gray-300 transition-all cursor-pointer"
                            />
                            <div>
                                <p className="font-black text-gray-900 tracking-tight">{t('dashboard.form.negotiable')}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{t('dashboard.form.negotiableDesc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 sticky bottom-0 z-10 shrink-0 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isCreating || isUpdating}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit} isLoading={isCreating || isUpdating}>
                        {productToEdit ? 'Update Product' : t('dashboard.form.submit')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
