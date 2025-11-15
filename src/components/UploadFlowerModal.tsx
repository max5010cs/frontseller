import { useState } from 'react';
import { api } from '../utils/api';

interface UploadFlowerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sellerId: string;
}

export default function UploadFlowerModal({ open, onClose, onSuccess, sellerId }: UploadFlowerModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleAddItem = () => {
    if (currentItem.trim()) {
      setItems([...items, currentItem.trim()]);
      setCurrentItem('');
    }
  };

  const handleSubmit = async () => {
    if (!imageUrl || !name || !price) {
      alert('Please fill in all required fields');
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price');
      return;
    }
    setUploading(true);
    try {
      await api.uploadFlower(sellerId, {
        image: imageUrl,
        name,
        description,
        price: priceNum,
        items,
      });
      setImageUrl('');
      setName('');
      setDescription('');
      setPrice('');
      setItems([]);
      setCurrentItem('');
      onSuccess();
      onClose();
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Upload Flower</h2>
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />
        <div className="mb-3">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add item (e.g. rose, tulip)"
              value={currentItem}
              onChange={e => setCurrentItem(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button onClick={handleAddItem} className="px-4 py-2 bg-green-600 text-white rounded-lg">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => (
              <span key={idx} className="bg-gray-100 px-2 py-1 rounded-lg text-sm">{item}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
