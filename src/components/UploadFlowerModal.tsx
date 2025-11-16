import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Image as ImageIcon, Tag, DollarSign, Type } from 'lucide-react';
import type { Flower } from '../types';

interface UploadFlowerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sellerId: string;
  flowerToEdit?: Flower | null;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) => (
  <div className="relative w-full">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{props.icon}</div>
    <input
      {...props}
      className="w-full pl-11 pr-4 py-3 bg-neutral/60 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
    />
  </div>
);

const UploadFlowerModal: React.FC<UploadFlowerModalProps> = ({ open, onClose, onSuccess, sellerId, flowerToEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!flowerToEdit;

  useEffect(() => {
    if (isEditMode && flowerToEdit) {
      setName(flowerToEdit.name);
      setDescription(flowerToEdit.description ?? '');
      setPrice(flowerToEdit.price.toString());
      setImageUrl(flowerToEdit.image_url ?? '');
    } else {
      // Reset form for new flower
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
    }
  }, [flowerToEdit, isEditMode]);

  const handleSubmit = async () => {
    if (!name || !price || !imageUrl) {
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
      const flowerData = {
        seller_id: sellerId,
        name,
        description,
        price: priceNum,
        image_url: imageUrl,
      };

      if (isEditMode) {
        // await api.updateFlower(flowerToEdit.id, flowerData);
        console.log("Update logic to be implemented");
      } else {
        await api.uploadFlower(flowerData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(`Failed to ${isEditMode ? 'update' : 'upload'} flower:`, err);
      setError(`Failed to ${isEditMode ? 'update' : 'upload'} flower. Please try again.`);
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
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 150 }}
            className="bg-surface rounded-t-3xl shadow-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-base-content">{isEditMode ? 'Edit Flower' : 'Add New Flower'}</h2>
              <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-neutral">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-error/10 text-error rounded-lg p-3 text-sm mb-4 text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input icon={<Tag className="w-5 h-5" />} type="text" placeholder="Flower Name*" value={name} onChange={(e) => setName(e.target.value)} />
              <Input icon={<Type className="w-5 h-5" />} type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Input icon={<DollarSign className="w-5 h-5" />} type="number" placeholder="Price*" value={price} onChange={(e) => setPrice(e.target.value)} />
              <Input icon={<ImageIcon className="w-5 h-5" />} type="text" placeholder="Image URL*" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-neutral transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-primary text-primary-content px-4 py-3 rounded-xl font-semibold hover:bg-primary-focus transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                disabled={uploading}
              >
                {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
                {uploading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Flower')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadFlowerModal;
