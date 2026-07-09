export interface Product {
  id: string | number;
  name: string;
  description: string;
  images: string | string[]; // Can be a single image URL, comma-separated string, or an array of URLs
  image_url?: string;
  whatsapp_number: string;
  category: string;
  price?: number;
  featured?: boolean;
  is_active?: boolean;
  created_at?: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  sortBy: 'latest' | 'price-asc' | 'price-desc' | 'name';
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}
