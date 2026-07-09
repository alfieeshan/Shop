import { motion } from 'motion/react';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export default function HeroSection({ onExploreClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#FAFAFA] border-b border-[#EAEAEA] py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left text column */}
        <div className="lg:col-span-6 space-y-8 text-left">
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-sans font-light tracking-tight text-[#111111] leading-[1.1]"
            >
              Discover Premium Products
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-[#666666] font-normal leading-relaxed max-w-lg"
            >
              A curated catalog of premium smartphones and minimalist mobile flagships. Explore authentic specifications and order instantly and securely via WhatsApp.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-2"
          >
            <button
              onClick={onExploreClick}
              className="bg-[#111111] text-[#FAFAFA] hover:bg-[#222222] text-sm font-medium px-8 py-3.5 rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
            >
              Browse Collection
            </button>
          </motion.div>
        </div>

        {/* Right elegant premium mobile device display image */}
        <div className="lg:col-span-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-xl overflow-hidden bg-[#EAEAEA] border border-[#EAEAEA]"
          >
            <img
              src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop&q=80"
              alt="Premium Mobile Flagship Device"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
