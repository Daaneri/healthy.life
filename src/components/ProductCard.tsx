import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types/product';
import { useCartStore } from '../store/useCartStore';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-brown/10 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative h-40 bg-beige-100 rounded-xl mb-3 overflow-hidden flex items-center justify-center text-gray-400">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-sm">Imagen</span>
        )}

        <span className="absolute top-2 left-2 bg-offwhite/90 backdrop-blur-sm text-forest text-[10px] font-medium px-2 py-1 rounded-full border border-brown/10">
          {product.category}
        </span>

        {lowStock && !outOfStock && (
          <span className="absolute bottom-2 left-2 bg-mustard text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            ¡Últimas unidades!
          </span>
        )}

        {outOfStock && (
          <span className="absolute bottom-2 left-2 bg-brown/80 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            Sin stock
          </span>
        )}
      </div>

      <h3 className="font-display font-semibold text-forest text-lg leading-snug">
        {product.name}
      </h3>
      {product.description && (
        <p className="text-brown/70 text-sm mt-0.5 line-clamp-2">{product.description}</p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-forest font-bold text-xl">
          ${product.price_retail.toLocaleString('es-AR')}
        </span>
        <button
          onClick={() => addToCart(product)}
          disabled={outOfStock}
          className="flex items-center gap-1.5 bg-mustard text-white px-4 py-2 rounded-lg font-medium hover:bg-mustard-dark active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          {outOfStock ? 'Sin stock' : 'Agregar'}
        </button>
      </div>
    </div>
  );
};