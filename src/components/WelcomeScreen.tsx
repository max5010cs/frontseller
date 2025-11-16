import { Store, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Seller } from '../types';

interface WelcomeScreenProps {
  seller: Seller;
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ seller, onContinue }) => {
  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
        >
          <Store className="w-12 h-12 text-primary" />
        </motion.div>

        <h1 className="text-3xl font-bold text-base-content mb-2">Welcome Back!</h1>
        <p className="text-base-content/70 mb-8">You are managing the shop:</p>

        <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left shadow-lg">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="font-bold text-base-content text-lg">{seller.shop_name}</h2>
              <div className="flex items-start gap-2 text-sm text-base-content/70 mt-1">
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
          className="w-full bg-primary text-primary-content px-6 py-4 rounded-xl font-semibold hover:bg-primary-focus transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 text-lg"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
