import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Order } from '../types';
import OrderCard from './OrderCard';

interface OrdersProps {
  sellerId: string;
  onBack: () => void;
}

const Orders: React.FC<OrdersProps> = ({ sellerId, onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    api.getOrders(sellerId)
      .then(setOrders)
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [sellerId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Your Orders</h2>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-sky-500 h-8 w-8" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">⚠️ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center h-64 flex flex-col justify-center items-center bg-white rounded-2xl shadow-sm border border-gray-100">
          <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">No Orders Yet</h3>
          <p className="text-gray-500">You have no pending or completed orders.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onUpdate={fetchOrders} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Orders;
