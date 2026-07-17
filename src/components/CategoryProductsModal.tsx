import { X } from 'lucide-react';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface CategoryProductsModalProps {
  category: string;
  products: Product[];
  onClose: () => void;
}

export function CategoryProductsModal({ category, products, onClose }: CategoryProductsModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col">
      <div className="sticky top-0 bg-offwhite border-b border-brown/10 px-4 py-4 flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-forest">{category}</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-beige-100 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-forest" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {products.length === 0 ? (
          <p className="text-center text-brown/60 py-10">No hay productos en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 max-w-5xl mx-auto">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}