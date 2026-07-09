import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  key?: any;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  // Safe extraction of the image
  const imageUrl = product.image_url || (Array.isArray(product.images) 
    ? product.images[0] 
    : (typeof product.images === 'string' ? product.images : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'));

  // Format price if available
  const formattedPrice = product.price !== undefined && product.price !== null
    ? `৳${new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(product.price)}`
    : 'Contact for Price';

  return (
    <motion.div
      layout
      onClick={onClick}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#EAEAEA] hover:shadow-md transition-all duration-300 h-full cursor-pointer text-left"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-[#FAFAFA] overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Small Category Text */}
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#666666] block">
            {product.category}
          </span>
          
          {/* Product Name */}
          <h3 className="font-sans font-medium text-[#111111] text-base tracking-tight leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Card Footer with Price and Button */}
        <div className="pt-3 border-t border-[#FAFAFA] flex items-center justify-between gap-3 shrink-0">
          <span className="font-sans font-semibold text-[#111111] text-base">
            {formattedPrice}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="text-xs font-medium text-[#111111] bg-[#FAFAFA] hover:bg-[#111111] hover:text-[#FAFAFA] px-3.5 py-2 rounded-xl border border-[#EAEAEA] hover:border-transparent transition-all duration-200 cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
