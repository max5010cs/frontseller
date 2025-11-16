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

const FlowerCard: React.FC<FlowerCardProps> = ({ flower }) => {
  return (
    <div className="rounded-2xl shadow bg-white/80 border border-emerald-100 p-4 mb-3 w-full">
      <div className="font-semibold text-base mb-1">{flower.name}</div>
      <div className="text-sm text-gray-600 mb-1">{flower.description}</div>
      <div className="text-sm text-gray-600 mb-1">Price: ${flower.price}</div>
      <img src={flower.image_url} alt={flower.name} className="w-full h-28 object-cover rounded-xl mb-1" />
    </div>
  );
};

export default FlowerCard;
