import { useState } from 'react';
import { api } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Loader2 } from 'lucide-react';

interface UploadFlowerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sellerId: string;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
  />
);

const UploadFlowerModal: React.FC<UploadFlowerModalProps> = ({ open, onClose, onSuccess, sellerId }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddItem = () => {
    if (currentItem.trim()) {
      setItems([...items, currentItem.trim()]);
      setCurrentItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!imageUrl || !name || !price) {
      setError('Please fill in all required fields.');
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price.');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      await api.uploadFlower({
        seller_id: sellerId,
        image_url: imageUrl,
        name,
        description,
        price: priceNum,
        items,
      });
      // Reset form
      setImageUrl('');
      setName('');
      setDescription('');
      setPrice('');
      setItems([]);
      setCurrentItem('');
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to upload flower. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload a New Flower</h2>
              <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input type="text" placeholder="Image URL*" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <Input type="text" placeholder="Flower Name*" value={name} onChange={(e) => setName(e.target.value)} />
              <Input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Input type="number" placeholder="Price*" value={price} onChange={(e) => setPrice(e.target.value)} />

              <div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add item (e.g., rose, tulip)"
                    value={currentItem}
                    onChange={(e) => setCurrentItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  />
                  <button
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {items.map((item, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {item}
                      <button onClick={() => handleRemoveItem(idx)} className="text-emerald-600 hover:text-emerald-800">
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                disabled={uploading}
              >
                {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
                {uploading ? 'Uploading...' : 'Upload Flower'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadFlowerModal;
