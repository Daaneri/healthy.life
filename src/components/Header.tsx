import { CartButton } from './CartButton';
import logoImg from '../assets/logo-header.png';

interface HeaderProps {
  onCartClick: () => void;
}

const ANNOUNCEMENTS = [
  'Envío a todo el país',
  'Pedidos por WhatsApp',
  'Productos 100% naturales',
];

export function Header({ onCartClick }: HeaderProps) {
  const unit = ANNOUNCEMENTS.join('     •     ') + '     •     ';
  const singleLoop = unit.repeat(6);
  const marqueeText = singleLoop + singleLoop;

  return (
    <header className="sticky top-0 z-40">
      {/* Barra de anuncios en movimiento */}
      <div className="bg-forest text-cream text-xs py-1.5 overflow-hidden whitespace-nowrap text-left">
        <div
          className="animate-marquee inline-block"
          style={{ willChange: 'transform' }}
        >
          {marqueeText}
        </div>
      </div>

      {/* Barra principal */}
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
          <CartButton onClick={onCartClick} />
        </div>
      </div>
    </header>
  );
}