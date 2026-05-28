'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  setCategory?: (cat: string) => void;
}

export default function Footer({ setCategory }: FooterProps) {
  return (
    <footer className='bg-[#171717] border-t border-neutral-800 mt-32 px-8 py-16 font-sans text-xs text-neutral-400 w-full shadow-[0_-10px_30px_rgba(0,0,0,0.03)]'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-neutral-800'>
        
        {/* Brand Information Section */}
        <div className='space-y-4'>
          <span className='text-sm font-black tracking-[0.3em] uppercase text-white'>EMPIRE</span>
          <p className='text-neutral-500 font-medium leading-relaxed'>
            Architectural wardrobing basics. Engineered in Nairobi, sourced globally.
          </p>
        </div>

        {/* Categories Filtering Link Toggles */}
        <div className='space-y-3'>
          <h4 className='font-black uppercase tracking-widest text-neutral-200 text-[10px]'>Collections</h4>
          <div className='flex flex-col items-start space-y-2 font-medium mt-2'>
            <button 
              onClick={() => setCategory?.('all')} 
              className='hover:text-white text-neutral-400 transition bg-transparent border-0 p-0 text-xs font-sans cursor-pointer'
            >
              All Assemblies
            </button>
            <button 
              onClick={() => setCategory?.('shirts')} 
              className='hover:text-white text-neutral-400 transition bg-transparent border-0 p-0 text-xs font-sans cursor-pointer'
            >
              Shirts
            </button>
            <button 
              onClick={() => setCategory?.('leather jackets')} 
              className='hover:text-white text-neutral-400 transition bg-transparent border-0 p-0 text-xs font-sans cursor-pointer'
            >
              Jackets
            </button>
            <button 
              onClick={() => setCategory?.('trousers')} 
              className='hover:text-white text-neutral-400 transition bg-transparent border-0 p-0 text-xs font-sans cursor-pointer'
            >
              Trousers
            </button>
          </div>
        </div>

        {/* Corporate Administrative Routing Links */}
        <div className='space-y-3'>
          <h4 className='font-black uppercase tracking-widest text-neutral-200 text-[10px]'>Assistance</h4>
          <div className='flex flex-col items-start space-y-2 font-medium mt-2'>
            <span className='hover:text-white transition cursor-pointer'>Tracking Matrix</span>
            <span className='hover:text-white transition cursor-pointer'>Returns Enclosure</span>
            <Link href='/admin/orders' className='text-neutral-500 hover:text-white font-bold transition'>
              System Administration
            </Link>
          </div>
        </div>

        {/* Studio Parameters Group */}
        <div className='space-y-3'>
          <h4 className='font-black uppercase tracking-widest text-neutral-200 text-[10px]'>Studio</h4>
          <p className='text-neutral-500 font-medium leading-relaxed'>Nairobi, Kenya<br />contact@empire-closet.co.ke</p>
        </div>

      </div>

      {/* Meta Declarations Bottom row */}
      <div className='max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <p className='font-mono text-[10px] text-neutral-600'>&copy; {new Date().getFullYear()} EMPIRE CLOSET CO. ALL RIGHTS RESERVED.</p>
        <div className='flex items-center gap-3 font-mono text-[9px] font-black text-neutral-500'>
          <span className='border border-neutral-800 rounded px-2.5 py-0.5 bg-neutral-900/40 text-neutral-400'>
            LIPA NA M-PESA SECURE
          </span>
        </div>
      </div>
    </footer>
  );
}
