
import { useState, useMemo } from 'react';
import { CATEGORIES } from '../constants';
import type { Product } from '../types';
import AppLogger, { Category } from '../utils/logger';
import { useToast } from '../components/Toast';
import { useTranslation } from 'react-i18next';
import { useProducts, useCreateOrder, useCreateBid } from './api';

export const useMarketplace = () => {
  const { t } = useTranslation(['products', 'auth', 'common']);
  const { showToast } = useToast();

  // Use TanStack Query to fetch products
  const { data: products = [], isLoading: loading } = useProducts();

  // Mutations with automatic invalidation
  const createOrderMutation = useCreateOrder();
  const createBidMutation = useCreateBid();

  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(10000);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [actionType, setActionType] = useState<'buy' | 'bid'>('buy');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [quantity, setQuantity] = useState(1);
  const [bidAmount, setBidAmount] = useState('');

  const filteredProducts = useMemo(() => {
    AppLogger.info(Category.DATA, "Filtering products", { selectedCategory, searchQuery, sortBy });
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
    const userString = localStorage.getItem('user');
    if (!userString) {
      showToast(t('auth:auth.pleaseLogin'), 'warning');
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
        // Use mutation instead of direct API call
        await createOrderMutation.mutateAsync({
          productId: selectedProduct.id,
          quantity,
          deliveryAddress: JSON.parse(localStorage.getItem('user') || '{}').location || t('common:common.address'),
          paymentMethod: 'cash'
        });
      } else {
        // Use mutation instead of direct API call
        await createBidMutation.mutateAsync({
          productId: selectedProduct.id,
          amount: Number(bidAmount),
          quantity,
          message: t('products:market.bidInterest')
        });
      }

      setStatus('success');
      // Toast is already shown by the mutation
      AppLogger.info("Market action successful", { type: actionType, productId: selectedProduct.id });
    } catch (error: any) {
      AppLogger.error(Category.API, "Market action failed", error);
      setStatus('idle');
      // Error toast is already shown by the mutation
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
