import { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SupabaseStatusBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isDismissed) return null;

  const sqlCode = `CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric,
  image_url text,
  whatsapp_number text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative z-50">
      {/* Banner */}
      <div className="w-full py-2 px-6 text-[11px] font-medium border-b border-[#EAEAEA] bg-white text-[#666666] flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <div className="truncate flex-1">
            {isSupabaseConfigured ? (
              <span>
                Live database connection active. Product data is loaded dynamically from Supabase.
              </span>
            ) : (
              <span>
                Showroom demo mode active. Displaying curated collection data.
              </span>
            )}
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[10px] font-medium border border-[#EAEAEA] hover:border-[#111111] transition-all shrink-0 text-[#111111]"
          >
            {isSupabaseConfigured ? 'Database Schema' : 'Setup Guide'}
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
        
        <button 
          onClick={() => setIsDismissed(true)} 
          className="p-1 hover:bg-[#FAFAFA] rounded-full transition-colors shrink-0 text-[#666666]"
          aria-label="Dismiss banner"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Accordion Setup Guide */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white border-b border-[#EAEAEA]"
          >
            <div className="max-w-7xl mx-auto px-6 py-8 text-xs text-[#666666] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                
                {/* Steps */}
                <div className="space-y-4">
                  <h3 className="font-medium text-[#111111] text-sm tracking-wider uppercase">
                    Supabase Integration
                  </h3>
                  <p className="text-[#666666] leading-relaxed font-light">
                    This web app is fully prepared to query your live Supabase database. Connect your backend using these steps:
                  </p>
                  
                  <ul className="space-y-4 text-[#666666] font-light">
                    <li className="space-y-1">
                      <strong className="text-[#111111] font-medium block">1. Environment Variables</strong>
                      <p>
                        Set the following secrets in your platform settings:
                      </p>
                      <code className="block mt-1 bg-[#FAFAFA] p-2.5 rounded-lg border border-[#EAEAEA] font-mono text-[10px] text-[#111111] whitespace-pre">
                        NEXT_PUBLIC_SUPABASE_URL=your-supabase-url<br />
                        NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
                      </code>
                    </li>
                    <li className="space-y-1">
                      <strong className="text-[#111111] font-medium block">2. Database Table</strong>
                      <p>
                        Execute the provided schema in your Supabase SQL Editor.
                      </p>
                    </li>
                  </ul>
                </div>

                {/* SQL Code Block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-[#111111] uppercase tracking-wider font-sans">schema.sql</span>
                    <button 
                      onClick={copySql}
                      className="text-[10px] font-medium text-[#111111] hover:text-[#666666] bg-[#FAFAFA] px-2 py-1 rounded-lg border border-[#EAEAEA]"
                    >
                      {copied ? (
                        <span className="text-emerald-600 font-semibold">Copied</span>
                      ) : (
                        <span>Copy SQL</span>
                      )}
                    </button>
                  </div>
                  <pre className="bg-[#FAFAFA] text-[#111111] border border-[#EAEAEA] p-4 rounded-xl font-mono text-[10px] overflow-x-auto leading-relaxed max-h-[180px]">
                    {sqlCode}
                  </pre>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
