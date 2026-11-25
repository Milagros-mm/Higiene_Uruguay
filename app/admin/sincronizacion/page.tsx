"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAdminCatalog, AdminPageHeader } from "@/frontend/context/AdminCatalogContext";

export default function SyncPage() {
  const { productos, syncLogs, isSyncing, runSyncNow, markProductsAsSuelto, resolveDuplicateSync } =
    useAdminCatalog();

  const ultimaSync = syncLogs[0];
  const recentLogs = syncLogs.slice(0, 20);
  const sinStockValido = productos.filter((p) => !p.esSuelto && p.stockSinDato);
  const posiblesDuplicados = productos.filter((p) => Boolean(p.posibleDuplicadoSku));

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
        {/* Aviso de productos con stock nulo o negativo (D.4) */}
        {sinStockValido.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-950">
                <span className="font-semibold">
                  {sinStockValido.length === 1
                    ? `${sinStockValido[0].nombre} llegó sin stock válido: ¿es suelto?`
                    : `${sinStockValido.length} productos llegaron sin stock válido: ¿son sueltos?`}
                </span>
                <p className="text-xs text-amber-800 mt-0.5">
                  Podés marcarlos como sueltos ahora o revisarlos de a uno; esta marca no se pierde
                  en próximas sincronizaciones.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => markProductsAsSuelto(sinStockValido.map((p) => p.id))}
              className="px-3.5 py-2 rounded-md bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-medium shrink-0"
            >
              Marcar como sueltos
            </button>
          </div>
        )}

        {/* Aviso de posibles productos duplicados (D.6) */}
        {posiblesDuplicados.map((prod) => (
          <div
            key={prod.id}
            className="bg-white border border-amber-300 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="text-sm text-slate-800">
              <span className="font-semibold text-slate-900">
                Posible producto duplicado: &ldquo;{prod.nombre}&rdquo;
              </span>
              <p className="text-xs text-slate-600 mt-0.5">
                Llegó un artículo similar desde el sistema del local. ¿Es el mismo producto?
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => resolveDuplicateSync(prod.id, "vincular")}
                className="px-3 py-1.5 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-xs font-medium"
              >
                Vincular
              </button>
              <button
                type="button"
                onClick={() => resolveDuplicateSync(prod.id, "separar")}
                className="px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium"
              >
                Mantener separados
              </button>
            </div>
          </div>
        ))}

        {/* Estado actual + Cómo funciona */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Estado actual</h2>
            <span className="text-xs text-slate-500">
              Próxima actualización automática: todos los días a las 08:30 hs
            </span>
          </div>

          {ultimaSync ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-xs text-slate-500">Última actualización</div>
                <div className="font-semibold text-slate-900 mt-1">{ultimaSync.fecha}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Resultado</div>
                <div className="mt-1 flex items-center gap-1.5 font-medium text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{ultimaSync.resultado}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Productos nuevos</div>
                <div className="font-semibold text-slate-900 mt-1">{ultimaSync.nuevos}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Productos actualizados</div>
                <div className="font-semibold text-slate-900 mt-1">{ultimaSync.actualizados}</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Todavía no se realizó ninguna sincronización.</p>
          )}

          {/* Explicación desplegable y breve */}
          <details className="pt-3 border-t border-slate-100 text-xs text-slate-600">
            <summary className="cursor-pointer font-medium text-slate-800 hover:text-slate-900 select-none">
              Cómo funciona la actualización con el sistema del local
            </summary>
            <div className="mt-2.5 space-y-1.5 leading-relaxed">
              <p>1. Trae los artículos activos del local junto con código, precio y stock.</p>
              <p>2. Actualiza únicamente el precio de venta y el stock físico.</p>
              <p>3. Conserva intactos fotos, descripciones, rubros, marcas y productos sueltos.</p>
            </div>
          </details>
        </div>

        {/* Historial de las últimas 20 sincronizaciones */}
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
                  <th className="py-3 px-5 text-center">Con avisos</th>
                  <th className="py-3 px-5">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-5 font-medium text-slate-900 whitespace-nowrap">
                      {log.fecha}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {log.conAviso > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Con avisos
                        </span>
                      ) : (
                        <span className="text-slate-700 font-medium">{log.resultado}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-center text-slate-800">{log.nuevos}</td>
                    <td className="py-3.5 px-5 text-center text-slate-800">{log.actualizados}</td>
                    <td className="py-3.5 px-5 text-center">
                      {log.conAviso > 0 ? (
                        <span className="font-semibold text-amber-800">{log.conAviso}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-600 max-w-md">
                      {log.avisosProductos && log.avisosProductos.length > 0 ? (
                        <div className="space-y-1">
                          {log.avisosProductos.map((av, idx) => (
                            <div key={idx}>
                              {av.productId ? (
                                <Link
                                  href={`/admin/productos/${av.productId}`}
                                  className="font-medium text-[#0f172a] hover:underline"
                                >
                                  {av.productName}
                                </Link>
                              ) : (
                                <span className="font-medium text-slate-900">{av.productName}</span>
                              )}
                              {": "}
                              <span>{av.mensaje}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        log.detalleAviso || "Sin avisos."
                      )}
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
