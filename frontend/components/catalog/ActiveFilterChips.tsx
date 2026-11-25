'use client';

import React from 'react';
import { LABELS } from '@/frontend/constants/labels';
import { X, RotateCcw } from 'lucide-react';

interface ActiveFilterChipsProps {
  categoryName?: string;
  subcategoryName?: string;
  brands: string[];
  minPrice?: number | '';
  maxPrice?: number | '';
  searchQuery?: string;
  onRemoveCategory: () => void;
  onRemoveSubcategory: () => void;
  onRemoveBrand: (brand: string) => void;
  onRemovePrice: () => void;
  onRemoveSearchQuery: () => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({
  categoryName,
  subcategoryName,
  brands,
  minPrice,
  maxPrice,
  searchQuery,
  onRemoveCategory,
  onRemoveSubcategory,
  onRemoveBrand,
  onRemovePrice,
  onRemoveSearchQuery,
  onClearAll,
}: ActiveFilterChipsProps) {
  const hasPrice = typeof minPrice === 'number' || typeof maxPrice === 'number';
  const hasActiveFilters =
    Boolean(categoryName) ||
    Boolean(subcategoryName) ||
    brands.length > 0 ||
    hasPrice ||
    Boolean(searchQuery);

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1">
        {LABELS.activeFilters}
      </span>

      {/* Chip de Búsqueda q */}
      {searchQuery && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
          <span>{LABELS.resultsFor(searchQuery)}</span>
          <button
            type="button"
            onClick={onRemoveSearchQuery}
            className="hover:text-red-500 cursor-pointer ml-0.5 p-0.5"
            aria-label="Quitar término de búsqueda"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {/* Chip de Categoría */}
      {categoryName && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
          <span>{LABELS.category}: <strong>{categoryName}</strong></span>
          <button
            type="button"
            onClick={onRemoveCategory}
            className="hover:text-red-500 cursor-pointer ml-0.5 p-0.5"
            aria-label="Quitar filtro de categoría"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {/* Chip de Subcategoría */}
      {subcategoryName && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-medium text-cyan-950 shadow-2xs">
          <span>{LABELS.subcategory}: <strong>{subcategoryName}</strong></span>
          <button
            type="button"
            onClick={onRemoveSubcategory}
            className="hover:text-red-500 cursor-pointer ml-0.5 p-0.5"
            aria-label="Quitar filtro de subcategoría"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {/* Chips de Marcas */}
      {brands.map((brand) => (
        <span
          key={brand}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs"
        >
          <span>{LABELS.brand}: <strong>{brand}</strong></span>
          <button
            type="button"
            onClick={() => onRemoveBrand(brand)}
            className="hover:text-red-500 cursor-pointer ml-0.5 p-0.5"
            aria-label={`Quitar filtro de marca ${brand}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}

      {/* Chip de Precio */}
      {hasPrice && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
          <span>
            {LABELS.price}:{' '}
            <strong>
              {typeof minPrice === 'number' ? `$${minPrice}` : '$0'} -{' '}
              {typeof maxPrice === 'number' ? `$${maxPrice}` : 'máx.'}
            </strong>
          </span>
          <button
            type="button"
            onClick={onRemovePrice}
            className="hover:text-red-500 cursor-pointer ml-0.5 p-0.5"
            aria-label="Quitar filtro de precio"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {/* Botón Limpiar Filtros */}
      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline px-2 py-1 cursor-pointer transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{LABELS.clearFilters}</span>
      </button>
    </div>
  );
}
