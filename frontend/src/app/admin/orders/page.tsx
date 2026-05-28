'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  order_id: string;
  phone_number: string;
  amount_paid: number;
  payment_status: string;
  items_summary: string;
  created_at: string;
}

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders');
      const data = await response.json();
      setOrders(data || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error syncing order logs:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.phone_number.includes(searchTerm) || 
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.payment_status === 'PAID')
    .reduce((sum, o) => sum + o.amount_paid, 0);

  return (
    <div className="bg-neutral-950 min-h-screen text-white font-mono p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Control Panel Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 text-[10px] tracking-widest uppercase">
          <Link href="/admin/inject" className="text-neutral-500 hover:text-white transition duration-300 flex items-center gap-2 cursor-pointer">
            &larr; Catalog Injection
          </Link>
          <span className="text-neutral-700 font-bold">// SYSTEM LOG TERMINAL ACTIVE</span>
          <Link href="/" className="text-neutral-400 hover:text-white transition duration-300 font-black border-b border-white/40 pb-0.5 cursor-pointer">
            View Storefront &rarr;
          </Link>
        </div>

        {/* Financial Metrics Summary Banner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-white">Fulfillment Center</h1>
            <p className="text-xs text-neutral-500 mt-1 lowercase">Monitor sales performance logs and M-Pesa ledger indexes.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl shadow-xs">
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-wider block">Total Volume</span>
              <span className="font-mono text-sm font-black text-white">{orders.length} Live Orders</span>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl shadow-xs">
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-wider block">Revenue Volume</span>
              <span className="font-mono text-sm font-black text-emerald-400">KSh {totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Database Filtering Panel */}
        <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
          <input 
            type="text" 
            placeholder="Filter by Order Reference or Customer Mobile..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full md:flex-1 bg-neutral-900 border border-neutral-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-neutral-500 text-white font-medium placeholder-neutral-700 font-sans" 
          />
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'PAID', 'PENDING_PIN_ENTRY', 'FAILED'].map((status) => (
              <button 
                key={status} 
                onClick={() => setStatusFilter(status)} 
                className={`text-[9px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${statusFilter === status ? 'bg-white text-neutral-950 shadow-xs' : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-600'}`}
              >
                {status === 'PENDING_PIN_ENTRY' ? 'STK PROMPTING' : status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Master Orders Ledger Grid Table */}
        <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-2xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="text-center py-24 text-xs font-semibold text-neutral-600 uppercase tracking-widest animate-pulse">// Synchronizing Ledger Rows...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-32 text-xs font-semibold text-neutral-600 uppercase tracking-widest">No matching records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900/50 text-[9px] font-black uppercase tracking-widest text-neutral-400">
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Customer Phone</th>
                    <th className="p-4">Items Summary</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 text-center">Status Matrix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60">
                  {filteredOrders.map((order) => (
                    <tr key={order.order_id} className="hover:bg-neutral-900/40 transition duration-150">
                      <td className="p-4 pl-6 font-mono font-black text-white tracking-tight">{order.order_id}</td>
                      <td className="p-4 font-mono text-neutral-400">+{order.phone_number}</td>
                      <td className="p-4 text-neutral-500 font-medium max-w-xs truncate font-sans text-[11px]">{order.items_summary || 'N/A'}</td>
                      <td className="p-4 font-mono font-black text-white">KSh {order.amount_paid.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded border ${
                          order.payment_status === 'PAID' 
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' 
                            : order.payment_status === 'PENDING_PIN_ENTRY'
                            ? 'bg-amber-950/40 text-amber-400 border-amber-800/40 animate-pulse'
                            : 'bg-rose-950/40 text-rose-400 border-rose-800/40'
                        }`}>
                          {order.payment_status === 'PENDING_PIN_ENTRY' ? 'STK PROMPTING' : order.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
