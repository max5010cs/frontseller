import { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from './utils/api';
import { Home, ShoppingCart, List, Mail, Loader2, Store } from 'lucide-react';

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
    className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-300 ${
      currentScreen === screen ? 'text-primary' : 'text-gray-500 hover:text-primary-focus'
    }`}
  >
    {children}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

function App() {
  const [seller, setSeller] = useState<{ user_id: string; name?: string } | null>(null);
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [authLog, setAuthLog] = useState('Authenticating...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encryptedId = params.get('auth');
    if (!encryptedId) {
      setAuthLog('Authentication failed: No auth token.');
      return;
    }
    loadSellerInfo(encryptedId);
  }, []);

  const loadSellerInfo = async (encryptedId: string) => {
    try {
      setAuthLog('Verifying seller...');
      const data = await api.authenticateSeller(encryptedId);
      console.log('Seller auth response:', data);
      // Defensive: check for both string and number user_id
      if (data && typeof data === 'object' && data.seller && data.seller.user_id !== undefined && data.seller.user_id !== null) {
        setSeller(data.seller);
        setAuthLog('Welcome!');
      } else {
        setAuthLog('Seller not found.');
        console.error('Seller not found in response:', data);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthLog('Authentication error.');
    }
  };

  if (!seller) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Store className="text-primary h-12 w-12 mb-4" />
        <h1 className="text-2xl font-bold text-primary-content mb-2">Flowey Seller</h1>
        <Loader2 className="animate-spin text-primary h-8 w-8 mb-4" />
        <p className="text-base-content/80 text-sm font-medium">{authLog}</p>
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
    <div className="min-h-screen w-full animated-gradient flex flex-col">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-lg shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800">
            Welcome, <span className="text-primary">{seller.name || 'Seller'}</span>
          </h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full mb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full"
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin text-primary h-8 w-8" />
                </div>
              }
            >
              {renderScreen()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-lg border-t border-gray-200/80 shadow-[0_-1px_4px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto h-full flex items-center justify-around">
          <NavItem screen="dashboard" currentScreen={screen} setScreen={setScreen} label="Home">
            <Home className="w-6 h-6" />
          </NavItem>
          <NavItem screen="products" currentScreen={screen} setScreen={setScreen} label="Products">
            <List className="w-6 h-6" />
          </NavItem>
          <NavItem screen="requests" currentScreen={screen} setScreen={setScreen} label="Requests">
            <Mail className="w-6 h-6" />
          </NavItem>
          <NavItem screen="orders" currentScreen={screen} setScreen={setScreen} label="Orders">
            <ShoppingCart className="w-6 h-6" />
          </NavItem>
        </div>
      </nav>
    </div>
  );
}

export default App;
