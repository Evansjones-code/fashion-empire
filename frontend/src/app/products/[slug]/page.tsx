'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminProductCreator() {
  const [title, setTitle] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [category, setCategory] = useState('shirts');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L']);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'SUCCESS' | 'ERROR'; text: string } | null>(null);

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          base_price: parseFloat(basePrice),
          category,
          image_url: imageUrl || 'https://unsplash.com',
          description,
          sizes: selectedSizes
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatusMessage({ type: 'SUCCESS', text: `Successfully inserted "${title}" into the catalog matrix!` });
        setTitle('');
        setBasePrice('');
        setImageUrl('');
        setDescription('');
      } else {
        setStatusMessage({ type: 'ERROR', text: data.error || 'Failed to inject item.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'ERROR', text: 'Network connection fault tracing to port 8080.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen font-sans antialiased text-neutral-950 p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition duration-300">
            ← Fulfillment Logs
          </Link>
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition duration-300">
            View Storefront →
          </Link>
        </div>

        <div className="border-b border-neutral-200 pb-5">
          <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-950">Catalog Injection</h1>
          <p className="text-xs text-neutral-500 font-medium mt-1">Append new garment design nodes straight to the active product table.</p>
        </div>

        {statusMessage && (
          <div className={`p-4 rounded-xl border text-xs font-semibold uppercase tracking-wider ${
            statusMessage.type === 'SUCCESS' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest font-black text-neutral-400 block">Garment Name</label>
              <input type="text" placeholder="e.g., Silk Shirt" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-neutral-50 border border-neutral-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-black font-medium text-neutral-950" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest font-black text-neutral-400 block">Price (KSh)</label>
              <input type="number" placeholder="e.g., 4500" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required className="w-full bg-neutral-50 border border-neutral-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-black font-mono font-bold text-neutral-950" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-black text-neutral-400 block">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-black font-bold text-neutral-950 cursor-pointer">
              <option value="shirts">Shirts</option>
              <option value="trousers">Trousers</option>
              <option value="leather jackets">Leather Jackets</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-black text-neutral-400 block">Image URL</label>
            <input type="url" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-black font-medium text-neutral-950" />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-black text-neutral-400 block">Description</label>
            <textarea rows={4} placeholder="Describe product textile compositions..." value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full bg-neutral-50 border border-neutral-200 text-xs p-4 rounded-xl focus:outline-none focus:border-black font-medium text-neutral-600 leading-relaxed resize-none" />
          </div>

          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-widest font-black text-neutral-400 block">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map(size => (
                <button type="button" key={size} onClick={() => handleSizeToggle(size)} className={`min-w-[50px] h-10 font-mono text-xs font-bold rounded-xl border transition flex items-center justify-center cursor-pointer ${selectedSizes.includes(size) ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-white text-neutral-800 border-neutral-200'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full h-14 bg-neutral-950 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-md hover:bg-neutral-900 transition disabled:bg-neutral-200 cursor-pointer">
            {isSubmitting ? 'Injecting Element...' : 'Deploy Piece Into Live Catalog'}
          </button>
        </form>
      </div>
    </div>
  );
}
