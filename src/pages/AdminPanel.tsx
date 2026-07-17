import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ProductsManager } from '../components/admin/ProductsManager';
import { LeadsManager } from '../components/admin/LeadsManager';

type Tab = 'products' | 'leads';

export function AdminPanel() {
  const [tab, setTab] = useState<Tab>('products');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">Panel Admin</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="flex gap-2 mb-6 border-b border-beige-200">
          <button
            onClick={() => setTab('products')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === 'products'
                ? 'border-orange-500 text-green-800'
                : 'border-transparent text-gray-400'
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setTab('leads')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === 'leads'
                ? 'border-orange-500 text-green-800'
                : 'border-transparent text-gray-400'
            }`}
          >
            Pedidos
          </button>
        </div>

        {tab === 'products' && <ProductsManager />}
        {tab === 'leads' && <LeadsManager />}
      </div>
    </div>
  );
}