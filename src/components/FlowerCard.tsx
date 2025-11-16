import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import type { Flower } from '../types';

interface FlowerCardProps {
  flower: Flower;
  onEdit: () => void;
  onRemove: () => void;
}

const FlowerCard: React.FC<FlowerCardProps> = ({ flower, onEdit, onRemove }) => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden shadow-lg group w-full"
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
    >
      <img
        src={flower.image_path ? `${process.env.BACKEND_URL}/${flower.image_path}` : ''}
        alt={flower.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-bold text-lg truncate">{flower.name}</h3>
        <p className="text-sm opacity-90">{flower.description}</p>
        <div className="text-xs mt-2">Items: {flower.items?.join(', ')}</div>
      </div>
      <div className="absolute top-2 right-2 flex gap-2">
        <span className="bg-surface/80 backdrop-blur-sm text-primary font-bold text-sm px-3 py-1 rounded-full">
          ${flower.price.toFixed(2)}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="bg-surface/80 backdrop-blur-sm p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="bg-error/80 backdrop-blur-sm p-2 rounded-full text-white hover:bg-error transition-colors"
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
};

export default FlowerCard;
