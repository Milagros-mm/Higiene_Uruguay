'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/frontend/context/CartContext';
import { money } from '@/frontend/utils/store';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  Sparkles,
  AlertCircle,
  Tag,
} from 'lucide-react';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    totalItems,
    subtotal,
    discountedSubtotal,
    promoProgress,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const router = useRouter();

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Evitar scroll del body cuando el drawer está visible
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartCheckout = () => {
    closeCart();
    router.push('/carrito');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-200">
      {/* Fondo oscuro con clic para cerrar */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          
          {/* 1. CABECERA DEL DRAWER */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
                  Carrito de Compras
                </h2>
                <p className="text-xs text-slate-500">
                  {totalItems} {totalItems === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. BARRA DE PROMOCIÓN CONFIGURADA DESDE EL ADMIN */}
          {items.length > 0 && promoProgress.isActive && (
            <div className="px-5 py-3 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-brand-blue">
                  <Sparkles className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                  {promoProgress.isReached ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      ¡Alcanzaste el {promoProgress.discountPercent}% OFF en tu compra! 🎉
                    </span>
                  ) : (
                    <span>
                      Te faltan <strong className="text-brand-cyan">{money(promoProgress.remaining)}</strong> para {promoProgress.discountPercent}% OFF
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-slate-500 font-bold">{promoProgress.percentage}%</span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-cyan h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${promoProgress.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* 3. LISTADO DE PRODUCTOS */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-10 h-10 opacity-40" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800 mb-1">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Explorá nuestro catálogo de insumos de limpieza profesional y químicos sueltos.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-xl bg-brand-cyan hover:bg-cyan-600 text-white font-bold text-sm shadow-md transition-colors"
                >
                  Explorar Productos
                </button>
              </div>
            ) : (
              <>
                {items.map((item, idx) => {
                  const hasDiscount =
                    item.product.originalPrice && item.product.originalPrice > item.price;
                  const discountPct = hasDiscount
                    ? Math.round(((item.product.originalPrice! - item.price) / item.product.originalPrice!) * 100)
                    : 0;

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedUnit}-${idx}`}
                      className="flex gap-3 p-3 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all shadow-2xs"
                    >
                      {/* Miniatura de la imagen */}
                      <div className="relative w-18 h-18 rounded-xl bg-slate-50 shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center p-1">
                        {item.product.images && item.product.images[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <Package className="w-7 h-7 text-slate-300" />
                        )}
                      </div>

                      {/* Información y Descuentos del Producto */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-semibold text-xs sm:text-sm text-slate-900 line-clamp-1 leading-snug">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.product.id, item.selectedUnit)}
                              className="text-slate-400 hover:text-red-500 p-1 -mr-1 transition-colors"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Presentación y Badge de Suelto */}
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {item.selectedUnit}
                            </span>
                            {item.product.isBulk && (
                              <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                Químico Suelto
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controles de Cantidad y Precios (con ofertas aplicadas) */}
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                          {/* Selector de cantidad */}
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedUnit)}
                              className="p-1 text-slate-600 hover:bg-slate-200/80 active:bg-slate-300 transition-colors"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedUnit)}
                              className="p-1 text-slate-600 hover:bg-slate-200/80 active:bg-slate-300 transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Precios con descuento visible */}
                          <div className="text-right">
                            {hasDiscount && (
                              <div className="flex items-center justify-end gap-1 mb-0.5">
                                <span className="text-[10px] text-slate-400 line-through">
                                  {money(item.product.originalPrice! * item.quantity)}
                                </span>
                                <span className="text-[9px] font-extrabold text-brand-cyan bg-cyan-50 px-1 py-0.2 rounded border border-cyan-200">
                                  -{discountPct}%
                                </span>
                              </div>
                            )}
                            <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                              {money(item.totalPrice)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[10px] text-slate-400">
                                {money(item.price)} c/u
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Aviso para artículos sueltos */}
                {items.some((i) => i.product.isBulk || i.product.requiresStockInquiry) && (
                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block">Químicos Sueltos:</strong>
                      El stock físico se confirma al recepcionar tu pedido en el local.
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 4. PIE DEL DRAWER: SUBTOTALES Y BOTONES "INICIAR COMPRA" / "VER MÁS PRODUCTOS" */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white shadow-lg space-y-3">
              {/* Desglose de totales */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Subtotal ({totalItems} productos):</span>
                  <span className="font-semibold text-slate-700">{money(subtotal)}</span>
                </div>

                {promoProgress.isReached && promoProgress.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Beneficio ({promoProgress.discountPercent}% OFF):
                    </span>
                    <span>-{money(promoProgress.discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Estimado
                  </span>
                  <span className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                    {money(discountedSubtotal)}
                  </span>
                </div>
              </div>

              {/* Botón Principal: Iniciar compra */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleStartCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-brand-cyan hover:bg-cyan-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.99] cursor-pointer"
                >
                  <span>Iniciar compra</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {/* Enlace secundario: Ver más productos */}
                <button
                  onClick={closeCart}
                  className="w-full py-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors text-center cursor-pointer block"
                >
                  Ver más productos
                </button>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={clearCart}
                  className="text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
