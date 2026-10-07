'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/frontend/context/CartContext';
import { money } from '@/frontend/utils/store';
import { CheckCircle2, X, ShoppingCart, ArrowRight, Package, Sparkles } from 'lucide-react';

export function CartMiniPopup() {
  const {
    isMiniPopupOpen,
    closeMiniPopup,
    lastAddedItem,
    totalItems,
    subtotal,
    openCart,
    promoProgress,
  } = useCart();

  if (!isMiniPopupOpen || !lastAddedItem) return null;

  return (
    <div className="absolute top-full right-0 mt-2 z-50 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 animate-in fade-in slide-in-from-top-2 duration-200 select-none">
      
      {/* Triángulo indicador superior apuntando al carrito */}
      <div className="absolute -top-2 right-4 sm:right-6 w-4 h-4 bg-white border-t border-l border-slate-200 rotate-45" />

      {/* Cabecera del aviso */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>¡Agregado a tu carrito!</span>
        </div>
        <button
          onClick={closeMiniPopup}
          className="text-slate-400 hover:text-slate-600 p-1 -mr-1 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Producto recién agregado */}
      <div className="flex gap-3 items-center">
        <div className="relative w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center p-1">
          {lastAddedItem.product.images && lastAddedItem.product.images[0] ? (
            <Image
              src={lastAddedItem.product.images[0]}
              alt={lastAddedItem.product.name}
              fill
              className="object-contain p-1"
            />
          ) : (
            <Package className="w-6 h-6 text-slate-300" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-xs text-slate-900 line-clamp-1 leading-snug">
            {lastAddedItem.product.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
              {lastAddedItem.selectedUnit}
            </span>
            <span className="text-[11px] font-bold text-slate-800">
              {money(lastAddedItem.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de progreso de la promoción activa */}
      {promoProgress.isActive && (
        <div className="mt-3 p-2 rounded-xl bg-cyan-50/70 border border-cyan-100 text-[11px]">
          <div className="flex items-center justify-between font-semibold text-brand-blue mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-cyan" />
              {promoProgress.isReached ? (
                <span className="text-emerald-700 font-bold">¡Beneficio {promoProgress.discountPercent}% OFF activo!</span>
              ) : (
                <span>Te faltan <strong className="text-brand-cyan">{money(promoProgress.remaining)}</strong> para {promoProgress.discountPercent}% OFF</span>
              )}
            </span>
          </div>
          <div className="w-full bg-slate-200/80 rounded-full h-1 overflow-hidden">
            <div
              className="bg-brand-cyan h-1 rounded-full transition-all duration-300"
              style={{ width: `${promoProgress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtotal del carrito */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-baseline justify-between text-xs">
        <span className="text-slate-500 font-medium">Subtotal ({totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}):</span>
        <span className="font-extrabold text-sm text-slate-900">{money(subtotal)}</span>
      </div>

      {/* Botones de acción */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            closeMiniPopup();
            openCart();
          }}
          className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Ver Carrito</span>
        </button>

        <Link
          href="/carrito"
          onClick={closeMiniPopup}
          className="w-full py-2 px-3 rounded-xl bg-brand-cyan hover:bg-cyan-600 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 text-center"
        >
          <span>Iniciar Compra</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
