import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingAiChat from './components/FloatingAiChat';
import ScrollToTop from './components/ScrollToTop';
import DashboardLayout from './components/layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import AiAssistant from './pages/AiAssistant';
import Help from './pages/Help';
import Legal from './pages/Legal';
import About from './pages/About';
import News from './pages/News';
import Videos from './pages/Videos';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';

// Farmer Dashboard Pages
import FarmerDashboardHome from './pages/FarmerDashboardHome';
import FarmerDashboard from './pages/FarmerDashboard';

// Buyer Dashboard Pages
import BuyerDashboard from './pages/BuyerDashboard';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminListings from './pages/admin/AdminListings';
import AdminPlaceholder from './pages/admin/AdminPlaceholder';
import SystemHealth from './pages/admin/SystemHealth';

/**
 * MainLayout provides the common UI wrapper (Navbar, Footer, AI Chat)
 * for public pages only.
 */
const MainLayout = () => (
    <div className="flex flex-col min-h-screen relative">
        <Navbar />
        <main className="flex-grow">
            <Outlet />
        </main>
        <Footer />
        <FloatingAiChat />
    </div>
);

/**
 * AppRouter component
 * Centralized routing with role-based authentication
 */
const AppRouter = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* ============= PUBLIC ROUTES (No Auth Required) ============= */}

                {/* Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Admin Auth (Separate from main login) */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Public Pages with Navbar/Footer */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/market" element={<Marketplace />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/ai-advisor" element={<AiAssistant />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/terms" element={<Legal type="terms" />} />
                    <Route path="/privacy" element={<Legal type="privacy" />} />
                </Route>

                {/* Farmer Routes (Protected) */}
                <Route element={<ProtectedRoute requiredRole="farmer" />}>
                    <Route element={<MainLayout />}>
                        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                        <Route path="/farmer/products/add" element={<AddProduct />} />
                        <Route path="/farmer/products/edit/:id" element={<EditProduct />} />
                    </Route>
                </Route>


                {/* Buyer Routes (Protected) */}
                <Route element={<ProtectedRoute requiredRole="buyer" />}>
                    <Route element={<MainLayout />}>
                        <Route path="/buyer/dashboard" element={<Marketplace />} />
                        <Route path="/cart" element={<Cart />} />
                    </Route>
                </Route>

                {/* ============= FARMER DASHBOARD (Protected) ============= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute requiredRole="farmer">
                            <DashboardLayout userType="farmer" />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<FarmerDashboardHome />} />
                    <Route path="products" element={<FarmerDashboard />} />
                    <Route path="products/new" element={<FarmerDashboard />} />
                    <Route path="orders" element={<div className="p-8"><h1 className="text-2xl font-bold">ઓર્ડર્સ</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
                    <Route path="bids" element={<div className="p-8"><h1 className="text-2xl font-bold">બિડ્સ</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
                    <Route path="profile" element={<div className="p-8"><h1 className="text-2xl font-bold">પ્રોફાઇલ</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
                </Route>

                {/* ============= BUYER DASHBOARD (Protected) ============= */}

                <Route
                    path="/buyer"
                    element={
                        <ProtectedRoute requiredRole="buyer">
                            <DashboardLayout userType="buyer" />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/buyer/dashboard" replace />} />
                    <Route path="dashboard" element={<BuyerDashboard />} />
                    <Route path="marketplace" element={<Marketplace />} />
                    <Route path="product/:id" element={<ProductDetail />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="orders" element={<div className="p-8"><h1 className="text-2xl font-bold">મારા ઓર્ડર્સ</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
                    <Route path="wishlist" element={<div className="p-8"><h1 className="text-2xl font-bold">વિશલિસ્ટ</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
                    <Route path="profile" element={<div className="p-8"><h1 className="text-2xl font-bold">પ્રોફાઇલ</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
                </Route>

                {/* ============= ADMIN DASHBOARD (Protected) ============= */}
                <Route element={<ProtectedRoute requiredRole="admin" />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/farmers" element={<AdminUsers type="farmer" />} />
                        <Route path="/admin/buyers" element={<AdminUsers type="buyer" />} />
                        <Route path="/admin/listings" element={<AdminListings />} />
                        <Route path="/admin/orders" element={<AdminPlaceholder title="Transactions & Orders" />} />
                        <Route path="/admin/ai-logs" element={<AdminPlaceholder title="AI Price Prediction Logs" />} />
                        <Route path="/admin/forecast" element={<AdminPlaceholder title="Demand Forecast Reports" />} />
                        <Route path="/admin/analytics" element={<AdminPlaceholder title="System Analytics" />} />
                        <Route path="/admin/health" element={<SystemHealth />} />
                        <Route path="/admin/settings" element={<AdminPlaceholder title="Settings" />} />
                    </Route>
                </Route>

                {/* ============= FALLBACK ============= */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default AppRouter;
