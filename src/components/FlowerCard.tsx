import { useState } from 'react';
import { Edit, Trash2, MoreVertical, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Flower } from '../types';

interface FlowerCardProps {
  flower: Flower;
  onUpdate?: () => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  const statusClasses = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    sold: "bg-blue-100 text-blue-800",
  };
  const classes = `${baseClasses} ${statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`;
  return <span className={classes}>{status}</span>;
};

const FlowerCard: React.FC<FlowerCardProps> = ({ flower, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this flower?')) return;
    setDeleting(true);
    // Here you would typically call an API to delete the flower
    // await api.deleteFlower(flower.id);
    console.log(`Deleting flower ${flower.id}`);
    onUpdate && onUpdate();
    setDeleting(false);
    setShowMenu(false);
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
      <div className="h-48 w-full overflow-hidden">
        <img src={flower.image_url} alt={flower.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg text-gray-800 truncate">{flower.name}</h3>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-gray-100">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 min-w-[140px]"
                >
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="text-gray-500 text-sm h-10 my-1 overflow-hidden">{flower.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-semibold text-emerald-600">${flower.price}</span>
          <StatusBadge status={flower.status || 'active'} />
        </div>
      </div>
      {showMenu && <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>}
    </motion.div>
  );
};

export default FlowerCard;
