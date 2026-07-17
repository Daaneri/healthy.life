interface HeroProps {
  onCtaClick: () => void;
}

export function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-offwhite py-16 sm:py-24 px-6">
      {/* Blobs orgánicos de fondo */}
      <div
        className="absolute -top-16 -left-20 w-72 h-72 bg-forest/10"
        style={{ borderRadius: '58% 42% 65% 35% / 45% 40% 60% 55%' }}
      />
      <div
        className="absolute -bottom-24 -right-16 w-80 h-80 bg-mustard/15"
        style={{ borderRadius: '40% 60% 35% 65% / 55% 45% 55% 45%' }}
      />
      <div
        className="absolute top-1/3 right-8 w-24 h-24 bg-brown/10 hidden sm:block"
        style={{ borderRadius: '65% 35% 50% 50% / 40% 60% 40% 60%' }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <span className="inline-block font-display italic text-mustard-dark text-sm mb-3">
          Frutos secos & semillas
        </span>
        <h1 className="font-display font-semibold text-3xl sm:text-5xl text-forest mb-4 leading-tight">
          Frutos secos, a tu manera
        </h1>
        <p className="text-brown text-base sm:text-lg max-w-md mx-auto mb-8">
          Mixes, semillas y frutas secas seleccionadas. Pedís por WhatsApp y lo tenés en tu puerta.
        </p>
        <button
          onClick={onCtaClick}
          className="bg-mustard hover:bg-mustard-dark text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
        >
          Ver catálogo
        </button>
      </div>
    </section>
  );
}