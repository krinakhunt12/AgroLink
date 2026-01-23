
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Filter, Star, MapPin, X, Check, TrendingUp, BadgeCheck, SlidersHorizontal, Clock,
  ShoppingBag, MessageSquare, IndianRupee, User
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CATEGORIES, MARKET_RATES_TICKER } from '../constants';
import { useMarketplace } from '../hooks/useMarketplace';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const Marketplace: React.FC = () => {
  const { t } = useTranslation();
  const m = useMarketplace();

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-20">
      {/* Marquee with Tailwind arbitrary values instead of manual CSS */}
      <div className="bg-gray-900 text-white py-2 overflow-hidden whitespace-nowrap relative flex items-center border-b border-gray-800 z-40">
        <div className="bg-green-600 px-4 py-2 absolute left-0 z-10 font-bold text-xs md:text-sm flex items-center gap-2 skew-x-12 -ml-2 shadow-[10px_0_20px_rgba(0,0,0,0.3)]">
          <div className="-skew-x-12 flex items-center gap-2">
            <TrendingUp size={16} />
            {t('liveFeatures.liveUpdates')}
          </div>
        </div>
        <div className="inline-block pl-44 text-green-300 animate-[marquee_30s_linear_infinite]">
          {MARKET_RATES_TICKER.concat(MARKET_RATES_TICKER).map((rate, idx) => (
            <span key={idx} className="mx-6 text-sm font-mono font-medium">
              {rate} <span className="text-green-500 mx-1">▲</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 sticky top-16 md:relative z-30 bg-gray-50/80 backdrop-blur-sm md:bg-transparent py-2 md:py-0">
          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder={t('market.searchPlaceholder')}
              className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-3.5 pl-12 focus:outline-none focus:border-green-500 transition-all shadow-sm"
              value={m.searchQuery}
              onChange={(e) => m.setSearchQuery(e.target.value)}
            />
            <Filter className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <select
              value={m.sortBy}
              onChange={(e) => m.setSortBy(e.target.value)}
              className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:border-green-500 shadow-sm cursor-pointer min-w-[160px]"
            >
              <option value="featured">{t('market.sortFeatured')}</option>
              <option value="lowToHigh">{t('market.sortLowHigh')}</option>
              <option value="highToLow">{t('market.sortHighLow')}</option>
              <option value="rating">{t('market.sortRating')}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4 hidden lg:block">
            <Card className="sticky top-24 p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-green-600" /> {t('market.filters')}
                </h3>
                <button onClick={m.resetFilters} className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:underline">{t('market.clearFilters')}</button>
              </div>
              <div className="space-y-10">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('market.categories')}</h4>
                  <div className="flex flex-col gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => m.setSelectedCategory(cat)}
                        className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${m.selectedCategory === cat ? 'bg-green-700 text-white shadow-lg shadow-green-700/20' : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          <div className="lg:w-3/4">
            {m.loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : m.filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                <Filter className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400">{t('market.noProducts')}</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {m.filteredProducts.map((p) => (
                  <Card key={p.id} className="group hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    <Link to={`/product/${p.id}`}>
                      <div className="relative h-56 overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest">{p.category}</span>
                          {p.isNegotiable && (
                            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest flex items-center gap-1">
                              <TrendingUp size={12} /> {t('market.bidding')}
                            </span>
                          )}
                        </div>
                        {p.isVerified && (
                          <span className="absolute top-4 right-4 bg-green-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white"><BadgeCheck size={16} /></span>
                        )}
                      </div>
                    </Link>
                    <CardContent className="flex-1 flex flex-col p-6">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-black text-gray-900 line-clamp-1">{p.name}</h3>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-full">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-black text-yellow-700">{p.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4"><MapPin className="w-3 h-3 mr-1" /> {p.location}</div>

                      <div className="mb-6 space-y-1">
                        <p className="text-sm font-bold text-gray-700 flex items-center gap-2"><User size={14} className="text-gray-400" /> {p.farmer?.name || t('products:market.farmer')}</p>
                        {p.stock && p.stock < 50 && (
                          <p className="text-[10px] font-black text-red-500 flex items-center gap-1">
                            <Clock size={10} /> {t('market.hurry', { count: p.stock, unit: p.unit.split(' ')[1] })}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col gap-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-gray-900">₹{p.price}</span>
                          <span className="text-[10px] text-gray-400 font-black uppercase">/ {p.unit}</span>
                        </div>
                        <div className="flex gap-2">
                          {p.isNegotiable && (
                            <Button variant="secondary" className="flex-1" onClick={() => m.initiateAction(p, 'bid')}>
                              <MessageSquare size={16} className="mr-2" /> {t('market.bid')}
                            </Button>
                          )}
                          <Button variant="primary" className={p.isNegotiable ? "flex-1" : "w-full"} onClick={() => m.initiateAction(p, 'buy')}>
                            <ShoppingBag size={16} className="mr-2" /> {t('market.buy')}
                          </Button>
                        </div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[150] flex items-center justify-center p-4" onClick={() => m.setSelectedProduct(null)}>
          <Card className="max-w-md w-full animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            {m.status === 'success' ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce"><Check className="w-12 h-12 text-green-600" /></div>
                <h3 className="text-3xl font-black text-gray-900 mb-3">{m.actionType === 'buy' ? t('market.success') : t('market.bidSuccess')}</h3>
                <p className="text-gray-500 mb-10 font-medium">{m.actionType === 'buy' ? t('market.successMsg') : t('market.bidSuccessMsg')}</p>
                <Button variant="primary" className="w-full py-5" onClick={() => m.setSelectedProduct(null)}>{t('market.close')}</Button>
              </div>
            ) : (
              <>
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-xl font-black text-gray-900">{m.actionType === 'buy' ? t('market.confirmOrder') : t('market.placeBid')}</h3>
                  <Button variant="ghost" size="icon" onClick={() => m.setSelectedProduct(null)}><X size={20} /></Button>
                </div>
                <div className="p-8">
                  <div className="flex gap-5 mb-8 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                    <img src={m.selectedProduct.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                    <div>
                      <h4 className="font-black text-lg text-gray-900">{m.selectedProduct.name}</h4>
                      <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{m.selectedProduct.farmer?.name || t('products:market.farmer')}</p>
                      <p className="text-green-700 font-black mt-1 text-xl">₹{m.selectedProduct.price} <span className="text-[10px] text-gray-400 font-normal">/ {m.selectedProduct.unit}</span></p>
                    </div>
                  </div>

                  {m.actionType === 'buy' ? (
                    <div className="mb-8">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block text-center">{t('market.quantity')}</label>
                      <div className="flex items-center justify-center gap-6">
                        <Button variant="outline" size="icon" onClick={() => m.setQuantity(Math.max(1, m.quantity - 1))} className="w-14 h-14 text-2xl">-</Button>
                        <span className="text-3xl font-black w-12 text-center">{m.quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => m.setQuantity(m.quantity + 1)} className="w-14 h-14 text-2xl">+</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8 space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-center">{t('market.yourPrice')}</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-6 top-5 text-gray-300" size={20} />
                        <input
                          type="number"
                          className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl py-5 pl-14 pr-8 text-2xl font-black focus:ring-4 ring-yellow-400/20 focus:border-yellow-400 transition-all outline-none"
                          value={m.bidAmount}
                          onChange={(e) => m.setBidAmount(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-900 rounded-[32px] p-8 text-white flex justify-between items-center shadow-2xl">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{m.actionType === 'buy' ? t('market.totalPrice') : t('market.totalBidPrice')}</p>
                      <p className="text-3xl font-black">₹{m.actionType === 'buy' ? m.selectedProduct.price * m.quantity : Number(m.bidAmount) * m.quantity}</p>
                    </div>
                    <Button
                      variant={m.actionType === 'buy' ? 'primary' : 'secondary'}
                      className="px-8 py-5 h-auto text-base"
                      onClick={m.confirmAction}
                      isLoading={m.status === 'processing'}
                    >
                      {m.actionType === 'buy' ? t('market.confirm') : t('market.bid')}
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
