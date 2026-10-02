'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/frontend/components/ui/Button';
import { Image as ImageIcon, ArrowLeft } from 'lucide-react';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoose, setIsLoose] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Producto guardado correctamente');
      router.push('/admin/productos');
    }, 1000);
  };

  return (
    <div className="min-h-full pb-12 bg-slate-50/50">
      
      <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-6 mb-8">
        <div className="max-w-4xl mx-auto flex flex-col items-start gap-4">
          <Link href="/admin/productos" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-brand-cyan">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Editar producto
          </h1>
        </div>
      </div>
      
      <div className="px-6 sm:px-8 max-w-4xl mx-auto space-y-6">
        
        {/* Ficha Resumen */}
        <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="text-xs font-bold text-slate-500 mb-1">Código</div>
            <div className="text-base font-semibold text-slate-800">101023</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 mb-1">Precio</div>
            <div className="text-base font-semibold text-slate-800">$ 9.950</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 mb-1">Stock</div>
            <div className="text-base font-semibold text-slate-800">{isLoose ? 'A consultar' : '18'}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nombre del producto</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-cyan outline-none text-slate-800" defaultValue="Difusor Aromanza x 200 ml" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Descripción</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-cyan outline-none text-slate-800" defaultValue="Difusor aromático ambiental de máxima persistencia con varillas de fibra de ratán para el hogar o comercio." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Detalle</label>
                <textarea rows={2} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-cyan outline-none text-slate-800" defaultValue="Apto para ambientes grandes y cerrados." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Precio de oferta</label>
                <input type="number" placeholder="Ej: 8500" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-cyan outline-none text-slate-800" />
                <p className="text-xs text-slate-500 font-medium">Dejalo vacío si no hay oferta.</p>
              </div>

              <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={isLoose}
                  onChange={(e) => setIsLoose(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-brand-cyan focus:ring-brand-cyan" 
                />
                <div>
                  <div className="font-bold text-slate-800 text-sm">Producto a consultar</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">No se muestra el stock. En la tienda aparecerá el aviso "Producto sujeto a consulta".</div>
                </div>
              </label>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700">Foto</label>
              
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                {/* Current Photo Preview */}
                <div className="aspect-square w-full flex items-center justify-center p-4 bg-white border-b border-slate-100">
                  <img src="/images/products/difusorAromanza.jpg" alt="Producto actual" className="max-w-full max-h-full object-contain" />
                </div>
                
                <div className="p-4 flex flex-col items-center justify-center text-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs font-bold rounded-lg w-full bg-white">
                    Cambiar foto
                  </Button>
                  <p className="text-[11px] text-slate-500 font-medium">JPG o PNG, máximo 2 MB.</p>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Link href="/admin/productos">
              <Button variant="outline" className="font-bold rounded-xl text-slate-600">Cancelar</Button>
            </Link>
            <Button onClick={handleSave} disabled={isSaving} className="bg-brand-cyan hover:bg-cyan-600 text-white font-bold py-2.5 px-6 rounded-xl">
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}