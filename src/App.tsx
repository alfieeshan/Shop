import { useState, useEffect, useRef } from 'react';
import { Product } from './types';
import { getProducts, getProductById } from './lib/supabase';
import HeroSection from './components/HeroSection';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import SkeletonCard from './components/SkeletonCard';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation State
  const [currentProductId, setCurrentProductId] = useState<string | number | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || null;
  });

  // Product Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Filtering & Interaction States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc' | 'name'>('latest');
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Scroll Ref
  const exploreRef = useRef<HTMLDivElement>(null);

  // Synchronize routing with browser history (PopState / Back Button)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setCurrentProductId(params.get('id') || null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch product detail when routing changes
  useEffect(() => {
    async function loadDetail() {
      if (currentProductId) {
        setLoadingDetail(true);
        const prod = await getProductById(currentProductId);
        setSelectedProduct(prod);
        setLoadingDetail(false);
      } else {
        setSelectedProduct(null);
      }
    }
    loadDetail();
  }, [currentProductId]);

  // Dynamic SEO Page Title
  useEffect(() => {
    if (selectedProduct) {
      document.title = `${selectedProduct.name} — Premium Mobile Shop`;
    } else {
      document.title = "AURA — Premium Mobile Shop";
    }
  }, [selectedProduct]);

  // Live Query: Fetch products dynamically on search/sort changes (no category filtering)
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await getProducts({
          searchQuery,
          sortBy
        });
        setProducts(data);
      } catch (error) {
        console.error('Error querying products:', error);
      } finally {
        setLoading(false);
      }
    }

    // Debouncing database queries
    const timer = setTimeout(() => {
      loadProducts();
    }, 120);

    return () => clearTimeout(timer);
  }, [searchQuery, sortBy]);

  // Navigation callbacks
  const handleProductClick = (id: string | number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('id', String(id));
    window.history.pushState({}, '', url.toString());
    setCurrentProductId(id);
  };

  const handleBackToHome = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url.toString());
    setCurrentProductId(null);
  };

  const scrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToFooter = () => {
    const footer = document.getElementById('footer-section');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('latest');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-[#111111] antialiased selection:bg-[#EAEAEA]">

      {/* Minimal Navbar (Apple / Nothing Inspired) */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          
          {/* Logo on Left */}
          <button 
            onClick={handleBackToHome}
            className="font-sans font-light text-lg tracking-[0.25em] hover:opacity-80 transition-opacity cursor-pointer text-left"
          >
            AURA
          </button>

          {/* Search bar and Links */}
          <div className="flex items-center gap-8 flex-1 justify-end">
            
            {/* Search Input Bar (Visible only when not in detail view) */}
            {!currentProductId && (
              <div className="relative max-w-xs w-full hidden md:block">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search phones by model or brand..."
                  className="w-full pl-10 pr-4 py-1.5 text-xs bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl focus:bg-white focus:outline-none focus:border-[#111111] transition-colors text-[#111111]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#666666] hover:text-[#111111] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Nav Links - Strictly simple and no Categories */}
            <nav className="flex items-center gap-6 text-xs font-medium text-[#666666]">
              <button 
                onClick={() => setIsAboutOpen(true)}
                className="hover:text-[#111111] transition-colors cursor-pointer"
              >
                About
              </button>
              <button 
                onClick={scrollToFooter}
                className="hover:text-[#111111] transition-colors cursor-pointer"
              >
                Contact
              </button>
            </nav>

          </div>
        </div>
      </header>

      {/* Primary Page Layout */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {selectedProduct ? (
            /* PRODUCT DETAILS VIEW */
            <motion.div
              key="detail-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductDetail 
                product={selectedProduct} 
                onBack={handleBackToHome} 
              />
            </motion.div>
          ) : (
            /* HOMEPAGE VIEW */
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <HeroSection onExploreClick={scrollToExplore} />

              {/* Products Catalog Display Area */}
              <section ref={exploreRef} className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-12">
                
                {/* Search & Sort Panel */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[#EAEAEA] pb-8">
                  <div className="space-y-1 text-left">
                    <h2 className="text-2xl font-sans font-light tracking-tight text-[#111111]">
                      {searchQuery ? 'Search Results' : 'Featured Flagships'}
                    </h2>
                    <p className="text-xs text-[#666666] font-light">
                      {searchQuery 
                        ? `Showing ${products.length} matching phones` 
                        : 'Explore authentic global devices in Bangladesh'
                      }
                    </p>
                  </div>
                  
                  {/* Search bar for Mobile & quick access + Sort option */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    {/* Compact Search Bar */}
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search model or brand..."
                        className="w-full pl-10 pr-8 py-2 text-xs bg-white border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#111111] transition-colors text-[#111111]"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#111111] cursor-pointer p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Simple Premium Sort Selector */}
                    <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-xl px-3 bg-white">
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#666666]" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="text-xs font-medium text-[#111111] bg-white py-2 pr-2 focus:outline-none border-none cursor-pointer"
                      >
                        <option value="latest">Latest Arrivals</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name">Alphabetical</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Clean Responsive Grid */}
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => handleProductClick(product.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 max-w-sm mx-auto space-y-4">
                    <p className="text-sm text-[#666666] font-light">
                      No phones found matching "{searchQuery}". Try searching for another model or brand.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="bg-[#111111] text-[#FAFAFA] text-xs font-medium px-5 py-2.5 rounded-xl hover:bg-[#222222] transition-colors cursor-pointer"
                    >
                      View All Phones
                    </button>
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Minimal Footer (Zara Home / MUJI style) */}
      <footer id="footer-section" className="bg-white border-t border-[#EAEAEA] text-[#666666] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 text-left">
          
          <div className="md:col-span-4 space-y-4">
            <span className="font-sans font-light text-lg tracking-[0.25em] text-[#111111]">AURA</span>
            <p className="text-xs font-light leading-relaxed text-[#666666] max-w-sm">
              Authentic premium smartphone showroom in Bangladesh. Browse pristine hand-selected mobile models and secure absolute dispatch support directly over WhatsApp.
            </p>
          </div>

          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="text-[11px] font-semibold text-[#111111] uppercase tracking-wider">Social Channels</h4>
            <div className="flex flex-col gap-2 font-light">
              <a 
                href="https://wa.me/8801712345678" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#111111] transition-colors"
              >
                WhatsApp Direct Line
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#111111] transition-colors"
              >
                Facebook Page
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#111111] transition-colors"
              >
                Instagram Feed
              </a>
            </div>
          </div>

          <div className="md:col-span-4 space-y-3 text-xs font-light">
            <h4 className="text-[11px] font-semibold text-[#111111] uppercase tracking-wider">Store Info</h4>
            <p className="text-[#666666] leading-relaxed">
              We focus on premium authentic smartphones, global flagships, and customized intact electronics. Verified quality and quick dispatch inside Bangladesh.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-[#EAEAEA] mt-12 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[11px] text-[#666666] font-light">
          <span>&copy; {new Date().getFullYear()} AURA. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Bangladesh</span>
            <span>&bull;</span>
            <span>Premium Smartphone Showroom</span>
          </div>
        </div>
      </footer>

      {/* ABOUT MODAL (MUJI Inspired) */}
      <AnimatePresence>
        {isAboutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAboutOpen(false)}
            className="fixed inset-0 z-50 bg-[#FAFAFA]/98 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-white border border-[#EAEAEA] p-8 rounded-xl shadow-sm text-left space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <h3 className="text-lg font-sans font-light tracking-wider">ABOUT AURA</h3>
                <button 
                  onClick={() => setIsAboutOpen(false)}
                  className="text-[#666666] hover:text-[#111111] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-[#666666] leading-relaxed font-light">
                <p>
                  AURA is a minimalist curated showroom designed for individuals who demand original quality, authentic specs, and reliable service.
                </p>
                <p>
                  Every device we present is hand-selected, verified global/official stock, and carefully packed with factory pristine boxes.
                </p>
                <p>
                  Browse high-resolution photographs, inspect clear technical details, and initiate ordering instantly with automated templated routing to our WhatsApp business desk.
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA] flex justify-end">
                <button
                  onClick={() => setIsAboutOpen(false)}
                  className="bg-[#111111] text-[#FAFAFA] hover:bg-[#222222] text-xs font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
