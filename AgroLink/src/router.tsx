import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingAiChat from './components/FloatingAiChat';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Page imports
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Register from './pages/Register';
import Login from './pages/Login';
import AiAssistant from './pages/AiAssistant';
import Help from './pages/Help';
import Legal from './pages/Legal';
import About from './pages/About';
import News from './pages/News';
import FarmerDashboard from './pages/FarmerDashboard';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';

/**
 * MainLayout provides the common UI wrapper (Navbar, Footer, AI Chat)
 * for standard application pages.
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
 * Centralized routing configuration for the entire application
 */
const AppRouter = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Public Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/ai-advisor" element={<AiAssistant />} />
                    <Route path="/terms" element={<Legal type="terms" />} />
                    <Route path="/privacy" element={<Legal type="privacy" />} />

                    {/* Public Market Preview (Optional, or redirect to Login if strict) */}
                    <Route path="/market" element={<Marketplace />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                </Route>

                {/* Farmer Routes (Protected) */}
                <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
                    <Route element={<MainLayout />}>
                        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                    </Route>
                </Route>

                {/* Buyer Routes (Protected) */}
                <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
                    <Route element={<MainLayout />}>
                        <Route path="/buyer/dashboard" element={<Marketplace />} />
                        <Route path="/cart" element={<Cart />} />
                    </Route>
                </Route>

                {/* Fallback - Redirect to Home */}
                <Route path="*" element={<Home />} />
            </Routes>
        </>
    );
};

export default AppRouter;
