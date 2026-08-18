'use client';

import React, { useState } from 'react';
// FIXED: Relative path mapping to prevent Next.js layout engine configuration breakage
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, Smartphone } from 'lucide-react';

export default function CartDrawer() {
  const { isCartOpen, setCartOpen, cartItems, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // HARDCODED LIVE RENDER ENDPOINT
  const BACKEND_API_URL = 'https://fashion-empire-3.onrender.com';

  if (!isCartOpen) return null;

  const handleMpesaCheckout = async () => {
    if (!phoneNumber) return alert("Please enter your M-Pesa phone number!");
    const sanitizedPhone = phoneNumber.trim().replace(/\s+/g, '');
    setIsPaying(true);

    try {
      const res = await fetch(`${BACKEND_API_URL}/api/checkout/mpesa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: sanitizedPhone, 
          amount: cartSubtotal,
          items: cartItems 
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("STK Push Sent Successfully! Confirm the payment prompt on your phone.");
        setCartOpen(false);
      } else {
        alert(data.error || "Payment initialization failed.");
      }
    } catch (err) {
      console.error("Checkout dispatch error:", err);
      alert("Network fault mapping to Node engine.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop panel background overlay mask */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setCartOpen(false)} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white flex flex-col shadow-xl border-l border-neutral-100">
          
          {/* Header Layout Grid */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-widest uppercase text-neutral-950">Your Basket</h2>
            <button onClick={() => setCartOpen(false)} className="text-neutral-400 hover:text-black transition cursor-pointer">
              <X size={18} />
            </button>
          </div>

          {/* Core Cart Items Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 text-xs font-bold uppercase tracking-wider">Your basket is empty.</div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-neutral-100">
                  {/* FIXED: Complete casing normalizer to prevent undefined image paths */}
                  <img 
                    src={item.imageUrl || item.price ? (item as any).image_url || item.imageUrl : '/placeholder.jpg'} 
                    alt={item.title} 
                    className="w-16 h-20 object-cover rounded-xl bg-neutral-50 border border-neutral-200/40 shrink-0" 
                  />
                  <div className="flex-1">
                    <h3 className="text-xs font-black text-neutral-950 uppercase tracking-tight line-clamp-1">{item.title}</h3>
                    
                    <div className="mt-1">
                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase bg-neutral-50 text-neutral-500 px-1.5 py-0.5 border border-neutral-200/40 rounded">
                        Size: {item.size}
                      </span>
                    </div>

                    <p className="text-xs font-mono font-black text-neutral-950 mt-2">KSh {item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition flex items-center justify-center cursor-pointer"><Minus size={8} /></button>
                      <span className="text-xs font-mono font-bold px-1.5 text-neutral-800">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition flex items-center justify-center cursor-pointer"><Plus size={8} /></button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-600 transition cursor-pointer p-1"><Trash2 size={14} /></button>
                </div>
              ))
            )}
          </div>

          {/* Integrated Lipa Na M-Pesa Checkout Engine Panel */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-neutral-50 space-y-4">
              <div className="flex items-baseline justify-between text-neutral-950">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Subtotal</span>
                <span className="text-lg font-mono font-black">KSh {cartSubtotal.toLocaleString()}</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-200/60">
                <label className="text-[9px] uppercase tracking-widest font-black text-neutral-400 block">Lipa na M-Pesa Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3.5 text-neutral-400" size={14} />
                  <input 
                    type="tel" 
                    placeholder="e.g., 0712345678" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white border border-neutral-200 text-xs pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:border-black font-medium text-neutral-950 shadow-xs"
                  />
                </div>
              </div>

              <button 
                onClick={handleMpesaCheckout}
                disabled={isPaying}
                className="w-full bg-neutral-950 text-white text-[10px] py-4 rounded-xl font-black tracking-widest uppercase transition hover:bg-neutral-900 disabled:bg-neutral-200 cursor-pointer disabled:cursor-not-allowed shadow-md"
              >
                {isPaying ? 'Processing STK Push Matrix...' : 'Secure Checkout via M-Pesa'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}