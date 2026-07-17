import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface CategorySectionProps {
  category: string;
  products: Product[];
}

const INITIAL_COUNT = 4;

export function CategorySection({ category, products }: CategorySectionProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = products.length > INITIAL_COUNT;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-xl text-forest">{category}</h2>
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="sm:hidden flex items-center gap-1 text-sm font-medium text-mustard-dark hover:text-mustard transition-colors"
          >
            {expanded ? 'Ver menos' : `Ver todos (${products.length})`}
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {products.map((p, idx) => {
          const hiddenOnMobile = !expanded && idx >= INITIAL_COUNT;
          return (
            <div key={p.id} className={hiddenOnMobile ? 'hidden sm:block' : ''}>
              <ProductCard product={p} />
            </div>
          );
        })}
      </div>
    </section>
  );
}