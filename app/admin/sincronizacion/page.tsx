'use client';

import React, { useState } from 'react';
import { Button } from '@/frontend/components/ui/Button';
import { RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';

const mockLogs = [
  { id: 1, date: '2026-09-28 15:30', status: 'SUCCESS', updated: 245 },
  { id: 2, date: '2026-09-27 10:15', status: 'SUCCESS', updated: 240 },
  { id: 3, date: '2026-09-26 09:00', status: 'ERROR', updated: 0 },
];

export default function SyncPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState(mockLogs);

  const handleSync = () => {
    setIsSyncing(true);
    // Simular sincronización
    setTimeout(() => {
      setIsSyncing(false);
      setLogs([{ id: Date.now(), date: new Date().toLocaleString(), status: 'SUCCESS', updated: 250 }, ...logs]);
      alert('Precios y stock actualizados correctamente');
    }, 3000);
  };

  return (
    <div className="min-h-full pb-12 bg-slate-50/50">
      <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Actualización de precios y stock
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Mantené tu tienda al día actualizando la información de tus productos.
          </p>
        </div>
      </div>
      
      <div className="px-6 sm:px-8 max-w-5xl mx-auto space-y-8">
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-bold text-xl text-slate-800">Actualizar información ahora</h3>
            <p className="text-slate-600 mt-2 max-w-xl text-sm">
              Al confirmar, los precios y la cantidad disponible de todos tus productos se pondrán al día.
            </p>
          </div>
          
          <Button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="bg-brand-cyan hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 whitespace-nowrap"
          >
            <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Actualizando...' : 'Actualizar precios y stock ahora'}</span>
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-800">Últimas actualizaciones</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <th className="py-3 px-6">Fecha y Hora</th>
                  <th className="py-3 px-6">Estado</th>
                  <th className="py-3 px-6">Productos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {log.date}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {log.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-4 h-4" />
                          Correcta
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                          <XCircle className="w-4 h-4" />
                          Con Errores
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-700">
                      {log.updated} actualizados
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}