
import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Register from './pages/Register';
import Login from './pages/Login';
import AiAssistant from './pages/AiAssistant';
import Help from './pages/Help';
import FloatingAiChat from './components/FloatingAiChat';
import Legal from './pages/Legal';
import About from './pages/About';
import News from './pages/News';
import FarmerDashboard from './pages/FarmerDashboard';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import ScrollToTop from './components/ScrollToTop';

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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Individual Pages (No Navbar/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Standard Pages (With Navbar/Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/ai-advisor" element={<AiAssistant />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/dashboard" element={<FarmerDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
