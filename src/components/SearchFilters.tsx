import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function SearchFilters({
  search,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
}: SearchFiltersProps) {
  // Estado local para que el input responda al instante, mientras
  // el filtrado real (onSearchChange) se dispara recién 300ms después
  // de que el usuario deja de tipear.
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(inputValue);
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <div className="sticky top-[92px] z-30 bg-cream/95 backdrop-blur-sm -mx-6 px-6 pt-2 pb-4 mb-4 border-b border-brown/10">
      <div className="max-w-5xl mx-auto px-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full border border-beige-300 rounded-full pl-10 pr-4 py-2.5 text-sm bg-offwhite focus:outline-none focus:ring-2 focus:ring-mustard/50 focus:border-mustard transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => onCategoryChange(null)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-forest text-white shadow-sm'
                : 'bg-white text-brown/70 border border-brown/10 hover:border-forest/30 hover:text-forest'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-white text-brown/70 border border-brown/10 hover:border-forest/30 hover:text-forest'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}