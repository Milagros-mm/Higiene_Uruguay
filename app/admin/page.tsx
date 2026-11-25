"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RefreshCw, AlertCircle } from "lucide-react";
import {
  useAdminCatalog,
  AdminPageHeader,
  ProductThumbnail,
} from "@/frontend/context/AdminCatalogContext";
import { money } from "@/frontend/utils/store";

export default function AdminDashboardPage() {
  const { productos, pedidos, syncLogs, isSyncing, runSyncNow } = useAdminCatalog();
  const [periodoDias, setPeriodoDias] = useState<7 | 30 | 90>(30);

  const pedidosPeriodo = pedidos.filter(
    (p) => p.diasAtras <= periodoDias && p.estado !== "Cancelado",
  );
  const pedidosPendientes = pedidos.filter((p) => p.estado === "Pendiente").length;
  const ventasPeriodo = pedidosPeriodo.reduce((acc, p) => acc + p.total, 0);

  const productosActivos = productos.filter((p) => p.activo).length;
  // C.6: Los productos sueltos no cuentan en "Productos sin stock"
  const productosSinStock = productos.filter((p) => p.activo && !p.esSuelto && p.stock <= 0);

  // C.1 y C.6: Agrupar avisos por producto (sin stock / stock bajo solo en no-sueltos)
  const avisosPorProducto = productos
    .map((prod) => {
      const problemas: string[] = [];
      let critica = false;

      if (!prod.precioSistema || prod.precioSistema <= 0) {
        problemas.push("sin precio");
        critica = true;
      }
      if (!prod.esSuelto && prod.stock <= 0) {
        problemas.push("sin stock");
        critica = true;
      } else if (!prod.esSuelto && prod.stock > 0 && prod.stock <= 5) {
        problemas.push(`stock bajo (${prod.stock})`);
      }
      if (!prod.imagenes || prod.imagenes.length === 0) {
        problemas.push("sin foto");
      }
      if (!prod.rubroId) {
        problemas.push("sin rubro");
      }

      if (problemas.length === 0) return null;

      return {
        productId: prod.id,
        productName: prod.nombre,
        descripcion: problemas.join(" y "),
        critica,
      };
    })
    .filter(Boolean) as {
    productId: string;
    productName: string;
    descripcion: string;
    critica: boolean;
  }[];

  const factorPeriodo = periodoDias === 7 ? 0.3 : periodoDias === 30 ? 1 : 2.6;

  const masVendidos = [...productos].sort((a, b) => b.ventas30d - a.ventas30d).slice(0, 6);

  const masConsultados = [...productos].sort((a, b) => b.consultas30d - a.consultas30d).slice(0, 6);

  const ultimaSync = syncLogs[0];

  return (
    <div className="min-h-full pb-12">
      <AdminPageHeader
        title="Inicio"
        action={
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-md border border-slate-200">
            {([7, 30, 90] as const).map((dias) => (
              <button
                key={dias}
                type="button"
                onClick={() => setPeriodoDias(dias)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  periodoDias === dias
                    ? "bg-white text-[#0f172a] font-semibold border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {dias} días
              </button>
            ))}
          </div>
        }
      />

      <div className="px-6 sm:px-8 max-w-6xl mx-auto space-y-6">
        {/* 4 Tarjetas de Resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/pedidos"
            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <div className="text-sm text-slate-600">Pedidos pendientes</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-semibold text-[#0f172a]">{pedidosPendientes}</span>
              {pedidosPendientes > 0 && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  Por revisar
                </span>
              )}
            </div>
          </Link>

          <Link
            href="/admin/pedidos"
            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <div className="text-sm text-slate-600">Ventas ({periodoDias} días)</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-semibold text-[#0f172a]">{money(ventasPeriodo)}</span>
              <span className="text-xs text-slate-500">
                {pedidosPeriodo.length} {pedidosPeriodo.length === 1 ? "pedido" : "pedidos"}
              </span>
            </div>
          </Link>

          <Link
            href="/admin/productos"
            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <div className="text-sm text-slate-600">Productos activos</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-semibold text-[#0f172a]">{productosActivos}</span>
              <span className="text-xs text-slate-500">de {productos.length} en catálogo</span>
            </div>
          </Link>

          <Link
            href="/admin/productos"
            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <div className="text-sm text-slate-600">Productos sin stock</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-semibold text-[#0f172a]">
                {productosSinStock.length}
              </span>
              {productosSinStock.length > 0 && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
                  Revisar
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Avisos del catálogo + Tarjeta compacta de última sincronización */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Avisos agrupados por producto */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Avisos del catálogo</h2>

            {avisosPorProducto.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {avisosPorProducto.slice(0, 6).map((aviso) => (
                  <div
                    key={aviso.productId}
                    className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AlertCircle
                        className={`w-4 h-4 shrink-0 ${
                          aviso.critica ? "text-red-600" : "text-amber-600"
                        }`}
                      />
                      <div className="text-sm text-slate-800 truncate">
                        <span className="font-medium text-slate-900">{aviso.productName}:</span>{" "}
                        <span className="text-slate-600">{aviso.descripcion}</span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/productos/${aviso.productId}`}
                      className="text-xs font-medium text-[#0f172a] hover:underline shrink-0"
                    >
                      Revisar
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No hay alertas pendientes. Todos los productos están completos.
              </p>
            )}
          </div>

          {/* Tarjeta compacta de Última sincronización */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Última sincronización</h2>
              {ultimaSync && (
                <span
                  className={`text-xs font-medium ${
                    ultimaSync.conAviso > 0 ? "text-amber-700" : "text-emerald-700"
                  }`}
                >
                  {ultimaSync.resultado}
                </span>
              )}
            </div>

            {ultimaSync ? (
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Fecha y hora:</span>
                  <span className="font-medium text-slate-900">{ultimaSync.fecha}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Productos actualizados:</span>
                  <span className="font-medium text-slate-900">
                    {ultimaSync.actualizados + ultimaSync.nuevos}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Sin registros todavía.</p>
            )}

            <button
              type="button"
              onClick={runSyncNow}
              disabled={isSyncing}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-xs font-medium transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Sincronizando..." : "Sincronizar ahora"}</span>
            </button>
          </div>
        </div>

        {/* Productos más vendidos y Productos más vistos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Más vendidos */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Productos más vendidos</h2>
              <span className="text-xs text-slate-500">Últimos {periodoDias} días</span>
            </div>

            <div className="divide-y divide-slate-100">
              {masVendidos.map((prod) => {
                const cantidad = Math.max(1, Math.round(prod.ventas30d * factorPeriodo));
                return (
                  <Link
                    key={prod.id}
                    href={`/admin/productos/${prod.id}`}
                    className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ProductThumbnail src={prod.imagenes[0]} alt={prod.nombre} size="sm" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {prod.nombre}
                        </div>
                        <div className="text-xs text-slate-500">{money(prod.precioSistema)}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 shrink-0">
                      {cantidad} {cantidad === 1 ? "unidad" : "unidades"}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Más vistos y consultados */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Productos más vistos y consultados
              </h2>
              <span className="text-xs text-slate-500">Últimos {periodoDias} días</span>
            </div>

            <div className="divide-y divide-slate-100">
              {masConsultados.map((prod) => {
                const vistas = Math.max(1, Math.round(prod.consultas30d * factorPeriodo));
                const maxVistas = Math.max(
                  1,
                  Math.round((masConsultados[0]?.consultas30d || 1) * factorPeriodo),
                );
                const porcentaje = Math.round((vistas / maxVistas) * 100);

                return (
                  <Link
                    key={prod.id}
                    href={`/admin/productos/${prod.id}`}
                    className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <ProductThumbnail src={prod.imagenes[0]} alt={prod.nombre} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {prod.nombre}
                        </div>
                        <div className="mt-1.5 w-full max-w-44 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#06b6d4] h-full rounded-full"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 shrink-0">
                      {vistas} visitas
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
