import { MessageCircle, MapPin, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-forest text-cream">
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display font-semibold text-lg mb-2">Healthy Life</h3>
          <p className="text-cream/70 text-sm leading-relaxed">
            Frutos secos, semillas y frutas desecadas naturales, seleccionados para tu bienestar.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-3 text-cream/90">Contacto</h4>
          
          <a  href="https://wa.me/5491138899936"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 text-sm text-cream/70 hover:text-mustard transition-colors mb-2"
>
  <MessageCircle className="w-4 h-4" />
  Escribinos por WhatsApp
</a>

          <div className="flex items-center gap-2 text-sm text-cream/70">
            <MapPin className="w-4 h-4" />
            Villa Constitución, Santa Fe
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-3 text-cream/90">Horario</h4>
          <div className="flex items-center gap-2 text-sm text-cream/70">
            <Clock className="w-4 h-4" />
            Lunes a sábados, 9 a 20 hs
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Healthy Life. Todos los derechos reservados.
      </div>
    </footer>
  );
}