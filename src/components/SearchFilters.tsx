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
  return (
    <div className="max-w-5xl mx-auto px-4 mb-8 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
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
  );
}