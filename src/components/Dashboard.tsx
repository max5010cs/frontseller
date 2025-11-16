import React from 'react';
import { motion } from 'framer-motion';
import { List, Mail, ShoppingCart, ArrowRight } from 'lucide-react';

type Screen = 'dashboard' | 'products' | 'requests' | 'orders';

interface DashboardProps {
  sellerId: string;
  setScreen: (screen: Screen) => void;
}

const ActionCard = ({
  icon,
  title,
  description,
  onClick,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay: number;
}) => (
  <motion.button
    onClick={onClick}
    className="bg-surface/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full text-left flex items-center gap-5"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut', delay }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="bg-primary/10 p-3 rounded-full">{icon}</div>
    <div className="flex-1">
      <h3 className="font-bold text-base-content text-md">{title}</h3>
      <p className="text-sm text-base-content/70">{description}</p>
    </div>
    <ArrowRight className="w-5 h-5 text-primary/50" />
  </motion.button>
);

const Dashboard: React.FC<DashboardProps> = ({ setScreen }) => {
  const actions = [
    {
      screen: 'products' as Screen,
      title: 'Manage Products',
      description: 'Add, edit, or remove your flower listings.',
      icon: <List className="w-6 h-6 text-primary" />,
    },
    {
      screen: 'requests' as Screen,
      title: 'Custom Requests',
      description: 'View and respond to special customer requests.',
      icon: <Mail className="w-6 h-6 text-primary" />,
    },
    {
      screen: 'orders' as Screen,
      title: 'Active Orders',
      description: 'Track and manage all incoming orders.',
      icon: <ShoppingCart className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="flex flex-col gap-4">
        {actions.map((action, index) => (
          <ActionCard
            key={action.screen}
            title={action.title}
            description={action.description}
            icon={action.icon}
            onClick={() => setScreen(action.screen)}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
