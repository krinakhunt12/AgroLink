import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingCart, Trash2, Plus, Minus, ArrowRight,
    Tag, Truck, ShieldCheck, AlertCircle, Heart
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useCart } from '../hooks/useCart';
import { useToast } from '../components/Toast';

const Cart: React.FC = () => {
    const { t } = useTranslation(['products', 'errors']);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const cart = useCart();

    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(JSON.parse(localStorage.getItem('user') || '{}').location || '');

    const subtotal = cart.subtotal;
    const deliveryFee = subtotal > 0 ? 100 : 0;
    const discount = subtotal > 2000 ? 100 : 0;
    const total = subtotal + deliveryFee - discount;

    const handleCheckout = async () => {
        const user = localStorage.getItem('user');
        if (!user) {
            showToast(t('errors:login.failed'), 'warning');
            navigate('/login');
            return;
        }

        if (!address) {
            showToast(t('products:cart.addressPlaceholder'), 'warning');
            return;
        }

        setLoading(true);
        const success = await cart.checkout(address);
        setLoading(false);
        if (success) {
            navigate('/market');
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 py-8 px-4 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <ShoppingCart className="text-green-600" size={36} />
                        {t('products:cart.title')}
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">
                        {t('products:cart.itemsCount', { count: cart.items.length })}
                    </p>
                </div>

                {cart.items.length === 0 ? (
                    // Empty Cart State
                    <Card className="p-20 text-center">
                        <ShoppingCart className="w-24 h-24 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-gray-400 mb-4">{t('products:cart.empty')}</h2>
                        <p className="text-gray-500 mb-8 font-medium">{t('products:cart.emptySubtitle')}</p>
                        <Link to="/market">
                            <Button variant="primary" className="px-8 py-4">
                                {t('products:market.title')}
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <Card key={item.id} className="p-6 hover:shadow-xl transition-shadow">
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden shrink-0 group">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <button
                                                onClick={() => cart.removeFromCart(item.id)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-xl font-black text-gray-900">{item.name}</h3>
                                                    <p className="text-sm text-gray-500 font-bold mt-1">
                                                        {item.farmer?.name} • {item.location}
                                                    </p>
                                                </div>
                                                <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <Heart size={20} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-6">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus size={18} />
                                                    </button>
                                                    <span className="text-xl font-black w-12 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= (item.stock || 999)}
                                                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                    <span className="text-xs text-gray-400 font-bold ml-2">/ {item.unit}</span>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-gray-900">₹{item.price * item.quantity}</p>
                                                    <p className="text-xs text-gray-400 font-bold">₹{item.price} / {item.unit}</p>
                                                </div>
                                            </div>

                                            {/* Stock Warning */}
                                            {item.stock && item.quantity >= item.stock && (
                                                <div className="mt-3 flex items-center gap-2 text-red-500 text-xs font-bold">
                                                    <AlertCircle size={14} />
                                                    {t('products:cart.maxStock')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}

                            {/* Continue Shopping */}
                            <Link to="/market" className="block">
                                <button className="w-full py-4 text-green-700 font-bold hover:bg-green-50 rounded-2xl transition-colors flex items-center justify-center gap-2">
                                    ← {t('products:cart.continueShopping')}
                                </button>
                            </Link>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="p-8 sticky top-24">
                                <h2 className="text-2xl font-black text-gray-900 mb-6">{t('products:cart.summary')}</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('products:cart.deliveryAddress')}</label>
                                        <textarea
                                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-4 py-3 focus:ring-4 ring-green-500/10 focus:border-green-500 transition-all font-bold text-sm resize-none"
                                            rows={2}
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder={t('products:cart.addressPlaceholder')}
                                        />
                                    </div>

                                    <div className="flex justify-between text-gray-600 font-bold">
                                        <span>{t('products:cart.subtotal')} ({cart.items.length} {t('products:cart.items')})</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 font-bold">
                                        <span className="flex items-center gap-2">
                                            <Truck size={16} />
                                            {t('products:cart.deliveryFee')}
                                        </span>
                                        <span>₹{deliveryFee}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600 font-bold">
                                        <span className="flex items-center gap-2">
                                            <Tag size={16} />
                                            {t('products:cart.discount')}
                                        </span>
                                        <span>-₹{discount}</span>
                                    </div>
                                    <div className="border-t-2 border-gray-100 pt-4 flex justify-between text-xl font-black text-gray-900">
                                        <span>{t('products:cart.total')}</span>
                                        <span>₹{total}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full py-5 text-lg mb-4"
                                    onClick={handleCheckout}
                                    isLoading={loading}
                                >
                                    {t('products:cart.checkout')}
                                    <ArrowRight size={20} className="ml-2" />
                                </Button>

                                {/* Trust Badges */}
                                <div className="space-y-3 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                        <ShieldCheck size={18} className="text-green-600" />
                                        {t('products:cart.securePayment')}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                        <Truck size={18} className="text-green-600" />
                                        {t('products:cart.fastDelivery')}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                        <Tag size={18} className="text-green-600" />
                                        {t('products:cart.bestPrice')}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
