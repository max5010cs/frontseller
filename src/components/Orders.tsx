import { useEffect, useState, useCallback } from 'react';
import { api } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
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

  const fetchOrders = useCallback(() => {
    setLoading(true);
    api.getOrders(sellerId)
      .then(setOrders)
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [sellerId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <button className="p-2 rounded-full hover:bg-neutral" onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 ml-2">Your Orders</h2>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary h-8 w-8" />
        </div>
      )}

      {error && (
        <div className="bg-error/10 text-error rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">⚠️ Error</h3>
          <p>{error}</p>
        </div>
      )}

      <AnimatePresence>
        {!loading && !error && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center h-64 flex flex-col justify-center items-center bg-surface/80 rounded-2xl shadow-sm"
          >
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">No Orders Yet</h3>
            <p className="text-gray-500 mt-1">New orders from customers will appear here.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !error && orders.length > 0 && (
        <motion.div
          className="grid grid-cols-1 gap-5"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.07 } },
          }}
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
