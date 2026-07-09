import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { normalizeProduct } from '../utils/productNormalizer';

// Retrieve environment variables (prioritize NEXT_PUBLIC_ as requested)
const supabaseUrl = 
  (import.meta as any).env.NEXT_PUBLIC_SUPABASE_URL || 
  (import.meta as any).env.VITE_SUPABASE_URL || 
  '';
const supabaseAnonKey = 
  (import.meta as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 
  '';

// Validate if variables are configured and are not placeholders
export const isSupabaseConfigured = 
  Boolean(supabaseUrl) && 
  Boolean(supabaseAnonKey) && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('your-supabase-project');

// Create the client or null if not configured
let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
}

export const supabase = supabaseInstance;

/**
 * Get products based on search, is_active status, and sort state
 */
export async function getProducts(options?: {
  searchQuery?: string;
  sortBy?: 'latest' | 'price-asc' | 'price-desc' | 'name';
}): Promise<Product[]> {
  if (!supabase) {
    return filterMockProducts(options);
  }

  try {
    // Try querying with 'is_active' column filter as specified
    let query = supabase.from('products').select('*').eq('is_active', true);

    if (options?.searchQuery) {
      const trimmedQuery = options.searchQuery.trim();
      query = query.or(`name.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`);
    }

    // Sort mapping
    if (options?.sortBy) {
      switch (options.sortBy) {
        case 'latest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price-asc':
          query = query.order('price', { ascending: true, nullsFirst: false });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false, nullsFirst: false });
          break;
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      // Fallback query in case the user has not yet created or migrated the 'is_active' column
      console.warn('Querying with is_active failed, attempting query without filter:', error);
      let fallbackQuery = supabase.from('products').select('*');
      if (options?.searchQuery) {
        const trimmedQuery = options.searchQuery.trim();
        fallbackQuery = fallbackQuery.or(`name.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`);
      }
      const res = await fallbackQuery;
      if (res.error) throw res.error;
      if (res.data) {
        return res.data.map(normalizeProduct);
      }
      return [];
    }

    if (data) {
      return data.map(normalizeProduct);
    }
    return [];
  } catch (error) {
    console.warn('Supabase getProducts failed, falling back to mock data:', error);
    return filterMockProducts(options);
  }
}

/**
 * Helper to filter mock products locally
 */
function filterMockProducts(options?: {
  searchQuery?: string;
  sortBy?: 'latest' | 'price-asc' | 'price-desc' | 'name';
}): Product[] {
  // Only display active mock products (conforming to is_active rule)
  let products = [...MOCK_PRODUCTS].filter(p => p.is_active !== false);

  if (options?.searchQuery) {
    const term = options.searchQuery.toLowerCase().trim();
    products = products.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term)
    );
  }

  if (options?.sortBy) {
    switch (options.sortBy) {
      case 'latest':
        products.sort((a, b) => {
          const tA = a.created_at || '';
          const tB = b.created_at || '';
          return tB.localeCompare(tA);
        });
        break;
      case 'price-asc':
        products.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        products.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
  }

  return products;
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  if (!supabase) {
    return MOCK_PRODUCTS.filter(p => p.featured && p.is_active !== false);
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('featured', true)
      .limit(4);

    if (error) {
      // Fallback query if is_active is not yet available in schema
      const { data: fbData, error: fbError } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4);
      if (fbError) throw fbError;
      if (fbData) return fbData.map(normalizeProduct);
    }

    if (data && data.length > 0) {
      return data.map(normalizeProduct);
    }
    
    const all = await getProducts();
    return all.slice(0, 4);
  } catch (error) {
    console.warn('Supabase getFeaturedProducts failed, falling back to mock data:', error);
    return MOCK_PRODUCTS.filter(p => p.featured && p.is_active !== false);
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string | number): Promise<Product | null> {
  if (!supabase) {
    const local = MOCK_PRODUCTS.find(p => String(p.id) === String(id));
    return local ? local : null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (data) {
      return normalizeProduct(data);
    }
    return null;
  } catch (error) {
    console.warn(`Supabase getProductById(${id}) failed, checking mock data:`, error);
    const local = MOCK_PRODUCTS.find(p => String(p.id) === String(id));
    return local ? local : null;
  }
}
