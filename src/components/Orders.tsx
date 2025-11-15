import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

interface OrdersProps {
  seller: any;
  onBack: () => void;
}

const Orders: React.FC<OrdersProps> = ({ seller, onBack }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getOrders(seller.user_id)
      .then(setOrders)
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [seller.user_id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center animate-fade-in">
      <button className="mb-4 btn" onClick={onBack}>← Back</button>
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      {loading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="w-full max-w-lg space-y-4">
        {orders.length === 0 && !loading && <div className="text-gray-500">No orders yet.</div>}
        {orders.map((order, idx) => (
          <div key={idx} className="p-4 rounded-xl shadow bg-white/80 border border-emerald-100 transition-all duration-300 hover:scale-[1.02]">
            <div className="font-semibold">Buyer: {order.buyer_name}</div>
            <div className="text-sm text-gray-600">Status: {order.status}</div>
            <div className="text-sm text-gray-600">Price: ${order.price}</div>
            <img src={order.image_url} alt="Order" className="w-full h-32 object-cover rounded-lg mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
