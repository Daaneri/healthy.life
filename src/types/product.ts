export interface Product {
  id: number;
  name: string;
  description: string;
  price_retail: number;
  price_wholesale: number | null;
  price_per_kg: number | null;
  price_per_2kg: number | null;
  price_per_3kg_plus: number | null;
  stock: number;
  image_url: string;
  category: string;
}