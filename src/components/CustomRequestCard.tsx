import { useState } from 'react';
import { DollarSign, Send, X, Loader2 } from 'lucide-react';
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
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {request.image_url && (
        <div className="h-48 w-full overflow-hidden">
          <img src={request.image_url} alt="Request inspiration" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <p className="text-sm text-gray-500">Request from <span className="font-semibold text-gray-700">{request.buyer_name}</span></p>
        <p className="text-gray-800 text-base h-12 my-2 overflow-hidden">{request.prompt}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {request.items?.map((item, index) => (
            <span key={index} className="px-3 py-1 text-xs font-medium text-amber-800 bg-amber-100 rounded-full">
              {item}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {showBidForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3"
            >
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Your bid"
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={handleBid}
                  disabled={loading || !bidAmount}
                  className="bg-amber-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-4">
          {!showBidForm ? (
            <button
              onClick={() => setShowBidForm(true)}
              className="w-full px-4 py-3 text-sm font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Place Bid
            </button>
          ) : (
            <button
              onClick={() => setShowBidForm(false)}
              className="w-full px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CustomRequestCard;
