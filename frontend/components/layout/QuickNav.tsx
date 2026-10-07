'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutGrid,
  Award,
  Sparkles,
  Store,
  ChevronDown,
  Home,
  ShieldCheck,
  Waves,
  Building2,
  Wrench,
  Leaf,
  Package,
  ArrowRight,
} from 'lucide-react';
import { categories } from '@/lib/mock-data';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Home,
  ShieldCheck,
  Waves,
  Building2,
  Wrench,
  Leaf,
};

export function QuickNav() {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: 'Marcas', shortLabel: 'Marcas', targetId: 'marcas', icon: Award },
    { label: 'Destacados', shortLabel: 'Destacados', targetId: 'destacados', icon: Sparkles },
    { label: 'Nuestra Tienda', shortLabel: 'Tienda', targetId: 'tienda', icon: Store },
  ];

  // Cerrar el menú desplegable al hacer clic fuera o presionar Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsCategoryMenuOpen(false);
      }
    }

    if (isCategoryMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCategoryMenuOpen]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (!element) return;

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

  const handleSelectCategory = (e: React.MouseEvent<HTMLAnchorElement>, categorySlug: string) => {
    e.preventDefault();
    setIsCategoryMenuOpen(false);

    // Desplazar a la sección general de categorías
    const element = document.getElementById('categorias');
    if (!element) return;

    const isMobile = window.innerWidth < 768;
    const headerOffset = isMobile ? 105 : 135;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth',
    });

    window.history.pushState(null, '', `#categorias`);
  };

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs relative md:sticky md:top-20 z-50 transition-all duration-200">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Contenedor centrado y SIN overflow-x-auto para no recortar la ventana flotante */}
        <div className="flex items-center justify-center gap-1 sm:gap-3 md:gap-6 py-2 md:py-2.5">
          
          {/* Categorías: Botón con mismo estilo y menú flotante de rubros */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
              className={`relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 group shrink-0 active:scale-95 cursor-pointer ${
                isCategoryMenuOpen
                  ? 'text-brand-cyan bg-cyan-50/70 shadow-xs'
                  : 'text-brand-slate hover:text-brand-cyan hover:bg-cyan-50/50'
              }`}
              aria-expanded={isCategoryMenuOpen}
              aria-label="Abrir categorías"
            >
              <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-cyan shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>Categorías</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isCategoryMenuOpen ? 'rotate-180 text-brand-cyan' : 'text-slate-400 group-hover:text-brand-cyan'
                }`}
              />
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-brand-cyan transition-all duration-200 rounded-full ${
                  isCategoryMenuOpen ? 'w-1/2 opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-100'
                }`}
              />
            </button>

            {/* Ventana flotante de Categorías */}
            {isCategoryMenuOpen && (
              <div
                className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 z-50 w-72 sm:w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2.5 sm:p-3 ring-1 ring-slate-900/5 select-none"
                style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))' }}
              >
                {/* Flecha indicadora superior */}
                <div className="absolute -top-1.5 left-6 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45" />

                <div className="relative flex items-center justify-between px-2.5 py-1.5 mb-1.5 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Rubros Disponibles
                  </span>
                  <span className="text-[11px] font-semibold text-brand-cyan bg-cyan-50 px-2 py-0.5 rounded-full">
                    {categories.length} categorías
                  </span>
                </div>

                <div className="relative space-y-1 max-h-[380px] overflow-y-auto no-scrollbar py-0.5">
                  {categories.map((category) => {
                    const IconComponent = CATEGORY_ICONS[category.icon] || Package;
                    return (
                      <a
                        key={category.id}
                        href={`#categoria-${category.slug}`}
                        onClick={(e) => handleSelectCategory(e, category.slug)}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-cyan-50/80 text-slate-700 hover:text-brand-blue transition-all duration-150 group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-cyan-100 flex items-center justify-center text-slate-600 group-hover:text-brand-cyan transition-colors shrink-0 shadow-2xs">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <span className="text-xs sm:text-sm font-semibold block leading-snug group-hover:text-brand-cyan transition-colors">
                              {category.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-normal block">
                              {category.itemCount} productos
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-cyan group-hover:translate-x-0.5 transition-all shrink-0" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Enlaces Restantes Centrados */}
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
