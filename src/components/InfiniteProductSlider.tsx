import { Product } from '../types';
import { normalizeProductImages } from '../utils/productNormalizer';

interface InfiniteProductSliderProps {
  products: Product[];
  onProductClick: (id: string | number) => void;
  reverse?: boolean;
}

export default function InfiniteProductSlider({ products, onProductClick, reverse = false }: InfiniteProductSliderProps) {
  if (products.length === 0) return null;

  // Duplicate items to ensure smooth infinite wrap around
  const displayItems = [...products, ...products, ...products, ...products];

  return (
    <div className="w-full overflow-hidden py-4 select-none relative">
      {/* Subtle fade overlay on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />

      <div 
        className={`flex gap-6 w-max ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
      >
        {displayItems.map((product, idx) => {
          const images = normalizeProductImages(product.images);
          const displayImage = product.image_url || images[0];
          const formattedPrice = product.price !== undefined && product.price !== null
            ? `৳${new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(product.price)}`
            : 'Price on Request';

          return (
            <button
              key={`${product.id}-${idx}`}
              onClick={() => onProductClick(product.id)}
              className="flex items-center gap-4 bg-white border border-[#EAEAEA] hover:border-[#111111] px-5 py-3.5 rounded-2xl w-[260px] shrink-0 text-left transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#FAFAFA] shrink-0 border border-[#EAEAEA] flex items-center justify-center p-1.5">
                <img
                  src={displayImage}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-[10px] font-semibold text-[#666666] tracking-wider uppercase truncate">
                  {product.category}
                </p>
                <h4 className="text-xs font-semibold text-[#111111] truncate group-hover:text-[#666666] transition-colors">
                  {product.name}
                </h4>
                <p className="text-xs font-medium text-[#111111]">
                  {formattedPrice}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
