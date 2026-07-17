import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CartButton } from './CartButton';
import logoImg from '../assets/logo-header.png';

interface HeaderProps {
  onCartClick: () => void;
  categories: string[];
  onCategorySelect: (category: string) => void;
}

const ANNOUNCEMENTS = [
  'Envío a todo el país',
  'Pedidos por WhatsApp',
  'Productos 100% naturales',
];

export function Header({ onCartClick, categories, onCategorySelect }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const unit = ANNOUNCEMENTS.join('     •     ') + '     •     ';
  const singleLoop = unit.repeat(6);
  const marqueeText = singleLoop + singleLoop;

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
    <header className="sticky top-0 z-40">
      <div className="bg-forest text-cream text-xs py-1.5 overflow-hidden whitespace-nowrap text-left">
        <div className="animate-marquee inline-block">{marqueeText}</div>
      </div>

      <div className="bg-offwhite border-b border-brown/10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={logoImg}
              alt="Healthy Life"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="font-display font-semibold text-xl text-forest">
              Healthy Life
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1 text-sm font-medium text-forest hover:text-mustard-dark transition-colors"
              >
                Productos
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 sm:left-0 top-full mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-xl shadow-lg border border-brown/10 py-2 z-50">
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

            <CartButton onClick={onCartClick} />
          </div>
        </div>
      </div>
    </header>
  );
}