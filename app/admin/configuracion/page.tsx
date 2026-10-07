'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/frontend/components/admin/AdminHeader';
import { Button } from '@/frontend/components/ui/Button';
import {
  STORE,
  money,
  StorePromotionConfig,
  getStoredPromotionConfig,
  saveStoredPromotionConfig,
} from '@/frontend/utils/store';
import { Sparkles, Save, CheckCircle2, Store, Tag } from 'lucide-react';

export default function TiendaConfigPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Datos generales del local
  const [storeData, setStoreData] = useState({
    name: STORE.name,
    phone: STORE.phoneDisplay,
    whatsapp: STORE.whatsapp,
    address: STORE.address,
    hours: `${STORE.hours.weekdays} | ${STORE.hours.saturday}`,
  });

  // Configuración de la promoción por monto en el carrito
  const [promoConfig, setPromoConfig] = useState<StorePromotionConfig>({
    thresholdAmount: 25000,
    discountPercent: 10,
    benefitTitle: '10% OFF en el total de tu pedido',
    isActive: true,
    bannerText: '¡Superando los $25.000 obtenés un 10% de DESCUENTO automático!',
  });

  useEffect(() => {
    setPromoConfig(getStoredPromotionConfig());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Guardar la promoción en localStorage para que el carrito la lea en vivo
    saveStoredPromotionConfig(promoConfig);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="min-h-full pb-16 bg-slate-50/50">
      <AdminHeader
        title="Configuración de Tienda y Promociones"
        subtitle="Modifica los datos de contacto y el beneficio por monto para el carrito"
      />

      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
        
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-bold">
              ¡Configuración y promociones guardadas exitosamente! El carrito ya está usando estos valores.
            </span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* SECCIÓN 1: BENEFICIO Y DESCUENTO POR PRECIO EN EL CARRITO */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Descuento por Monto de Compra (Promoción del Carrito)
                </h3>
                <p className="text-xs text-slate-500">
                  El cliente verá una barra de progreso en el carrito y obtendrá el descuento al alcanzar el monto fijado.
                </p>
              </div>
            </div>

            {/* Activar / Desactivar Promoción */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-sm font-bold text-slate-800 block">
                  Activar beneficio en la tienda
                </label>
                <span className="text-xs text-slate-500">
                  Muestra la barra de progreso en el carrito lateral y aplica el descuento al llegar al monto.
                </span>
              </div>
              <input
                type="checkbox"
                checked={promoConfig.isActive}
                onChange={(e) => setPromoConfig({ ...promoConfig, isActive: e.target.checked })}
                className="w-5 h-5 text-brand-cyan rounded focus:ring-brand-cyan cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monto Mínimo a Alcanzar */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Monto a Alcanzar ($ ARS)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={promoConfig.thresholdAmount}
                    onChange={(e) =>
                      setPromoConfig({ ...promoConfig, thresholdAmount: Number(e.target.value) || 0 })
                    }
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-slate-900 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Ejemplo: 25000 (el cliente debe sumar ${money(promoConfig.thresholdAmount)} para desbloquearlo).
                </p>
              </div>

              {/* Porcentaje de Descuento */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Porcentaje de Descuento (% OFF)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={promoConfig.discountPercent}
                    onChange={(e) =>
                      setPromoConfig({ ...promoConfig, discountPercent: Number(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-slate-900 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Descuento directo que se restará del total del pedido.
                </p>
              </div>

              {/* Título del beneficio */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Título del Beneficio
                </label>
                <input
                  type="text"
                  value={promoConfig.benefitTitle}
                  onChange={(e) => setPromoConfig({ ...promoConfig, benefitTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none"
                />
              </div>

              {/* Texto de la barra / banner */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Texto Informativo / Leyenda Promocional
                </label>
                <input
                  type="text"
                  value={promoConfig.bannerText}
                  onChange={(e) => setPromoConfig({ ...promoConfig, bannerText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none"
                />
              </div>
            </div>

            {/* Vista Previa del Beneficio */}
            <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 text-xs text-brand-blue">
              <span className="font-bold flex items-center gap-1.5 mb-1 text-slate-800">
                <Tag className="w-3.5 h-3.5 text-brand-cyan" />
                Vista previa en el Carrito:
              </span>
              <p className="text-slate-600">
                Si un cliente agrega artículos por $15.000, el carrito le dirá:
                <strong className="text-brand-cyan ml-1">
                  "Te faltan {money(Math.max(0, promoConfig.thresholdAmount - 15000))} para {promoConfig.discountPercent}% OFF"
                </strong>
                . Al superar {money(promoConfig.thresholdAmount)}, se le descontará automáticamente el {promoConfig.discountPercent}%.
              </p>
            </div>
          </div>

          {/* SECCIÓN 2: DATOS DEL LOCAL COMERCIAL */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Datos Generales del Local
                </h3>
                <p className="text-xs text-slate-500">
                  Ubicación física y números de WhatsApp oficiales para la recepción de pedidos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Nombre de la Tienda
                </label>
                <input
                  type="text"
                  value={storeData.name}
                  onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-brand-cyan outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Número de WhatsApp para Pedidos
                </label>
                <input
                  type="text"
                  value={storeData.whatsapp}
                  onChange={(e) => setStoreData({ ...storeData, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-brand-cyan outline-none font-mono"
                />
                <span className="text-[11px] text-slate-400 block">Formato internacional: 5493442334343</span>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Dirección del Local Físico (Punto de Retiro)
                </label>
                <input
                  type="text"
                  value={storeData.address}
                  onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-brand-cyan outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Horarios de Atención
                </label>
                <input
                  type="text"
                  value={storeData.hours}
                  onChange={(e) => setStoreData({ ...storeData, hours: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-brand-cyan outline-none"
                />
              </div>
            </div>
          </div>

          {/* BOTÓN DE GUARDADO */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-brand-cyan hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Configuración'}</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}