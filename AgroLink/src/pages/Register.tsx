
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { UserType } from '../types';
import { User, Phone, MapPin, Lock, CheckCircle, Sprout, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authAPI } from '../services/api';
import { useToast } from '../components/Toast';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [userType, setUserType] = useState<UserType>(UserType.FARMER);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.password) {
      showToast('કૃપા કરીને તમામ ફીલ્ડ ભરો', 'error');
      return;
    }

    // Validate name (at least 3 characters)
    if (formData.name.trim().length < 3) {
      showToast('કૃપા કરીને માન્ય નામ દાખલ કરો (ઓછામાં ઓછા 3 અક્ષરો)', 'error');
      return;
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      showToast('કૃપા કરીને માન્ય 10 અંકનો ફોન નંબર દાખલ કરો', 'error');
      return;
    }

    // Validate password strength (at least 6 characters)
    if (formData.password.length < 6) {
      showToast('પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરોનો હોવો જોઈએ', 'error');
      return;
    }

    // Validate location for farmers
    if (userType === UserType.FARMER && !formData.location) {
      showToast('કૃપા કરીને તમારું સ્થાન દાખલ કરો', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name.trim(),
        phone: formData.phone,
        password: formData.password,
        userType: userType,
        location: formData.location || 'ગુજરાત'
      });

      // Check if registration was successful
      if (response.success && response.token) {
        showToast(`સ્વાગત છે, ${formData.name}! હવે લોગિન કરો.`, 'success');

        // Small delay to show success message before navigation
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        throw new Error('રજિસ્ટ્રેશન પ્રતિસાદ અમાન્ય છે');
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      // Handle specific error messages
      let errorMessage = 'રજિસ્ટ્રેશન નિષ્ફળ. કૃપા કરીને ફરીથી પ્રયાસ કરો.';

      if (error.message.includes('Phone number already registered')) {
        errorMessage = 'આ ફોન નંબર પહેલેથી જ નોંધાયેલ છે. કૃપા કરીને લોગિન કરો.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'કૃપા કરીને તમામ ફીલ્ડ યોગ્ય રીતે ભરો';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'નેટવર્ક ભૂલ. કૃપા કરીને તમારું કનેક્શન તપાસો.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-stone-50 flex items-center justify-center p-0 md:p-8 font-sans relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="hidden md:block absolute top-1/4 -left-20 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="hidden md:block absolute bottom-1/4 -right-20 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-1000"></div>

      {/* Standalone Back Button */}
      <Link to="/" className="absolute top-8 left-8 z-30 flex items-center gap-2 text-green-700 font-bold hover:text-green-800 transition-all bg-white/90 backdrop-blur px-5 py-2.5 rounded-full shadow-sm border border-gray-100 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>{t('nav.home')}</span>
      </Link>

      <div className="max-w-6xl w-full bg-white md:rounded-[40px] md:shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 md:border md:border-white h-full md:h-auto">
        {/* Info Column */}
        <div className="bg-gradient-to-br from-green-800 via-green-900 to-emerald-950 text-white md:w-5/12 p-10 md:p-16 flex flex-col justify-between relative min-h-[400px] md:min-h-0">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-12 group w-fit">
              <div className="bg-white p-2.5 rounded-2xl shadow-xl transition-transform group-hover:rotate-6">
                <Sprout className="w-8 h-8 text-green-700" />
              </div>
              <span className="text-3xl font-black tracking-tighter">ખેડૂત સેતુ</span>
            </Link>

            <h2 className="text-3xl md:text-4xl font-black mb-10 leading-tight">{t('registerInfo.title')}</h2>

            <ul className="space-y-6">
              {(t('registerInfo.list', { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="bg-yellow-400 p-1.5 rounded-full mt-1 shrink-0 shadow-lg shadow-yellow-400/20">
                    <CheckCircle size={14} className="text-green-900" />
                  </div>
                  <span className="text-lg font-medium opacity-90 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-16 flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <ShieldCheck className="text-yellow-400" />
            <p className="text-xs font-bold text-white/80">તમારો ડેટા 100% સુરક્ષિત છે અને સરકારી નિયમોનું પાલન કરે છે.</p>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:w-7/12 p-8 md:p-16 bg-white overflow-y-auto">
          <div className="max-w-md mx-auto">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t('auth.registerTitle')}</h2>
              <p className="mt-3 text-gray-500 font-medium">{userType === UserType.FARMER ? t('auth.farmerDesc') : t('auth.buyerDesc')}</p>
            </div>

            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-10 border border-gray-100">
              <button
                onClick={() => setUserType(UserType.FARMER)}
                className={`flex-1 py-3.5 text-sm font-black rounded-xl transition-all ${userType === UserType.FARMER ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {t('auth.farmer')}
              </button>
              <button
                onClick={() => setUserType(UserType.BUYER)}
                className={`flex-1 py-3.5 text-sm font-black rounded-xl transition-all ${userType === UserType.BUYER ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {t('auth.buyer')}
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2 group-focus-within:text-green-600">{t('auth.fullName')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors"><User size={18} /></div>
                    <input name="name" type="text" required value={formData.name} onChange={handleChange} className="block w-full pl-11 px-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:outline-none focus:border-green-500 focus:bg-white transition-all" placeholder={userType === UserType.FARMER ? "રામજીભાઈ પટેલ" : "રમેશ કુમાર"} />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2 group-focus-within:text-green-600">{t('auth.phone')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors"><Phone size={18} /></div>
                    <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="block w-full pl-11 px-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:outline-none focus:border-green-500 focus:bg-white transition-all" placeholder="9876543210" />
                  </div>
                </div>

                {userType === UserType.FARMER && (
                  <div className="group animate-in fade-in slide-in-from-top-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2 group-focus-within:text-green-600">{t('auth.village')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors"><MapPin size={18} /></div>
                      <input name="location" type="text" required value={formData.location} onChange={handleChange} className="block w-full pl-11 px-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:outline-none focus:border-green-500 focus:bg-white transition-all" placeholder="તાલાલા, ગીર" />
                    </div>
                  </div>
                )}

                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2 group-focus-within:text-green-600">{t('auth.password')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors"><Lock size={18} /></div>
                    <input name="password" type="password" required value={formData.password} onChange={handleChange} className="block w-full pl-11 px-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:outline-none focus:border-green-500 focus:bg-white transition-all" placeholder="********" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-5 px-4 bg-green-700 hover:bg-green-800 text-white rounded-2xl font-black text-xl shadow-xl shadow-green-700/20 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70"
              >
                {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : t('auth.registerBtn')}
              </button>

              <div className="text-center">
                <p className="text-gray-500 font-bold text-sm">
                  {t('auth.haveAccount')}{' '}
                  <Link to="/login" className="text-green-700 hover:underline underline-offset-4 decoration-2">{t('auth.loginLink')}</Link>
                </p>
              </div>

              <div className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed pt-6 border-t border-gray-50">
                {t('auth.agree', { terms: t('auth.terms') })}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
