'use client';

import React from 'react';
import { brands } from '@/lib/mock-data';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function BrandGrid() {
  return (
    <section id="marcas" className="py-14 md:py-18 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-cyan mb-1 block">
            Calidad Garantizada
          </span>
          <SectionTitle
            title="Marcas que Confían en Nosotros"
            subtitle="Trabajamos exclusivamente con fabricantes líderes en higiene y limpieza profesional."
            centered
          />
        </div>

        {/* Brands Horizontal Display Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 items-center">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-cyan hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center h-28 cursor-pointer"
            >
              <div className="h-8 flex items-center justify-center">
                <span className="font-display font-bold text-base md:text-lg text-slate-500 group-hover:text-brand-blue transition-colors">
                  {brand.name}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-brand-cyan">
                Ver catálogo →
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
