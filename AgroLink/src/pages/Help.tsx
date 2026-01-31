
import React from 'react';
import { ChevronDown, Mail, Phone, Shield, AlertTriangle, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Help: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-green-900 mb-2">{t('help.title')}</h1>
        <div className="h-1 w-20 bg-yellow-400 mx-auto rounded"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-start gap-4 shadow-sm">
          <div className="bg-green-100 p-3 rounded-full text-green-700"><Phone size={24} /></div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{t('help.helpline')}</h3>
            <p className="text-green-700 font-bold text-xl mt-1">1800-123-4567</p>
            <p className="text-sm text-gray-500 mt-1">{t('help.hours')}</p>
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-start gap-4 shadow-sm">
          <div className="bg-green-100 p-3 rounded-full text-green-700"><Mail size={24} /></div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{t('help.emailSupport')}</h3>
            <p className="text-green-700 font-bold text-xl mt-1">support@agrolink.in</p>
            <p className="text-sm text-gray-500 mt-1">{t('help.response')}</p>
          </div>
        </div>
      </div>

      <div id="faq" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 scroll-mt-24">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <MessageSquare className="text-yellow-500" /> {t('help.faqTitle')}
        </h2>
        <div className="space-y-4">
          <details className="group border border-gray-100 rounded-xl p-4 cursor-pointer bg-gray-50 open:bg-white transition-all">
            <summary className="flex justify-between items-center font-bold text-gray-800 list-none">
              <span>{t('help.faq1')}</span>
              <ChevronDown className="group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-gray-600 mt-3 pl-4 border-l-2 border-green-500">{t('help.ans1')}</p>
          </details>
          <details className="group border border-gray-100 rounded-xl p-4 cursor-pointer bg-gray-50 open:bg-white transition-all">
            <summary className="flex justify-between items-center font-bold text-gray-800 list-none">
              <span>{t('help.faq2')}</span>
              <ChevronDown className="group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-gray-600 mt-3 pl-4 border-l-2 border-green-500">{t('help.ans2')}</p>
          </details>
          <details className="group border border-gray-100 rounded-xl p-4 cursor-pointer bg-gray-50 open:bg-white transition-all">
            <summary className="flex justify-between items-center font-bold text-gray-800 list-none">
              <span>{t('help.faq3')}</span>
              <ChevronDown className="group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-gray-600 mt-3 pl-4 border-l-2 border-green-500">{t('help.ans3')}</p>
          </details>
        </div>
      </div>

      <div id="safety" className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-12 scroll-mt-24">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-red-800"><Shield className="w-6 h-6" /> {t('help.safetyTitle')}</h2>
        <p className="text-red-700 mb-4 text-sm">{t('help.safetyDesc')}</p>
        <ul className="grid md:grid-cols-2 gap-3">
          {(t('help.tips', { returnObjects: true }) as string[]).map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-red-900 text-sm bg-white/60 p-2 rounded">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" /> {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-green-900 text-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
        <h2 className="text-2xl font-bold mb-6 text-center relative z-10">{t('help.contactTitle')}</h2>
        <form className="space-y-4 max-w-lg mx-auto relative z-10">
          <div>
            <label className="text-xs font-bold text-green-200 uppercase ml-1">{t('help.formName')}</label>
            <input type="text" className="w-full p-3 mt-1 rounded-xl bg-green-800 border border-green-700 text-white focus:outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label className="text-xs font-bold text-green-200 uppercase ml-1">{t('help.formMsg')}</label>
            <textarea rows={4} className="w-full p-3 mt-1 rounded-xl bg-green-800 border border-green-700 text-white focus:outline-none focus:border-yellow-400"></textarea>
          </div>
          <button className="w-full py-4 bg-yellow-400 text-green-900 font-bold rounded-xl hover:bg-yellow-300 shadow-lg text-lg transition">{t('help.sendBtn')}</button>
        </form>
      </div>
    </div>
  );
};

export default Help;
