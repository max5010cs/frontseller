import { useState } from 'react';
import { Calendar, Clock, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import type { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onUpdate: () => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  const statusClasses = {
    pending_pickup: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  const formattedStatus = status.toLowerCase().replace(' ', '_');
  const classes = `${baseClasses} ${statusClasses[formattedStatus] || 'bg-gray-100 text-gray-800'}`;
  return <span className={classes}>{status}</span>;
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
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
      >
        <div className="p-5 flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Order #{order.id}</p>
              <p className="font-semibold text-gray-800">From: {order.buyer_name}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-semibold text-sky-600">${order.price}</span>
            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="p-5 bg-gray-50 border-t border-gray-100">
          {order.pickup_time ? (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-semibold">Pickup Scheduled</p>
                <p>
                  {new Date(order.pickup_time).toLocaleDateString()} at{' '}
                  {new Date(order.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPickupModal(true)}
              className="w-full bg-sky-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPickupModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Set Pickup Time</h2>
                <button onClick={() => setShowPickupModal(false)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <div className="space-y-4">
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-colors" />
                <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-colors" />
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowPickupModal(false)} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors" disabled={submitting}>
                  Cancel
                </button>
                <button onClick={handleSetPickupTime} disabled={submitting || !pickupDate || !pickupTime} className="flex-1 bg-sky-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
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
