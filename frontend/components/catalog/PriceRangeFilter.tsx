'use client';

import React, { useState, useEffect } from 'react';
import { LABELS } from '@/frontend/constants/labels';
import { ChevronDown } from 'lucide-react';

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  initialMin?: number | '';
  initialMax?: number | '';
  onApply: (min?: number, max?: number) => void;
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  initialMin,
  initialMax,
  onApply,
}: PriceRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [desde, setDesde] = useState<string>(
    typeof initialMin === 'number' ? initialMin.toString() : ''
  );
  const [hasta, setHasta] = useState<string>(
    typeof initialMax === 'number' ? initialMax.toString() : ''
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setDesde(typeof initialMin === 'number' ? initialMin.toString() : '');
  }, [initialMin]);

  useEffect(() => {
    setHasta(typeof initialMax === 'number' ? initialMax.toString() : '');
  }, [initialMax]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const numDesde = desde.trim() !== '' ? Number(desde) : undefined;
    const numHasta = hasta.trim() !== '' ? Number(hasta) : undefined;

    // Validación únicamente en UI de que sean números y Desde <= Hasta
    if (numDesde !== undefined && isNaN(numDesde)) {
      setValidationError('El valor "Desde" debe ser un número.');
      return;
    }
    if (numHasta !== undefined && isNaN(numHasta)) {
      setValidationError('El valor "Hasta" debe ser un número.');
      return;
    }
    if (numDesde !== undefined && numHasta !== undefined && numDesde > numHasta) {
      setValidationError('El precio "Desde" no puede ser mayor que "Hasta".');
      return;
    }

    onApply(numDesde, numHasta);
  };

  return (
    <div className="border-t border-slate-200/80 pt-4">
      {/* Cabecera del Acordeón */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-brand-cyan transition-colors cursor-pointer py-1"
        aria-expanded={isOpen}
      >
        <span>{LABELS.price}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brand-cyan' : ''
          }`}
        />
      </button>

      {/* Formulario de Rango */}
      {isOpen && (
        <form onSubmit={handleApply} className="mt-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="price-from" className="text-[11px] font-medium text-slate-500 block mb-1">
                {LABELS.priceFrom}
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                <input
                  id="price-from"
                  type="number"
                  inputMode="numeric"
                  placeholder={minPrice ? minPrice.toString() : '0'}
                  value={desde}
                  onChange={(e) => {
                    setDesde(e.target.value);
                    setValidationError(null);
                  }}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="price-to" className="text-[11px] font-medium text-slate-500 block mb-1">
                {LABELS.priceTo}
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                <input
                  id="price-to"
                  type="number"
                  inputMode="numeric"
                  placeholder={maxPrice ? maxPrice.toString() : '99999'}
                  value={hasta}
                  onChange={(e) => {
                    setHasta(e.target.value);
                    setValidationError(null);
                  }}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
                />
              </div>
            </div>
          </div>

          {validationError && (
            <p className="text-[10px] text-red-600 font-medium">
              {validationError}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
          >
            {LABELS.apply}
          </button>
        </form>
      )}
    </div>
  );
}
