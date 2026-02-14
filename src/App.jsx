import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import WhatsAppFAB from './components/WhatsAppFAB';
import VoiceNavigation from './components/VoiceNavigation';
import MobileNav from './components/MobileNav';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import NetworkStatus from './components/NetworkStatus'; // Import NetworkStatus

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const Buyer = lazy(() => import('./pages/Buyer'));
const Seller = lazy(() => import('./pages/Seller'));
const MyProducts = lazy(() => import('./pages/MyProducts'));
const Products = lazy(() => import('./pages/Products'));
const Contact = lazy(() => import('./pages/Contact'));
const MandiRates = lazy(() => import('./pages/MandiRates'));
const Partner = lazy(() => import('./pages/Partner'));
const News = lazy(() => import('./pages/News'));
const Weather = lazy(() => import('./pages/Weather'));
const CropAdvisory = lazy(() => import('./pages/CropAdvisory'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Chaupal = lazy(() => import('./pages/Chaupal'));
const PashuPalan = lazy(() => import('./pages/PashuPalan'));
const Transport = lazy(() => import('./pages/Transport'));
const SellerDirectory = lazy(() => import('./pages/SellerDirectory'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const Help = lazy(() => import('./pages/Help'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Admin = lazy(() => import('./pages/Admin'));
const FPORegistration = lazy(() => import('./pages/FPORegistration'));
const TradeArea = lazy(() => import('./pages/TradeArea'));
import Promo from './pages/Promo';
import Land from './pages/Land';
import LandForm from './pages/LandForm';
import ConsentBanner from './components/ConsentBanner';
import InstallPrompt from './components/InstallPrompt';
import LanguageSelectionModal from './components/LanguageSelectionModal';

// Loading component
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--color-primary)' }}>
    <div className="spinner"></div>
    <style>{`
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `}</style>
  </div>
);

function App() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <LanguageSelectionModal />
        <main style={{ flex: 1 }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/marketplace" element={<Buyer />} />
              <Route path="/buyer" element={<Buyer />} />
              <Route path="/sell" element={<Seller />} />
              <Route path="/my-products" element={<MyProducts />} />
              <Route path="/products" element={<Products />} />
              <Route path="/rates" element={<MandiRates />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/news" element={<News />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/advisory" element={<CropAdvisory />} />
              <Route path="/chaupal" element={<Chaupal />} />
              <Route path="/pashu-palan" element={<PashuPalan />} />
              <Route path="/transport" element={<Transport />} />
              <Route path="/sellers" element={<SellerDirectory />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="Admin">
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="/fpo-registration" element={<FPORegistration />} />
              <Route path="/trade-area" element={<TradeArea />} />
              <Route path="/land" element={<Land />} />
              <Route path="/add-land" element={<LandForm />} />
              <Route path="/promo" element={<Promo />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <WhatsAppFAB />
        <VoiceNavigation />
        <MobileNav />
        <ConsentBanner />
        <InstallPrompt />
        <NetworkStatus />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
