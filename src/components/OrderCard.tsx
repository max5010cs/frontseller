import { useState } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import type { Order } from '../types';
import { api } from '../utils/api';

interface OrderCardProps {
  order: Order;
  onUpdate: () => void;
}

export default function OrderCard({ order, onUpdate }: OrderCardProps) {
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetPickupTime = async () => {
    if (!pickupDate || !pickupTime) {
      alert('Please select both date and time');
      return;
    }
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`).toISOString();
    setSubmitting(true);
    setError(null);
    try {
      await api.setPickup(order.id, pickupDateTime);
      onUpdate();
      alert('Pickup time confirmed and buyer notified!');
    } catch (e) {
      setError('Failed to set pickup');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_pickup':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_pickup':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={order.image_url}
                alt="Order"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">{order.buyer_name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Order #{order.id.slice(0, 8)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <span className="text-xl font-bold text-green-600">${order.price}</span>
              </div>
              {order.pickup_time ? (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(order.pickup_time).toLocaleDateString()} at{' '}
                    {new Date(order.pickup_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => setShowPickupModal(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Set Pickup Time
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showPickupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Set Pickup Time</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowPickupModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetPickupTime}
                  disabled={submitting || !pickupDate || !pickupTime}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Confirming...' : 'Confirm'}
                </button>
              </div>
              {error && <div className="text-red-500">{error}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
