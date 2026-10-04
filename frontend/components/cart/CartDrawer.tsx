'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/frontend/context/CartContext';
import { STORE, money, getWhatsAppOrderUrl } from '@/frontend/utils/store';
import { CheckoutFormData } from '@/types';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  Store,
  AlertCircle,
  MessageCircle,
  Package,
  Sparkles,
} from 'lucide-react';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    totalItems,
    subtotal,
    freeShipping,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  // Paso actual en el drawer: 'cart' (listado de productos) o 'checkout' (formulario de contacto/entrega)
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  // Formulario de checkout
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    phone: '',
    deliveryType: 'DELIVERY',
    address: '',
    cornerStreet: '',
    city: STORE.city,
    notes: '',
    paymentMethod: 'TRANSFERENCIA',
  });

  const [formErrors, setFormErrors] = useState<{ customerName?: string; phone?: string; address?: string }>({});

  // Resetear al paso 1 cuando se abre o se vacía
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep('cart'), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (items.length === 0) {
      setStep('cart');
    }
  }, [items.length]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Evitar scroll del body cuando el drawer está abierto
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

  const validateCheckout = (): boolean => {
    const errors: { customerName?: string; phone?: string; address?: string } = {};
    if (!formData.customerName.trim()) {
      errors.customerName = 'Por favor ingresá tu nombre y apellido';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Por favor ingresá un número de teléfono o WhatsApp';
    }
    if (formData.deliveryType === 'DELIVERY' && !formData.address?.trim()) {
      errors.address = 'Por favor ingresá tu dirección para el envío';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCheckout()) return;

    const url = getWhatsAppOrderUrl(formData, items, subtotal);
    window.open(url, '_blank', 'noopener,noreferrer');

    // Cerrar drawer y opcionalmente vaciar el carrito
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          
          {/* Header del Drawer */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              {step === 'checkout' ? (
                <button
                  onClick={() => setStep('cart')}
                  className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors"
                  aria-label="Volver al carrito"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              )}
              <div>
                <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
                  {step === 'cart' ? 'Tu Carrito' : 'Finalizar Pedido'}
                </h2>
                <p className="text-xs text-slate-500">
                  {step === 'cart'
                    ? `${totalItems} ${totalItems === 1 ? 'producto seleccionado' : 'productos seleccionados'}`
                    : 'Completá tus datos para el envío o retiro'}
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

          {/* Barra de Envío Gratis (solo visible en paso 1 con productos) */}
          {step === 'cart' && items.length > 0 && (
            <div className="px-5 py-3 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-brand-blue">
                  <Truck className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                  {freeShipping.isEligible ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      ¡Tenés Envío GRATIS en C. del Uruguay! 🎉
                    </span>
                  ) : (
                    <span>
                      Te faltan <strong className="text-brand-cyan">{money(freeShipping.remaining)}</strong> para envío gratis
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-slate-500 font-bold">{freeShipping.percentage}%</span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-cyan h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${freeShipping.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* CUERPO DEL DRAWER */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            
            {/* ESTADO VACÍO */}
            {items.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-10 h-10 opacity-40" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800 mb-1">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Descubrí nuestros productos de limpieza profesional, envasados y químicos sueltos.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-xl bg-brand-cyan hover:bg-cyan-600 text-white font-bold text-sm shadow-md transition-colors"
                >
                  Explorar Productos
                </button>
              </div>
            )}

            {/* PASO 1: LISTADO DE PRODUCTOS */}
            {step === 'cart' && items.length > 0 && (
              <div className="space-y-3">
                {items.map((item, idx) => (
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

                    {/* Información del Producto */}
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

                        {/* Etiqueta de presentación / suelto */}
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

                      {/* Controles de cantidad y precio */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
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

                        {/* Precio subtotal por item */}
                        <div className="text-right">
                          <span className="font-extrabold text-sm text-slate-900 block">
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
                ))}

                {/* Aviso sobre químicos sueltos si hay alguno */}
                {items.some((i) => i.product.isBulk || i.product.requiresStockInquiry) && (
                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block">Artículos Sueltos:</strong>
                      El stock físico de los químicos a granel se confirma al momento de recepcionar tu pedido en el local.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PASO 2: FORMULARIO DE CHECKOUT */}
            {step === 'checkout' && items.length > 0 && (
              <form id="checkout-form" onSubmit={handleSendWhatsApp} className="space-y-4">
                
                {/* Datos del Cliente */}
                <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    1. Datos de Contacto
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre y Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Laura Benítez"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none bg-white transition-all"
                    />
                    {formErrors.customerName && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Teléfono o WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 3442 556677"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none bg-white transition-all"
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Modalidad de Entrega */}
                <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    2. Modalidad de Entrega
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, deliveryType: 'DELIVERY' })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        formData.deliveryType === 'DELIVERY'
                          ? 'bg-brand-cyan text-white border-brand-cyan shadow-sm font-bold'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span>Envío a domicilio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, deliveryType: 'PICKUP' })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        formData.deliveryType === 'PICKUP'
                          ? 'bg-brand-cyan text-white border-brand-cyan shadow-sm font-bold'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <span>Retiro en local</span>
                    </button>
                  </div>

                  {formData.deliveryType === 'DELIVERY' ? (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Dirección de Entrega <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Calle, número, piso o depto"
                          value={formData.address || ''}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none bg-white transition-all"
                        />
                        {formErrors.address && (
                          <p className="text-[11px] text-red-500 mt-1">{formErrors.address}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Entre calles o referencias (opcional)
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Entre San Martín y Urquiza"
                          value={formData.cornerStreet || ''}
                          onChange={(e) => setFormData({ ...formData, cornerStreet: e.target.value })}
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none bg-white transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200 text-xs text-brand-blue animate-in fade-in duration-200">
                      <p className="font-bold flex items-center gap-1.5 mb-1">
                        <Store className="w-3.5 h-3.5 text-brand-cyan" />
                        Punto de retiro:
                      </p>
                      <p className="text-slate-600 font-medium">
                        {STORE.address}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {STORE.hours.weekdays} | {STORE.hours.saturday}
                      </p>
                    </div>
                  )}
                </div>

                {/* Forma de Pago Preferida */}
                <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    3. Forma de Pago Preferida
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 text-xs font-medium text-slate-800">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="TRANSFERENCIA"
                        checked={formData.paymentMethod === 'TRANSFERENCIA'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'TRANSFERENCIA' })}
                        className="text-brand-cyan focus:ring-brand-cyan"
                      />
                      <span>Transferencia</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 text-xs font-medium text-slate-800">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="EFECTIVO"
                        checked={formData.paymentMethod === 'EFECTIVO'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'EFECTIVO' })}
                        className="text-brand-cyan focus:ring-brand-cyan"
                      />
                      <span>Efectivo</span>
                    </label>
                  </div>
                </div>

                {/* Observaciones */}
                <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aclaraciones o notas para el local (opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Entregar por la mañana, tocar timbre de arriba..."
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none bg-white transition-all resize-none"
                  />
                </div>
              </form>
            )}

          </div>

          {/* FOOTER DEL DRAWER */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white shadow-lg space-y-3">
              {/* Resumen del subtotal */}
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Estimado
                </span>
                <div className="text-right">
                  <span className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                    {money(subtotal)}
                  </span>
                </div>
              </div>

              {/* Botones de acción según el paso */}
              {step === 'cart' ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-3.5 px-4 rounded-xl bg-brand-cyan hover:bg-cyan-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.99]"
                  >
                    <span>Continuar con el Pedido</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href="/carrito"
                      onClick={closeCart}
                      className="text-xs font-semibold text-slate-500 hover:text-brand-cyan transition-colors"
                    >
                      Ver Carrito Completo
                    </Link>

                    <button
                      onClick={clearCart}
                      className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Vaciar Carrito
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="submit"
                    form="checkout-form"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.99]"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                    <span>Enviar Pedido por WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors text-center"
                  >
                    Volver a modificar productos
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
