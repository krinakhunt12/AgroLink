
import { useState, useEffect, useCallback } from 'react';
import { getAgriculturalAdvice } from '../services/geminiService';
import AppLogger from '../utils/logger';
import { useToast } from '../components/Toast';
import { productsAPI, bidsAPI, authAPI } from '../services/api';

export const useFarmerDashboard = () => {
  const { showToast } = useToast();

  const [listings, setListings] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchDashboardData = useCallback(async () => {
    const user = authAPI.getCurrentUser();
    if (!user) return;

    setLoading(true);
    try {
      const productsRes = await productsAPI.getByFarmer(user.id || user._id);
      setListings(productsRes.data);

      // Fetch bids for each product
      const allBids: any[] = [];
      for (const product of productsRes.data) {
        const bidsRes = await bidsAPI.getProductBids(product._id);
        allBids.push(...bidsRes.data.map((b: any) => ({ ...b, productName: product.name })));
      }
      setBids(allBids.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      AppLogger.error("Failed to fetch dashboard data", error);
      showToast("ડેશબોર્ડ ડેટા લોડ કરવામાં નિષ્ફળતા મળી.", 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const fetchAiAdvice = async () => {
    if (!formData.name) {
      showToast("કૃપા કરીને પહેલા પાકનું નામ લખો.", "warning");
      return;
    }

    setLoadingAi(true);
    AppLogger.info("Requesting AI market advice", { crop: formData.name });

    try {
      const query = `ગુજરાતમાં અત્યારે ${formData.name} ના બજાર ભાવ શું ચાલી રહ્યા છે અને મારે શું ભાવે વેચવું જોઈએ?`;
      const res = await getAgriculturalAdvice(query);
      setAiAdvice(res.text);
      setAiSources(res.sources || []);
      AppLogger.info("AI advice received");
    } catch (error) {
      AppLogger.error("Failed to fetch AI advice", error);
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
      setLoading(true);
      await productsAPI.create(data);
      showToast("ઉત્પાદન સફળતાપૂર્વક ઉમેરવામાં આવ્યું છે!", 'success');
      setShowAddForm(false);
      resetForm();
      fetchDashboardData();
    } catch (error: any) {
      AppLogger.error("Failed to submit crop", error);
      showToast(error.message || "ઉત્પાદન ઉમેરવામાં ભૂલ થઈ.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBidAction = async (bidId: string, status: 'accepted' | 'rejected') => {
    try {
      await bidsAPI.updateStatus(bidId, status);
      showToast(`બિડ ${status === 'accepted' ? 'સ્વીકારવામાં' : 'નકારવામાં'} આવી છે.`, 'success');
      fetchDashboardData();
    } catch (error: any) {
      showToast("એક્શન લેવામાં ભૂલ થઈ.", 'error');
    }
  };

  const deleteListing = async (productId: string) => {
    if (!window.confirm("શું તમે ખરેખર આ જાહેરાત કાઢી નાખવા માંગો છો?")) return;
    try {
      await productsAPI.delete(productId);
      showToast("જાહેરાત કાઢી નાખવામાં આવી છે.", 'success');
      fetchDashboardData();
    } catch (error) {
      showToast("જાહેરાત કાઢી નાખવામાં ભૂલ થઈ.", 'error');
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
    listings, bids, loading,
    showAddForm, setShowAddForm,
    loadingAi, aiAdvice, aiSources,
    formData, setFormData,
    fetchAiAdvice,
    submitCrop,
    handleBidAction,
    deleteListing
  };
};
