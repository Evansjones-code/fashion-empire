'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CatalogInjectionPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isInjecting, setIsInjecting] = useState(false);

  // DYNAMIC BACKEND TARGET CONFIGURATION
  const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !category) return alert("Please fill out Name, Price, and Category!");
    
    setIsInjecting(true);

    const payloadNode = {
      title,
      base_price: Number(price),
      category,
      image_url: imageUrl || '/catalog/placeholder.jpg',
      description,
      sizes: selectedSizes
    };

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadNode)
      });
      const data = await response.json();
      if (data.success) {
        alert("🎉 Garment Design Node successfully injected into active database partition!");
        setTitle(''); setPrice(''); setCategory(''); setImageUrl(''); setDescription(''); setSelectedSizes([]);
      } else {
        alert("Injection matrix rejected data payload.");
      }
    } catch (err) {
      alert(`Network fault tracking to backend instance at: ${BACKEND_API_URL}`);
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6 font-mono text-white">
      <div className="w-full max-w-2xl bg-neutral-950 p-8 rounded-3xl border border-neutral-800/80 shadow-2xl">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-6 mb-8 text-[11px] tracking-widest uppercase">
          <Link href="/admin/orders" className="text-neutral-400 hover:text-white transition duration-300 flex items-center gap-2 cursor-pointer">
            &larr; Fulfillment Logs
          </Link>
          <span className="text-neutral-700 font-bold">// STUDIO CONCEPT SYSTEM ACTIVE</span>
          <Link href="/" className="text-neutral-400 hover:text-white transition duration-300 font-black border-b border-white/40 pb-0.5 cursor-pointer">
            View Storefront &rarr;
          </Link>
        </div>

        {/* Form Heading */}
        <div className="space-y-2 mb-8">
          <h1 className="text-xl font-black tracking-tight uppercase text-white">Catalog Injection</h1>
          <p className="text-xs text-neutral-500 lowercase">Append new garment design nodes straight to the active product table.</p>
        </div>

        {/* Input Fields Form */}
        <form className="space-y-6" onSubmit={handleFormSubmission}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Garment Name</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Raw Silk Asymmetric tunic" className="w-full bg-neutral-900 border border-neutral-800 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neutral-500 font-sans font-medium text-white placeholder-neutral-700 transition" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Price (KSh)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g., 7500" className="w-full bg-neutral-900 border border-neutral-800 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neutral-500 font-sans font-medium text-white placeholder-neutral-700 transition" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neutral-500 text-white cursor-pointer transition">
                <option value="" disabled hidden>Select Matrix...</option>
                <option value="shirts">shirts</option>
                <option value="trousers">trousers</option>
                <option value="leather jackets">leather jackets</option>
                <option value="denim">denim</option>
                <option value="joga">joga</option>
                <option value="shorts">shorts</option>
                <option value="trench coats">trench coats</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Image URL</label>
              <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="e.g., /catalog/silk-tunic.jpg" className="w-full bg-neutral-900 border border-neutral-800 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neutral-500 font-sans font-medium text-white placeholder-neutral-700 transition" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Description</label>
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Architectural, geometric cutting with raw texture details..." className="w-full bg-neutral-900 border border-neutral-800 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neutral-500 font-sans font-medium text-white placeholder-neutral-700 transition resize-none"></textarea>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Available Sizes</label>
            <div className="flex flex-wrap gap-3">
              <div className="flex gap-2 bg-neutral-900 p-2 rounded-xl border border-neutral-800/40">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => {
                  const active = selectedSizes.includes(size);
                  return (
                    <button type="button" key={size} onClick={() => handleSizeToggle(size)} className={`flex items-center justify-center w-10 h-10 border rounded-lg text-[10px] font-bold transition select-none cursor-pointer ${active ? 'bg-white text-neutral-950 border-white' : 'border-neutral-800 text-white hover:border-neutral-500'}`}>{size}</button>
                  );
                })}
              </div>
              <div className="flex gap-2 bg-neutral-900 p-2 rounded-xl border border-neutral-800/40">
                {['30', '31', '32', '34', '36'].map(size => {
                  const active = selectedSizes.includes(size);
                  return (
                    <button type="button" key={size} onClick={() => handleSizeToggle(size)} className={`flex items-center justify-center w-10 h-10 border rounded-lg text-[10px] font-mono font-bold transition select-none cursor-pointer ${active ? 'bg-white text-neutral-950 border-white' : 'border-neutral-800 text-white hover:border-neutral-500'}`}>{size}</button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isInjecting} className="w-full h-12 bg-white text-neutral-950 text-xs font-black tracking-widest uppercase rounded-xl transition hover:bg-neutral-200 cursor-pointer shadow-sm disabled:bg-neutral-800 disabled:text-neutral-500">
              {isInjecting ? 'Processing Injection Matrix...' : 'Inject New Design Node'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
