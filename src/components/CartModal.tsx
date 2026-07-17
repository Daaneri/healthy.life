import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { supabase } from '../lib/supabase';
import type { Product } from '../types/product';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

interface CartModalProps {
  onClose: () => void;
}

type CartItem = Product & { quantity: number };

const WHATSAPP_NUMBER = '5491138899936'; // 54 9 + código de área + número, sin espacios ni signos

export function CartModal({ onClose }: CartModalProps) {
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Precio efectivo según cantidad: si el producto tiene escala (mixes en oferta), usa el tramo correspondiente.
  // Si no tiene escala cargada (resto del catálogo), usa el precio normal.
  const getEffectivePrice = (item: CartItem) => {
    if (item.price_per_kg === null) {
      return item.price_retail;
    }
    if (item.quantity >= 3 && item.price_per_3kg_plus !== null) {
      return item.price_per_3kg_plus;
    }
    if (item.quantity === 2 && item.price_per_2kg !== null) {
      return item.price_per_2kg;
    }
    return item.price_per_kg;
  };

  const total = cart.reduce((acc, item) => acc + getEffectivePrice(item) * item.quantity, 0);

  const canSubmit = cart.length > 0 && name.trim() !== '' && phone.trim() !== '' && !loading;

  const buildWhatsAppMessage = () => {
    const lines = cart.map((item) => {
      const price = getEffectivePrice(item);
      return `- ${item.name} x${item.quantity} — $${(price * item.quantity).toLocaleString('es-AR')}`;
    });

    return [
      `*Nuevo pedido - Healthy Life*`,
      ``,
      `Cliente: ${name.trim()}`,
      `Teléfono: ${phone.trim()}`,
      ``,
      `*Productos:*`,
      ...lines,
      ``,
      `*Total: $${total.toLocaleString('es-AR')}*`,
    ].join('\n');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.from('leads').insert({
      name: name.trim(),
      phone: phone.trim(),
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: getEffectivePrice(item),
      })),
      total,
    });

    if (error) {
      console.error('Error guardando lead:', error);
      setErrorMsg('No pudimos registrar tu pedido. Probá de nuevo.');
      setLoading(false);
      return;
    }

    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    clearCart();
    setLoading(false);
    onClose();
  };

  return (
    <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col">
      {/* Header del modal */}
      <div className="flex items-center justify-between p-4 border-b border-beige-200">
        <h2 className="text-lg font-bold text-green-800">Tu pedido</h2>
        <button onClick={onClose} aria-label="Cerrar">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Lista de items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="text-center py-14">
            <ShoppingBag className="w-12 h-12 text-beige-300 mx-auto mb-3" />
            <p className="text-brown/60 font-medium">Tu carrito está vacío</p>
            <p className="text-brown/40 text-sm mt-1">Agregá productos para armar tu pedido</p>
          </div>
        ) : (
          cart.map((item) => {
            const effectivePrice = getEffectivePrice(item);
            const isDiscounted = item.price_per_kg !== null && effectivePrice < item.price_per_kg;

            return (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover bg-beige-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ${effectivePrice.toLocaleString('es-AR')}
                    {isDiscounted && (
                      <span className="ml-1 text-green-600 font-medium">(oferta x{item.quantity}kg)</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-beige-100 hover:bg-beige-200 active:scale-90 transition-transform"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-beige-100 hover:bg-beige-200 active:scale-90 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                aria-label="Quitar producto"
                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 active:scale-90 transition-transform"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer: total + form + submit */}
      {cart.length > 0 && (
        <div className="border-t border-beige-200 p-4 space-y-3">
          <div className="flex justify-between font-bold text-green-800">
            <span>Total</span>
            <span>${total.toLocaleString('es-AR')}</span>
          </div>

          <input
            type="text"
            placeholder="Nombre y apellido"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-beige-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="tel"
            placeholder="Teléfono (WhatsApp)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-beige-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {errorMsg && (
            <p className="text-sm text-red-500 text-center">{errorMsg}</p>
          )}

          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="w-full bg-orange-500 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Enviando...' : 'Finalizar pedido por WhatsApp'}
          </button>
        </div>
      )}
    </div>
  );
}