import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
      className="fixed bottom-24 right-4 sm:bottom-6 sm:right-24 z-40 w-11 h-11 rounded-full bg-white border border-brown/15 shadow-md flex items-center justify-center hover:bg-beige-100 transition-colors"
    >
      <ArrowUp className="w-5 h-5 text-forest" />
    </button>
  );
}