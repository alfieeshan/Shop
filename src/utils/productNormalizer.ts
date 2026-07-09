import { Product } from '../types';

/**
 * Construct public storage URLs for relative paths inside Supabase Storage bucket 'Shop'.
 */
export function getPublicStorageUrl(path: string): string {
  if (!path) {
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80';
  }
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Strip leading slash if any
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Retrieve current active Supabase URL from environments
  const url = 
    (import.meta as any).env.VITE_SUPABASE_URL || 
    (import.meta as any).env.NEXT_PUBLIC_SUPABASE_URL || 
    '';
    
  if (url) {
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    
    // Check if the path already includes the bucket name. If not, default to 'Shop'.
    if (cleanPath.startsWith('Shop/') || cleanPath.startsWith('product-images/')) {
      return `${cleanUrl}/storage/v1/object/public/${cleanPath}`;
    }
    // Users specify images are in a public bucket named 'Shop'.
    return `${cleanUrl}/storage/v1/object/public/Shop/${cleanPath}`;
  }
  
  return path;
}

/**
 * Normalizes product images into a clean string array.
 * Robustly handles arrays, JSON arrays, comma-separated lists, and single URLs.
 */
export function normalizeProductImages(images: any, image_url?: any): string[] {
  if (image_url) {
    return [getPublicStorageUrl(String(image_url).trim())];
  }

  if (!images) {
    return ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80']; // Default premium placeholder
  }

  // If it's already an array, clean each element
  if (Array.isArray(images)) {
    return images.map(img => getPublicStorageUrl(String(img).trim())).filter(Boolean);
  }

  // If it is a string
  if (typeof images === 'string') {
    const trimmed = images.trim();
    
    // Check if it's a JSON array string
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(img => getPublicStorageUrl(String(img).trim())).filter(Boolean);
        }
      } catch (e) {
        // Fall through
      }
    }

    // Check if it's a comma-separated list
    if (trimmed.includes(',')) {
      return trimmed.split(',').map(img => getPublicStorageUrl(img.trim())).filter(Boolean);
    }

    // Single URL
    return [getPublicStorageUrl(trimmed)];
  }

  return [getPublicStorageUrl(String(images))];
}

/**
 * Safely parses a product record and ensures it conforms to expected types.
 */
export function normalizeProduct(raw: any): Product {
  const resolvedImages = normalizeProductImages(raw.images, raw.image_url);

  return {
    id: raw.id,
    name: String(raw.name || 'Unnamed Product'),
    description: String(raw.description || ''),
    images: resolvedImages,
    image_url: raw.image_url ? getPublicStorageUrl(raw.image_url) : (resolvedImages[0] || ''),
    whatsapp_number: String(raw.whatsapp_number || '8801712345678'),
    category: String(raw.category || 'Premium Phone'),
    price: raw.price !== null && raw.price !== undefined ? Number(raw.price) : undefined,
    featured: Boolean(raw.featured),
    is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : true,
    created_at: raw.created_at || new Date().toISOString()
  };
}
