// Script para generar public/sitemap.xml a partir de los productos reales en Supabase.
// Se corre a mano o como parte del build (ver instrucciones más abajo).
//
// Uso: node scripts/generate-sitemap.mjs
//
// Requiere las mismas variables de entorno que usa la app:
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
// y una variable extra con el dominio real del sitio:
//   SITE_URL=https://tu-dominio.com

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { config } from 'dotenv';

config(); // lee el .env

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = process.env.SITE_URL || 'https://tu-dominio.com';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en el .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateSitemap() {
  const { data: products, error } = await supabase.from('products').select('id');

  if (error) {
    console.error('Error trayendo productos:', error.message);
    process.exit(1);
  }

  const staticUrls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
  ];

  const productUrls = (products || []).map((p) => ({
    loc: `${SITE_URL}/producto/${p.id}`,
    priority: '0.8',
  }));

  const allUrls = [...staticUrls, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  writeFileSync('public/sitemap.xml', xml);
  console.log(`sitemap.xml generado con ${allUrls.length} URLs en public/sitemap.xml`);
}

generateSitemap();