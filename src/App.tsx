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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="px-4 py-2 mb-4">
          <h1 className="text-2xl font-bold tracking-tighter">Flowey</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          <NavItem screen="dashboard" currentScreen={screen} setScreen={setScreen} label="Dashboard">
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
        </nav>
        <div className="mt-auto p-4 text-center text-xs text-gray-500">
          <p>&copy; 2024 Flowey. All rights reserved.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
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
    </div>
  );
}

export default App;
