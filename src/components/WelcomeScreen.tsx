import { Store, MapPin, ArrowRight } from 'lucide-react';
import type { Seller } from '../types';

interface WelcomeScreenProps {
  seller: Seller;
  onContinue: () => void;
}

export default function WelcomeScreen({ seller, onContinue }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Store className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-600 mb-8">Manage your flower shop</p>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 text-left">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Store className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 text-lg mb-1">
                  {seller.shop_name}
                </h2>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{seller.address}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 text-lg"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Telegram Seller WebApp v1.0
        </p>
      </div>
    </div>
  );
}
