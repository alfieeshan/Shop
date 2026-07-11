import { useState, useEffect } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { normalizeProductImages } from '../utils/productNormalizer';
import { ArrowUpRight } from 'lucide-react';

interface RecentlyAddedSliderProps {
  products: Product[];
  onProductClick: (id: string | number) => void;
}

export default function RecentlyAddedSlider({ products, onProductClick }: RecentlyAddedSliderProps) {
  // Sort by created_at desc or fallback to id
  const latestProducts = [...products]
    .sort((a, b) => {
      const dateA = a.created_at || '';
      const dateB = b.created_at || '';
      return dateB.localeCompare(dateA);
    })
    .slice(0, 6);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (latestProducts.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % latestProducts.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [activeIndex, latestProducts]);

  if (latestProducts.length === 0) return null;

  const currentProduct = latestProducts[activeIndex];
  const images = normalizeProductImages(currentProduct.images);
  const displayImage = currentProduct.image_url || images[0];
  const formattedPrice = currentProduct.price !== undefined && currentProduct.price !== null
    ? `৳${new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(currentProduct.price)}`
    : 'Price on Request';

  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 space-y-6 text-left my-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-sans font-medium text-[#111111] tracking-tight">
            New Arrivals
          </h3>
          <p className="text-[11px] text-[#666666] font-light">
            Freshly unboxed global devices and official models
          </p>
        </div>

        {/* Custom Progress Indicators */}
        <div className="flex items-center gap-1">
          {latestProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-4 bg-[#111111]' : 'w-1 bg-[#EAEAEA] hover:bg-[#666666]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Thumbnail Showcase Grid (Left) */}
        <div className="md:col-span-4 flex md:flex-col gap-2 overflow-x-auto scrollbar-none md:overflow-visible">
          {latestProducts.map((product, idx) => {
            const prodImages = normalizeProductImages(product.images);
            const thumbImg = product.image_url || prodImages[0];
            return (
              <button
                key={product.id}
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all shrink-0 md:shrink w-[180px] md:w-full cursor-pointer ${
                  activeIndex === idx
                    ? 'border-[#111111] bg-[#FAFAFA]'
                    : 'border-[#EAEAEA] bg-white hover:border-[#666666]'
                }`}
              >
                <div className="w-8 h-8 rounded bg-[#FAFAFA] overflow-hidden shrink-0 border border-[#EAEAEA] flex items-center justify-center p-1">
                  <img
                    src={thumbImg}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[11px] font-semibold text-[#111111] truncate">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-[#666666] truncate">
                    {product.category}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Featured Active Display (Right) */}
        <div className="md:col-span-8 bg-[#FAFAFA] rounded-xl border border-[#EAEAEA] p-6 min-h-[220px] flex flex-col justify-between relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center flex-1"
            >
              <div className="sm:col-span-4 flex justify-center">
                <div className="w-32 h-32 overflow-hidden bg-white rounded-xl border border-[#EAEAEA] p-3 shadow-sm flex items-center justify-center">
                  <img
                    src={displayImage}
                    alt={currentProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-8 text-left space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold tracking-wider text-[#666666] uppercase">
                    {currentProduct.category}
                  </span>
                  <h4 className="text-base font-sans font-medium text-[#111111] leading-snug">
                    {currentProduct.name}
                  </h4>
                </div>

                <p className="text-xs text-[#666666] font-light leading-relaxed line-clamp-2">
                  {currentProduct.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-semibold text-[#111111]">
                    {formattedPrice}
                  </span>

                  <button
                    onClick={() => onProductClick(currentProduct.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] hover:text-[#666666] transition-colors cursor-pointer group"
                  >
                    <span>View Flagship</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
