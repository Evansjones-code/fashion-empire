'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Product { 
  id: string; 
  title: string; 
  slug: string; 
  base_price: number; 
  category: string; 
  image_url: string; 
  sizes: string[]; 
}

export default function ProductCard({ p }: { p: Product }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // DYNAMIC BACKEND TARGET CONFIGURATION
  const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

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

    return "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' viewBox='0 0 100 130'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='" + stopStart + "'/><stop offset='100%' stop-color='" + stopEnd + "'/></linearGradient></defs><rect width='100' height='130' fill='url(%23g)'/><text x='50%' y='55%' font-family='sans-serif' font-size='5.5' font-weight='black' fill='" + fontColor + "' text-anchor='middle' letter-spacing='1'>" + textNode + "</text></svg>";
  };

  const handlePayment = async () => {
    if (!phoneNumber) return alert("Please enter your M-Pesa phone number!");
    setIsProcessing(true);

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/checkout/mpesa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: phoneNumber, 
          amount: p.base_price,
          items: [{ title: p.title, size: 'M', quantity: 1 }]
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("STK Push Sent! Enter your M-Pesa PIN on your phone to complete your order.");
      } else {
        alert("Payment process failed.");
      }
    } catch (error) {
      alert(`Network fault tracking to backend instance at: ${BACKEND_API_URL}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="group bg-white overflow-hidden border border-neutral-200/60 shadow-xs rounded-3xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 flex flex-col h-full justify-between">
      <div>
        <Link href={`/products/${p.slug}`} className="block relative aspect-[3/4] w-full bg-neutral-950 overflow-hidden cursor-pointer">
          <img 
            src={getProductImage(p)} 
            alt={p.title} 
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]" 
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-neutral-900 text-[9px] tracking-widest uppercase font-black px-2 py-1 rounded border border-neutral-200/30 z-10">
            {p.category}
          </div>
        </Link>

        <div className="p-5 space-y-2">
          <Link href={`/products/${p.slug}`} className="block cursor-pointer">
            <h2 className="text-sm font-black text-neutral-950 tracking-tight hover:text-neutral-700 transition-colors line-clamp-1">
              {p.title}
            </h2>
          </Link>
          
          <div className="flex flex-wrap gap-1">
            {p.sizes?.map(s => (
              <span key={s} className="font-mono text-[9px] text-neutral-500 font-bold px-1.5 py-0.5 bg-neutral-50 border border-neutral-200/40 rounded">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-neutral-400 group-hover:text-neutral-950 transition duration-300">View Details &rarr;</span>
          <p className="text-neutral-950 font-mono text-sm font-black">KSh {p.base_price?.toLocaleString()}</p>
        </div>
        
        <div className="mt-4 space-y-2">
          <input 
            type="text" 
            placeholder="e.g., 0714445249" 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 text-xs px-4 py-2.5 rounded-xl font-sans focus:outline-none focus:border-black font-medium text-neutral-950"
          />
          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-11 bg-emerald-600 text-white text-[10px] rounded-xl font-black tracking-widest uppercase transition-colors hover:bg-emerald-700 disabled:bg-neutral-200 cursor-pointer pt-0.5 shadow-sm"
          >
            {isProcessing ? 'Processing Matrix...' : 'Lipa na M-Pesa'}
          </button>
        </div>
      </div>
    </div>
  );
}
