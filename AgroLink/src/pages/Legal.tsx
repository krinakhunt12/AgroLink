
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LegalProps {
  type: 'terms' | 'privacy';
}

const Legal: React.FC<LegalProps> = ({ type }) => {
  const { t } = useTranslation();
  const isTerms = type === 'terms';

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-green-700 font-bold mb-8 hover:underline">
          <ArrowLeft size={20} />
          {t('nav.home')}
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
             <div className="bg-green-100 p-4 rounded-full text-green-700">
                {isTerms ? <FileText size={32} /> : <Lock size={32} />}
             </div>
             <h1 className="text-3xl font-bold text-gray-900">
               {isTerms ? t('footer.terms') : t('footer.privacy')}
             </h1>
          </div>

          <div className="prose prose-green max-w-none text-gray-600 space-y-6">
             {isTerms ? (
               <>
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{t('legal.introTitle')}</h3>
                   <p>{t('legal.introDesc')}</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{t('legal.farmerTermsTitle')}</h3>
                   <ul className="list-disc pl-5 space-y-2">
                     {(t('legal.farmerTerms', { returnObjects: true }) as string[]).map((item, i) => <li key={i}>{item}</li>)}
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{t('legal.buyerTermsTitle')}</h3>
                   <ul className="list-disc pl-5 space-y-2">
                     {(t('legal.buyerTerms', { returnObjects: true }) as string[]).map((item, i) => <li key={i}>{item}</li>)}
                   </ul>
                 </div>
               </>
             ) : (
               <>
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{t('legal.collectionTitle')}</h3>
                   <p>{t('legal.collectionDesc')}</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{t('legal.usageTitle')}</h3>
                   <p>{t('legal.usageDesc')}</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{t('legal.paymentSecurityTitle')}</h3>
                   <p>{t('legal.paymentSecurityDesc')}</p>
                 </div>
               </>
             )}
             
             <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8 rounded-r-lg">
                <div className="flex gap-3">
                  <ShieldCheck className="text-blue-600 w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="font-bold text-blue-800 mb-1">{t('legal.securityAssurance')}</h4>
                    <p className="text-sm text-blue-700 font-medium">{t('legal.securityAssuranceDesc')}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
