import { useState, useEffect } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { normalizeProductImages } from '../utils/productNormalizer';

interface RandomRecommendationProps {
  products: Product[];
  onProductClick: (id: string | number) => void;
}

export default function RandomRecommendation({ products, onProductClick }: RandomRecommendationProps) {
  const [recommended, setRecommended] = useState<Product | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (products.length === 0) return;

    // Retrieve recommendation on load
    const timer = setTimeout(() => {
      // Pick a random product
      const randomIndex = Math.floor(Math.random() * products.length);
      setRecommended(products[randomIndex]);
      setIsVisible(true);
    }, 1800); // Trigger 1.8 seconds after page load for premium feel

    return () => clearTimeout(timer);
  }, [products]);

  if (!recommended) return null;

  const images = normalizeProductImages(recommended.images);
  const displayImage = recommended.image_url || images[0];
  const formattedPrice = recommended.price !== undefined && recommended.price !== null
    ? `৳${new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(recommended.price)}`
    : 'Price on Request';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="fixed bottom-6 left-6 z-40 max-w-sm w-full bg-white border border-[#EAEAEA] rounded-2xl shadow-xl p-4 text-left flex items-start gap-4"
        >
          {/* Accent decoration */}
          <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center shadow-md animate-pulse">
            <Sparkles className="w-3 h-3 text-[#FAFAFA]" />
          </div>

          {/* Product Thumbnail */}
          <div className="w-16 h-16 bg-[#FAFAFA] rounded-xl border border-[#EAEAEA] p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={displayImage}
              alt={recommended.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Product details */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-start justify-between">
              <span className="text-[9px] font-semibold tracking-wider text-emerald-600 uppercase">
                Daily Discovery
              </span>
              <button
                onClick={() => setIsVisible(false)}
                className="text-[#666666] hover:text-[#111111] transition-colors p-0.5"
                aria-label="Close recommendation"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="text-xs font-semibold text-[#111111] truncate pr-4">
              {recommended.name}
            </h4>
            <p className="text-[10px] text-[#666666] line-clamp-1 font-light">
              {recommended.description}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-[#111111]">
                {formattedPrice}
              </span>
              <button
                onClick={() => {
                  onProductClick(recommended.id);
                  setIsVisible(false);
                }}
                className="text-[10px] font-semibold text-[#111111] hover:underline cursor-pointer"
              >
                Explore Phone
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
