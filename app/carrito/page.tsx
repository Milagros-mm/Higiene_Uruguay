'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/frontend/context/CartContext';
import { STORE, money, getWhatsAppOrderUrl, buildWhatsAppOrderMessage } from '@/frontend/utils/store';
import { CheckoutFormData } from '@/types';
import { Header } from '@/frontend/components/layout/Header';
import { PromoTopBar } from '@/frontend/components/layout/PromoTopBar';
import { Footer } from '@/frontend/components/layout/Footer';
import { WhatsAppFloatingBtn } from '@/frontend/components/layout/WhatsAppFloatingBtn';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  Store,
  MessageCircle,
  AlertCircle,
  Package,
  ArrowLeft,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function CarritoPage() {
  const {
    items,
    totalItems,
    subtotal,
    freeShipping,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

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
  const [showPreview, setShowPreview] = useState(false);

  const validateCheckout = (): boolean => {
    const errors: { customerName?: string; phone?: string; address?: string } = {};
    if (!formData.customerName.trim()) {
      errors.customerName = 'Por favor ingresá tu nombre y apellido';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Por favor ingresá un número de teléfono o WhatsApp de contacto';
    }
    if (formData.deliveryType === 'DELIVERY' && !formData.address?.trim()) {
      errors.address = 'Por favor ingresá tu dirección para coordinar la entrega';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCheckout()) return;

    const url = getWhatsAppOrderUrl(formData, items, subtotal);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PromoTopBar />
      <Header />

      <main className="flex-grow py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Breadcrumb y Volver */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-brand-cyan transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la tienda</span>
            </Link>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Vaciar carrito
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight mb-2">
            Carrito de Compras
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-8">
            Revisá tus artículos seleccionados y completá los datos para enviar tu pedido por WhatsApp.
          </p>

          {/* ESTADO VACÍO */}
          {items.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center max-w-lg mx-auto my-8">
              <div className="w-20 h-20 rounded-2xl bg-cyan-50 text-brand-cyan flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="font-display font-bold text-xl text-slate-900 mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Aún no has agregado ningún producto. Explorá nuestro catálogo de insumos de higiene y químicos sueltos.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-cyan hover:bg-cyan-600 text-white font-bold text-sm shadow-md transition-all"
              >
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS (7 COLUMNAS) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Banner de Envío Gratis */}
                <div className="bg-white rounded-2xl p-4 border border-cyan-100 shadow-xs">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
                    <span className="flex items-center gap-2 text-brand-blue">
                      <Truck className="w-4 h-4 text-brand-cyan" />
                      {freeShipping.isEligible ? (
                        <span className="text-emerald-700 font-bold">
                          ¡Tenés Envío GRATIS en Concepción del Uruguay! 🎉
                        </span>
                      ) : (
                        <span>
                          Te faltan <strong className="text-brand-cyan">{money(freeShipping.remaining)}</strong> para envío gratis
                        </span>
                      )}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{freeShipping.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-cyan h-2 rounded-full transition-all duration-500"
                      style={{ width: `${freeShipping.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Listado de Items */}
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.selectedUnit}-${idx}`}
                      className="p-4 sm:p-5 flex gap-4 items-center justify-between"
                    >
                      {/* Miniatura */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center p-1">
                        {item.product.images && item.product.images[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-slate-300" />
                        )}
                      </div>

                      {/* Detalles */}
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-semibold text-sm sm:text-base text-slate-900 line-clamp-1 leading-snug">
                          {item.product.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                            {item.selectedUnit}
                          </span>
                          {item.product.isBulk && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              Químico Suelto
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-slate-400 block mt-1">
                          {money(item.price)} por unidad
                        </span>
                      </div>

                      {/* Selector de Cantidad */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedUnit)}
                          className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                          aria-label="Disminuir"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-xs sm:text-sm text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedUnit)}
                          className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal y Eliminar */}
                      <div className="text-right shrink-0 min-w-[80px]">
                        <span className="font-bold text-sm sm:text-base text-slate-900 block">
                          {money(item.totalPrice)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedUnit)}
                          className="text-xs text-slate-400 hover:text-red-500 transition-colors mt-1 inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Quitar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Aviso de Químicos Sueltos */}
                {items.some((i) => i.product.isBulk || i.product.requiresStockInquiry) && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block">Aviso sobre productos sueltos:</strong>
                      Tu pedido contiene químicos sueltos en presentaciones fijadas. Su disponibilidad física se confirmará al momento de recepcionar tu mensaje en el local.
                    </div>
                  </div>
                )}
              </div>

              {/* COLUMNA DERECHA: CHECKOUT FORM & RESUMEN (5 COLUMNAS) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-display font-bold text-slate-900">
                      Datos para el Pedido
                    </h2>
                    <p className="text-xs text-slate-500">
                      Completá el formulario para enviar el pedido formateado por WhatsApp.
                    </p>
                  </div>

                  <form id="full-checkout-form" onSubmit={handleSendWhatsApp} className="space-y-4">
                    {/* Nombre */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nombre y Apellido <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Marcelo Gómez"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none transition-all"
                      />
                      {formErrors.customerName && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.customerName}</p>
                      )}
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Teléfono / WhatsApp de Contacto <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej: 3442 456789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none transition-all"
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Modalidad de entrega */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Modalidad de Entrega
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, deliveryType: 'DELIVERY' })}
                          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                            formData.deliveryType === 'DELIVERY'
                              ? 'bg-brand-cyan text-white border-brand-cyan shadow-sm font-bold'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <Truck className="w-4 h-4" />
                          <span>Envío a domicilio</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, deliveryType: 'PICKUP' })}
                          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                            formData.deliveryType === 'PICKUP'
                              ? 'bg-brand-cyan text-white border-brand-cyan shadow-sm font-bold'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <Store className="w-4 h-4" />
                          <span>Retiro en local</span>
                        </button>
                      </div>
                    </div>

                    {formData.deliveryType === 'DELIVERY' ? (
                      <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Dirección de Entrega <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Calle, número, depto o timbre"
                            value={formData.address || ''}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none transition-all"
                          />
                          {formErrors.address && (
                            <p className="text-[11px] text-red-500 mt-1">{formErrors.address}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Entre calles o indicaciones (opcional)
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Portón verde entre Artigas y Congreso"
                            value={formData.cornerStreet || ''}
                            onChange={(e) => setFormData({ ...formData, cornerStreet: e.target.value })}
                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-xs text-brand-blue animate-in fade-in duration-200">
                        <strong className="block font-bold mb-1">Punto de retiro:</strong>
                        <p className="text-slate-700">{STORE.address}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{STORE.hours.weekdays}</p>
                      </div>
                    )}

                    {/* Forma de Pago */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Forma de Pago Preferida
                      </label>
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

                    {/* Notas */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Notas para el local (opcional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ej: Entregar a partir de las 16:00 hs..."
                        value={formData.notes || ''}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none transition-all resize-none"
                      />
                    </div>
                  </form>

                  {/* Resumen Total y Botón WhatsApp */}
                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Subtotal ({totalItems} productos)</span>
                        <span>{money(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Envío</span>
                        <span>{freeShipping.isEligible ? 'Gratis' : 'A coordinar'}</span>
                      </div>
                      <div className="flex justify-between text-base sm:text-lg font-display font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                        <span>Total Estimado</span>
                        <span className="text-xl sm:text-2xl text-brand-blue">{money(subtotal)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      form="full-checkout-form"
                      className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.99]"
                    >
                      <MessageCircle className="w-6 h-6 fill-white text-transparent" />
                      <span>Enviar Pedido por WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="w-full text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1 font-medium"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{showPreview ? 'Ocultar vista previa del mensaje' : 'Ver mensaje que se enviará'}</span>
                    </button>

                    {showPreview && (
                      <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed border border-slate-800">
                        {buildWhatsAppOrderMessage(formData, items, subtotal)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
      <WhatsAppFloatingBtn />
    </div>
  );
}
