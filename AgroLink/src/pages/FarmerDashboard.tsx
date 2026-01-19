import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Package, MessageSquare, Sparkles, Check, X, Camera, IndianRupee, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import { useFarmerDashboard } from '../hooks/useFarmerDashboard';
import Button from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { CATEGORIES } from '../constants';

const FarmerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const d = useFarmerDashboard();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      d.setFormData({ ...d.formData, image: e.target.files[0] });
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('dashboard.title')}</h1>
            <p className="text-gray-500 font-medium">{t('dashboard.subtitle')}</p>
          </div>
          <Button onClick={() => d.setShowAddForm(true)}>
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
                <p className="text-gray-400 font-bold">કોઈ સક્રિય જાહેરાતો નથી.</p>
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
                      <button className="text-xs font-black text-gray-400 hover:text-green-700 transition-colors uppercase tracking-widest">{t('dashboard.edit')}</button>
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
                <p className="text-gray-400 font-bold text-center py-4">કોઈ બિડ મળી નથી.</p>
              ) : (
                <div className="space-y-8">
                  {d.bids.map((bid) => (
                    <div key={bid._id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-black text-gray-900">{bid.buyer?.name || 'ખરીદનાર'}</p>
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

      {d.showAddForm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto" onClick={() => d.setShowAddForm(false)}>
          <Card className="w-full max-w-2xl my-8 flex flex-col animate-in slide-in-from-bottom-5" onClick={e => e.stopPropagation()}>
            <CardHeader className="flex justify-between items-center sticky top-0 bg-white z-20">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t('dashboard.form.title')}</h2>
              <Button variant="ghost" size="icon" onClick={() => d.setShowAddForm(false)}><X /></Button>
            </CardHeader>
            <div className="p-8 space-y-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-4 border-dashed rounded-[32px] h-52 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer overflow-hidden ${d.formData.image ? 'border-green-500 bg-green-50' : 'border-gray-100 text-gray-400 hover:border-green-200 hover:bg-green-50'}`}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                {d.formData.image ? (
                  <div className="text-center">
                    <Package size={48} className="text-green-600 mx-auto mb-2" />
                    <p className="font-black text-sm text-green-700">{d.formData.image.name}</p>
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
                    value={d.formData.name}
                    onChange={(e) => d.setFormData({ ...d.formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('dashboard.form.category')}</label>
                  <select
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 focus:ring-4 ring-green-500/10 focus:border-green-500 focus:bg-white transition-all font-bold"
                    value={d.formData.category}
                    onChange={(e) => d.setFormData({ ...d.formData, category: e.target.value })}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('dashboard.form.price')}</label>
                  <Button variant="secondary" size="sm" onClick={d.fetchAiAdvice} isLoading={d.loadingAi} className="h-8">
                    <Sparkles size={12} className="mr-1.5" /> {t('dashboard.form.aiAdvice')}
                  </Button>
                </div>

                {d.aiAdvice && (
                  <div className="bg-yellow-50/50 p-6 rounded-3xl border border-yellow-100 text-sm text-yellow-900 animate-in fade-in duration-500 shadow-sm">
                    <p className="whitespace-pre-wrap leading-relaxed font-medium">{d.aiAdvice}</p>
                    {d.aiSources.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-yellow-200/50 flex flex-wrap gap-2">
                        {d.aiSources.map((s, i) => s.web && (
                          <a key={i} href={s.web.uri} target="_blank" rel="noopener" className="bg-white/80 hover:bg-white text-[9px] text-yellow-800 font-black px-2.5 py-1.5 rounded-lg border border-yellow-200 flex items-center gap-1.5 transition-colors">
                            {s.web.title || "લિંક"} <ExternalLink size={10} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <IndianRupee className="absolute left-5 top-4.5 text-gray-300" size={18} />
                    <input
                      type="number"
                      placeholder="1200"
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-5 py-4 focus:ring-4 ring-green-500/10 focus:border-green-500 focus:bg-white transition-all font-bold"
                      value={d.formData.price}
                      onChange={(e) => d.setFormData({ ...d.formData, price: e.target.value })}
                    />
                  </div>
                  <select
                    className="bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-green-500 transition-all cursor-pointer"
                    value={d.formData.unit}
                    onChange={(e) => d.setFormData({ ...d.formData, unit: e.target.value })}
                  >
                    <option>પ્રતિ 20 કિલો</option>
                    <option>પ્રતિ કિલો</option>
                    <option>પ્રતિ નંગ</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">વર્ણન (Description)</label>
                <textarea
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 focus:ring-4 ring-green-500/10 focus:border-green-500 focus:bg-white transition-all font-bold min-h-[100px]"
                  value={d.formData.description}
                  onChange={(e) => d.setFormData({ ...d.formData, description: e.target.value })}
                  placeholder="તમારા પાક વિશે વિગતો લખો..."
                />
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100 transition-colors hover:bg-gray-100/50">
                <input
                  type="checkbox"
                  checked={d.formData.isNegotiable}
                  onChange={(e) => d.setFormData({ ...d.formData, isNegotiable: e.target.checked })}
                  className="w-6 h-6 rounded-lg text-green-700 focus:ring-green-500 border-gray-300 transition-all cursor-pointer"
                />
                <div>
                  <p className="font-black text-gray-900 tracking-tight">{t('dashboard.form.negotiable')}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{t('dashboard.form.negotiableDesc')}</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-gray-50 border-t border-gray-100">
              <Button variant="primary" className="w-full py-5 text-xl" onClick={d.submitCrop} isLoading={d.loading}>
                {t('dashboard.form.submit')}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
