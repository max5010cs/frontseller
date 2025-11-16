import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Flower2 } from 'lucide-react';
import { Flower } from '../types';
import FlowerCard from './FlowerCard';

interface ProductListProps {
  sellerId: string;
  onBack: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ sellerId, onBack }) => {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlowers = () => {
    setLoading(true);
    api.getFlowers(sellerId)
      .then(setFlowers)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFlowers();
  }, [sellerId]);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>
        <h2 className="text-3xl font-bold text-gray-900">My Products</h2>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-emerald-500 h-8 w-8" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">⚠️ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && flowers.length === 0 && (
        <div className="text-center h-64 flex flex-col justify-center items-center bg-white rounded-2xl shadow-sm border border-gray-100">
          <Flower2 className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">No Products Found</h3>
          <p className="text-gray-500">You haven't uploaded any products yet.</p>
        </div>
      )}

      {!loading && !error && flowers.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {flowers.map((flower) => (
            <FlowerCard key={flower.id} flower={flower} onUpdate={fetchFlowers} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProductList;
