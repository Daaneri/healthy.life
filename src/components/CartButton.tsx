import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export function CartButton({ onClick }: { onClick: () => void }) {
  const totalItems = useCartStore((state) =>
    state.cart.reduce((acc, item) => acc + item.quantity, 0)
  );

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-beige-100 active:scale-90 transition-all"
      aria-label="Ver carrito"
    >
      <ShoppingCart className="w-6 h-6 text-forest" />
      {totalItems > 0 && (
        <span
          key={totalItems}
          className="absolute -top-1 -right-1 bg-mustard text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-fadein"
        >
          {totalItems}
        </span>
      )}
    </button>
  );
}