
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Users, Lightbulb, Heart, Target, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-stone-50 min-h-screen font-sans">
      <div className="relative bg-green-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595252328701-d41951551a37?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('about.title')}</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">{t('about.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
           <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
             <span className="w-12 h-1 bg-yellow-400"></span>
             {t('about.storyTitle')}
           </h2>
           <div className="flex flex-col md:flex-row gap-10 items-center">
             <div className="md:w-1/2">
                <p className="text-lg text-gray-700 leading-relaxed">{t('about.storyDesc')}</p>
                <div className="mt-8 flex gap-4">
                  <div className="flex flex-col">
                     <span className="text-4xl font-bold text-green-700">2024</span>
                     <span className="text-sm text-gray-500 uppercase font-bold">{t('about.founded')}</span>
                  </div>
                  <div className="w-px bg-gray-200"></div>
                  <div className="flex flex-col">
                     <span className="text-4xl font-bold text-green-700">50k+</span>
                     <span className="text-sm text-gray-500 uppercase font-bold">{t('about.users')}</span>
                  </div>
                </div>
             </div>
             <div className="md:w-1/2">
               <img src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Farmer" className="rounded-2xl shadow-lg border-4 border-white" />
             </div>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
           <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm"><Target size={32} /></div>
                <h3 className="text-2xl font-bold mb-4">{t('about.missionTitle')}</h3>
                <p className="text-green-100 text-lg leading-relaxed">{t('about.missionDesc')}</p>
              </div>
           </div>
           <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600"><Eye size={32} /></div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('about.visionTitle')}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{t('about.visionDesc')}</p>
              </div>
           </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.valuesTitle')}</h2>
          <div className="w-20 h-1.5 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl text-center shadow-sm border border-gray-100">
             <div className="w-14 h-14 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4"><ShieldCheck size={28} /></div>
             <h3 className="font-bold text-gray-900">{t('about.values.trust')}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center shadow-sm border border-gray-100">
             <div className="w-14 h-14 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4"><Lightbulb size={28} /></div>
             <h3 className="font-bold text-gray-900">{t('about.values.innovation')}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center shadow-sm border border-gray-100">
             <div className="w-14 h-14 mx-auto bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4"><Users size={28} /></div>
             <h3 className="font-bold text-gray-900">{t('about.values.community')}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center shadow-sm border border-gray-100">
             <div className="w-14 h-14 mx-auto bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-4"><Heart size={28} /></div>
             <h3 className="font-bold text-gray-900">{t('about.values.transparency')}</h3>
          </div>
        </div>

        <div className="mt-20 bg-yellow-400 rounded-3xl p-10 text-center relative overflow-hidden shadow-xl">
           <div className="relative z-10">
             <h2 className="text-3xl font-black text-green-900 mb-6">{t('ctaFinal.title')}</h2>
             <Link to="/register" className="inline-block bg-green-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-800 transition shadow-lg">{t('ctaFinal.startBtn')}</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default About;
