
import { motion } from 'framer-motion';
import { ArrowRight, User, ShoppingCart, List, Mail } from 'lucide-react';

interface SellerDashboardProps {
  seller: { user_id: string; name?: string };
  setScreen: (screen: 'dashboard' | 'products' | 'requests' | 'orders') => void;
}

const InfoCard = ({ seller }: { seller: { user_id: string; name?: string } }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <User className="w-8 h-8 text-gray-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {seller.name || 'Seller'}</h2>
        <p className="text-gray-500">Here's what's happening with your store today.</p>
      </div>
    </div>
  </div>
);

const NavCard = ({
  title,
  onClick,
  icon,
  color,
}: {
  title: string;
  onClick: () => void;
  icon: React.ReactNode;
  color: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }}
    transition={{ type: 'spring', stiffness: 300 }}
    onClick={onClick}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-opacity-10 ${color}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-400" />
    </div>
  </motion.div>
);

const SellerDashboard: React.FC<SellerDashboardProps> = ({ seller, setScreen }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <InfoCard seller={seller} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NavCard
          title="Products"
          onClick={() => setScreen('products')}
          icon={<List className="w-6 h-6 text-emerald-600" />}
          color="bg-emerald-100"
        />
        <NavCard
          title="Custom Requests"
          onClick={() => setScreen('requests')}
          icon={<Mail className="w-6 h-6 text-amber-600" />}
          color="bg-amber-100"
        />
        <NavCard
          title="Orders"
          onClick={() => setScreen('orders')}
          icon={<ShoppingCart className="w-6 h-6 text-sky-600" />}
          color="bg-sky-100"
        />
      </motion.div>
    </motion.div>
  );
};

export default SellerDashboard;
