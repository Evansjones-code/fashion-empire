'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export default function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const BACKEND_API_URL = 'https://fashion-empire-3.onrender.com';

  const [title, setTitle] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [category, setCategory] = useState('shirts');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const categories = ['shirts', 'trousers', 'leather jackets', 'denim', 'joga', 'shorts', 'trench coats'];

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !basePrice || !imageUrl) {
      alert('Please fill in all required fields!');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        base_price: parseFloat(basePrice),
        category,
        image_url: imageUrl,
        sizes: selectedSizes,
      };

      const res = await fetch(`${BACKEND_API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('✨ Product created and injected into matrix catalog!');
        setTitle('');
        setBasePrice('');
        setImageUrl('');
        onProductAdded();
        onClose();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to add product: ${errData.detail || 'Server rejected request'}`);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Network failure reaching backend endpoint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 block">Matrix Injection Engine</span>
            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-950">Add New Garment</h2>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-black transition cursor-pointer rounded-full hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        {/* Product Creation Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Garment Title *</label>
            <input
              type="text"
              placeholder="e.g. OVERSIZED LEATHER BOMBER"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-black font-semibold text-neutral-950"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Price (KSh) *</label>
              <input
                type="number"
                placeholder="e.g. 12500"
                value={basePrice}
                onChange={e => setBasePrice(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-black font-mono font-bold text-neutral-950"
                required
              />
            </div>

            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 text-xs px-3 py-3 rounded-xl focus:outline-none focus:border-black font-semibold text-neutral-950 uppercase cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Image URL *</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-black font-mono text-neutral-950"
              required
            />
          </div>

          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-1.5">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => {
                const active = selectedSizes.includes(size);
                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                      active
                        ? 'bg-neutral-950 text-white border-neutral-950'
                        : 'bg-neutral-50 text-neutral-400 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 bg-neutral-100 text-neutral-600 text-[10px] font-black tracking-widest uppercase py-3.5 rounded-xl hover:bg-neutral-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 bg-neutral-950 text-white text-[10px] font-black tracking-widest uppercase py-3.5 rounded-xl hover:bg-neutral-800 transition cursor-pointer disabled:bg-neutral-300 shadow-lg"
            >
              {isSubmitting ? 'Injecting Product...' : '+ Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}