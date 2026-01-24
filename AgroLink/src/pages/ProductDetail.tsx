import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Star, MapPin, BadgeCheck, ShoppingCart,
    Phone, ArrowLeft,
    Truck, ShieldCheck, Package, ChevronRight, Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { productsAPI, ordersAPI } from '../services/api';
import { useToast } from '../components/Toast';
import AppLogger, { Category } from '../utils/logger';
import { useCart } from '../hooks/useCart';
import { useTranslation } from 'react-i18next';
import { Badge } from '../components/ui/badge';

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
            <div className="min-h-screen flex items-center justify-center bg-bg-base">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-4" />
                    <p className="font-semibold text-text-muted">{t('common:common.loading')}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-base">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">{t('products:market.noProducts')}</h2>
                    <Link to="/market">
                        <Button variant="outline">{t('products:detail.back')}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    return (
        <div className="min-h-screen bg-bg-base font-sans pb-20">
            {/* Breadcrumb & Navigation */}
            <div className="bg-white border-b border-border-base">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
                            <Link to="/" className="hover:text-brand-primary transition-colors">{t('common:nav.home')}</Link>
                            <ChevronRight size={14} />
                            <Link to="/market" className="hover:text-brand-primary transition-colors">{t('common:nav.market')}</Link>
                            <ChevronRight size={14} />
                            <span className="text-text-primary">{t('common:categories.items.' + product.category)}</span>
                        </div>
                        <Link to="/market" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
                            <ArrowLeft size={14} /> {t('products:detail.back')}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Media Section */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white border border-border-base rounded-lg overflow-hidden shadow-sm">
                            <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-20 h-20 rounded border-2 shrink-0 transition-all ${selectedImage === idx ? 'border-brand-primary' : 'border-transparent opacity-60'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover rounded-[2px]" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col">
                        <div className="flex-1 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="bg-brand-primary/5 text-brand-primary border-brand-primary/20 text-[10px] uppercase font-bold tracking-wider">
                                        {t('common:categories.items.' + product.category)}
                                    </Badge>
                                    {product.isVerified && (
                                        <Badge className="bg-status-success/10 text-status-success border-none text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                                            <BadgeCheck size={12} /> {t('products:detail.verified')}
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-3xl font-bold text-text-primary tracking-tight leading-tight">{product.name}</h1>

                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 fill-status-warning text-status-warning" />
                                    <span className="font-bold text-text-primary">{product.rating || '4.5'}</span>
                                    <span className="text-sm text-text-muted font-medium ml-1">({product.totalRatings || '24'} {t('products:detail.ratings')})</span>
                                </div>
                            </div>

                            <div className="p-4 bg-bg-surface border border-border-base rounded-lg shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 bg-bg-muted rounded-full flex items-center justify-center text-text-primary font-bold">
                                    {(product.farmer?.name || 'K')[0]}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm text-text-primary">{product.farmer?.name || t('products:market.farmer')}</p>
                                    <p className="text-xs text-text-muted font-medium flex items-center gap-1 mt-0.5">
                                        <MapPin size={12} /> {product.location}
                                    </p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-brand-primary font-bold flex items-center gap-1.5" onClick={() => window.open(`tel:${product.farmer?.phone || '9999999999'}`)}>
                                    <Phone size={14} /> {t('products:detail.call')}
                                </Button>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-text-primary">₹{product.price}</span>
                                    <span className="text-lg text-text-muted font-medium">/ {product.unit}</span>
                                </div>
                                <div className="text-xs font-bold text-status-success flex items-center gap-1">
                                    <Package size={14} /> {t('products:detail.inStock', { count: product.stock || 150, unit: product.unit })}
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-border-base">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('products:detail.selectQuantity')}</span>
                                    <div className="flex items-center gap-4 bg-bg-muted/50 p-1 rounded-md border border-border-base">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center font-bold hover:bg-bg-muted rounded transition-colors">-</button>
                                        <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                                        <button onClick={() => setQuantity(Math.min(product.stock || 100, quantity + 1))} className="w-8 h-8 flex items-center justify-center font-bold hover:bg-bg-muted rounded transition-colors">+</button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <span className="text-text-muted underline underline-offset-4 decoration-border-base">{t('products:detail.totalPrice')}</span>
                                    <span className="text-xl font-bold text-text-primary">₹{product.price * quantity}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 grid grid-cols-2 gap-4">
                            <Button className="h-12 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold shadow-sm cursor-pointer" onClick={handleAddToCart}>
                                <ShoppingCart size={18} className="mr-2" /> {t('products:detail.addToCart')}
                            </Button>
                            <Button variant="outline" className="h-12 border-border-base font-bold text-text-primary hover:bg-bg-muted cursor-pointer" onClick={handleOrder} isLoading={actionLoading}>
                                {t('products:detail.orderNow')}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Info Tabs / Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-text-primary">{t('products:detail.productDetails')}</h2>
                            <p className="text-text-secondary leading-relaxed font-medium">
                                {product.description || t('products:detail.defaultDescription')}
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-white border border-border-base rounded-lg text-center space-y-2">
                                <Truck size={24} className="mx-auto text-brand-primary" />
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('products:detail.fastDelivery')}</p>
                            </div>
                            <div className="p-4 bg-white border border-border-base rounded-lg text-center space-y-2">
                                <ShieldCheck size={24} className="mx-auto text-brand-primary" />
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('products:detail.secure')}</p>
                            </div>
                            <div className="p-4 bg-white border border-border-base rounded-lg text-center space-y-2">
                                <Package size={24} className="mx-auto text-brand-primary" />
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('products:detail.fresh')}</p>
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <Card className="border border-border-base bg-white shadow-sm overflow-hidden">
                            <div className="p-4 bg-bg-muted/50 border-b border-border-base">
                                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">{t('products:detail.specifications')}</h3>
                            </div>
                            <div className="p-4 space-y-4 text-sm font-medium">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-text-muted">{t('products:detail.weight')}</span>
                                    <span className="text-text-primary font-bold">{product.unit}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-text-muted">{t('products:detail.category')}</span>
                                    <span className="text-text-primary font-bold">{t('common:categories.items.' + product.category)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-text-muted">{t('products:detail.location')}</span>
                                    <span className="text-text-primary font-bold">{product.location}</span>
                                </div>
                            </div>
                        </Card>
                    </aside>
                </div>

                {/* Related Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 pt-16 border-t border-border-base">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-text-primary">{t('products:detail.similarProducts')}</h2>
                                <p className="text-text-muted text-sm mt-1">{t('products:detail.youMayLike')}</p>
                            </div>
                            <Link to="/market" className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1 cursor-pointer">
                                {t('products:market.title')} <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedProducts.map((item: any) => (
                                <Link key={item._id} to={`/product/${item._id}`}>
                                    <Card className="group bg-bg-surface border-border-base hover:border-brand-primary/50 transition-colors rounded-lg overflow-hidden shadow-sm h-full flex flex-col cursor-pointer">
                                        <div className="relative h-48 overflow-hidden bg-bg-muted shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-none" />
                                        </div>
                                        <CardContent className="p-4 flex-1 flex flex-col">
                                            <h3 className="font-bold text-text-primary text-sm tracking-tight truncate mb-1">{item.name}</h3>
                                            <div className="flex items-center gap-1 mb-4">
                                                <Star className="w-3 h-3 fill-status-warning text-status-warning" />
                                                <span className="text-xs font-bold text-text-secondary">{item.rating || '4.5'}</span>
                                            </div>
                                            <div className="mt-auto flex items-baseline gap-1">
                                                <span className="text-lg font-bold text-text-primary">₹{item.price}</span>
                                                <span className="text-[10px] text-text-muted font-bold">/ {item.unit}</span>
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

