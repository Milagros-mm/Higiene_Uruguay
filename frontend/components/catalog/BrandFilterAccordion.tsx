'use client';

import React, { useState, useMemo } from 'react';
import { LABELS } from '@/frontend/constants/labels';
import { ChevronDown, Search } from 'lucide-react';

interface BrandFilterAccordionProps {
  availableBrands: string[];
  selectedBrands: string[];
  onChange: (brands: string[]) => void;
}

export function BrandFilterAccordion({
  availableBrands,
  selectedBrands,
  onChange,
}: BrandFilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrands = useMemo(() => {
    if (!searchTerm.trim()) return availableBrands;
    const term = searchTerm.toLowerCase().trim();
    return availableBrands.filter((b) => b.toLowerCase().includes(term));
  }, [availableBrands, searchTerm]);

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onChange([...selectedBrands, brand]);
    }
  };

  if (availableBrands.length === 0) return null;

  return (
    <div className="border-t border-slate-200/80 pt-4">
      {/* Cabecera del Acordeón */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-brand-cyan transition-colors cursor-pointer py-1"
        aria-expanded={isOpen}
      >
        <span>{LABELS.brands}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brand-cyan' : ''
          }`}
        />
      </button>

      {/* Contenido Desplegable */}
      {isOpen && (
        <div className="mt-2.5 space-y-2">
          {/* Mini buscador si hay más de 5 marcas */}
          {availableBrands.length > 5 && (
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={LABELS.searchBrandsPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
          )}

          {/* Lista de Checkboxes */}
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {filteredBrands.map((brand) => {
              const isChecked = selectedBrands.includes(brand);

              return (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-xs text-slate-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleBrand(brand)}
                    className="w-4 h-4 rounded text-brand-cyan border-slate-300 focus:ring-brand-cyan cursor-pointer"
                  />
                  <span className={`truncate ${isChecked ? 'font-bold text-brand-blue' : ''}`}>
                    {brand}
                  </span>
                </label>
              );
            })}

            {filteredBrands.length === 0 && (
              <p className="text-[11px] text-slate-400 py-1 italic">
                No se encontraron marcas
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
