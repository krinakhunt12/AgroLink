import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingAiChat from './components/FloatingAiChat';
import ScrollToTop from './components/ScrollToTop';

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
                {/* Auth Pages (No Navbar/Footer) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Standard Pages (With Navbar/Footer) */}
                <Route element={<MainLayout />}>
                    {/* Home */}
                    <Route path="/" element={<Home />} />

                    {/* Marketplace & Products */}
                    <Route path="/market" element={<Marketplace />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />

                    {/* Dashboard */}
                    <Route path="/dashboard" element={<FarmerDashboard />} />

                    {/* AI & Help */}
                    <Route path="/ai-advisor" element={<AiAssistant />} />
                    <Route path="/help" element={<Help />} />

                    {/* Information Pages */}
                    <Route path="/about" element={<About />} />
                    <Route path="/news" element={<News />} />

                    {/* Legal Pages */}
                    <Route path="/terms" element={<Legal type="terms" />} />
                    <Route path="/privacy" element={<Legal type="privacy" />} />
                </Route>
            </Routes>
        </>
    );
};

export default AppRouter;
