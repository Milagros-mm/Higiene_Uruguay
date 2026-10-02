'use client';

import React from 'react';
import { AdminHeader } from '@/frontend/components/admin/AdminHeader';
import { User, Activity, Edit, RefreshCw } from 'lucide-react';

const mockLogs = [
  { id: 1, date: '2026-09-28 16:05', user: 'Admin Principal', action: 'Editó Producto', detail: 'Jabón Líquido Ala - Precio Oferta actualizado' },
  { id: 2, date: '2026-09-28 15:30', user: 'Sistema', action: 'Sincronización manual', detail: 'Se actualizaron 245 productos desde Apollo' },
  { id: 3, date: '2026-09-27 11:20', user: 'Admin Principal', action: 'Editó Tienda', detail: 'Horario de atención actualizado' },
];

export default function LogsPage() {
  return (
    <div className="min-h-full pb-12">
      <AdminHeader 
        title="Historial de Cambios" 
        subtitle="Registro de actividades y modificaciones en la plataforma"
      />
      
      <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <Activity className="w-5 h-5 text-brand-cyan" />
            <h3 className="font-bold text-lg text-slate-800">Últimos Eventos</h3>
          </div>
          
          <div className="divide-y divide-slate-100">
            {mockLogs.map((log) => (
              <div key={log.id} className="p-5 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 sm:gap-6">
                
                <div className="flex-shrink-0 w-32 text-xs font-semibold text-slate-500">
                  {log.date}
                </div>
                
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    {log.action === 'Sincronización manual' ? (
                      <RefreshCw className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Edit className="w-4 h-4 text-amber-500" />
                    )}
                    {log.action}
                  </div>
                  <div className="text-sm text-slate-600">
                    {log.detail}
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg h-fit">
                  <User className="w-3.5 h-3.5" />
                  {log.user}
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}