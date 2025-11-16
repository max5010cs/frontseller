import { motion } from 'framer-motion';
import { ArrowRight, User, ShoppingCart, List, Mail } from 'lucide-react';

interface SellerDashboardProps {
  seller: { user_id: string; name?: string };
  setScreen: (screen: 'dashboard' | 'products' | 'requests' | 'orders') => void;
}

const InfoCard = ({ seller }: { seller: { user_id: string; name?: string } }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <User className="w-8 h-8 text-gray-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {seller.name || 'Seller'}</h2>
        <p className="text-gray-500">Here's what's happening with your store today.</p>
      </div>
    </div>
  </div>
);

const NavCard = ({
  title,
  onClick,
  icon,
  color,
}: {
  title: string;
  onClick: () => void;
  icon: React.ReactNode;
  color: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }}
    transition={{ type: 'spring', stiffness: 300 }}
    onClick={onClick}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-opacity-10 ${color}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-400" />
    </div>
  </motion.div>
);

const SellerDashboard: React.FC<SellerDashboardProps> = ({ seller, setScreen }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-2 w-full max-w-md mx-auto">
      <div className="rounded-2xl shadow-lg bg-white/80 p-6 mb-8 w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {seller.name}</h2>
        <div className="text-gray-500 mb-4">Seller ID: <span className="font-mono text-xs">{seller.user_id}</span></div>
        <div className="flex flex-col gap-3 w-full">
          <button className="btn-dashboard w-full" onClick={() => setScreen('products')}>Products</button>
          <button className="btn-dashboard w-full" onClick={() => setScreen('requests')}>Custom Requests</button>
          <button className="btn-dashboard w-full" onClick={() => setScreen('orders')}>Orders</button>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
