'use client';

import React from 'react';
import { FrontendCategory } from '@/frontend/adapters/productAdapter';
import { LABELS } from '@/frontend/constants/labels';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';

interface CategoryFilterTreeProps {
  categories: FrontendCategory[];
  activeCategorySlug?: string;
  activeSubcategorySlug?: string;
  onSelect: (categorySlug?: string, subcategorySlug?: string) => void;
}

export function CategoryFilterTree({
  categories,
  activeCategorySlug,
  activeSubcategorySlug,
  onSelect,
}: CategoryFilterTreeProps) {
  return (
    <div className="space-y-1">
      {/* Opción Todas las categorías */}
      <button
        type="button"
        onClick={() => onSelect(undefined, undefined)}
        className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
          !activeCategorySlug || activeCategorySlug === 'todas'
            ? 'bg-slate-900 text-white shadow-2xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <span>{LABELS.allCategories}</span>
      </button>

      {/* Lista de Categorías */}
      <div className="space-y-1 pt-1">
        {categories.map((cat) => {
          const isCategoryActive = activeCategorySlug === cat.slug;
          const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;

          return (
            <div key={cat.id} className="rounded-xl overflow-hidden">
              {/* Botón de la Categoría */}
              <button
                type="button"
                onClick={() => {
                  if (isCategoryActive && !activeSubcategorySlug) {
                    // Si ya está activa y se vuelve a tocar, o se deja abierta
                  } else {
                    onSelect(cat.slug, undefined);
                  }
                }}
                className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isCategoryActive && (!activeSubcategorySlug || activeSubcategorySlug === 'todas')
                    ? 'bg-brand-cyan text-white font-bold shadow-2xs'
                    : isCategoryActive
                    ? 'bg-cyan-50/80 text-brand-blue font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0 pr-1">
                  <span className="truncate">{cat.name}</span>
                  {typeof cat.productCount === 'number' && (
                    <span
                      className={`text-[10px] shrink-0 font-normal ${
                        isCategoryActive && (!activeSubcategorySlug || activeSubcategorySlug === 'todas')
                          ? 'text-white/80'
                          : 'text-slate-400'
                      }`}
                    >
                      ({cat.productCount})
                    </span>
                  )}
                </div>

                {hasSubcategories && (
                  <span className="shrink-0 ml-1">
                    {isCategoryActive ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </span>
                )}
              </button>

              {/* Subcategorías desplegadas debajo de la categoría activa */}
              {isCategoryActive && hasSubcategories && (
                <div className="pl-4 pr-1 py-1.5 space-y-1 border-l-2 border-brand-cyan/30 ml-3 my-1">
                  {/* Opción "Todas" las subcategorías para esta categoría */}
                  <button
                    type="button"
                    onClick={() => onSelect(cat.slug, undefined)}
                    className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                      !activeSubcategorySlug || activeSubcategorySlug === 'todas'
                        ? 'text-brand-cyan font-bold bg-cyan-50/50'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{LABELS.allSubcategories}</span>
                    {(!activeSubcategorySlug || activeSubcategorySlug === 'todas') && (
                      <Check className="w-3 h-3 text-brand-cyan" />
                    )}
                  </button>

                  {/* Subcategorías individuales */}
                  {cat.subcategories.map((sub) => {
                    const isSubActive = activeSubcategorySlug === sub.slug;

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => onSelect(cat.slug, sub.slug)}
                        className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                          isSubActive
                            ? 'text-brand-cyan font-bold bg-cyan-50/50'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate pr-1">{sub.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {typeof sub.productCount === 'number' && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({sub.productCount})
                            </span>
                          )}
                          {isSubActive && <Check className="w-3 h-3 text-brand-cyan" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
