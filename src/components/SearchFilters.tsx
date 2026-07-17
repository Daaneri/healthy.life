import { useEffect, useRef, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  onCategorySelect: (category: string) => void;
}

export function SearchFilters({
  search,
  onSearchChange,
  categories,
  onCategorySelect,
}: SearchFiltersProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (category: string) => {
    setMenuOpen(false);
    onCategorySelect(category);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mb-8 space-y-2">
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

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-forest bg-white border border-brown/10 px-4 py-2 rounded-full hover:border-forest/30 transition-colors"
        >
          Categorías
          <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        </button>

        {menuOpen && (
          <div className="absolute left-0 top-full mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-xl shadow-lg border border-brown/10 py-2 z-40">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSelect(cat)}
                className="w-full text-left px-4 py-2 text-sm text-brown/80 hover:bg-beige-100 hover:text-forest transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}