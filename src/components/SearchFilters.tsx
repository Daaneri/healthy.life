import { Search } from 'lucide-react';

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function SearchFilters({ search, onSearchChange }: SearchFiltersProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 mb-8">
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
    </div>
  );
}