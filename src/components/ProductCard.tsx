import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types/product';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useToastStore((state) => state.showToast);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAdd = () => {
    addToCart(product);
    showToast(`${product.name} agregado`);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-brown/10 p-2.5 sm:p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative h-28 sm:h-40 bg-beige-100 rounded-xl mb-2 sm:mb-3 overflow-hidden flex items-center justify-center text-gray-400">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-xs sm:text-sm">Imagen</span>
        )}

        <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-offwhite/90 backdrop-blur-sm text-forest text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-brown/10">
          {product.category}
        </span>

        {lowStock && !outOfStock && (
          <span className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-mustard text-white text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            ¡Últimas!
          </span>
        )}

        {outOfStock && (
          <span className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-brown/80 text-white text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            Sin stock
          </span>
        )}
      </div>

      <h3 className="font-display font-semibold text-forest text-sm sm:text-lg leading-snug line-clamp-2">
        {product.name}
      </h3>
      {product.description && (
        <p className="hidden sm:block text-brown/70 text-sm mt-0.5 line-clamp-2">
          {product.description}
        </p>
      )}

      <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="text-forest font-bold text-sm sm:text-xl">
          ${product.price_retail.toLocaleString('es-AR')}
        </span>
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-mustard text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium hover:bg-mustard-dark active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {outOfStock ? 'Sin stock' : 'Agregar'}
        </button>
      </div>
    </div>
  );
};