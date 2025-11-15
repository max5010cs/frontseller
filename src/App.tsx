import { useState, useEffect } from 'react';
import { api } from './services/api';
import SellerDashboard from './components/SellerDashboard';
import ProductList from './components/ProductList';
import CustomRequests from './components/CustomRequests';
import Orders from './components/Orders';

function App() {
  const [seller, setSeller] = useState(null);
  const [screen, setScreen] = useState<'dashboard' | 'products' | 'requests' | 'orders'>('dashboard');
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
        <div className="text-gray-600">{authLog}</div>
      </div>
    );
  }

  return (
    <>
      {screen === 'dashboard' && <SellerDashboard seller={seller} setScreen={setScreen} />}
      {screen === 'products' && <ProductList seller={seller} onBack={() => setScreen('dashboard')} />}
      {screen === 'requests' && <CustomRequests seller={seller} onBack={() => setScreen('dashboard')} />}
      {screen === 'orders' && <Orders seller={seller} onBack={() => setScreen('dashboard')} />}
    </>
  );
}

export default App;
