import React from 'react';
import { Link } from 'react-router-dom';
import {
    Package, ShoppingBag, MessageSquare, TrendingUp,
    Plus, Eye, IndianRupee, Users
} from 'lucide-react';
import { useProductsByFarmer } from '../hooks/api';
import { authAPI } from '../services/api';

const FarmerDashboardHome: React.FC = () => {
    const user = authAPI.getCurrentUser();
    const userId = user?.id || user?._id;
    const { data: products = [], isLoading } = useProductsByFarmer(userId || '');

    // Calculate stats
    const totalProducts = products.length;
    const activeProducts = products.filter((p: any) => p.status === 'active').length;
    const totalRevenue = products.reduce((sum: number, p: any) => sum + (p.price * (p.soldQuantity || 0)), 0);

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">ડેશબોર્ડ</h1>
                <p className="mt-2 text-gray-600">તમારા ખેતી વ્યવસાયનું વિહંગાવલોકન</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">કુલ ઉત્પાદનો</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {isLoading ? '...' : totalProducts}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">સક્રિય જાહેરાતો</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {isLoading ? '...' : activeProducts}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">કુલ આવક</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2 flex items-center gap-1">
                                <IndianRupee className="w-6 h-6" />
                                {isLoading ? '...' : totalRevenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">કુલ ખરીદદારો</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {isLoading ? '...' : '0'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">ઝડપી ક્રિયાઓ</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        to="/dashboard/products/new"
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">નવું ઉત્પાદન</h3>
                        <p className="text-sm text-gray-600">નવો પાક ઉમેરો</p>
                    </Link>

                    <Link
                        to="/dashboard/products"
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">મારા ઉત્પાદનો</h3>
                        <p className="text-sm text-gray-600">ઉત્પાદનો મેનેજ કરો</p>
                    </Link>

                    <Link
                        to="/dashboard/orders"
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-yellow-500 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">ઓર્ડર્સ</h3>
                        <p className="text-sm text-gray-600">ઓર્ડર સ્ટેટસ જુઓ</p>
                    </Link>

                    <Link
                        to="/dashboard/bids"
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">બિડ્સ</h3>
                        <p className="text-sm text-gray-600">બિડ્સ મેનેજ કરો</p>
                    </Link>
                </div>
            </div>

            {/* Recent Products */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">તાજેતરના ઉત્પાદનો</h2>
                    <Link
                        to="/dashboard/products"
                        className="text-sm font-medium text-green-600 hover:text-green-700"
                    >
                        બધા જુઓ →
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.slice(0, 6).map((product: any) => (
                            <div
                                key={product.id || product._id}
                                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                            >
                                <div className="aspect-video bg-gray-100 relative">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                    <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${product.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {product.status}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-green-600 font-bold">
                                            <IndianRupee className="w-4 h-4" />
                                            <span>{product.price}</span>
                                            <span className="text-xs text-gray-500">/ {product.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">તમે હજુ સુધી કોઈ ઉત્પાદન ઉમેર્યું નથી</p>
                        <Link
                            to="/dashboard/products/new"
                            className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            પ્રથમ ઉત્પાદન ઉમેરો
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FarmerDashboardHome;
