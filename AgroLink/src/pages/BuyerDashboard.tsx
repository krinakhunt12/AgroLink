import React from 'react';
import { Link } from 'react-router-dom';
import {
    ShoppingBag, Package, TrendingUp, Search,
    ArrowRight, Star, MapPin, IndianRupee
} from 'lucide-react';
import { useProducts, useOrders } from '../hooks/api';

const BuyerDashboard: React.FC = () => {
    const { data: products = [], isLoading: loadingProducts } = useProducts();
    const { data: orders = [], isLoading: loadingOrders } = useOrders();

    // Calculate stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
    const featuredProducts = products.filter((p: any) => p.featured).slice(0, 4);

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">ડેશબોર્ડ</h1>
                <p className="mt-2 text-gray-600">તમારા ખરીદી પ્રવૃત્તિઓનું વિહંગાવલોકન</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">કુલ ઓર્ડર્સ</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {loadingOrders ? '...' : totalOrders}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">પેન્ડિંગ ઓર્ડર્સ</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {loadingOrders ? '...' : pendingOrders}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">ઉપલબ્ધ ઉત્પાદનો</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {loadingProducts ? '...' : products.length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">ઝડપી ક્રિયાઓ</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        to="/buyer/marketplace"
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Search className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">ઉત્પાદનો શોધો</h3>
                        <p className="text-sm text-gray-600">નવા ઉત્પાદનો શોધો</p>
                    </Link>

                    <Link
                        to="/buyer/cart"
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">કાર્ટ જુઓ</h3>
                        <p className="text-sm text-gray-600">તમારી કાર્ટ તપાસો</p>
                    </Link>

                    <Link
                        to="/buyer/orders"
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-yellow-500 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">મારા ઓર્ડર્સ</h3>
                        <p className="text-sm text-gray-600">ઓર્ડર સ્ટેટસ ટ્રેક કરો</p>
                    </Link>

                    <Link
                        to="/buyer/profile"
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Star className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">પ્રોફાઇલ</h3>
                        <p className="text-sm text-gray-600">તમારી માહિતી અપડેટ કરો</p>
                    </Link>
                </div>
            </div>

            {/* Featured Products */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">ફીચર્ડ ઉત્પાદનો</h2>
                    <Link
                        to="/buyer/marketplace"
                        className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                        બધા જુઓ
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loadingProducts ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
                                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : featuredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product: any) => (
                            <Link
                                key={product.id}
                                to={`/buyer/product/${product.id}`}
                                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow group"
                            >
                                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                                        <MapPin className="w-3 h-3" />
                                        <span className="line-clamp-1">{product.location}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-green-600 font-bold">
                                            <IndianRupee className="w-4 h-4" />
                                            <span>{product.price}</span>
                                        </div>
                                        {product.rating && (
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">હાલમાં કોઈ ફીચર્ડ ઉત્પાદનો નથી</p>
                        <Link
                            to="/buyer/marketplace"
                            className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            માર્કેટપ્લેસ જુઓ
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyerDashboard;
