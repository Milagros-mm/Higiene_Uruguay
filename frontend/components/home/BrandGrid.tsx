'use client';

import React from 'react';
import { brands } from '@/lib/mock-data';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function BrandGrid() {
  // Duplicar las marcas para hacer el efecto de scroll infinito suave
  const infiniteBrands = [...brands, ...brands, ...brands];

  return (
    <section id="marcas" className="scroll-mt-32 py-20 md:py-32 bg-slate-900 border-b border-slate-800 overflow-hidden">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-cyan mb-1 block">
            Calidad Garantizada
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Marcas Oficiales</h2>
          <p className="text-slate-400 text-sm md:text-base">Trabajamos exclusivamente con fabricantes líderes en higiene y limpieza profesional.</p>
        </div>

        {/* Marquee Animation Container */}
        <div className="relative max-w-7xl mx-auto flex overflow-hidden">
          {/* Gradient masks for smooth fade in/out on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

          {/* Animated scrolling track */}
          <div className="flex items-center gap-6 md:gap-10 animate-scroll pause-hover py-2 pl-6 md:pl-10">
            {infiniteBrands.map((brand, idx) => (
              <div
                key={`${brand.id}-${idx}`}
                className="group bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 hover:border-brand-cyan/40 hover:shadow-[0_0_15px_rgba(0,180,216,0.3)] transition-all duration-300 flex items-center justify-center text-center h-20 min-w-[140px] md:min-w-[160px] cursor-pointer shrink-0"
              >
                <img 
                  src={brand.logoUrl} 
                  alt={brand.name} 
                  className="w-auto h-12 md:h-14 object-contain opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 brightness-200 group-hover:brightness-100"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

