
import { useState, useMemo, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import type { Product } from '../types';
import AppLogger from '../utils/logger';
import { useToast } from '../components/Toast';
import { useTranslation } from 'react-i18next';
import { productsAPI, bidsAPI, ordersAPI } from '../services/api';

export const useMarketplace = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(10000);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [actionType, setActionType] = useState<'buy' | 'bid'>('buy');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [quantity, setQuantity] = useState(1);
  const [bidAmount, setBidAmount] = useState('');

  // Fetch products on mount and when filters change (if we want server-side filtering)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productsAPI.getAll();
        // Map _id to id if necessary
        const mappedProducts = response.data.map((p: any) => ({
          ...p,
          id: p._id || p.id
        }));
        setProducts(mappedProducts);
      } catch (error) {
        AppLogger.error("Failed to fetch products", error);
        showToast("પ્રોડક્ટ્સ લોડ કરવામાં નિષ્ફળતા મળી.", 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showToast]);

  const filteredProducts = useMemo(() => {
    AppLogger.info("Filtering products", { selectedCategory, searchQuery, sortBy });
    let result = [...products].filter((product) => {
      const matchesCategory = selectedCategory === CATEGORIES[0] || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price <= priceRange;
      return matchesCategory && matchesSearch && matchesPrice;
    });

    if (sortBy === 'lowToHigh') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'highToLow') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return result;
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  const initiateAction = (product: Product, type: 'buy' | 'bid') => {
    const user = localStorage.getItem('user');
    if (!user) {
      showToast("મહેરબાની કરીને પહેલા લોગિન કરો.", 'warning');
      return;
    }

    setSelectedProduct(product);
    setActionType(type);
    setStatus('idle');
    setQuantity(1);
    setBidAmount((product.price - 50).toString());
  };

  const confirmAction = async () => {
    if (!selectedProduct) return;

    setStatus('processing');
    try {
      if (actionType === 'buy') {
        await ordersAPI.create({
          productId: selectedProduct.id,
          quantity,
          deliveryAddress: JSON.parse(localStorage.getItem('user') || '{}').location || 'Farm pickup',
          paymentMethod: 'cash'
        });
      } else {
        await bidsAPI.create({
          productId: selectedProduct.id,
          amount: Number(bidAmount),
          quantity,
          message: "રસ ધરાવું છું"
        });
      }

      setStatus('success');
      showToast(actionType === 'buy' ? t('market.success') : t('market.bidSuccess'), 'success');
      AppLogger.info("Market action successful", { type: actionType, productId: selectedProduct.id });
    } catch (error: any) {
      AppLogger.error("Market action failed", error);
      setStatus('idle');
      showToast(error.message || "કંઈક ભૂલ થઈ છે. ફરી પ્રયાસ કરો.", 'error');
    }
  };

  const resetFilters = () => {
    setSelectedCategory(CATEGORIES[0]);
    setSearchQuery('');
    setPriceRange(10000);
    setSortBy('featured');
  };

  return {
    filteredProducts,
    loading,
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    selectedProduct, setSelectedProduct,
    actionType,
    status,
    quantity, setQuantity,
    bidAmount, setBidAmount,
    initiateAction,
    confirmAction,
    resetFilters
  };
};
