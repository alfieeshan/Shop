import { Product } from '../types';
import { normalizeProductImages } from '../utils/productNormalizer';
import { Search } from 'lucide-react';

interface SearchSuggestionsProps {
  query: string;
  products: Product[];
  onSelect: (id: string | number) => void;
  onClose: () => void;
}

export default function SearchSuggestions({ query, products, onSelect, onClose }: SearchSuggestionsProps) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return null;

  // Filter products by brand/category or name
  const matches = products.filter(p => 
    p.name.toLowerCase().includes(trimmed) || 
    p.category.toLowerCase().includes(trimmed)
  ).slice(0, 5); // Limit to top 5 matches

  if (matches.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#EAEAEA] rounded-xl shadow-lg z-50 p-4 text-left">
        <p className="text-xs text-[#666666] font-light">
          No matches found for "{query}"
        </p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#EAEAEA] rounded-xl shadow-lg z-50 overflow-hidden text-left max-h-[300px] overflow-y-auto scrollbar-none animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="bg-[#FAFAFA] px-3.5 py-1.5 border-b border-[#EAEAEA] flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider">
          Suggested Phones
        </span>
        <span className="text-[9px] text-[#999999]">
          {matches.length} {matches.length === 1 ? 'match' : 'matches'}
        </span>
      </div>

      <div className="divide-y divide-[#F1F1F1]">
        {matches.map((product) => {
          const images = normalizeProductImages(product.images);
          const displayImage = product.image_url || images[0];
          const formattedPrice = product.price !== undefined && product.price !== null
            ? `৳${new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(product.price)}`
            : 'Price on Request';

          return (
            <button
              key={product.id}
              onClick={() => {
                onSelect(product.id);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#FAFAFA] border border-[#EAEAEA] overflow-hidden p-1 shrink-0 flex items-center justify-center">
                <img
                  src={displayImage}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="text-xs font-semibold text-[#111111] truncate group-hover:text-[#666666] transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-[#666666] font-light">
                  <span className="uppercase">{product.category}</span>
                  <span>&bull;</span>
                  <span className="font-medium text-[#111111]">{formattedPrice}</span>
                </div>
              </div>

              <Search className="w-3.5 h-3.5 text-[#CCCCCC] group-hover:text-[#111111] transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
