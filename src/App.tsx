import { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from './utils/api';
import { Home, ShoppingCart, List, Mail, Loader2 } from 'lucide-react';

const Dashboard = lazy(() => import('./components/Dashboard'));
const ProductList = lazy(() => import('./components/ProductList'));
const CustomRequests = lazy(() => import('./components/CustomRequests'));
const Orders = lazy(() => import('./components/Orders'));

type Screen = 'dashboard' | 'products' | 'requests' | 'orders';

const NavItem = ({
  screen,
  currentScreen,
  setScreen,
  children,
  label,
}: {
  screen: Screen;
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  children: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={() => setScreen(screen)}
    className={`flex items-center w-full px-4 py-3 text-left text-gray-600 rounded-lg transition-colors duration-200 ${
      currentScreen === screen
        ? 'bg-gray-200 text-gray-900 font-semibold'
        : 'hover:bg-gray-100'
    }`}
  >
    {children}
    <span className="ml-3">{label}</span>
  </button>
);

function App() {
  const [seller, setSeller] = useState<{ user_id: string; name?: string } | null>(null);
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [authLog, setAuthLog] = useState('Authenticating with Telegram...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encryptedId = params.get('auth');
    if (!encryptedId) {
      setAuthLog('Authentication failed: No auth token found in URL.');
      return;
    }
    setAuthLog('Authenticating with Telegram...');
    loadSellerInfo(encryptedId);
  }, []);

  const loadSellerInfo = async (encryptedId: string) => {
    try {
      setAuthLog('Loading profile from backend...');
      const data = await api.authenticateSeller(encryptedId);
      if (data.profile) {
        setSeller(data.profile);
        setAuthLog('Authentication successful, opening dashboard...');
      } else {
        setAuthLog('Authentication failed: seller not found.');
      }
    } catch (error) {
      setAuthLog('Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (!seller) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Loader2 className="animate-spin text-emerald-500 h-10 w-10 mb-4" />
        <p className="text-gray-600 text-lg font-medium">{authLog}</p>
      </motion.div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return <Dashboard sellerId={seller.user_id} setScreen={setScreen} />;
      case 'products':
        return <ProductList sellerId={seller.user_id} onBack={() => setScreen('dashboard')} />;
      case 'requests':
        return <CustomRequests sellerId={seller.user_id} onBack={() => setScreen('dashboard')} />;
      case 'orders':
        return <Orders sellerId={seller.user_id} onBack={() => setScreen('dashboard')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Top Navigation (mobile-friendly) */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100 flex items-center justify-between px-4 py-2">
        <span className="text-lg font-bold text-gray-900 tracking-tight">Flowey Seller</span>
        <div className="flex gap-2">
          <NavItem screen="dashboard" currentScreen={screen} setScreen={setScreen} label="Home">
            <Home className="w-5 h-5" />
          </NavItem>
          <NavItem screen="products" currentScreen={screen} setScreen={setScreen} label="Products">
            <List className="w-5 h-5" />
          </NavItem>
          <NavItem screen="requests" currentScreen={screen} setScreen={setScreen} label="Requests">
            <Mail className="w-5 h-5" />
          </NavItem>
          <NavItem screen="orders" currentScreen={screen} setScreen={setScreen} label="Orders">
            <ShoppingCart className="w-5 h-5" />
          </NavItem>
        </div>
      </nav>
      {/* Main Content - mobile responsive */}
      <main className="flex-1 px-2 py-4 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin text-emerald-500 h-8 w-8" />
                </div>
              }
            >
              {renderScreen()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="text-xs text-gray-500 text-center py-2 bg-white/80 border-t border-gray-100 w-full">
        &copy; 2024 Flowey. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
