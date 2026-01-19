
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Calendar, User, ArrowRight, X, Share2, MessageCircle, Facebook, Twitter, Copy } from 'lucide-react';

const ALL_NEWS = [
  {
    id: 1,
    title: "કપાસના ભાવમાં રેકોર્ડ બ્રેક ઉછાળો",
    date: "12 May 2024",
    source: "APMC સમાચાર",
    category: "Market",
    image: "https://images.unsplash.com/photo-1594314489370-17e57c617b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    desc: "ગુજરાતના વિવિધ માર્કેટ યાર્ડમાં કપાસના ભાવ ઐતિહાસિક સપાટીએ પહોંચ્યા છે. ખેડૂતોમાં આનંદની લાગણી."
  },
  {
    id: 2,
    title: "ચોમાસુ 2024: ગુજરાતમાં સામાન્ય કરતા વધુ વરસાદની આગાહી",
    date: "10 May 2024",
    source: "હવામાન વિભાગ",
    category: "Weather",
    image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    desc: "ભારતીય હવામાન વિભાગે આ વર્ષે સારા વરસાદની આગાહી કરી છે, જે ખરીફ પાક માટે ખૂબ જ ફાયદાકારક રહેશે."
  },
  {
    id: 3,
    title: "પ્રાકૃતિક ખેતી કરતા ખેડૂતો માટે વિશેષ પેકેજ જાહેર",
    date: "08 May 2024",
    source: "ગાંધીનગર",
    category: "Government",
    image: "https://images.unsplash.com/photo-1625246333195-5848c428173f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    desc: "રાજ્ય સરકાર દ્વારા ગાય આધારિત ખેતી કરતા ખેડૂતો માટે પ્રતિ માસ 900 રૂપિયા સહાય ચાલુ રાખવાની જાહેરાત."
  }
];

const News: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState('All');
  const [selectedNews, setSelectedNews] = useState<typeof ALL_NEWS[0] | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const filteredNews = filter === 'All' ? ALL_NEWS : ALL_NEWS.filter(n => n.category === filter);

  useEffect(() => {
    const newsId = searchParams.get('id');
    if (newsId) {
      const item = ALL_NEWS.find(n => n.id === Number(newsId));
      if (item) setSelectedNews(item);
    } else {
      setSelectedNews(null);
    }
  }, [searchParams]);

  const openNews = (item: typeof ALL_NEWS[0]) => setSearchParams({ id: item.id.toString() });
  const closeNews = () => {
    setSearchParams({});
    setShowShareMenu(false);
  };

  const handleShare = async () => {
    if (!selectedNews) return;
    setIsSharing(true);
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: selectedNews.title, text: selectedNews.desc, url: shareUrl });
      } catch (err) { console.error(err); }
    } else {
      setShowShareMenu(!showShareMenu);
    }
    setIsSharing(false);
  };

  const categories = [
    { key: 'All', label: t('news.categories.all') },
    { key: 'Market', label: t('news.categories.market') },
    { key: 'Weather', label: t('news.categories.weather') },
    { key: 'Government', label: t('news.categories.government') },
    { key: 'Technology', label: t('news.categories.technology') },
    { key: 'Policy', label: t('news.categories.policy') }
  ];

  return (
    <div className="bg-stone-50 min-h-screen font-sans py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('news.title')}</h1>
           <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('news.subtitle')}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
           {categories.map(cat => (
             <button key={cat.key} onClick={() => setFilter(cat.key)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === cat.key ? 'bg-green-700 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-50'}`}>{cat.label}</button>
           ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredNews.map(item => (
             <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative h-52 overflow-hidden"><img src={item.image} alt={item.title} className="w-full h-full object-cover" /></div>
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                      <span className="flex items-center gap-1"><User size={12} /> {item.source}</span>
                   </div>
                   <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-green-700 cursor-pointer" onClick={() => openNews(item)}>{item.title}</h2>
                   <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">{item.desc}</p>
                   <button onClick={() => openNews(item)} className="text-green-700 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-auto group w-fit">{t('news.readMore')} <ArrowRight size={16} /></button>
                </div>
             </article>
           ))}
        </div>
      </div>
      {selectedNews && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeNews}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="relative h-56 sm:h-72 shrink-0">
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
              <button onClick={closeNews} className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full"><X size={20} /></button>
              <div className="absolute bottom-6 left-6 right-6">
                 <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-md">{selectedNews.title}</h2>
              </div>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto bg-white">
               <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {selectedNews.date}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {selectedNews.source}</span>
               </div>
               <div className="text-gray-700 leading-relaxed space-y-4">
                  <p className="font-semibold text-lg text-gray-900">{selectedNews.desc}</p>
                  <p>વધુ વિગતો માટે કૃપા કરીને તમારા નજીકના એપીએમસી સેન્ટર અથવા કૃષિ ભવનનો સંપર્ક કરો.</p>
               </div>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end shrink-0 gap-3">
               <button onClick={closeNews} className="px-6 py-2.5 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition">{t('news.close')}</button>
               <button onClick={handleShare} disabled={isSharing} className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-800 transition flex items-center gap-2">
                 <Share2 size={16} /> {t('news.share')}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
