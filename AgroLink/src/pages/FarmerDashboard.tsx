import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Package, MessageSquare, Check, X, Trash2, Loader2, Edit } from 'lucide-react';
import { useFarmerDashboard } from '../hooks/useFarmerDashboard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { AddProductModal } from '../components/farmer/AddProductModal';
import type { Product } from '../types';

const FarmerDashboard: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'common', 'products']);
  const d = useFarmerDashboard();

  // Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsAddProductOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddProductOpen(false);
    setProductToEdit(null);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('dashboard.title')}</h1>
            <p className="text-gray-500 font-medium">{t('dashboard.subtitle')}</p>
          </div>
          <Button onClick={() => setIsAddProductOpen(true)}>
            <PlusCircle size={20} className="mr-2" /> {t('dashboard.addNew')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Package className="text-green-600" /> {t('dashboard.activeListings')}
            </h2>

            {d.loading && d.listings.length === 0 ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-green-600 w-10 h-10" />
              </div>
            ) : d.listings.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-400 font-bold">{t('dashboard.noListings')}</p>
              </Card>
            ) : (
              d.listings.map((item) => (
                <Card key={item._id} className="flex items-center gap-6 p-6 group transition-all hover:shadow-xl">
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover shadow-inner" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black text-gray-900">{item.name}</h3>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-gray-400 font-bold text-sm mt-1">₹{item.price} / {item.unit}</p>
                    <div className="mt-4 flex gap-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-xs font-black text-gray-400 hover:text-green-700 transition-colors uppercase tracking-widest flex items-center gap-1"
                      >
                        <Edit size={12} /> {t('dashboard.edit')}
                      </button>
                      <button
                        onClick={() => d.deleteListing(item._id)}
                        className="text-xs font-black text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest flex items-center gap-1"
                      >
                        <Trash2 size={12} /> {t('dashboard.delete')}
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <MessageSquare className="text-blue-600" /> {t('dashboard.recentBids')}
            </h2>
            <Card className="p-8">
              {d.bids.length === 0 ? (
                <p className="text-gray-400 font-bold text-center py-4">{t('dashboard.noBids')}</p>
              ) : (
                <div className="space-y-8">
                  {d.bids.map((bid) => (
                    <div key={bid._id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-black text-gray-900">{bid.buyer?.name || t('dashboard.buyer')}</p>
                          <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">{bid.productName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-700 font-black text-xl">₹{bid.amount}</p>
                        </div>
                      </div>

                      {bid.status === 'pending' ? (
                        <div className="flex gap-3 mt-4">
                          <Button
                            variant="ghost"
                            className="flex-1 bg-green-50 text-green-700 hover:bg-green-100"
                            size="sm"
                            onClick={() => d.handleBidAction(bid._id, 'accepted')}
                          >
                            <Check size={14} className="mr-1" /> {t('dashboard.accept')}
                          </Button>
                          <Button
                            variant="danger"
                            className="flex-1"
                            size="sm"
                            onClick={() => d.handleBidAction(bid._id, 'rejected')}
                          >
                            <X size={14} className="mr-1" /> {t('dashboard.reject')}
                          </Button>
                        </div>
                      ) : (
                        <div className={`mt-4 text-center py-2 rounded-xl text-xs font-black uppercase tracking-widest ${bid.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {bid.status === 'accepted' ? 'Accepted' : 'Rejected'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={handleCloseModal}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default FarmerDashboard;
