
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Users, Lightbulb, Heart, Target, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-stone-50 min-h-screen font-sans">
      <div className="relative bg-brand-primary-dark text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595252328701-d41951551a37?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 drop-shadow-lg">{t('about.title')}</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto font-medium opacity-90">{t('about.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        <Card className="bg-bg-surface rounded-[32px] shadow-theme p-8 md:p-12 mb-16 border-none overflow-hidden">
          <h2 className="text-3xl font-black text-text-primary mb-10 flex items-center gap-4">
            <span className="w-12 h-1.5 bg-status-warning rounded-full"></span>
            {t('about.storyTitle')}
          </h2>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <p className="text-lg text-text-secondary leading-relaxed font-medium">{t('about.storyDesc')}</p>
              <div className="mt-10 flex gap-8">
                <div className="flex flex-col">
                  <span className="text-5xl font-black text-brand-primary">2024</span>
                  <span className="text-xs text-text-muted uppercase font-bold tracking-widest mt-1">{t('about.founded')}</span>
                </div>
                <div className="w-px bg-border-subtle"></div>
                <div className="flex flex-col">
                  <span className="text-5xl font-black text-brand-primary">50k+</span>
                  <span className="text-xs text-text-muted uppercase font-bold tracking-widest mt-1">{t('about.users')}</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Farmer" className="rounded-[32px] shadow-2xl border-8 border-white group-hover:scale-[1.02] transition-transform duration-500" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-status-warning/10 rounded-full -z-10 animate-pulse"></div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-brand-primary-dark to-brand-primary rounded-[32px] p-10 text-white relative overflow-hidden border-none shadow-theme-lg">
            <div className="relative z-10">
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner"><Target size={32} /></div>
              <h3 className="text-3xl font-black mb-4">{t('about.missionTitle')}</h3>
              <p className="text-green-50 text-lg leading-relaxed font-medium opacity-90">{t('about.missionDesc')}</p>
            </div>
          </Card>
          <Card className="bg-bg-surface rounded-[32px] p-10 border border-border-base shadow-theme relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="relative z-10">
              <div className="bg-status-info/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-status-info"><Eye size={32} /></div>
              <h3 className="text-3xl font-black mb-4 text-text-primary group-hover:text-brand-primary transition-colors">{t('about.visionTitle')}</h3>
              <p className="text-text-secondary text-lg leading-relaxed font-medium">{t('about.visionDesc')}</p>
            </div>
          </Card>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-text-primary mb-6">{t('about.valuesTitle')}</h2>
          <div className="w-20 h-2 bg-status-warning mx-auto rounded-full shadow-sm"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50', key: 'trust' },
            { icon: Lightbulb, color: 'text-brand-primary', bg: 'bg-brand-primary/5', key: 'innovation' },
            { icon: Users, color: 'text-status-warning', bg: 'bg-status-warning/10', key: 'community' },
            { icon: Heart, color: 'text-status-error', bg: 'bg-status-error/10', key: 'transparency' }
          ].map((val, i) => (
            <Card key={i} className="bg-bg-surface p-8 rounded-[32px] text-center shadow-sm border border-border-subtle hover:shadow-lg transition-all hover:-translate-y-2">
              <div className={`w-16 h-16 mx-auto ${val.bg} ${val.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}><val.icon size={32} /></div>
              <h3 className="font-bold text-text-primary text-xl uppercase tracking-tighter">{t(`about.values.${val.key}`)}</h3>
            </Card>
          ))}
        </div>

        <div className="mt-24 bg-status-warning rounded-[40px] p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-brand-primary-dark mb-8 leading-tight">{t('ctaFinal.title')}</h2>
            <Button asChild size="lg" className="bg-brand-primary-dark text-white px-12 py-6 rounded-full font-black text-xl hover:bg-brand-primary transition-all shadow-xl hover:scale-105">
              <Link to="/register">{t('ctaFinal.startBtn')}</Link>
            </Button>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default About;
