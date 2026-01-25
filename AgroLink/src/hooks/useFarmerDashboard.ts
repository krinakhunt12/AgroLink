
import { useState, useCallback } from 'react';
import { getAgriculturalAdvice } from '../services/geminiService';
import AppLogger from '../utils/logger';
import { useToast } from '../components/Toast';
import { authAPI } from '../services/api';
import {
  useProductsByFarmer,
  useCreateProduct,
  useDeleteProduct,
  useProductBids,
  useUpdateBidStatus
} from './api';

export const useFarmerDashboard = () => {
  const { showToast } = useToast();
  const user = authAPI.getCurrentUser();
  const userId = user?.id || user?._id;

  // Use TanStack Query to fetch farmer's products
  const { data: listings = [], isLoading: loadingProducts } = useProductsByFarmer(userId || '');

  // Mutations with automatic invalidation
  const createProductMutation = useCreateProduct();
  const deleteProductMutation = useDeleteProduct();
  const updateBidStatusMutation = useUpdateBidStatus();

  const [showAddForm, setShowAddForm] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('');
  const [aiSources, setAiSources] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'અનાજ',
    price: '',
    unit: '20 કિલો',
    isNegotiable: true,
    description: '',
    image: null as File | null
  });

  // Fetch bids for all farmer's products
  // Note: This is a simplified approach. For better performance, 
  // you might want to create a dedicated backend endpoint
  const allBids = listings.flatMap(product => {
    const { data: productBids = [] } = useProductBids(product._id || product.id);
    return productBids.map((bid: any) => ({
      ...bid,
      productName: product.name
    }));
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const loading = loadingProducts || createProductMutation.isPending || deleteProductMutation.isPending;

  const fetchAiAdvice = async () => {
    if (!formData.name) {
      showToast("કૃપા કરીને પહેલા પાકનું નામ લખો.", "warning");
      return;
    }

    setLoadingAi(true);
    AppLogger.info("AI", { message: "Requesting AI market advice", crop: formData.name });

    try {
      const query = `ગુજરાતમાં અત્યારે ${formData.name} ના બજાર ભાવ શું ચાલી રહ્યા છે અને મારે શું ભાવે વેચવું જોઈએ?`;
      const res = await getAgriculturalAdvice(query);
      setAiAdvice(res.text);
      setAiSources(res.sources || []);
      AppLogger.info("AI", { message: "AI advice received" });
    } catch (error) {
      AppLogger.error("AI", error);
      showToast("AI સલાહ મેળવવામાં સમસ્યા થઈ.", "error");
    } finally {
      setLoadingAi(false);
    }
  };

  const submitCrop = async () => {
    if (!formData.name || !formData.price) {
      showToast("બધી માહિતી ભરો.", "warning");
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('unit', formData.unit);
    data.append('isNegotiable', String(formData.isNegotiable));
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      // Use mutation - it will automatically invalidate and refetch
      await createProductMutation.mutateAsync(data);
      setShowAddForm(false);
      resetForm();
      // No need to manually refetch - TanStack Query handles it!
    } catch (error: any) {
      // Error handling is done in the mutation
      AppLogger.error("Product", error);
    }
  };

  const handleBidAction = async (bidId: string, status: 'accepted' | 'rejected') => {
    try {
      // Use mutation - it will automatically invalidate and refetch
      await updateBidStatusMutation.mutateAsync({ bidId, status });
      // No need to manually refetch - TanStack Query handles it!
    } catch (error: any) {
      // Error handling is done in the mutation
      AppLogger.error("Bid", error);
    }
  };

  const deleteListing = async (productId: string) => {
    if (!window.confirm("શું તમે ખરેખર આ જાહેરાત કાઢી નાખવા માંગો છો?")) return;

    try {
      // Use mutation - it will automatically invalidate and refetch
      await deleteProductMutation.mutateAsync(productId);
      // No need to manually refetch - TanStack Query handles it!
    } catch (error) {
      // Error handling is done in the mutation
      AppLogger.error("Product", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'અનાજ',
      price: '',
      unit: '20 કિલો',
      isNegotiable: true,
      description: '',
      image: null
    });
    setAiAdvice('');
    setAiSources([]);
  };

  return {
    listings,
    bids: allBids,
    loading,
    showAddForm, setShowAddForm,
    loadingAi, aiAdvice, aiSources,
    formData, setFormData,
    fetchAiAdvice,
    submitCrop,
    handleBidAction,
    deleteListing
  };
};
