"use client";

import React from "react";
import { RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAdminCatalog, AdminPageHeader } from "@/frontend/context/AdminCatalogContext";

export default function SyncPage() {
  const { syncLogs, isSyncing, runSyncNow } = useAdminCatalog();
  const ultimaSync = syncLogs[0];

  return (
    <div className="min-h-full pb-16">
      <AdminPageHeader
        title="Sincronización"
        action={
          <button
            type="button"
            onClick={runSyncNow}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Sincronizando..." : "Sincronizar ahora"}</span>
          </button>
        }
      />

      <div className="px-6 sm:px-8 max-w-6xl mx-auto space-y-6">
        {/* Estado actual y cómo funciona la sincronización */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estado actual */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
              Estado actual
            </h2>

            {ultimaSync ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Última actualización:</span>
                  <span className="font-semibold text-slate-900">{ultimaSync.fecha}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Resultado:</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {ultimaSync.resultado}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Productos nuevos incorporados:</span>
                  <span className="font-medium text-slate-900">{ultimaSync.nuevos}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Precios y stock actualizados:</span>
                  <span className="font-medium text-slate-900">{ultimaSync.actualizados}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Todavía no se realizó ninguna sincronización.
              </p>
            )}
          </div>

          {/* Explicación clara de qué datos trae y qué campos pisa */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
              Cómo funciona la actualización con el sistema del local
            </h2>

            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <div>
                <span className="font-semibold text-slate-900">Qué información trae:</span>{" "}
                incorpora los artículos de venta activos del sistema de facturación del local junto
                con su código, precio de venta al público y cantidad física disponible.
              </div>
              <div>
                <span className="font-semibold text-slate-900">Qué datos actualiza:</span> pone al
                día únicamente el <strong>precio de venta</strong> y el{" "}
                <strong>stock físico</strong> de cada producto.
              </div>
              <div>
                <span className="font-semibold text-slate-900">Qué datos conserva intactos:</span>{" "}
                nunca modifica las fotos, descripciones, rubros, subrubros, marcas, precios
                promocionales ni la configuración de venta suelta que hayas cargado en este panel.
              </div>
            </div>
          </div>
        </div>

        {/* Historial de sincronizaciones */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-base font-semibold text-slate-900">
              Historial de sincronizaciones
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-5">Fecha y hora</th>
                  <th className="py-3 px-5">Resultado</th>
                  <th className="py-3 px-5 text-center">Nuevos</th>
                  <th className="py-3 px-5 text-center">Actualizados</th>
                  <th className="py-3 px-5 text-center">Con error</th>
                  <th className="py-3 px-5">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-5 font-medium text-slate-900 whitespace-nowrap">
                      {log.fecha}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {log.conError > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {log.resultado}
                        </span>
                      ) : (
                        <span className="text-slate-700 font-medium">{log.resultado}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-center text-slate-800">{log.nuevos}</td>
                    <td className="py-3.5 px-5 text-center text-slate-800">{log.actualizados}</td>
                    <td className="py-3.5 px-5 text-center">
                      {log.conError > 0 ? (
                        <span className="font-semibold text-amber-800">{log.conError}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-600 max-w-md">
                      {log.detalleError || "Sin observaciones."}
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
