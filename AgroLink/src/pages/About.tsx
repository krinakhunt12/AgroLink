import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Users, Lightbulb, Heart, Target, Eye, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-bg-base min-h-screen">
      {/* Header Section */}
      <div className="bg-white border-b border-border-base py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-brand-primary"></span>
              {t('about.ourStory')}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
              {t('about.title')}
            </h1>
            <p className="text-lg text-text-muted leading-relaxed font-medium">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="bg-bg-surface border border-border-base rounded-lg overflow-hidden shadow-sm">
            <CardContent className="p-10 space-y-6">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
                <Target size={24} />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">{t('about.missionTitle')}</h3>
              <p className="text-text-secondary leading-relaxed font-medium">{t('about.missionDesc')}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-border-base rounded-lg overflow-hidden shadow-sm">
            <CardContent className="p-10 space-y-6">
              <div className="w-12 h-12 bg-status-info/10 rounded-lg flex items-center justify-center text-status-info">
                <Eye size={24} />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">{t('about.visionTitle')}</h3>
              <p className="text-text-secondary leading-relaxed font-medium">{t('about.visionDesc')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Inner Story */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-text-primary tracking-tight">{t('about.storyTitle')}</h2>
            <p className="text-lg text-text-secondary leading-relaxed font-medium">
              {t('about.storyDesc')}
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-bold text-brand-primary">2024</p>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">{t('about.founded')}</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-brand-primary">50k+</p>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">{t('about.users')}</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Farmer"
              className="rounded-lg shadow-sm border border-border-base object-cover w-full h-[400px]"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-text-primary">{t('about.valuesTitle')}</h2>
            <div className="w-12 h-1 bg-brand-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, color: 'text-brand-primary', bg: 'bg-brand-primary/5', key: 'trust' },
              { icon: Lightbulb, color: 'text-brand-primary', bg: 'bg-brand-primary/5', key: 'innovation' },
              { icon: Users, color: 'text-brand-primary', bg: 'bg-brand-primary/5', key: 'community' },
              { icon: Heart, color: 'text-brand-primary', bg: 'bg-brand-primary/5', key: 'transparency' }
            ].map((val, i) => (
              <div key={i} className="bg-white p-8 rounded-lg text-center border border-border-base transition-colors hover:border-brand-primary/50">
                <div className={`w-12 h-12 mx-auto ${val.bg} ${val.color} rounded-lg flex items-center justify-center mb-6`}>
                  <val.icon size={24} />
                </div>
                <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">{t(`about.values.${val.key}`)}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Join Us CTA */}
        <div className="mt-24 bg-bg-muted/50 rounded-lg p-12 md:p-16 text-center border border-border-base relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">{t('ctaFinal.title')}</h2>
            <p className="text-lg text-text-muted">{t('ctaFinal.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold h-14 px-10 cursor-pointer shadow-sm">
                <Link to="/register">{t('ctaFinal.startBtn')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white border-border-base text-text-primary font-bold h-14 px-10 cursor-pointer hover:bg-bg-muted">
                <Link to="/market" className="flex items-center gap-2">
                  {t('about.browseMarket')} <ChevronRight size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

