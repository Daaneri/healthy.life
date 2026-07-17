import type { Product } from '../types/product';

type CartItem = Product & { quantity: number };

/**
 * Precio efectivo según cantidad: si el producto tiene escala (mixes en oferta),
 * usa el tramo correspondiente (1kg / 2kg / 3kg+). Si no tiene escala cargada,
 * usa el precio normal (price_retail).
 */
export function getEffectivePrice(item: CartItem | Product, quantity: number): number {
  if (item.price_per_kg === null) {
    return item.price_retail;
  }
  if (quantity >= 3 && item.price_per_3kg_plus !== null) {
    return item.price_per_3kg_plus;
  }
  if (quantity === 2 && item.price_per_2kg !== null) {
    return item.price_per_2kg;
  }
  return item.price_per_kg;
}

/**
 * Valida un teléfono argentino de forma laxa: entre 8 y 15 dígitos,
 * permitiendo espacios, guiones, paréntesis y "+" en la entrada del usuario.
 */
export function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/[\s\-()+ ]/g, '');
  return /^\d{8,15}$/.test(digitsOnly);
}