import { useState } from 'react';
import { DollarSign, MapPin, MessageSquare, Send } from 'lucide-react';
import { api } from '../utils/api';
import type { CustomRequest } from '../types';

interface CustomRequestCardProps {
  request: CustomRequest;
  sellerId: string;
  onBidSubmitted: () => void;
  lang: string;
}

export default function CustomRequestCard({
  request,
  sellerId,
  onBidSubmitted,
  lang,
}: CustomRequestCardProps) {
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBid = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.postBid(sellerId, request.id, parseFloat(bidAmount), lang);
      setShowBidForm(false);
      setBidAmount('');
      onBidSubmitted();
    } catch (e) {
      setError('Failed to submit bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex gap-4">
          <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={request.image_url}
              alt="Custom bouquet"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{request.buyer_name}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              {request.buyer_location_lat && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>Nearby</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 line-clamp-3">{request.prompt}</p>
            </div>

            {Array.isArray(request.items) && request.items.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {request.items.map((item, index) => (
                  <span
                    key={index}
                    className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-lg font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {!showBidForm ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBidForm(true)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Place Bid
                </button>
                <button className="px-4 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  Skip
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="Enter your bid"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      min="0"
                      step="0.01"
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={handleBid}
                    disabled={loading || !bidAmount}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
                {error && <div className="text-red-500">{error}</div>}
                <button
                  onClick={() => {
                    setShowBidForm(false);
                    setBidAmount('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
