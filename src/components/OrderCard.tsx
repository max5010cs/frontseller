import { useState } from 'react';
import { Clock, X, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import type { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onUpdate: () => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: { [key: string]: string } = {
    pending_pickup: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  const formattedStatus = status.toLowerCase().replace(' ', '_');
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        statusStyles[formattedStatus] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdate }) => {
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetPickupTime = async () => {
    if (!pickupDate || !pickupTime) {
      setError('Please select both date and time.');
      return;
    }
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`).toISOString();
    setSubmitting(true);
    setError(null);
    try {
      await api.setPickup(order.id, pickupDateTime);
      onUpdate();
      setShowPickupModal(false);
    } catch (e) {
      console.error("Failed to set pickup time:", e);
      setError('Failed to set pickup time. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="bg-surface/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-bold text-base-content text-md">{order.buyer_name}</p>
              <p className="text-xs text-base-content/60">Order #{order.id}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">${(order.price ?? 0).toFixed(2)}</span>
            <p className="text-sm text-base-content/70">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="px-4 py-3 bg-black/5">
          {order.pickup_time ? (
            <div className="flex items-center gap-3 text-sm text-secondary">
              <Check className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-semibold">Pickup Scheduled</p>
                <p className="text-xs">
                  {new Date(order.pickup_time).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPickupModal(true)}
              className="w-full bg-secondary text-secondary-content px-4 py-2 rounded-lg font-semibold hover:bg-secondary-focus transition-colors flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Set Pickup Time
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showPickupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPickupModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 150 }}
              className="bg-surface rounded-t-3xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-base-content">Set Pickup Time</h2>
                <button onClick={() => setShowPickupModal(false)} className="p-2 rounded-full text-gray-500 hover:bg-neutral">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && <p className="text-error text-sm mb-4 text-center">{error}</p>}

              <div className="space-y-4">
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 bg-neutral/60 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors" />
                <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full px-4 py-3 bg-neutral/60 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors" />
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowPickupModal(false)} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-neutral transition-colors" disabled={submitting}>
                  Cancel
                </button>
                <button onClick={handleSetPickupTime} disabled={submitting || !pickupDate || !pickupTime} className="flex-1 bg-primary text-primary-content px-4 py-3 rounded-xl font-semibold hover:bg-primary-focus transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {submitting ? 'Confirming...' : 'Confirm Pickup'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderCard;
