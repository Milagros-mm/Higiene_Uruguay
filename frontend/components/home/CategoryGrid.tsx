'use client';

import React, { useRef } from 'react';
import { categories } from '@/lib/mock-data';
import { CategoryCard } from '@/components/product/CategoryCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 260;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="categorias" className="scroll-mt-32 py-28 md:py-36 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-brand-cyan mb-1 block">
            Explorá por Rubro
          </span>
          <SectionTitle
            title="Nuestras Categorías"
            subtitle="Encontrá productos específicos organizados para tu sector o necesidad."
            centered
          />
        </div>

        {/* Carousel with Minimalist Lateral Arrows */}
        <div className="relative group/carousel max-w-6xl mx-auto px-2">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            aria-label="Desplazar categorías a la izquierda"
            className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full border border-slate-200 bg-white/90 hover:bg-white text-brand-slate hover:text-brand-cyan shadow-sm hover:shadow transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Horizontal Carousel Container */}
          <div
            ref={scrollRef}
            className="flex items-center justify-start sm:justify-center gap-6 sm:gap-8 md:gap-10 overflow-x-auto py-2 px-6 snap-x snap-mandatory no-scrollbar"
          >
            {categories.map((category) => (
              <div key={category.id} className="snap-start shrink-0">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            aria-label="Desplazar categorías a la derecha"
            className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full border border-slate-200 bg-white/90 hover:bg-white text-brand-slate hover:text-brand-cyan shadow-sm hover:shadow transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}


