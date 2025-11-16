import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Package } from 'lucide-react';
import { CustomRequest } from '../types';
import CustomRequestCard from './CustomRequestCard';

interface CustomRequestsProps {
  sellerId: string;
  onBack: () => void;
}

const CustomRequests: React.FC<CustomRequestsProps> = ({ sellerId, onBack }) => {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = () => {
    setLoading(true);
    api.getCustomRequests()
      .then(setRequests)
      .catch(() => setError('Failed to load custom requests'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto px-2">
      <div className="flex items-center justify-between mb-4">
        <button className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium" onClick={onBack}>← Back</button>
        <h2 className="text-xl font-bold text-gray-900">Custom Requests</h2>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-amber-500 h-8 w-8" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">⚠️ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && requests.length === 0 && (
        <div className="text-center h-64 flex flex-col justify-center items-center bg-white rounded-2xl shadow-sm border border-gray-100">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">No Custom Requests</h3>
          <p className="text-gray-500">There are currently no custom requests available.</p>
        </div>
      )}

      {!loading && !error && requests.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {requests.map((request) => (
            <CustomRequestCard
              key={request.id}
              request={request}
              sellerId={sellerId}
              onBidSubmitted={fetchRequests}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CustomRequests;
