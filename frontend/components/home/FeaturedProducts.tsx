'use client';

import React from 'react';
import { featuredProducts } from '@/lib/mock-data';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FeaturedProducts() {
  return (
    <section id="destacados" className="scroll-mt-32 py-16 md:py-24 bg-slate-50 border-b border-border">
      <div className="container mx-auto px-4">
        
        {/* Cabecera de la Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 max-w-7xl mx-auto">
          <div>
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-brand-cyan mb-1 block">
              Lo Más Elegido
            </span>
            <SectionTitle 
              title="Productos Destacados" 
              subtitle="Nuestra selección de artículos esenciales con stock garantizado y la mejor calidad."
            />
          </div>

          <Link
            href="/destacados"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 hover:text-brand-cyan transition-colors self-start md:self-auto group"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Matriz (Grid) Responsiva de Productos */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-7xl mx-auto">
          {featuredProducts.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Botón Central Inferior "Ver más" */}
        <div className="mt-12 sm:mt-14 text-center">
          <Link
            href="/destacados"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 hover:text-brand-cyan border border-slate-300 hover:border-brand-cyan/60 font-bold text-sm shadow-xs hover:shadow-md transition-all duration-200 group active:scale-95"
          >
            <span>Ver más productos destacados</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-cyan" />
          </Link>
        </div>

      </div>
    </section>
  );
}
