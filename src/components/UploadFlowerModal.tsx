import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Tag, DollarSign, Type } from 'lucide-react';
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<string[]>(['']);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isEditMode = !!flowerToEdit;

  useEffect(() => {
    if (isEditMode && flowerToEdit) {
      setName(flowerToEdit.name);
      setDescription(flowerToEdit.description ?? '');
      setPrice(flowerToEdit.price.toString());
      setItems(flowerToEdit.items ?? ['']);
    } else {
      // Reset form for new flower
      setName('');
      setDescription('');
      setPrice('');
      setItems(['']);
    }
  }, [flowerToEdit, isEditMode]);

  const handleItemChange = (idx: number, value: string) => {
    setItems(items => items.map((item, i) => (i === idx ? value : item)));
  };
  const handleAddItem = () => {
    setItems(items => [...items, '']);
  };
  const handleRemoveItem = (idx: number) => {
    setItems(items => items.filter((_, i) => i !== idx));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || items.some(item => !item.trim()) || !imageFile) {
      setError('Please fill in all required fields and select an image.');
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
      const formData = new FormData();
      formData.append('seller_id', sellerId);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', priceNum.toString());
      formData.append('items', JSON.stringify(items));
      formData.append('image', imageFile);

      if (isEditMode && flowerToEdit) {
        await api.updateFlower(flowerToEdit.id, formData);
      } else {
        await api.uploadFlower(formData);
      }

      onSuccess();
      onClose();
    } catch (err) {
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
              <div>
                <label className="block text-sm font-semibold mb-2">Items Used*</label>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={item}
                        onChange={e => handleItemChange(idx, e.target.value)}
                        placeholder={`Item ${idx + 1}`}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {items.length > 1 && (
                        <button type="button" onClick={() => handleRemoveItem(idx)} className="text-error px-2 py-1 rounded hover:bg-error/10">Remove</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddItem} className="mt-2 px-3 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-focus">+ Add Item</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Flower Image*</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
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
