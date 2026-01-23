import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Star, MapPin, BadgeCheck, ShoppingCart,
    TrendingUp, Phone, ArrowLeft, Check,
    Truck, ShieldCheck, Package, ChevronRight, Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { productsAPI, ordersAPI } from '../services/api';
import { useToast } from '../components/Toast';
import AppLogger, { Category } from '../utils/logger';
import { useCart } from '../hooks/useCart';

import { useTranslation } from 'react-i18next';

const ProductDetail: React.FC = () => {
    const { t } = useTranslation(['products', 'common', 'errors']);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const cart = useCart();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await productsAPI.getById(id);
                setProduct(response.data);

                // Fetch related products (same category)
                const allProducts = await productsAPI.getAll();
                const filtered = allProducts.data
                    .filter((p: any) => p.category === response.data.category && p._id !== response.data._id)
                    .slice(0, 3);
                setRelatedProducts(filtered);
            } catch (error) {
                AppLogger.error(Category.API, "Failed to fetch product details", error as Error);
                showToast(t('errors:general.error'), 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, showToast, t]);

    const handleOrder = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            showToast(t('errors:login.failed'), 'warning');
            navigate('/login');
            return;
        }

        setActionLoading(true);
        try {
            await ordersAPI.create({
                productId: product._id,
                quantity,
                deliveryAddress: JSON.parse(userStr).location || 'Farm pickup',
                paymentMethod: 'cash'
            });
            showToast(t('products:market.successMsg'), 'success');
            navigate('/market');
        } catch (error: any) {
            AppLogger.error(Category.API, "Order failed", error as Error);
            showToast(error.message || t('errors:general.error'), 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        cart.addToCart({
            ...product,
            id: product._id || product.id
        }, quantity);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                    <p className="font-bold text-gray-600">{t('common:common.loading')}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 mb-4">{t('products:market.noProducts')}</h2>
                    <Link to="/market" className="text-green-700 font-bold hover:underline">{t('products:detail.back')}</Link>
                </div>
            </div>
        );
    }

    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Link to="/" className="hover:text-green-700">મુખ્ય પૃષ્ઠ</Link>
                        <ChevronRight size={16} />
                        <Link to="/market" className="hover:text-green-700">બજાર</Link>
                        <ChevronRight size={16} />
                        <span className="text-gray-900">{product.category}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <Link to="/market">
                    <button className="flex items-center gap-2 text-green-700 font-bold hover:text-green-800 mb-6 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        {t('products:detail.back')}
                    </button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Product Images */}
                    <div>
                        {/* Main Image */}
                        <Card className="mb-4 overflow-hidden shadow-xl border-0 ring-1 ring-black/5">
                            <div className="relative aspect-square">
                                <img
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {product.isVerified && (
                                    <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                        <BadgeCheck size={18} />
                                        <span className="font-black text-sm">{t('products:detail.verified')}</span>
                                    </div>
                                )}
                                {product.isNegotiable && (
                                    <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                        <TrendingUp size={18} />
                                        <span className="font-black text-sm">{t('products:detail.negotiable')}</span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Thumbnail Images */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${selectedImage === index
                                            ? 'border-green-600 shadow-lg scale-95'
                                            : 'border-transparent hover:border-gray-200 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-6">
                            <span className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4">
                                {product.category}
                            </span>
                            <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-black text-yellow-700">{product.rating || '4.5'}</span>
                                    <span className="text-sm text-gray-500 font-medium">({product.totalRatings || '20'} {t('products:detail.ratings')})</span>
                                </div>
                            </div>

                            {/* Farmer Info */}
                            <div className="flex items-center gap-4 p-4 bg-white shadow-sm border border-gray-100 rounded-3xl mb-6">
                                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-inner">
                                    {(product.farmer?.name || 'K')[0]}
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-gray-900">{product.farmer?.name || t('products:market.farmer')}</p>
                                    <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                        <MapPin size={14} />
                                        {product.location}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => window.open(`tel:${product.farmer?.phone || '9999999999'}`)}>
                                    <Phone size={16} />
                                    {t('products:detail.call')}
                                </Button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 rounded-3xl mb-6 text-white shadow-xl shadow-green-900/10">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-black">₹{product.price}</span>
                                <span className="text-xl opacity-80 font-bold">/ {product.unit}</span>
                            </div>
                            <p className="text-sm font-bold text-green-100">{t('products:detail.inStock', { count: product.stock || 100, unit: product.unit })}</p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4">{t('products:detail.selectQuantity')}</label>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center bg-white border-2 border-gray-100 rounded-3xl p-2 shadow-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-xl font-black transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="text-2xl font-black w-16 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock || 100, quantity + 1))}
                                        className="w-12 h-12 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-xl font-black transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-gray-500 font-bold text-lg">× {product.unit}</span>
                            </div>
                            <div className="mt-4 flex justify-between items-center p-4 bg-gray-900 rounded-2xl text-white">
                                <span className="text-sm font-bold opacity-70">{t('products:detail.totalPrice')}</span>
                                <span className="text-2xl font-black">₹{product.price * quantity}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Button variant="primary" className="flex-1 py-6 text-lg shadow-lg shadow-green-600/20" onClick={handleAddToCart} isLoading={actionLoading}>
                                <ShoppingCart size={22} className="mr-2" />
                                {t('products:detail.addToCart')}
                            </Button>
                            <Button variant="outline" className="flex-1 py-6 text-lg" onClick={handleOrder} isLoading={actionLoading}>
                                {t('products:detail.orderNow')}
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            <div className="text-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="text-[10px] font-black text-gray-700 uppercase">{t('products:detail.fastDelivery')}</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="text-[10px] font-black text-gray-700 uppercase">{t('products:detail.secure')}</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="text-[10px] font-black text-gray-700 uppercase">{t('products:detail.fresh')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
                    <div className="lg:col-span-2">
                        <Card className="p-10 shadow-sm border-0 ring-1 ring-black/5">
                            <h2 className="text-3xl font-black text-gray-900 mb-8">{t('products:detail.productDetails')}</h2>

                            <div className="mb-10">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t('products:detail.description')}</h3>
                                <p className="text-gray-600 leading-relaxed text-lg font-medium">
                                    {product.description || t('products:detail.defaultDescription')}
                                </p>
                            </div>

                            {/* Features if any (using static ones for now as backend might not have them) */}
                            <div className="mb-10">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{t('products:detail.features')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(t('products:detail.defaultFeatures', { returnObjects: true }) as string[]).map((feature, index) => (
                                        <div key={index} className="flex items-center gap-4 bg-green-50/50 p-5 rounded-2xl border border-green-100/50">
                                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white shrink-0">
                                                <Check size={14} />
                                            </div>
                                            <span className="font-bold text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="p-8 bg-gray-900 text-white shadow-xl shadow-gray-200 border-0 ring-1 ring-white/10">
                            <h3 className="text-xl font-black mb-6">{t('products:detail.specifications')}</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="opacity-60 text-sm font-bold">{t('products:detail.weight')}</span>
                                    <span className="font-black">{product.unit}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="opacity-60 text-sm font-bold">{t('products:detail.category')}</span>
                                    <span className="font-black">{product.category}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="opacity-60 text-sm font-bold">{t('products:detail.location')}</span>
                                    <span className="font-black">{product.location}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="opacity-60 text-sm font-bold">{t('products:detail.type')}</span>
                                    <span className="font-black">{t('products:detail.defaultType')}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 mb-2">{t('products:detail.similarProducts')}</h2>
                                <p className="text-gray-500 font-medium">{t('products:detail.youMayLike')}</p>
                            </div>
                            <Link to="/market" className="text-green-700 font-bold hover:underline flex items-center gap-2">
                                {t('products:detail.viewMore')} <ChevronRight size={16} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedProducts.map((item: any) => (
                                <Link key={item._id} to={`/product/${item._id}`}>
                                    <Card className="group hover:shadow-2xl transition-all duration-500 h-full border-0 ring-1 ring-black/5 overflow-hidden">
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-900">
                                                {item.category}
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-green-700 transition-colors">{item.name}</h3>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-black text-yellow-700">{item.rating || '4.5'}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-black text-gray-900">₹{item.price}</span>
                                                    <span className="text-xs text-gray-500 font-bold">/ {item.unit}</span>
                                                </div>
                                                <div className="bg-green-50 text-green-700 p-2 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
