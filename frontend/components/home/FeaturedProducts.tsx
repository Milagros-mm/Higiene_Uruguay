'use client';

import React, { useRef } from 'react';
import { featuredProducts } from '@/lib/mock-data';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="destacados" className="py-14 md:py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-cyan mb-1 block">
              Lo Más Elegido
            </span>
            <SectionTitle 
              title="Productos Destacados" 
              subtitle="Los insumos y químicos más solicitados por nuestros clientes residenciales y corporativos."
            />
          </div>

          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:text-brand-cyan transition-colors self-start md:self-auto"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Carousel Container with High-Visibility Floating Cyan Buttons */}
        <div className="relative group/featured max-w-7xl mx-auto px-2">
          
          {/* Prominent Floating Cyan Button (Left) */}
          <button
            onClick={() => scroll('left')}
            aria-label="Anterior producto"
            className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-brand-cyan hover:bg-brand-cyan-dark text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 ring-4 ring-white"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Horizontal Scrolling Products Row (Compact Density) */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 md:gap-5 overflow-x-auto py-3 px-2 snap-x snap-mandatory no-scrollbar"
          >
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="w-[190px] sm:w-[210px] md:w-[230px] lg:w-[240px] snap-start shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Prominent Floating Cyan Button (Right) */}
          <button
            onClick={() => scroll('right')}
            aria-label="Siguiente producto"
            className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-brand-cyan hover:bg-brand-cyan-dark text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 ring-4 ring-white"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

        </div>

      </div>
    </section>
  );
}

