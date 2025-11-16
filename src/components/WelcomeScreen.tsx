
import { Store, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Seller } from '../types';

interface WelcomeScreenProps {
  seller: Seller;
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ seller, onContinue }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Store className="w-12 h-12 text-emerald-600" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-500 mb-8">You are managing the shop:</p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-200">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">{seller.shop_name}</h2>
                <div className="flex items-start gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{seller.address}</span>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="w-full bg-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-lg"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
        <p className="text-center text-gray-400 text-xs mt-6">
          Flowey Seller App
        </p>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
