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
    <div className="rounded-2xl shadow bg-white/80 border border-emerald-100 p-4 mb-3 w-full">
      <div className="font-semibold text-base mb-1">{request.buyer_name}</div>
      <div className="text-sm text-gray-600 mb-1">Prompt: {request.prompt}</div>
      <div className="text-sm text-gray-600 mb-1">Items: {request.items?.join(', ')}</div>
      <img src={request.image_url} alt={request.buyer_name} className="w-full h-28 object-cover rounded-xl mb-1" />
    </div>
  );
};

export default CustomRequestCard;
