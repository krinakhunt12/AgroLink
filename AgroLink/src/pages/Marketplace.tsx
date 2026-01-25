import React from 'react';
import { Link } from 'react-router-dom';
import {
  Star, MapPin, X, Check, BadgeCheck, Clock,
  ShoppingBag, IndianRupee, User, Search
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '../constants';
import { useMarketplace } from '../hooks/useMarketplace';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Marketplace: React.FC = () => {
  const { t } = useTranslation(['products', 'common']);
  const m = useMarketplace();

  return (
    <div className="bg-bg-base min-h-screen pb-20">
      {/* Search Header */}
      <div className="bg-white border-b border-border-base py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-text-primary mb-2">{t('products:market.title')}</h1>
            <p className="text-text-muted mb-8">{t('products:market.subtitle')}</p>
            <div className="relative group max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
              <input
                type="text"
                placeholder={t('products:market.searchPlaceholder')}
                className="w-full bg-bg-muted/30 border border-border-base rounded-md px-5 py-3.5 pl-12 focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all text-sm font-medium"
                value={m.searchQuery}
                onChange={(e) => m.setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('products:market.categories')}</h3>
                <button onClick={m.resetFilters} className="text-[10px] text-status-error font-bold uppercase hover:underline cursor-pointer">{t('products:market.clearFilters')}</button>
              </div>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => m.setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${m.selectedCategory === cat ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-secondary hover:bg-bg-muted hover:text-text-primary'}`}
                  >
                    {t('common:categories.items.' + cat)}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border-base space-y-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('products:market.sortBy')}</h3>
              <select
                value={m.sortBy}
                onChange={(e) => m.setSortBy(e.target.value)}
                className="w-full bg-white border border-border-base rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary cursor-pointer"
              >
                <option value="featured">{t('products:market.sortFeatured')}</option>
                <option value="lowToHigh">{t('products:market.sortLowHigh')}</option>
                <option value="highToLow">{t('products:market.sortHighLow')}</option>
                <option value="rating">{t('products:market.sortRating')}</option>
              </select>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {m.loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-primary border-t-transparent"></div>
              </div>
            ) : m.filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-bg-surface rounded-lg border border-border-base border-dashed">
                <Search className="w-12 h-12 text-border-base mx-auto mb-4" />
                <h3 className="text-lg font-bold text-text-muted">{t('products:market.noProducts')}</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {m.filteredProducts.map((p) => (
                  <Card key={p.id} className="group bg-bg-surface border-border-base hover:border-brand-primary/50 transition-colors rounded-lg overflow-hidden shadow-sm flex flex-col h-full">
                    <Link to={`/product/${p.id}`} className="block relative h-48 overflow-hidden bg-bg-muted cursor-pointer">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-none" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-text-primary border-none shadow-sm text-[10px] font-bold py-0.5 px-2">
                          {t('common:categories.items.' + p.category)}
                        </Badge>
                        {p.isNegotiable && (
                          <Badge variant="outline" className="bg-status-warning/10 text-status-warning-dark border-status-warning/20 text-[10px] font-bold py-0.5 px-2 backdrop-blur-sm">
                            {t('products:market.bidding')}
                          </Badge>
                        )}
                      </div>
                      {p.isVerified && (
                        <div className="absolute top-3 right-3 text-status-success bg-white/90 rounded-full p-1 shadow-sm">
                          <BadgeCheck size={18} />
                        </div>
                      )}
                    </Link>
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-bold text-text-primary truncate">{p.name}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-status-warning text-status-warning" />
                          <span className="text-xs font-bold text-text-secondary">{p.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-text-muted text-[10px] font-bold uppercase tracking-wider mb-4">
                        <MapPin className="w-3 h-3 mr-1" /> {p.location}
                      </div>

                      <div className="space-y-1.5 mb-6">
                        <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
                          <User size={14} className="text-text-muted" />
                          {p.farmerName || p.farmer?.name || t('products:market.farmer')}
                        </div>
                        {p.stock && p.stock < 50 && (
                          <p className="text-[10px] font-bold text-status-error flex items-center gap-1">
                            <Clock size={10} /> {t('products:market.hurry', { count: p.stock, unit: p.unit })}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-border-subtle flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-text-primary">₹{p.price}</span>
                          <span className="text-[10px] text-text-muted font-bold">/ {p.unit}</span>
                        </div>
                        <Button size="sm" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold rounded shadow-sm cursor-pointer">
                          <ShoppingBag size={14} className="mr-1.5" /> {t('products:market.buy')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {m.selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4" onClick={() => m.setSelectedProduct(null)}>
          <Card className="max-w-md w-full rounded-lg transition-none" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            {m.status === 'success' ? (
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-status-success/10 rounded-full flex items-center justify-center mx-auto text-status-success">
                  <Check size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">{m.actionType === 'buy' ? t('products:market.success') : t('products:market.bidSuccess')}</h3>
                  <p className="text-sm text-text-muted mt-2">{m.actionType === 'buy' ? t('products:market.successMsg') : t('products:market.bidSuccessMsg')}</p>
                </div>
                <Button className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold cursor-pointer" onClick={() => m.setSelectedProduct(null)}>{t('products:market.close')}</Button>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-border-base flex justify-between items-center">
                  <h3 className="font-bold text-text-primary">{m.actionType === 'buy' ? t('products:market.confirmOrder') : t('products:market.placeBid')}</h3>
                  <Button variant="ghost" size="icon" onClick={() => m.setSelectedProduct(null)} className="h-8 w-8 text-text-muted cursor-pointer"><X size={18} /></Button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex gap-4 p-4 bg-bg-muted/50 rounded-md border border-border-base">
                    <img src={m.selectedProduct.image} className="w-16 h-16 rounded object-cover border border-border-base" />
                    <div>
                      <h4 className="font-bold text-text-primary">{m.selectedProduct.name}</h4>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{m.selectedProduct.farmer?.name || t('products:market.farmer')}</p>
                      <p className="text-brand-primary font-bold mt-1">₹{m.selectedProduct.price} <span className="text-text-muted font-normal text-xs">/ {m.selectedProduct.unit}</span></p>
                    </div>
                  </div>

                  {m.actionType === 'buy' ? (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider block text-center">{t('products:market.quantity')}</label>
                      <div className="flex items-center justify-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => m.setQuantity(Math.max(1, m.quantity - 1))} className="h-10 w-10 rounded-full cursor-pointer">-</Button>
                        <span className="text-xl font-bold w-4 text-center">{m.quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => m.setQuantity(m.quantity + 1)} className="h-10 w-10 rounded-full cursor-pointer">+</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">{t('products:market.yourPrice')}</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                        <input
                          type="number"
                          className="w-full bg-white border border-border-base rounded-md py-3 pl-10 pr-4 font-bold text-lg focus:ring-2 ring-brand-primary/10 focus:border-brand-primary transition-all outline-none"
                          value={m.bidAmount}
                          onChange={(e) => m.setBidAmount(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-bg-muted p-6 rounded-md space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-text-muted">{m.actionType === 'buy' ? t('products:market.totalPrice') : t('products:market.totalBidPrice')}</span>
                      <span className="text-xl font-bold text-text-primary">₹{m.actionType === 'buy' ? m.selectedProduct.price * m.quantity : Number(m.bidAmount) * m.quantity}</span>
                    </div>
                    <Button
                      className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold h-12 shadow-sm cursor-pointer"
                      onClick={m.confirmAction}
                      isLoading={m.status === 'processing'}
                    >
                      {m.actionType === 'buy' ? t('products:market.confirm') : t('products:market.bid')}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};


export default Marketplace;

