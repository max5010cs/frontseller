import React from 'react';

interface SellerDashboardProps {
  seller: any;
  setScreen: (screen: 'dashboard' | 'products' | 'requests' | 'orders') => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ seller, setScreen }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Welcome, {seller.name}</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button className="btn" onClick={() => setScreen('products')}>Manage Products</button>
        <button className="btn" onClick={() => setScreen('requests')}>Custom Requests</button>
        <button className="btn" onClick={() => setScreen('orders')}>Orders</button>
      </div>
    </div>
  );
};

export default SellerDashboard;
