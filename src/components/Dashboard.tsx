import React from 'react';

interface DashboardProps {
  sellerId: string;
  setScreen: (screen: 'dashboard' | 'products' | 'requests' | 'orders') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ sellerId, setScreen }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-2 w-full max-w-md mx-auto">
      <div className="rounded-2xl shadow-lg bg-white/80 p-6 mb-8 w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Seller</h2>
        <div className="text-gray-500 mb-4">Your Seller ID: <span className="font-mono text-xs">{sellerId}</span></div>
        <div className="flex flex-col gap-3 w-full">
          <button className="btn-dashboard w-full" onClick={() => setScreen('products')}>Manage Products</button>
          <button className="btn-dashboard w-full" onClick={() => setScreen('requests')}>Custom Requests</button>
          <button className="btn-dashboard w-full" onClick={() => setScreen('orders')}>Orders</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
