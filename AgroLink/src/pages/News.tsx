
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
      // Fallback
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
    <div className="bg-bg-base min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-text-primary mb-2">{t('common:news.title')}</h1>
          <p className="text-text-muted max-w-2xl mx-auto">{t('common:news.subtitle')}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <Button
              key={cat.key}
              variant={filter === cat.key ? "primary" : "outline"}
              onClick={() => setFilter(cat.key)}
              className="rounded-md font-bold text-xs h-9 cursor-pointer"
            >
              {cat.label}
            </Button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item: any) => (
            <article key={item.id} className="bg-bg-surface rounded-lg overflow-hidden shadow-sm border border-border-base flex flex-col h-full hover:border-brand-primary/50 transition-colors">
              <div className="relative h-48 overflow-hidden bg-bg-muted">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-[10px] text-text-muted mb-3 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {item.source}</span>
                </div>
                <h2 className="text-lg font-bold text-text-primary mb-3 leading-tight hover:text-brand-primary cursor-pointer transition-colors" onClick={() => openNews(item)}>
                  {item.title}
                </h2>
                <p className="text-text-secondary text-sm mb-6 flex-1 line-clamp-3">{item.desc}</p>
                <Button variant="link" onClick={() => openNews(item)} className="p-0 h-auto font-bold text-brand-primary flex items-center gap-1 w-fit cursor-pointer text-xs">
                  {t('common:news.readMore')} <ArrowRight size={14} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedNews} onOpenChange={(open) => !open && closeNews()}>
        {selectedNews && (
          <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white rounded-lg shadow-xl">
            <div className="flex flex-col max-h-[90vh]">
              <div className="relative h-64 shrink-0 overflow-hidden">
                <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white leading-tight drop-shadow-sm text-left">
                      {selectedNews.title}
                    </DialogTitle>
                  </DialogHeader>
                </div>
              </div>
              <div className="p-8 overflow-y-auto">
                <div className="flex items-center gap-4 text-xs font-bold text-text-muted mb-6 border-b border-border-base pb-4 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {selectedNews.date}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {selectedNews.source}</span>
                </div>
                <div className="text-text-secondary leading-relaxed space-y-4 text-sm font-medium">
                  <p>{selectedNews.desc}</p>
                  <p>{t('news:detail.contactInfo')}</p>
                </div>
              </div>
              <div className="bg-bg-muted/30 p-4 border-t border-border-base flex justify-end shrink-0 gap-3">
                <Button variant="outline" onClick={closeNews} className="rounded-md font-bold text-xs h-9 cursor-pointer">
                  {t('common:news.close')}
                </Button>
                <Button onClick={handleShare} isLoading={isSharing} className="bg-brand-primary hover:bg-brand-primary-dark text-white rounded-md font-bold text-xs h-9 cursor-pointer flex items-center gap-2 px-4 shadow-sm">
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
