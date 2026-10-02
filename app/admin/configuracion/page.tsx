'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/frontend/components/admin/AdminHeader';
import { Button } from '@/frontend/components/ui/Button';

export default function TiendaConfigPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Cambios guardados exitosamente');
    }, 1000);
  };

  return (
    <div className="min-h-full pb-12">
      <AdminHeader 
        title="Información de la Tienda" 
        subtitle="Configura los datos de contacto y banners promocionales"
      />
      
      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-lg text-slate-800">Datos Generales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nombre de la Tienda</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-cyan outline-none" defaultValue="Higiene Uruguay" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Teléfono de Contacto (WhatsApp)</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-cyan outline-none" defaultValue="+598 99 123 456" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Dirección</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-cyan outline-none" defaultValue="Av. Principal 123, Montevideo" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Horario de Atención</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-cyan outline-none" defaultValue="Lunes a Viernes de 9:00 a 18:00" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-lg text-slate-800">Marketing y Promociones</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Leyenda Promocional Superior (Banner)</label>
            <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-cyan outline-none" defaultValue="¡Envíos gratis en compras mayores a $2000!" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="bg-brand-cyan hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-xl">
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}