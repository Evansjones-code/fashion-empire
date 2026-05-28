'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  base_price: number;
  category: string;
  image_url: string;
  sizes: string[];
}

export default function AdminProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = () => {
    setIsLoading(true);
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this garment from the lifestyle catalog?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchProducts(); // Refresh layout state dynamically
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans antialiased pb-24">
      
      {/* Luxury Admin Navigation Bar */}
      <header className="bg-white border-b border-neutral-100 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition">
            ← Storefront
          </Link>
          <span className="text-sm font-black tracking-[0.2em] uppercase text-neutral-950 absolute left-1/2 -translate-x-1/2">
            EMPIRE CONTROL
          </span>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
            <Link href="/admin" className="text-neutral-400 hover:text-black transition pb-1">
              Invoices
            </Link>
            <Link href="/admin/products" className="text-black border-b-2 border-black pb-1">
              Products
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-black text-neutral-950 uppercase tracking-tight">Product Catalog Matrix</h1>
              <p className="text-xs text-neutral-400 uppercase tracking-wider">Manage your warehouse stock items and active listings</p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-xs font-medium text-neutral-400">Loading master catalog stock...</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-neutral-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 font-bold uppercase text-neutral-400 tracking-wider">
                    <th className="p-4">Item Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Available Sizes</th>
                    <th className="p-4">Retail Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50/50 transition">
                      <td className="p-4 flex items-center gap-3">
                        <img src={product.image_url} alt={product.title} className="w-10 h-12 object-cover rounded bg-neutral-50 shrink-0" />
                        <span className="font-bold text-neutral-950">{product.title}</span>
                      </td>
                      <td className="p-4 uppercase tracking-wider text-[10px] text-neutral-500 font-bold">{product.category}</td>
                      <td className="p-4 font-mono text-neutral-600">{product.sizes.join(', ')}</td>
                      <td className="p-4 font-mono font-bold text-neutral-950">KSh {product.base_price.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 font-bold px-2.5 py-1.5 rounded transition text-[10px] uppercase tracking-wider cursor-pointer"
                        >
                          Prune Item
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
