
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Phone, Lock, Sprout, Lightbulb, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useLogin } from '../hooks/api';
import { useToast } from '../components/Toast';
import { authAPI } from '../services/api';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const loginMutation = useLogin();

  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.phone || !formData.password) {
      showToast('કૃપા કરીને તમામ ફીલ્ડ ભરો', 'error');
      return;
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      showToast('કૃપા કરીને માન્ય 10 અંકનો ફોન નંબર દાખલ કરો', 'error');
      return;
    }

    try {
      // Use TanStack Query mutation
      await loginMutation.mutateAsync({
        phone: formData.phone,
        password: formData.password
      });

      // Get user info to determine redirect
      const user = authAPI.getCurrentUser();

      // Small delay to show success message
      setTimeout(() => {
        // Redirect based on user type
        const from = (location.state as any)?.from?.pathname;
        if (from && !from.includes('/login') && !from.includes('/register')) {
          navigate(from, { replace: true });
        } else if (user?.userType === 'farmer') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/buyer/dashboard', { replace: true });
        }
      }, 500);
    } catch (error: any) {
      // Error handling is done in the mutation
      // Just log for debugging
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

      {/* Floating Back Button */}
      <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-green-700 font-bold hover:text-green-800 transition-all bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm hover:shadow group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>{t('nav.home')}</span>
      </Link>

      <div className="max-w-4xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse relative z-10 border border-white">
        {/* Visual Panel */}
        <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 text-green-950 md:w-5/12 p-10 flex flex-col justify-between relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" /></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          </div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-10 text-green-950 hover:scale-105 transition-transform w-fit">
              <div className="bg-white p-2 rounded-2xl shadow-lg">
                <Sprout size={32} className="text-green-700" />
              </div>
              <span className="font-black text-2xl tracking-tighter">ખેડૂત સેતુ</span>
            </Link>

            <div className="space-y-6">
              <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm">
                <h3 className="flex items-center gap-2 font-black text-lg mb-2">
                  <Lightbulb className="text-green-950" /> {t('loginInfo.title')}
                </h3>
                <p className="font-medium text-sm leading-relaxed opacity-90">{t('loginInfo.tip')}</p>
              </div>

              <div className="flex items-center gap-3 text-green-950/70 font-bold text-xs uppercase tracking-widest pl-4">
                <ShieldCheck size={16} /> 100% સુરક્ષિત અને વેરિફાઈડ
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-green-950/40">© 2024 Khedut Setu</p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="md:w-7/12 p-8 md:p-14">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t('auth.loginTitle')}</h2>
            <p className="mt-3 text-gray-500 font-medium">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="font-bold text-green-700 hover:text-green-800 underline underline-offset-4 decoration-2">{t('auth.registerLink')}</Link>
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 group-focus-within:text-green-600 transition-colors">{t('auth.phone')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600"><Phone size={18} /></div>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-green-500 focus:bg-white transition-all placeholder:font-medium"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 group-focus-within:text-green-600 transition-colors">{t('auth.password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600"><Lock size={18} /></div>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-green-500 focus:bg-white transition-all placeholder:font-medium"
                    placeholder="********"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg text-green-600 focus:ring-green-500 border-gray-300 bg-gray-50" />
                <span className="ml-2 text-sm text-gray-500 font-bold group-hover:text-gray-900 transition-colors">{t('auth.rememberMe')}</span>
              </label>
              <a href="#" className="text-sm font-bold text-green-700 hover:text-green-800 hover:underline">{t('auth.forgotPassword')}</a>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex justify-center py-5 px-4 bg-green-700 hover:bg-green-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-700/20 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loginMutation.isPending ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2"><LogIn size={20} /> {t('auth.loginBtn')}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
