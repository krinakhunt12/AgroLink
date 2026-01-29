import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { authAPI } from '../../services/api';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await authAPI.adminLogin({ email, password });
            if (response.success) {
                navigate('/admin/dashboard');
            } else {
                setError(response.message || 'Authentication failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-['Inter',_sans-serif]">
            {/* Background pattern/elements if needed, keeping it minimal */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#1e293b]"></div>

            <div className="w-full max-w-[440px]">
                {/* Logo/Brand Area */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-200 mb-6 group transition-all duration-300 hover:border-slate-300 hover:shadow-md">
                        <Shield className="w-8 h-8 text-[#1e293b]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight mb-2">
                        Admin Login – Smart Agro-Market
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Authorized personnel only
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-red-600 leading-tight">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-[#1e293b] flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[#1e293b] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all duration-200"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-[#1e293b] flex items-center gap-2">
                                <Lock className="w-4 h-4 text-slate-400" />
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[#1e293b] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all duration-200"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#1e293b] hover:bg-[#0f172a] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100 group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Login to Dashboard
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="mt-10 text-center">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" />
                        Secure Admin Gateway
                    </p>
                    <div className="mt-4 flex justify-center gap-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
