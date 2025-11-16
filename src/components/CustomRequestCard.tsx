import { useState } from 'react';
import { DollarSign, Send, X, Loader2, Tag } from 'lucide-react';
import { api } from '../utils/api';
import type { CustomRequest } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomRequestCardProps {
  request: CustomRequest;
  sellerId: string;
  onBidSubmitted: () => void;
}

const CustomRequestCard: React.FC<CustomRequestCardProps> = ({
  request,
  sellerId,
  onBidSubmitted,
}) => {
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBid = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      setError('Please enter a valid bid amount.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.postBid(sellerId, request.id, parseFloat(bidAmount));
      setShowBidForm(false);
      setBidAmount('');
      onBidSubmitted();
    } catch (e) {
      console.error("Failed to submit bid:", e);
      setError('Failed to submit bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-surface/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
    >
      <img src={request.image_url} alt="Custom Request" className="w-full h-40 object-cover" />
      <div className="p-4">
        <p className="font-bold text-base-content text-md">{request.buyer_name}</p>
        <p className="text-sm text-base-content/80 mt-1">{request.prompt}</p>
        
        {request.items && request.items.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {request.items.map((item, i) => (
              <span key={i} className="bg-neutral text-neutral-focus-content px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-black/5">
        <AnimatePresence>
          {showBidForm ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {error && <p className="text-error text-sm mb-2 text-center">{error}</p>}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Your bid"
                    className="w-full pl-9 pr-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleBid}
                  disabled={loading}
                  className="bg-primary text-primary-content px-4 py-2 rounded-lg font-semibold hover:bg-primary-focus transition-colors disabled:opacity-60 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setShowBidForm(false)}
                  className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setShowBidForm(true)}
              className="w-full bg-secondary text-secondary-content px-4 py-2 rounded-lg font-semibold hover:bg-secondary-focus transition-colors flex items-center justify-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Place a Bid
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CustomRequestCard;
