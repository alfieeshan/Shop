import { useState, useEffect } from 'react';
import { Product } from '../types';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { normalizeProductImages } from '../utils/productNormalizer';

interface ProductCarouselProps {
  products: Product[];
  onProductClick: (id: string | number) => void;
}

export default function ProductCarousel({ products, onProductClick }: ProductCarouselProps) {
  const featured = products.filter(p => p.featured).slice(0, 5);
  const items = featured.length > 0 ? featured : products.slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000); // 5 seconds autoplay

    return () => clearInterval(timer);
  }, [currentIndex, items]);

  if (items.length === 0) return null;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const currentProduct = items[currentIndex];
  const images = normalizeProductImages(currentProduct.images);
  const displayImage = currentProduct.image_url || images[0];

  const formattedPrice = currentProduct.price !== undefined && currentProduct.price !== null
    ? `৳${new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(currentProduct.price)}`
    : 'Price on Request';

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return (
    <div className="relative bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-sm my-8">
      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px] md:min-h-[480px]">
        
        {/* Left Side: Product Meta & Call to action */}
        <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between text-left relative z-10 bg-white">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAFAFA] text-[#111111] border border-[#EAEAEA] uppercase tracking-wider">
                {currentProduct.category}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                Featured Flagship
              </span>
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentProduct.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <h3 className="text-3xl sm:text-4xl font-sans font-light tracking-tight text-[#111111] leading-tight">
                  {currentProduct.name}
                </h3>
                
                <p className="text-xs sm:text-sm text-[#666666] font-light leading-relaxed line-clamp-4">
                  {currentProduct.description}
                </p>

                <div className="pt-2">
                  <span className="text-2xl font-sans font-semibold text-[#111111]">
                    {formattedPrice}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pt-8 flex items-center justify-between">
            <button
              onClick={() => onProductClick(currentProduct.id)}
              className="inline-flex items-center gap-2 bg-[#111111] text-[#FAFAFA] hover:bg-[#222222] text-xs font-semibold px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <span>Explore Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Slider Dots */}
            <div className="flex items-center gap-1.5">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-5 bg-[#111111]' : 'w-1.5 bg-[#EAEAEA] hover:bg-[#999999]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Showcase Image with Elegant Crop */}
        <div className="lg:col-span-7 bg-[#FAFAFA] relative min-h-[280px] lg:min-h-0 overflow-hidden flex items-center justify-center border-t lg:border-t-0 lg:border-l border-[#EAEAEA]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentProduct.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full p-6 sm:p-12 flex items-center justify-center"
            >
              <img
                src={displayImage}
                alt={currentProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[340px] drop-shadow-md select-none transition-transform duration-700 hover:scale-[1.02]"
              />
            </motion.div>
          </AnimatePresence>

          {/* Interactive Absolute Controls */}
          <div className="absolute right-6 bottom-6 flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white border border-[#EAEAEA] shadow-sm flex items-center justify-center hover:bg-[#FAFAFA] text-[#111111] transition-all cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white border border-[#EAEAEA] shadow-sm flex items-center justify-center hover:bg-[#FAFAFA] text-[#111111] transition-all cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
