import {
  Search,
  LayoutGrid,
  Wheat,
  Leaf,
  Apple,
  Sun,
  Package,
  Sprout,
  Cherry,
  Layers,
  Cookie,
  Cake,
  Flower2,
} from 'lucide-react';

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CATEGORY_ICONS: Record<string, typeof Wheat> = {
  'Cereales': Wheat,
  'Condimentos y hierbas': Leaf,
  'Frutas secas peladas': Apple,
  'Frutos desecados': Sun,
  'Harina y azúcar': Package,
  'Legumbres': Sprout,
  'Maní': Cherry,
  'Mix de frutos secos': Layers,
  'Productos con chocolate': Cookie,
  'Repostería': Cake,
  'Semillas': Flower2,
};

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
          className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === null
              ? 'bg-forest text-white shadow-sm'
              : 'bg-white text-brown/70 border border-brown/10 hover:border-forest/30 hover:text-forest'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Todos
        </button>
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] || Package;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-white text-brown/70 border border-brown/10 hover:border-forest/30 hover:text-forest'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}