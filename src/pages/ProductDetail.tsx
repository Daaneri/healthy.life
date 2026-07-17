import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types/product';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { getEffectivePrice } from '../utils/pricing';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useToastStore((state) => state.showToast);

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);
      setQuantity(1);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProduct(data);

      const { data: relatedData } = await supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(4);

      setRelated(relatedData || []);
      setLoading(false);
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    showToast(`${product.name} agregado`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Header onCartClick={() => {}} />
        <div className="flex-1 flex items-center justify-center text-brown/40">
          Cargando producto...
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Header onCartClick={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <p className="text-brown/60 font-medium">No encontramos ese producto.</p>
          <Link to="/" className="text-forest font-semibold underline">
            Volver al catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const outOfStock = product.stock <= 0;
  const effectivePrice = getEffectivePrice(product, quantity);
  const isDiscounted = product.price_per_kg !== null && effectivePrice < product.price_per_kg;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header onCartClick={() => {}} />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-brown/60 hover:text-forest text-sm mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>

        <div className="grid sm:grid-cols-2 gap-8">
          {/* Galería */}
          <div className="aspect-square bg-beige-100 rounded-2xl overflow-hidden flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">Sin imagen</span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="inline-block w-fit bg-offwhite text-forest text-xs font-medium px-2.5 py-1 rounded-full border border-brown/10 mb-3">
              {product.category}
            </span>

            <h1 className="font-display font-bold text-forest text-2xl sm:text-3xl leading-snug">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-brown/70 mt-3 leading-relaxed">{product.description}</p>
            )}

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-forest font-bold text-3xl">
                ${effectivePrice.toLocaleString('es-AR')}
              </span>
              {isDiscounted && (
                <span className="text-green-600 text-sm font-medium">
                  precio por {quantity}kg
                </span>
              )}
            </div>

            {product.price_per_kg !== null && (
              <p className="text-brown/50 text-xs mt-1">
                Llevando 2kg o más el precio baja automáticamente
              </p>
            )}

            {outOfStock ? (
              <p className="mt-6 text-brown/60 font-medium">Sin stock por el momento</p>
            ) : (
              <>
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-sm font-medium text-brown/70">Cantidad</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-beige-100 hover:bg-beige-200 active:scale-90 transition-transform"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-beige-100 hover:bg-beige-200 active:scale-90 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {product.stock <= 5 && (
                    <span className="text-mustard text-xs font-semibold">
                      ¡Quedan {product.stock}!
                    </span>
                  )}
                </div>

                <button
                  onClick={handleAdd}
                  className="mt-6 w-full sm:w-auto flex items-center justify-center gap-2 bg-mustard text-white px-6 py-3 rounded-lg font-medium hover:bg-mustard-dark active:scale-95 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Agregar al carrito
                </button>
              </>
            )}
          </div>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display font-semibold text-forest text-lg mb-4">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/producto/${p.id}`}
                  className="bg-white rounded-xl border border-brown/10 p-2.5 hover:shadow-md transition-shadow"
                >
                  <div className="h-24 bg-beige-100 rounded-lg overflow-hidden mb-2">
                    {p.image_url && (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs font-medium text-forest line-clamp-2">{p.name}</p>
                  <p className="text-xs text-brown/60 mt-0.5">
                    ${p.price_retail.toLocaleString('es-AR')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}