import { useEffect, useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import type { Flower, CustomRequest, Order } from '../types';
import { Loader2, Flower2, Package, ShoppingBag, Plus, ArrowRight } from 'lucide-react';

const UploadFlowerModal = lazy(() => import('./UploadFlowerModal'));

interface DashboardProps {
  sellerId: string;
  setScreen: (screen: 'dashboard' | 'products' | 'requests' | 'orders') => void;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  onClick,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-lg bg-opacity-10 ${color}`}>
        {icon}
      </div>
      <span className="text-3xl font-bold text-gray-800">{value}</span>
    </div>
    <h3 className="text-lg font-medium text-gray-600 mt-4">{title}</h3>
  </motion.div>
);

const RecentActivityCard = ({
  items,
  title,
  icon,
  emptyText,
  onViewAll,
}: {
  items: (Flower | Order | CustomRequest)[];
  title: string;
  icon: React.ReactNode;
  emptyText: string;
  onViewAll: () => void;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <button onClick={onViewAll} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
        View All <ArrowRight className="w-4 h-4" />
      </button>
    </div>
    <div className="space-y-3">
      {items.length > 0 ? (
        items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <p className="font-medium text-gray-700">
              {'name' in item ? item.name : `Order #${item.id.substring(0, 8)}`}
            </p>
            <p className="text-sm text-gray-500">
              {'price' in item && item.price
                ? `${item.price.toFixed(2)}`
                : 'created_at' in item
                ? new Date(item.created_at).toLocaleDateString()
                : ''}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">{emptyText}</p>
      )}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ sellerId, setScreen }) => {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [flowersData, requestsData, ordersData] = await Promise.all([
          api.getFlowers(sellerId),
          api.getCustomRequests(),
          api.getOrders(sellerId),
        ]);
        setFlowers(flowersData);
        setCustomRequests(requestsData);
        setOrders(ordersData);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-emerald-500 h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-red-50 text-red-700 rounded-2xl p-8">
        <h3 className="text-lg font-semibold mb-2">⚠️ Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">Welcome back, here's a summary of your store.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Upload Flower
        </motion.button>
      </div>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatCard
          title="My Products"
          value={flowers.length}
          icon={<Flower2 className="w-6 h-6 text-emerald-600" />}
          color="bg-emerald-100"
          onClick={() => setScreen('products')}
        />
        <StatCard
          title="Custom Requests"
          value={customRequests.length}
          icon={<Package className="w-6 h-6 text-amber-600" />}
          color="bg-amber-100"
          onClick={() => setScreen('requests')}
        />
        <StatCard
          title="Pending Orders"
          value={orders.length}
          icon={<ShoppingCart className="w-6 h-6 text-sky-600" />}
          color="bg-sky-100"
          onClick={() => setScreen('orders')}
        />
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <RecentActivityCard
          title="Recent Listings"
          items={flowers}
          icon={<Flower2 className="w-5 h-5 text-gray-500" />}
          emptyText="No flowers listed yet."
          onViewAll={() => setScreen('products')}
        />
        <RecentActivityCard
          title="Recent Orders"
          items={orders}
          icon={<ShoppingCart className="w-5 h-5 text-gray-500" />}
          emptyText="No new orders."
          onViewAll={() => setScreen('orders')}
        />
      </motion.div>

      {showUploadModal && (
        <Suspense fallback={<div></div>}>
          <UploadFlowerModal
            open={showUploadModal}
            sellerId={sellerId}
            onClose={() => setShowUploadModal(false)}
            onSuccess={() => {
              setShowUploadModal(false);
              // Consider re-fetching data here if needed
            }}
          />
        </Suspense>
      )}
    </motion.div>
  );
};

export default Dashboard;
