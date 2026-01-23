
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Calendar, User, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

const News: React.FC = () => {
  const { t } = useTranslation(['news', 'common']);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState('All');
  const [isSharing, setIsSharing] = useState(false);

  const ALL_NEWS = t('news:items', { returnObjects: true }) as any[];
  const filteredNews = filter === 'All' ? ALL_NEWS : ALL_NEWS.filter(n => n.category === filter);

  const newsId = searchParams.get('id');
  const selectedNews = newsId ? ALL_NEWS.find(n => n.id === Number(newsId)) : null;

  const openNews = (item: any) => setSearchParams({ id: item.id.toString() });
  const closeNews = () => {
    setSearchParams({});
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
      // Fallback sharing could be implemented here
    }
    setIsSharing(false);
  };

  const categories = [
    { key: 'All', label: t('common:news.categories.all') },
    { key: 'Market', label: t('common:news.categories.market') },
    { key: 'Weather', label: t('common:news.categories.weather') },
    { key: 'Government', label: t('common:news.categories.government') },
    { key: 'Technology', label: t('common:news.categories.technology') },
    { key: 'Policy', label: t('common:news.categories.policy') }
  ];

  return (
    <div className="bg-stone-50 min-h-screen font-sans py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">{t('common:news.title')}</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">{t('common:news.subtitle')}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => (
            <Button
              key={cat.key}
              variant={filter === cat.key ? "primary" : "outline"}
              onClick={() => setFilter(cat.key)}
              className="rounded-full font-bold"
            >
              {cat.label}
            </Button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item: any) => (
            <article key={item.id} className="bg-bg-surface rounded-2xl overflow-hidden shadow-theme hover:shadow-xl transition-all border border-border-base flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative h-52 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-xs text-text-muted mb-3 font-medium uppercase tracking-wide">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {item.source}</span>
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-3 leading-tight hover:text-brand-primary-dark cursor-pointer transition-colors" onClick={() => openNews(item)}>
                  {item.title}
                </h2>
                <p className="text-text-secondary text-sm mb-6 flex-1 line-clamp-3">{item.desc}</p>
                <Button variant="link" onClick={() => openNews(item)} className="p-0 h-auto font-bold text-brand-primary flex items-center gap-1 hover:gap-2 transition-all w-fit">
                  {t('common:news.readMore')} <ArrowRight size={16} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedNews} onOpenChange={(open) => !open && closeNews()}>
        {selectedNews && (
          <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-transparent shadow-none">
            <div className="bg-bg-surface rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="relative h-56 sm:h-72 shrink-0">
                <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-md text-left">
                      {selectedNews.title}
                    </DialogTitle>
                  </DialogHeader>
                </div>
              </div>
              <div className="p-6 sm:p-8 overflow-y-auto bg-bg-surface">
                <div className="flex items-center gap-4 text-sm text-text-muted mb-6 border-b border-border-subtle pb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {selectedNews.date}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {selectedNews.source}</span>
                </div>
                <div className="text-text-secondary leading-relaxed space-y-4">
                  <p className="font-semibold text-lg text-text-primary">{selectedNews.desc}</p>
                  <p>{t('news:detail.contactInfo')}</p>
                </div>
              </div>
              <div className="bg-bg-muted/50 p-4 border-t border-border-subtle flex justify-end shrink-0 gap-3">
                <Button variant="outline" onClick={closeNews} className="rounded-xl font-bold">
                  {t('common:news.close')}
                </Button>
                <Button onClick={handleShare} isLoading={isSharing} className="bg-brand-primary text-white px-6 rounded-xl font-bold hover:bg-brand-primary-dark transition flex items-center gap-2">
                  <Share2 size={16} /> {t('common:news.share')}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default News;
