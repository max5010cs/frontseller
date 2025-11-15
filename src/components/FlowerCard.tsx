import { useState } from 'react';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import type { Flower } from '../types';

interface FlowerCardProps {
  flower: Flower;
  onUpdate?: () => void;
  lang?: string;
}

export default function FlowerCard({ flower, onUpdate, lang }: FlowerCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this flower?')) return;

    setDeleting(true);
    // Code related to supabase has been removed
    onUpdate && onUpdate();
    setDeleting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-4">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={flower.image || flower.image_url}
            alt={flower.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{flower.name}</h3>
              {flower.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {flower.description}
                </p>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20 min-w-[140px]">
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
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-lg font-bold text-green-600">${flower.price}</span>
            <span
              className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                flower.status || 'active'
              )}`}
            >
              {flower.status || 'active'}
            </span>
          </div>

          {Array.isArray(flower.items) && flower.items.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {flower.items.map((item, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
