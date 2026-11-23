"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RefreshCw, AlertCircle, Package } from "lucide-react";
import { useAdminCatalog, AdminPageHeader } from "@/frontend/context/AdminCatalogContext";
import { money } from "@/frontend/utils/store";

export default function AdminDashboardPage() {
  const { productos, pedidos, syncLogs, isSyncing, runSyncNow } = useAdminCatalog();
  const [periodoDias, setPeriodoDias] = useState<7 | 30 | 90>(30);

  // Filtrar pedidos según el período elegido
  const pedidosPeriodo = pedidos.filter(
    (p) => p.diasAtras <= periodoDias && p.estado !== "Cancelado",
  );
  const pedidosNuevos = pedidos.filter((p) => p.estado === "Nuevo").length;
  const ventasPeriodo = pedidosPeriodo.reduce((acc, p) => acc + p.total, 0);

  const productosActivos = productos.filter((p) => p.activo).length;
  const productosSinStock = productos.filter((p) => p.activo && p.controlarStock && p.stock <= 0);
  const productosStockBajo = productos.filter(
    (p) => p.activo && p.controlarStock && p.stock > 0 && p.stock <= 5,
  );
  const productosSinFoto = productos.filter((p) => !p.imagenes || p.imagenes.length === 0);
  const productosSinPrecio = productos.filter((p) => !p.precioSistema || p.precioSistema <= 0);
  const productosSinRubro = productos.filter((p) => !p.rubroId);

  // Factor proporcional simple para que el ranking refleje el período de 7, 30 o 90 días
  const factorPeriodo = periodoDias === 7 ? 0.3 : periodoDias === 30 ? 1 : 2.6;

  const masVendidos = [...productos].sort((a, b) => b.ventas30d - a.ventas30d).slice(0, 6);

  const masConsultados = [...productos].sort((a, b) => b.consultas30d - a.consultas30d).slice(0, 6);

  const ultimaSync = syncLogs[0];

  const alertas = [
    productosSinStock.length > 0 && {
      id: "sin-stock",
      texto: `${productosSinStock.length} ${
        productosSinStock.length === 1 ? "producto sin stock" : "productos sin stock"
      }`,
      detalle: productosSinStock
        .map((p) => p.nombre)
        .slice(0, 2)
        .join(", "),
      href: "/admin/productos",
      critica: true,
    },
    productosStockBajo.length > 0 && {
      id: "stock-bajo",
      texto: `${productosStockBajo.length} ${
        productosStockBajo.length === 1
          ? "producto con stock bajo (5 o menos)"
          : "productos con stock bajo (5 o menos)"
      }`,
      detalle: productosStockBajo
        .map((p) => `${p.nombre} (${p.stock})`)
        .slice(0, 2)
        .join(", "),
      href: "/admin/productos",
      critica: false,
    },
    productosSinFoto.length > 0 && {
      id: "sin-foto",
      texto: `${productosSinFoto.length} ${
        productosSinFoto.length === 1 ? "producto sin foto" : "productos sin foto"
      }`,
      detalle: productosSinFoto
        .map((p) => p.nombre)
        .slice(0, 2)
        .join(", "),
      href: "/admin/productos",
      critica: false,
    },
    productosSinRubro.length > 0 && {
      id: "sin-rubro",
      texto: `${productosSinRubro.length} ${
        productosSinRubro.length === 1
          ? "producto sin rubro asignado"
          : "productos sin rubro asignado"
      }`,
      detalle: productosSinRubro
        .map((p) => p.nombre)
        .slice(0, 2)
        .join(", "),
      href: "/admin/productos",
      critica: false,
    },
    productosSinPrecio.length > 0 && {
      id: "sin-precio",
      texto: `${productosSinPrecio.length} ${
        productosSinPrecio.length === 1 ? "producto sin precio" : "productos sin precio"
      }`,
      detalle: productosSinPrecio
        .map((p) => p.nombre)
        .slice(0, 2)
        .join(", "),
      href: "/admin/productos",
      critica: true,
    },
  ].filter(Boolean) as {
    id: string;
    texto: string;
    detalle: string;
    href: string;
    critica: boolean;
  }[];

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
            <div className="text-sm text-slate-600">Pedidos nuevos</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-semibold text-[#0f172a]">{pedidosNuevos}</span>
              {pedidosNuevos > 0 && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  Para preparar
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

        {/* Estado de última sincronización + Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alertas simples que requieren atención */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Avisos del catálogo</h2>

            {alertas.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {alertas.map((alerta) => (
                  <div
                    key={alerta.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <AlertCircle
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          alerta.critica ? "text-red-600" : "text-amber-600"
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900">{alerta.texto}</div>
                        {alerta.detalle && (
                          <div className="text-xs text-slate-500 truncate mt-0.5">
                            {alerta.detalle}
                          </div>
                        )}
                      </div>
                    </div>
                    <Link
                      href={alerta.href}
                      className="text-xs font-medium text-[#0f172a] hover:underline shrink-0"
                    >
                      Revisar
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No hay alertas pendientes. Todos los productos activos tienen foto, precio y rubro.
              </p>
            )}
          </div>

          {/* Estado de la última sincronización */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Última sincronización</h2>
              {ultimaSync ? (
                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Fecha y hora:</span>
                    <span className="font-medium text-slate-900">{ultimaSync.fecha}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Resultado:</span>
                    <span className="font-medium text-emerald-700">{ultimaSync.resultado}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Productos al día:</span>
                    <span className="font-medium text-slate-900">
                      {ultimaSync.actualizados + ultimaSync.nuevos}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 mt-2">
                  Todavía no se registró ninguna sincronización.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={runSyncNow}
              disabled={isSyncing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Sincronizando..." : "Sincronizar ahora"}</span>
            </button>
          </div>
        </div>

        {/* Productos más vendidos y Productos más consultados */}
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
                      <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {prod.imagenes[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={prod.imagenes[0]}
                            alt={prod.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
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

          {/* Más consultados o más vistos */}
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
                      <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {prod.imagenes[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={prod.imagenes[0]}
                            alt={prod.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {prod.nombre}
                        </div>
                        <div className="mt-1.5 w-full max-w-44 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0f172a] h-full rounded-full"
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
