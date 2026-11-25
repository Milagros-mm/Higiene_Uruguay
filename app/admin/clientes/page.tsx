"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, MessageCircle } from "lucide-react";
import {
  useAdminCatalog,
  AdminPageHeader,
  AdminDrawer,
  OrderStatusBadge,
  AdminCustomer,
} from "@/frontend/context/AdminCatalogContext";
import { money } from "@/frontend/utils/store";

function formatWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("54") ? digits : `549${digits.replace(/^0+/, "")}`;
  return `https://wa.me/${normalized}`;
}

export default function AdminClientesPage() {
  const { clientes, pedidos } = useAdminCatalog();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  const filteredClientes = clientes.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.telefono.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const getCustomerOrders = (clienteId: string) => pedidos.filter((p) => p.clienteId === clienteId);

  return (
    <div className="min-h-full pb-16">
      <AdminPageHeader title="Clientes" />

      <div className="px-6 sm:px-8 max-w-6xl mx-auto space-y-4">
        {/* Buscador compacto */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, teléfono o correo..."
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0f172a] outline-none"
            />
          </div>
        </div>

        {/* Tabla de clientes */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {filteredClientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-5">Nombre</th>
                    <th className="py-3 px-5">Contacto</th>
                    <th className="py-3 px-5">Pedidos</th>
                    <th className="py-3 px-5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClientes.map((cliente) => {
                    const pedidosCliente = getCustomerOrders(cliente.id);
                    return (
                      <tr
                        key={cliente.id}
                        onClick={() => setSelectedCustomer(cliente)}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-5 font-medium text-slate-900">{cliente.nombre}</td>
                        <td className="py-3.5 px-5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${cliente.telefono.replace(/\s+/g, "")}`}
                              className="text-[#0f172a] hover:underline"
                            >
                              {cliente.telefono}
                            </a>
                            <a
                              href={formatWhatsAppUrl(cliente.telefono)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-emerald-600"
                              title="Escribir por WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          <a
                            href={`mailto:${cliente.email}`}
                            className="text-xs text-slate-500 hover:text-slate-800 hover:underline block"
                          >
                            {cliente.email}
                          </a>
                        </td>
                        <td className="py-3.5 px-5 text-slate-700">
                          {pedidosCliente.length}{" "}
                          {pedidosCliente.length === 1 ? "pedido" : "pedidos"}
                        </td>
                        <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedCustomer(cliente)}
                            className="px-3 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700 hover:text-slate-900"
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-sm font-medium text-slate-900">
                No se encontraron clientes con ese criterio
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detalle del Cliente e Historial de Pedidos */}
      <AdminDrawer
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.nombre || "Detalle del cliente"}
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="space-y-2 text-sm">
              <h3 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
                Datos de contacto
              </h3>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Teléfono:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedCustomer.telefono.replace(/\s+/g, "")}`}
                    className="font-medium text-[#0f172a] hover:underline"
                  >
                    {selectedCustomer.telefono}
                  </a>
                  <a
                    href={formatWhatsAppUrl(selectedCustomer.telefono)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#06b6d4] hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Correo:</span>
                <a
                  href={`mailto:${selectedCustomer.email}`}
                  className="text-[#0f172a] hover:underline"
                >
                  {selectedCustomer.email}
                </a>
              </div>
              {selectedCustomer.direccion && (
                <div className="flex justify-between py-1 gap-4">
                  <span className="text-slate-500 shrink-0">Dirección:</span>
                  <span className="text-slate-800 text-right">{selectedCustomer.direccion}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Cliente desde:</span>
                <span className="text-slate-800">{selectedCustomer.fechaAlta}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
                Historial de pedidos
              </h3>
              {getCustomerOrders(selectedCustomer.id).length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {getCustomerOrders(selectedCustomer.id).map((ord) => (
                    <Link
                      key={ord.id}
                      href={`/admin/pedidos?pedido=${ord.id}`}
                      className="py-3 px-2 -mx-2 rounded-md hover:bg-slate-50 flex items-center justify-between gap-4 text-sm transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">Pedido #{ord.numero}</span>
                          <OrderStatusBadge status={ord.estado} />
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{ord.fecha}</div>
                      </div>
                      <div className="font-semibold text-slate-900">{money(ord.total)}</div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Este cliente todavía no registra pedidos.</p>
              )}
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}
