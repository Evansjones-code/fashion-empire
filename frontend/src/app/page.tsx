'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import ProductCard from '../components/ProductCard';

interface Product { 
  id: string; 
  title: string; 
  slug: string; 
  base_price: number; 
  category: string; 
  image_url: string; 
  sizes: string[]; 
}

export default function StorefrontHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [hasMounted, setHasMounted] = useState(false);
  const [dbError, setDbError] = useState(false);
  const { setCartOpen, cartItems } = useCart();

  // HARDCODED LIVE RENDER ENDPOINT (Bypasses local env variable caching)
  const BACKEND_API_URL = 'https://fashion-empire-3.onrender.com';

  // STREAM LIVE REQUISITIONS FROM THE SQLITE ENGINE OR RENDER SERVER
  const fetchActiveCatalog = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/products`);
      if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
      const data = await response.json();
      setProducts(data || []);
      setDbError(false);
    } catch (err) {
      console.error('Core catalog network synchronization drop:', err);
      setDbError(true);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    fetchActiveCatalog();
    
    // Automatically poll for newly injected design nodes every 5 seconds
    const syncInterval = setInterval(fetchActiveCatalog, 5000);
    return () => clearInterval(syncInterval);
  }, []);

  // FILTERS CONTROLLER MATRIX
  useEffect(() => {
    let out = products;
    if (category !== 'all') {
      out = out.filter(p => p.category?.toLowerCase().trim() === category.toLowerCase().trim());
    }
    if (search.trim() !== '') {
      out = out.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(out);
  }, [search, category, products]);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  if (!hasMounted) return null;

  return (
    <div className="bg-[#F5F4F0] min-h-screen w-full font-sans antialiased text-neutral-900">
      <main className="min-h-screen flex flex-col justify-between bg-[#F5F4F0]">
        <div>
          {/* Header */}
          <header className='bg-white border-b border-neutral-200 px-8 py-5 sticky top-0 z-40 shadow-xs'>
            <div className='max-w-6xl mx-auto flex items-center justify-between'>
              <div className="flex items-center gap-4">
                <Link href='/admin/orders' className='text-[9px] font-black uppercase tracking-wider text-neutral-400 hover:text-black transition duration-300'>
                  Control Panel
                </Link>
                
                {/* INTERACTIVE BROWSER-TRIGGERED SEED BUTTON */}
                <button 
                  onClick={async () => {
                    try {
                      const res = await fetch(`${BACKEND_API_URL}/api/products/seed`, { method: 'POST' });
                      if (res.ok) {
                        alert("🌱 Matrix Seed Injection Successful! 12 garments loaded.");
                        fetchActiveCatalog(); // Reload database items safely
                      } else {
                        alert("Seed node entry request rejected.");
                      }
                    } catch (err) {
                      alert(`Database node offline. Ensure backend instance is running at: ${BACKEND_API_URL}`);
                    }
                  }}
                  className='text-[9px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-800 transition cursor-pointer bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded'
                >
                  ⚡ Seed Matrix
                </button>
              </div>

              <span className='text-lg font-black tracking-[0.4em] uppercase text-neutral-950 absolute left-1/2 -translate-x-1/2 select-none'>
                EMPIRE
              </span>
              <button onClick={() => setCartOpen(true)} className='relative p-2.5 border border-neutral-200 rounded-full hover:bg-neutral-50 transition text-neutral-950 cursor-pointer text-xs font-bold'>
                🛒 Basket ({cartCount})
              </button>
            </div>
          </header>

          {/* Hero Banner */}
          <section className='max-w-6xl mx-auto px-6 mt-12 mb-16'>
            <div className='bg-neutral-950 rounded-[2rem] p-8 sm:p-16 text-white relative overflow-hidden flex flex-col justify-end min-h-[340px] shadow-xl'>
              <div className='absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10' />
              <div className='absolute inset-0 bg-neutral-900 flex items-center justify-center font-mono text-[9px] tracking-[0.4em] font-black text-neutral-600 uppercase opacity-25'>
                [ STUDIO CONCEPT SYSTEM ACTIVE ]
              </div>
              <div className='relative z-20 max-w-lg space-y-3'>
                <span className='text-[9px] font-black uppercase tracking-[0.3em] text-neutral-400 bg-white/10 px-3 py-1.5 rounded-full inline-block'>
                  Drop 01 / Pre-Fall Matrix
                </span>
                <h2 className='text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none'>
                  Silhouettes of<br/>Structure.
                </h2>
              </div>
            </div>
          </section>

          {/* Filters Portfolio */}
          <section className='max-w-6xl mx-auto px-6 mb-12'>
            <div className='bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs'>
              <div className='flex flex-wrap items-center gap-1.5'>
                {['all', 'shirts', 'trousers', 'leather jackets', 'denim', 'joga', 'shorts', 'trench coats'].map(c => (
                  <button key={c} onClick={() => setCategory(c)} className={`text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition cursor-pointer ${category === c ? 'bg-neutral-950 text-white shadow-xs' : 'bg-neutral-50 text-neutral-800'}`}>{c}</button>
                ))}
              </div>
              <input type='text' placeholder='Search active catalog...' value={search} onChange={e => setSearch(e.target.value)} className='w-full md:w-64 bg-neutral-50 border border-neutral-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-black font-medium text-neutral-950' />
            </div>
          </section>

          {/* Main Collection Grid */}
          <section className='max-w-6xl mx-auto px-6'>
            <div className='flex items-baseline justify-between mb-10 border-b border-neutral-200 pb-4'>
              <h1 className='text-xl font-black tracking-tight text-neutral-950 uppercase'>The Collection Matrix</h1>
              <span className='text-[10px] font-mono font-bold text-neutral-500'>{filtered.length} Results</span>
            </div>

            {/* Offline Error Feedback Block */}
            {dbError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 mb-6 text-xs font-mono">
                ⚠️ [DATABASE TERMINAL OFFLINE] Check if your server configuration instance is live at: {BACKEND_API_URL}
              </div>
            )}

            {filtered.length === 0 && !dbError ? (
              <div className="text-center py-24 border border-dashed rounded-3xl bg-white/40">
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">No design nodes found in current table partition.</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12'>
                {filtered.map(p => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            )}
          </section>
        </div>
        <div className="mt-24">
          <Footer setCategory={setCategory} />
        </div>
      </main>
      <CartDrawer />
    </div>
  );
}