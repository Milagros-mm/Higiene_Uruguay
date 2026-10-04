'use client';

import React from 'react';
import { LayoutGrid, Award, Sparkles, Store } from 'lucide-react';

export function QuickNav() {
  const navItems = [
    { label: 'Categorías', shortLabel: 'Categorías', targetId: 'categorias', icon: LayoutGrid },
    { label: 'Marcas', shortLabel: 'Marcas', targetId: 'marcas', icon: Award },
    { label: 'Destacados', shortLabel: 'Destacados', targetId: 'destacados', icon: Sparkles },
    { label: 'Nuestra Tienda', shortLabel: 'Tienda', targetId: 'tienda', icon: Store },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (!element) return;

    // Calcular desplazamiento exacto para que quede centrado cómodamente sin ser tapado por el header
    const isMobile = window.innerWidth < 768;
    const headerOffset = isMobile ? 105 : 135;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth',
    });

    window.history.pushState(null, '', `#${targetId}`);
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-xs relative md:sticky md:top-20 z-40 transition-all duration-200">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between sm:justify-center gap-1 sm:gap-3 md:gap-6 py-2 md:py-2.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={`#${item.targetId}`}
                onClick={(e) => handleScrollTo(e, item.targetId)}
                className="relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-brand-slate hover:text-brand-cyan hover:bg-cyan-50/50 transition-all duration-200 group shrink-0 active:scale-95 cursor-pointer"
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-cyan shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-brand-cyan transition-all duration-200 group-hover:w-1/2 rounded-full opacity-0 group-hover:opacity-100" />
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

