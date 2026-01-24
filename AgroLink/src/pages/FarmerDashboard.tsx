import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Package, MessageSquare, Check, X, Trash2, Loader2, Edit, TrendingUp, Users } from 'lucide-react';
import { useFarmerDashboard } from '../hooks/useFarmerDashboard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const FarmerDashboard: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'common', 'products']);
  const navigate = useNavigate();
  const d = useFarmerDashboard();

  return (
    <div className="bg-bg-base min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-base pb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">{t('dashboard.title')}</h1>
            <p className="text-text-muted text-sm">{t('dashboard.subtitle')}</p>
          </div>
          <Button
            onClick={() => navigate('/farmer/products/add')}
            className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold shadow-sm"
          >
            <PlusCircle size={18} className="mr-2" /> {t('dashboard.addNew')}
          </Button>
        </div>

        {/* Stats Summary - New Minimal Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center gap-4 bg-bg-surface border-border-base shadow-sm">
            <div className="p-3 bg-brand-primary/10 rounded-md text-brand-primary">
              <Package size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('dashboard.activeListings')}</p>
              <p className="text-xl font-bold">{d.listings.length}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4 bg-bg-surface border-border-base shadow-sm">
            <div className="p-3 bg-status-info/10 rounded-md text-status-info">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('dashboard.recentBids')}</p>
              <p className="text-xl font-bold">{d.bids.length}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4 bg-bg-surface border-border-base shadow-sm cursor-pointer hover:border-brand-primary transition-colors">
            <div className="p-3 bg-status-success/10 rounded-md text-status-success">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('dashboard.totalSales')}</p>
              <p className="text-xl font-bold">₹0</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4 bg-bg-surface border-border-base shadow-sm cursor-pointer hover:border-brand-primary transition-colors">
            <div className="p-3 bg-status-warning/10 rounded-md text-status-warning">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('dashboard.followers')}</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Listings Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Package size={20} className="text-brand-primary" /> {t('dashboard.activeListings')}
              </h2>
            </div>

            {d.loading && d.listings.length === 0 ? (
              <div className="flex justify-center py-20 bg-bg-surface rounded-lg border border-border-base">
                <Loader2 className="animate-spin text-brand-primary w-8 h-8" />
              </div>
            ) : d.listings.length === 0 ? (
              <Card className="p-12 text-center bg-bg-surface border-border-base border-dashed">
                <p className="text-text-muted font-medium">{t('dashboard.noListings')}</p>
                <Button
                  variant="ghost"
                  className="mt-4 text-brand-primary font-semibold"
                  onClick={() => navigate('/farmer/products/add')}
                >
                  {t('dashboard.addNew')}
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {d.listings.map((item) => (
                  <Card key={item._id} className="flex gap-4 p-4 bg-bg-surface border-border-base hover:border-brand-primary/50 transition-colors shadow-sm">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover border border-border-base" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-base font-bold text-text-primary truncate">{item.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${item.status === 'active' ? 'bg-status-success/10 text-status-success' : 'bg-bg-muted text-text-muted'}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-text-secondary font-semibold text-sm">₹{item.price} <span className="text-text-muted font-normal">/ {item.unit}</span></p>

                      <div className="mt-3 flex gap-3 border-t border-border-subtle pt-3">
                        <button
                          onClick={() => navigate(`/farmer/products/edit/${item._id}`)}
                          className="text-xs font-semibold text-text-muted hover:text-brand-primary transition-colors flex items-center gap-1.5"
                        >
                          <Edit size={14} /> {t('dashboard.edit')}
                        </button>
                        <button
                          onClick={() => d.deleteListing(item._id)}
                          className="text-xs font-semibold text-text-muted hover:text-status-error transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 size={14} /> {t('dashboard.delete')}
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Side Bids Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <MessageSquare size={20} className="text-status-info" /> {t('dashboard.recentBids')}
            </h2>
            <Card className="bg-bg-surface border-border-base shadow-sm overflow-hidden">
              {d.bids.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-text-muted text-sm font-medium">{t('dashboard.noBids')}</p>
                </div>
              ) : (
                <div className="divide-y divide-border-subtle">
                  {d.bids.map((bid) => (
                    <div key={bid._id} className="p-5 space-y-3 hover:bg-bg-muted/30 transition-colors">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-bold text-text-primary text-sm">{bid.buyer?.name || t('dashboard.buyer')}</p>
                          <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">{bid.productName}</p>
                        </div>
                        <p className="text-text-primary font-bold text-base">₹{bid.amount}</p>
                      </div>

                      {bid.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            className="flex-1 bg-status-success/5 text-status-success hover:bg-status-success/10 text-xs py-1.5 h-auto rounded-md"
                            size="sm"
                            onClick={() => d.handleBidAction(bid._id, 'accepted')}
                          >
                            <Check size={14} className="mr-1" /> {t('dashboard.accept')}
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex-1 bg-status-error/5 text-status-error hover:bg-status-error/10 text-xs py-1.5 h-auto rounded-md"
                            size="sm"
                            onClick={() => d.handleBidAction(bid._id, 'rejected')}
                          >
                            <X size={14} className="mr-1" /> {t('dashboard.reject')}
                          </Button>
                        </div>
                      ) : (
                        <div className={`text-center py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${bid.status === 'accepted' ? 'bg-status-success/10 text-status-success' : 'bg-status-error/5 text-status-error'}`}>
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
    </div>
  );
};

export default FarmerDashboard;

