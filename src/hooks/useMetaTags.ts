import { useEffect } from 'react';

interface MetaTagsOptions {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'product';
}

const SITE_NAME = 'Healthy Life';
const DEFAULT_DESCRIPTION = 'Frutos secos, semillas y mixes naturales seleccionados.';

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Actualiza el <title> y las meta tags (og:*, description) de la página actual.
 * Al desmontar, restaura los valores por defecto del sitio (los que están en index.html)
 * para que al volver al catálogo no queden pegados los del producto anterior.
 */
export function useMetaTags({ title, description, image, type = 'website' }: MetaTagsOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const desc = description || DEFAULT_DESCRIPTION;

    const previousTitle = document.title;
    document.title = fullTitle;

    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('property', 'og:type', type === 'product' ? 'product' : 'website');
    setMetaTag('name', 'description', desc);

    if (image) {
      setMetaTag('property', 'og:image', image);
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, image, type]);
}