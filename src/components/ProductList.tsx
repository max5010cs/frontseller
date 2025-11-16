import { useEffect, useState, useCallback } from 'react';
import { api } from '../utils/api';
import { motion } from 'framer-motion';
import { Loader2, Plus } from 'lucide-react';
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
    <div className="w-full max-w-md mx-auto px-2">
      <div className="flex items-center justify-between mb-4">
        <button className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium" onClick={onBack}>← Back</button>
        <h2 className="text-xl font-bold text-gray-900">Your Products</h2>
        <button
          className="px-3 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary-focus flex items-center gap-2"
          onClick={() => handleOpenModal(null)}
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-emerald-500 h-8 w-8" />
        </div>
      )}
      {error && (
        <div className="bg-error/10 text-error rounded-lg p-3 text-sm mb-4 text-center">{error}</div>
      )}
      {!loading && !error && flowers.length > 0 && (
        <div className="space-y-4">
          {flowers.map(flower => (
            <FlowerCard
              key={flower.id}
              flower={flower}
              onEdit={() => handleOpenModal(flower)}
              onRemove={async () => {
                if (window.confirm('Are you sure you want to delete this flower?')) {
                  await api.deleteFlower(flower.id);
                  fetchFlowers();
                }
              }}
            />
          ))}
        </div>
      )}
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
