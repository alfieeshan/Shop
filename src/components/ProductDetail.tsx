import { useState, useEffect } from 'react';
import { Product } from '../types';
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { normalizeProductImages } from '../utils/productNormalizer';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  allProducts: Product[];
  onProductClick: (id: string | number) => void;
}

export default function ProductDetail({ product, onBack, allProducts, onProductClick }: ProductDetailProps) {
  const imagesList = normalizeProductImages(product.images);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Filter other products for "You May Also Like"
  const relatedProducts = allProducts
    .filter((p) => String(p.id) !== String(product.id))
    .sort((a, b) => {
      // Prioritize same brand/category
      const aSameBrand = a.category === product.category ? 1 : 0;
      const bSameBrand = b.category === product.category ? 1 : 0;
      return bSameBrand - aSameBrand;
    })
    .slice(0, 6);

  // Scroll to top when detail page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
  }, [product]);

  // Keyboard navigation for slider and lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (imagesList.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, imagesList]);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  // Format price if available
  const formattedPrice = product.price !== undefined && product.price !== null
    ? `৳${new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(product.price)}`
    : 'Price on Request';

  // Build the WhatsApp message template exactly as requested
  const buildWhatsAppLink = () => {
    const rawNumber = product.whatsapp_number || '8801712345678';
    // Clean non-digit characters for WhatsApp api
    const cleanNumber = rawNumber.replace(/\D/g, '');
    
    const currentUrl = window.location.href;
    const messageText = `Hello,

I want to order this product.

Product Name:
${product.name}

Description:
${product.description}

Product Link:
${currentUrl}

Please provide more information.`;

    const encodedMessage = encodeURIComponent(messageText);
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
      {/* Back button */}
      <div className="mb-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#666666] hover:text-[#111111] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: Gallery Panel */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Display Frame */}
          <div className="relative aspect-[4/3] rounded-xl bg-white border border-[#EAEAEA] overflow-hidden group">
            <img
              src={imagesList[activeImageIndex]}
              alt={`${product.name} - View ${activeImageIndex + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Slider Controls (Show if more than 1 image) */}
            {imagesList.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#EAEAEA] shadow-sm text-[#111111] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#EAEAEA] shadow-sm text-[#111111] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Lightbox / Zoom Trigger */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white border border-[#EAEAEA] shadow-sm text-[#111111] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
              title="Zoom image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Photo Index Indicator */}
            {imagesList.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#111111]/80 text-[#FAFAFA] text-[10px] font-medium tracking-wide">
                {activeImageIndex + 1} / {imagesList.length}
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {imagesList.length > 1 && (
            <div className="flex flex-wrap gap-2 pt-1 overflow-x-auto scrollbar-none">
              {imagesList.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-20 aspect-video rounded-lg overflow-hidden border transition-all cursor-pointer ${
                    activeImageIndex === index 
                      ? 'border-[#111111]' 
                      : 'border-[#EAEAEA] hover:border-[#666666]'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Description & Order Panel */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8 text-left">
          
          {/* Header Specs */}
          <div className="space-y-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[#666666] block">
              {product.category}
            </span>

            <h1 className="text-3xl lg:text-4xl font-sans font-light text-[#111111] tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price Frame */}
            <div className="py-2 flex items-baseline gap-2 border-b border-[#EAEAEA]">
              <span className="font-sans font-semibold text-[#111111] text-2xl">
                {formattedPrice}
              </span>
            </div>
          </div>

          {/* Core Description Text Block */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase text-[#666666] tracking-wider">Product Details</h3>
            <p className="text-[#111111] text-sm leading-relaxed whitespace-pre-line font-light">
              {product.description}
            </p>
          </div>

          {/* Minimalist Trust Badges */}
          <div className="border-t border-[#EAEAEA] pt-6 grid grid-cols-2 gap-4 text-left">
            <div>
              <h4 className="text-[11px] font-semibold uppercase text-[#111111] tracking-wider">Authentication</h4>
              <p className="text-xs text-[#666666] mt-1 font-light">100% Original Product guaranteed.</p>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold uppercase text-[#111111] tracking-wider">Customer Support</h4>
              <p className="text-xs text-[#666666] mt-1 font-light">Fast WhatsApp response within working hours.</p>
            </div>
          </div>

          {/* WhatsApp order button (Clean, rounded 12px, Accent green background) */}
          <div className="space-y-4 pt-4 border-t border-[#EAEAEA]">
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              id="whatsapp-order-btn"
              className="flex items-center justify-center w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm tracking-wide transition-all duration-200 text-center cursor-pointer shadow-sm"
            >
              Order via WhatsApp
            </a>
            
            <p className="text-center text-xs text-[#666666] leading-relaxed font-light">
              Orders are dispatched securely within Bangladesh. Direct vendor line: <span className="font-medium text-[#111111]">{product.whatsapp_number}</span>.
            </p>
          </div>

        </div>

      </div>

      {/* YOU MAY ALSO LIKE SLIDER */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-[#EAEAEA] space-y-8 text-left">
          <div className="space-y-1">
            <h3 className="text-xl font-sans font-medium text-[#111111] tracking-tight">
              You May Also Like
            </h3>
            <p className="text-xs text-[#666666] font-light">
              Hand-selected premium alternatives of authentic mobile flagships
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x scroll-smooth">
            {relatedProducts.map((item) => {
              const itemImages = normalizeProductImages(item.images);
              const displayImage = item.image_url || itemImages[0];
              const itemPrice = item.price !== undefined && item.price !== null
                ? `৳${new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(item.price)}`
                : 'Price on Request';

              return (
                <div
                  key={item.id}
                  onClick={() => onProductClick(item.id)}
                  className="w-[240px] sm:w-[260px] shrink-0 bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden p-4 text-left space-y-4 hover:border-[#111111] transition-all cursor-pointer group snap-start"
                >
                  <div className="aspect-[4/3] bg-[#FAFAFA] rounded-xl overflow-hidden p-3 flex items-center justify-center">
                    <img
                      src={displayImage}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <span className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-semibold text-[#111111] truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-[#111111]">
                        {itemPrice}
                      </span>
                      <span className="text-[10px] font-semibold text-[#111111] inline-flex items-center gap-0.5 group-hover:underline">
                        <span>View</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FAFAFA]/98 flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white border border-[#EAEAEA] text-[#111111] hover:bg-[#111111] hover:text-[#FAFAFA] flex items-center justify-center transition-all cursor-pointer shadow-sm"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Slider back overlay control */}
            {imagesList.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#EAEAEA] text-[#111111] hover:bg-[#111111] hover:text-[#FAFAFA] flex items-center justify-center transition-all cursor-pointer shadow-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Active Image in Lightbox */}
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imagesList[activeImageIndex]}
                alt={`${product.name} - Lightbox View`}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[80vh] object-contain rounded-xl mx-auto shadow-sm border border-[#EAEAEA]"
              />
            </motion.div>

            {/* Slider next overlay control */}
            {imagesList.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#EAEAEA] text-[#111111] hover:bg-[#111111] hover:text-[#FAFAFA] flex items-center justify-center transition-all cursor-pointer shadow-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Caption Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#666666] text-xs font-light">
              {product.name} — Image {activeImageIndex + 1} of {imagesList.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
