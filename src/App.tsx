import { useEffect, useState, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import type { Product } from './types/product';
import { ProductCard } from './components/ProductCard';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { CartModal } from './components/CartModal';
import { SearchFilters } from './components/SearchFilters';
import { CategoryProductsModal } from './components/CategoryProductsModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminPanel } from './pages/AdminPanel';

function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [modalCategory, setModalCategory] = useState<string | null>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error('Error:', error);
      else setProducts(data || []);
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return Array.from(unique).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  const groupedByCategory = useMemo(() => {
    const groups = new Map<string, Product[]>();
    for (const p of filteredProducts) {
      if (!groups.has(p.category)) groups.set(p.category, []);
      groups.get(p.category)!.push(p);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredProducts]);

  const modalProducts = useMemo(() => {
    if (!modalCategory) return [];
    return products.filter((p) => p.category === modalCategory);
  }, [products, modalCategory]);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string | null) => {
    setModalCategory(category);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <Hero onCtaClick={scrollToCatalog} />

      <div ref={catalogRef} className="bg-texture p-6 flex-1">
        <SearchFilters
          search={search}
          onSearchChange={setSearch}
          categories={categories}
          activeCategory={modalCategory}
          onCategoryChange={handleCategoryChange}
        />

        {filteredProducts.length === 0 ? (
          <p className="text-center text-brown/60 py-10">
            No encontramos productos con esa búsqueda.
          </p>
        ) : (
          <div className="max-w-5xl mx-auto space-y-10">
            {groupedByCategory.map(([category, items]) => (
              <section key={category}>
                <h2 className="font-display font-semibold text-xl text-forest mb-4">
                  {category}
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <CartModal onClose={() => setIsCartOpen(false)} />
        </div>
      )}

      {modalCategory && (
        <CategoryProductsModal
          category={modalCategory}
          products={modalProducts}
          onClose={() => setModalCategory(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;