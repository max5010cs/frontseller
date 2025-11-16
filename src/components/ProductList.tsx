import { useEffect, useState, useCallback } from 'react';
import { api } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Flower2, Plus } from 'lucide-react';
import { Flower } from '../types';
import FlowerCard from './FlowerCard';
import UploadFlowerModal from './UploadFlowerModal';

interface ProductListProps {
  sellerId: string;
  onBack: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ sellerId, onBack }) => {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);

  const fetchFlowers = useCallback(() => {
    setLoading(true);
    api.getFlowers(sellerId)
      .then(setFlowers)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, [sellerId]);

  useEffect(() => {
    fetchFlowers();
  }, [fetchFlowers]);

  const handleOpenModal = (flower: Flower | null = null) => {
    setSelectedFlower(flower);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFlower(null);
  };

  const handleSuccess = () => {
    fetchFlowers();
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <button className="p-2 rounded-full hover:bg-neutral" onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 ml-2">Your Products</h2>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary h-8 w-8" />
        </div>
      )}

      {error && (
        <div className="bg-error/10 text-error rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">⚠️ Error</h3>
          <p>{error}</p>
        </div>
      )}

      <AnimatePresence>
        {!loading && !error && flowers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center h-64 flex flex-col justify-center items-center bg-surface/80 rounded-2xl shadow-sm"
          >
            <Flower2 className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">No Products Yet</h3>
            <p className="text-gray-500 mt-1">Click the '+' button to add your first flower.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !error && flowers.length > 0 && (
        <motion.div
          className="grid grid-cols-1 gap-5"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {flowers.map((flower) => (
            <FlowerCard key={flower.id} flower={flower} onEdit={() => handleOpenModal(flower)} />
          ))}
        </motion.div>
      )}

      <motion.button
        onClick={() => handleOpenModal()}
        className="fixed bottom-20 right-5 bg-primary text-primary-content h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
      >
        <Plus className="w-7 h-7" />
      </motion.button>

      <UploadFlowerModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        sellerId={sellerId}
        flowerToEdit={selectedFlower}
      />
    </div>
  );
};

export default ProductList;
