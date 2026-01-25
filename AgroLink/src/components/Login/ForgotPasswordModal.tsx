import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, X, Send } from 'lucide-react';
import { useToast } from '../Toast';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [phone, setPhone] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;

        // For now, just show a message
        showToast("પાસવર્ડ રીસેટ ફીચર ટૂંક સમયમાં ઉપલબ્ધ થશે", "info");
        onClose();
        setPhone('');
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            પાસવર્ડ ભૂલી ગયા?
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <p className="text-gray-600 font-medium mb-8 leading-relaxed">
                        તમારો ફોન નંબર દાખલ કરો અને અમે તમને પાસવર્ડ રીસેટ કરવા માટે લિંક મોકલીશું.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                ફોન નંબર
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-green-500 focus:bg-white transition-all placeholder:font-medium"
                                    placeholder="9876543210"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!phone}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-green-700 hover:bg-green-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-700/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <Send size={20} />
                            રીસેટ લિંક મોકલો
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
