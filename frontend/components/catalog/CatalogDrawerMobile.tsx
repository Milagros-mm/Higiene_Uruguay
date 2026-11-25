'use client';

import React, { useEffect, useRef } from 'react';
import { LABELS } from '@/frontend/constants/labels';
import { FrontendCategory } from '@/frontend/adapters/productAdapter';
import { CategoryFilterTree } from './CategoryFilterTree';
import { BrandFilterAccordion } from './BrandFilterAccordion';
import { PriceRangeFilter } from './PriceRangeFilter';
import { X, Filter, RotateCcw } from 'lucide-react';

interface CatalogDrawerMobileProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FrontendCategory[];
  activeCategorySlug?: string;
  activeSubcategorySlug?: string;
  onSelectCategory: (catSlug?: string, subcatSlug?: string) => void;
  availableBrands: string[];
  selectedBrands: string[];
  onChangeBrands: (brands: string[]) => void;
  minPrice: number;
  maxPrice: number;
  selectedMinPrice?: number | '';
  selectedMaxPrice?: number | '';
  onApplyPrice: (min?: number, max?: number) => void;
  totalResults: number;
  onClearAll: () => void;
}

export function CatalogDrawerMobile({
  isOpen,
  onClose,
  categories,
  activeCategorySlug,
  activeSubcategorySlug,
  onSelectCategory,
  availableBrands,
  selectedBrands,
  onChangeBrands,
  minPrice,
  maxPrice,
  selectedMinPrice,
  selectedMaxPrice,
  onApplyPrice,
  totalResults,
  onClearAll,
}: CatalogDrawerMobileProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Atrapado de foco y cierre con tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Bloquear scroll de la página mientras el drawer está abierto
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-drawer-title"
    >
      {/* Backdrop oscuro translúcido */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel deslizante */}
      <div
        ref={drawerRef}
        className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-250"
      >
        {/* Cabecera del Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Filter className="w-4 h-4 text-brand-cyan" />
            <span id="mobile-drawer-title">{LABELS.filters}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Cerrar panel de filtros"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-4 overflow-y-auto flex-1 space-y-5">
          {/* Bloque 1: Categorías y Subcategorías */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {LABELS.categories}
            </h3>
            <CategoryFilterTree
              categories={categories}
              activeCategorySlug={activeCategorySlug}
              activeSubcategorySlug={activeSubcategorySlug}
              onSelect={onSelectCategory}
            />
          </div>

          {/* Bloque 2: Marcas */}
          <BrandFilterAccordion
            availableBrands={availableBrands}
            selectedBrands={selectedBrands}
            onChange={onChangeBrands}
          />

          {/* Bloque 3: Precio */}
          <PriceRangeFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            initialMin={selectedMinPrice}
            initialMax={selectedMaxPrice}
            onApply={onApplyPrice}
          />
        </div>

        {/* Pie Fijo del Drawer */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-full bg-brand-cyan hover:bg-brand-cyan-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center"
          >
            {LABELS.viewResults(totalResults)}
          </button>

          <button
            type="button"
            onClick={() => {
              onClearAll();
              onClose();
            }}
            className="w-full py-2 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{LABELS.clearFilters}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
