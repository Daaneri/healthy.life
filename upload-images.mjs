// upload-images.mjs
// Corré esto una sola vez desde la terminal: node upload-images.mjs
//
// Antes de correrlo:
// 1. npm install dotenv @supabase/supabase-js
// 2. Completá SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tu .env
// 3. Las fotos pueden estar sueltas o organizadas en subcarpetas por categoría
//    dentro de ./product-photos — el script busca en todos los niveles.
//    El nombre de archivo (sin extensión) tiene que ser igual al nombre del producto.

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BUCKET_NAME = 'product-images';
const PHOTOS_FOLDER = './product-photos';
const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const getContentType = (ext) => {
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  };
  return map[ext.toLowerCase()] || 'application/octet-stream';
};

// Recorre carpetas y subcarpetas, devuelve la lista completa de archivos de imagen encontrados
function getAllImageFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.name.startsWith('.')) continue;

    if (entry.isDirectory()) {
      results = results.concat(getAllImageFiles(fullPath));
    } else if (VALID_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }

  return results;
}

async function run() {
  const files = getAllImageFiles(PHOTOS_FOLDER);

  console.log(`Encontré ${files.length} fotos en total (incluyendo subcarpetas)\n`);

  const matched = [];
  const unmatched = [];

  for (const filePath of files) {
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName);
    const productName = path.basename(fileName, ext).trim();
    const fileBuffer = fs.readFileSync(filePath);

    // 1. Subir a Storage (uso el nombre de archivo solo, sin la subcarpeta, para mantener el bucket plano)
    const storagePath = `products/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: getContentType(ext),
        upsert: true,
      });

    if (uploadError) {
      console.error(`❌ Error subiendo "${fileName}":`, uploadError.message);
      unmatched.push(filePath);
      continue;
    }

    // 2. Obtener URL pública
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
    const publicUrl = urlData.publicUrl;

    // 3. Actualizar el producto (case-insensitive)
    const { data: updated, error: updateError } = await supabase
      .from('products')
      .update({ image_url: publicUrl })
      .ilike('name', productName)
      .select();

    if (updateError) {
      console.error(`❌ Error actualizando "${productName}":`, updateError.message);
      unmatched.push(filePath);
      continue;
    }

    if (!updated || updated.length === 0) {
      console.warn(`⚠️  Subida OK, pero no encontré un producto llamado "${productName}" (archivo: ${filePath})`);
      unmatched.push(filePath);
      continue;
    }

    console.log(`✅ ${productName}`);
    matched.push(productName);
  }

  console.log(`\n--- Resumen ---`);
  console.log(`Actualizados: ${matched.length}`);
  console.log(`Con problemas: ${unmatched.length}`);
  if (unmatched.length > 0) {
    console.log(`Archivos a revisar:`);
    unmatched.forEach((f) => console.log(`  - ${f}`));
  }
}

run();