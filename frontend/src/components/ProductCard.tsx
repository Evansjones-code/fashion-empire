'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';

interface Product { 
  id: string; 
  title: string; 
  slug: string; 
  base_price: number; 
  category: string; 
  image_url: string; 
  sizes: string[]; 
}

interface ProductCardProps {
  p: Product;
  onDelete?: () => void;
}

export default function ProductCard({ p, onDelete }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(p.sizes?.[0] || 'M');
  const [isDeleting, setIsDeleting] = useState(false);

  // HARDCODED LIVE RENDER ENDPOINT
  const BACKEND_API_URL = 'https://fashion-empire-3.onrender.com';

  const getProductImage = (product: Product) => {
    const titleLower = product.title?.toLowerCase().trim() || '';
    const catLower = product.category?.toLowerCase().trim() || '';
    
    let textNode = "STUDIO BASIC";
    let stopStart = "%231f2421";
    let stopEnd = "%230f1210";
    let fontColor = "%23707d75";

    if (titleLower.includes('linen')) {
      textNode = "HEAVY LINEN"; stopStart = "%23e4dcd3"; stopEnd = "%23bcae9f"; fontColor = "%23544a40";
    } else if (titleLower.includes('cuban')) {
      textNode = "CUBAN COLLAR"; stopStart = "%23dfdcd6"; stopEnd = "%23a39e95"; fontColor = "%233d3b37";
    } else if (titleLower.includes('boxy') || titleLower.includes('overshirt')) {
      textNode = "BOX OVERSHIRT"; stopStart = "%233a3d40"; stopEnd = "%231a1b1c"; fontColor = "%239da2a6";
    } else if (titleLower.includes('silk') || titleLower.includes('tunic')) {
      textNode = "RAW SILK TUNIC"; stopStart = "%23f5f2eb"; stopEnd = "%23d0c9bc"; fontColor = "%236e6556";
    } else if (titleLower.includes('pleated')) {
      textNode = "PLEATED TROUSERS"; stopStart = "%232b2a29"; stopEnd = "%23121111"; fontColor = "%238a847f";
    } else if (titleLower.includes('khaki') || titleLower.includes('jeans')) {
      textNode = "TAILORED JEANS"; stopStart = "%23c2b29c"; stopEnd = "%238c7e6b"; fontColor = "%23473f33";
    } else if (titleLower.includes('palazzo')) {
      textNode = "PALAZZO PANTS"; stopStart = "%23fcfbfa"; stopEnd = "%23e3ded9"; fontColor = "%236b6660";
    } else if (titleLower.includes('wool') || titleLower.includes('slacks')) {
      textNode = "CHARCOAL SLACKS"; stopStart = "%232e3133"; stopEnd = "%23191b1c"; fontColor = "%23899094";
    } else if (titleLower.includes('biker')) {
      textNode = "BIKER JACKET"; stopStart = "%23242424"; stopEnd = "%230a0a0a"; fontColor = "%23a9a9a9";
    } else if (titleLower.includes('bomber')) {
      textNode = "MINIMALIST BOMBER"; stopStart = "%231f2421"; stopEnd = "%230f1210"; fontColor = "%23707d75";
    } else if (titleLower.includes('aviator')) {
      textNode = "AVIATOR COAT"; stopStart = "%234a3621"; stopEnd = "%2321170d"; fontColor = "%23d1beaa";
    } else if (titleLower.includes('trucker') || titleLower.includes('suede')) {
      textNode = "SUEDE TRUCKER"; stopStart = "%23bd8a42"; stopEnd = "%23855a21"; fontColor = "%23faebd7";
    } else if (titleLower.includes('denim') || catLower.includes('denim')) {
      textNode = "DENIM JACKET"; stopStart = "%233b5998"; stopEnd = "%231e2d5a"; fontColor = "%239cb3f0";
    } else if (titleLower.includes('joga') || titleLower.includes('jogger') || catLower.includes('joga')) {
      textNode = "JOGA PANTS"; stopStart = "%234f4f4f"; stopEnd = "%23242424"; fontColor = "%23cccccc";
    } else if (titleLower.includes('shorts') || catLower.includes('shorts')) {
      textNode = "STUDIO SHORTS"; stopStart = "%23d6cfc4"; stopEnd = "%23aba294"; fontColor = "%234a453e";
    } else if (titleLower.includes('trench') || titleLower.includes('coat') || catLower.includes('trench')) {
      textNode = "TRENCH COAT"; stopStart = "%23877b66"; stopEnd = "%234f473a"; fontColor = "%23e3dec8";
    }

    if (product.image_url && !product.image_url.includes('placeholder')) {
      return product.image_url;
    }

    return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 130'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='" + stopStart + "'/><stop offset='100%' stop-color='" + stopEnd + "'/></linearGradient></defs><rect width='100' height='130' fill='url(%23g)'/><text x='50%' y='55%' font-family='sans-serif' font-size='5.5' font-weight='black' fill='" + fontColor + "' text-anchor='middle' letter-spacing='1'>" + textNode + "</text></svg>";
  };

  const handleAddToCart = () => {
    addToCart({
      id: `${p.id}-${selectedSize}`,
      title: p.title,
      price: p.base_price,
      imageUrl: getProductImage(p),
      size: selectedSize,
    });
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove "${p.title}" from the catalog?`)) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`${BACKEND_API_URL}/api/products/${p.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        if (onDelete) onDelete();
      } else {
        alert('Failed to delete product from matrix database.');
      }
    } catch (err) {
      console.error('Delete dispatch fault:', err);
      alert('Network error communicating with Render backend.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative bg-white overflow-hidden border border-neutral-200/80 rounded-3xl transition-all duration-300 hover:shadow-xl hover:border-neutral-300 flex flex-col h-full justify-between p-4">
      <div>
        {/* Header Badges & Delete Action */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md">
            {p.category}
          </span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete product from catalog"
            className="text-neutral-300 hover:text-red-600 transition cursor-pointer p-1 rounded-lg hover:bg-red-50 disabled:opacity-40"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Product Image */}
        <Link href={`/products/${p.slug}`} className="block relative aspect-[3/4] w-full bg-neutral-950 overflow-hidden rounded-2xl cursor-pointer mb-4">
          <img 
            src={getProductImage(p)} 
            alt={p.title} 
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
          />
        </Link>

        {/* Product Info & Price */}
        <div className="space-y-1 mb-3">
          <Link href={`/products/${p.slug}`} className="block cursor-pointer">
            <h2 className="text-xs font-black text-neutral-950 uppercase tracking-tight hover:text-neutral-700 transition-colors line-clamp-1">
              {p.title}
            </h2>
          </Link>
          <p className="text-xs font-mono font-black text-neutral-900">
            KSh {p.base_price?.toLocaleString()}
          </p>
        </div>

        {/* Size Selection */}
        {p.sizes && p.sizes.length > 0 && (
          <div className="mb-4">
            <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400 block mb-1.5">
              Select Size
            </span>
            <div className="flex flex-wrap gap-1">
              {p.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`text-[9px] font-mono font-bold px-2 py-1 rounded-md border transition cursor-pointer ${
                    selectedSize === s
                      ? 'bg-neutral-950 text-white border-neutral-950'
                      : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add to Basket Action */}
      <button 
        onClick={handleAddToCart}
        className="w-full bg-neutral-950 text-white text-[9px] font-black uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 transition cursor-pointer shadow-xs active:scale-[0.98] mt-2"
      >
        <ShoppingBag size={12} /> Add to Basket
      </button>
    </div>
  );
}