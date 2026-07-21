import { MessageCircle, MapPin, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-50">
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-2">Healthy Life</h3>
          <p className="text-emerald-200/80 text-sm leading-relaxed">
            Frutos secos, semillas y frutas desecadas naturales, seleccionados para tu bienestar.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-3 text-emerald-100">Contacto</h4>
          
          <a  
            href="https://wa.me/5491138899936"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-emerald-200/80 hover:text-amber-400 transition-colors mb-2"
          >
            <MessageCircle className="w-4 h-4" />
            Escribinos por WhatsApp
          </a>

          <div className="flex items-center gap-2 text-sm text-emerald-200/80">
            <MapPin className="w-4 h-4" />
            Villa Constitución, Santa Fe (Envíos y retiro coordinado)
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-3 text-emerald-100">Horario de atención</h4>
          <div className="flex items-center gap-2 text-sm text-emerald-200/80">
            <Clock className="w-4 h-4" />
            Lunes a sábados de 9:00 a 20:00 hs
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-800 py-4 text-center text-xs text-emerald-300/60">
        © {new Date().getFullYear()} Healthy Life. Todos los derechos reservados.
      </div>
    </footer>
  );
}