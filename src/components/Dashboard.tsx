import { useEffect, useState } from 'react';
import { Package, Flower2, ShoppingBag, Plus } from 'lucide-react';
import { api } from '../utils/api';
import type { Flower, CustomRequest, Order } from '../types';
import FlowerCard from './FlowerCard';
import CustomRequestCard from './CustomRequestCard';
import OrderCard from './OrderCard';
import UploadFlowerModal from './UploadFlowerModal';

interface DashboardProps {
  sellerId: string;
  lang: string;
}

export default function Dashboard({ sellerId, lang }: DashboardProps) {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.getFlowers(sellerId, lang).then(setFlowers),
      api.getCustomRequests(lang).then(setCustomRequests),
      api.getOrders(sellerId, lang).then(setOrders),
    ])
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, [sellerId, lang]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <p className="text-gray-900 font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setFlowers([]);
              setCustomRequests([]);
              setOrders([]);
              setLoading(false);
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <div className="space-y-6">
          {/* Flowers Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flower2 className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">My Flowers</h2>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30"
              >
                <Plus className="w-5 h-5" />
                Upload
              </button>
            </div>
            {flowers.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <Flower2 className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No flowers uploaded yet</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 text-green-600 font-medium hover:text-green-700"
                >
                  Upload your first flower
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {flowers.map((flower) => (
                  <FlowerCard key={flower.id} flower={flower} onUpdate={() => {}} />
                ))}
              </div>
            )}
          </section>
          {/* Custom Requests Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Custom Requests</h2>
            </div>
            {customRequests.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No custom requests available</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {customRequests.map((request) => (
                  <CustomRequestCard
                    key={request.id}
                    request={request}
                    sellerId={sellerId}
                    onBidSubmitted={() => {}}
                    lang={lang}
                  />
                ))}
              </div>
            )}
          </section>
          {/* Orders Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Orders</h2>
            </div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No pending orders</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} onUpdate={() => {}} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      {showUploadModal && (
        <UploadFlowerModal
          open={showUploadModal}
          sellerId={sellerId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
}
