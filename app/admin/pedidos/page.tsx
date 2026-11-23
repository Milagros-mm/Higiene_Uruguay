"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  useAdminCatalog,
  AdminPageHeader,
  AdminDrawer,
  AdminOrder,
  OrderStatus,
} from "@/frontend/context/AdminCatalogContext";
import { money } from "@/frontend/utils/store";

const ESTADOS_PEDIDO: OrderStatus[] = ["Nuevo", "En preparación", "Entregado", "Cancelado"];

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  if (status === "Nuevo") {
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
        Nuevo
      </span>
    );
  }
  if (status === "En preparación") {
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
        En preparación
      </span>
    );
  }
  if (status === "Cancelado") {
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        Cancelado
      </span>
    );
  }
  return <span className="text-xs font-medium text-slate-600">Entregado</span>;
}

export default function AdminPedidosPage() {
  const { pedidos, updatePedidoStatus } = useAdminCatalog();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"TODOS" | OrderStatus>("TODOS");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder: AdminOrder | undefined = pedidos.find((o) => o.id === selectedOrderId);

  const filteredPedidos = pedidos.filter((pedido) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      pedido.numero.toLowerCase().includes(q) ||
      pedido.clienteNombre.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "TODOS" || pedido.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-full pb-16">
      <AdminPageHeader title="Pedidos" />

      <div className="px-6 sm:px-8 max-w-6xl mx-auto space-y-4">
        {/* Buscador y filtro por estado */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por número o cliente..."
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0f172a] outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "TODOS" | OrderStatus)}
            aria-label="Filtrar por estado"
            className="px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:border-[#0f172a] outline-none"
          >
            <option value="TODOS">Todos los estados</option>
            {ESTADOS_PEDIDO.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        {/* Tabla de pedidos */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {filteredPedidos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-5">Número</th>
                    <th className="py-3 px-5">Fecha</th>
                    <th className="py-3 px-5">Cliente</th>
                    <th className="py-3 px-5">Total</th>
                    <th className="py-3 px-5">Estado</th>
                    <th className="py-3 px-5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPedidos.map((pedido) => (
                    <tr
                      key={pedido.id}
                      onClick={() => setSelectedOrderId(pedido.id)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-slate-900">#{pedido.numero}</td>
                      <td className="py-3.5 px-5 text-slate-600">{pedido.fecha}</td>
                      <td className="py-3.5 px-5">
                        <div className="font-medium text-slate-900">{pedido.clienteNombre}</div>
                        <div className="text-xs text-slate-500">{pedido.modalidadEntrega}</div>
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        {money(pedido.total)}
                      </td>
                      <td className="py-3.5 px-5">
                        <OrderStatusBadge status={pedido.estado} />
                      </td>
                      <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedOrderId(pedido.id)}
                          className="px-3 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700 hover:text-slate-900"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-sm font-medium text-slate-900">
                No hay pedidos que coincidan con la búsqueda
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Probá cambiando el filtro de estado o el nombre del cliente.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detalle del pedido */}
      <AdminDrawer
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrderId(null)}
        title={selectedOrder ? `Pedido #${selectedOrder.numero}` : "Detalle de pedido"}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Cambio de estado con un solo selector */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Estado del pedido
              </label>
              <select
                value={selectedOrder.estado}
                onChange={(e) =>
                  updatePedidoStatus(selectedOrder.id, e.target.value as OrderStatus)
                }
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:border-[#0f172a] outline-none"
              >
                {ESTADOS_PEDIDO.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            {/* Datos de contacto y entrega */}
            <div className="space-y-2 text-sm">
              <h3 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
                Datos de contacto y entrega
              </h3>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Cliente:</span>
                <span className="font-medium text-slate-900">{selectedOrder.clienteNombre}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Teléfono:</span>
                <span className="font-medium text-slate-900">{selectedOrder.clienteTelefono}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Fecha:</span>
                <span className="text-slate-800">{selectedOrder.fecha}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Entrega:</span>
                <span className="font-medium text-slate-900">{selectedOrder.modalidadEntrega}</span>
              </div>
              {selectedOrder.direccionEntrega && (
                <div className="flex justify-between py-1 gap-4">
                  <span className="text-slate-500 shrink-0">Dirección:</span>
                  <span className="text-slate-800 text-right">
                    {selectedOrder.direccionEntrega}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Medio de pago:</span>
                <span className="text-slate-800">{selectedOrder.metodoPago}</span>
              </div>
              {selectedOrder.notas && (
                <div className="pt-2">
                  <span className="text-xs text-slate-500 block mb-1">Notas del cliente:</span>
                  <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    {selectedOrder.notas}
                  </div>
                </div>
              )}
            </div>

            {/* Productos del pedido */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
                Productos
              </h3>
              <div className="divide-y divide-slate-100">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-sm">
                    <div>
                      <div className="font-medium text-slate-900">
                        {item.cantidad}x {item.nombre}
                      </div>
                      {item.presentacion && (
                        <div className="text-xs text-slate-500">{item.presentacion}</div>
                      )}
                    </div>
                    <div className="font-medium text-slate-900 shrink-0">
                      {money(item.cantidad * item.precioUnitario)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>{money(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}
