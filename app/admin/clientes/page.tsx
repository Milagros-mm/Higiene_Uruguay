"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  useAdminCatalog,
  AdminPageHeader,
  AdminTabs,
  AdminDrawer,
  AdminToggle,
  AdminCustomer,
} from "@/frontend/context/AdminCatalogContext";
import { money } from "@/frontend/utils/store";

export default function AdminClientesPage() {
  const { clientes, pedidos, consultas, toggleConsultaRespondida } = useAdminCatalog();

  const [activeTab, setActiveTab] = useState<"clientes" | "consultas">("clientes");
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

  const consultasPendientes = consultas.filter((c) => !c.respondida).length;

  return (
    <div className="min-h-full pb-16">
      <AdminPageHeader title="Clientes" />

      <div className="px-6 sm:px-8 max-w-6xl mx-auto">
        <AdminTabs
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as "clientes" | "consultas")}
          tabs={[
            { id: "clientes", label: "Clientes", count: clientes.length },
            { id: "consultas", label: "Consultas", count: consultasPendientes || consultas.length },
          ]}
        />

        {/* PESTAÑA 1: CLIENTES */}
        {activeTab === "clientes" && (
          <div className="space-y-4">
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
                            <td className="py-3.5 px-5 font-medium text-slate-900">
                              {cliente.nombre}
                            </td>
                            <td className="py-3.5 px-5">
                              <div className="text-slate-800">{cliente.telefono}</div>
                              <div className="text-xs text-slate-500">{cliente.email}</div>
                            </td>
                            <td className="py-3.5 px-5 text-slate-700">
                              {pedidosCliente.length}{" "}
                              {pedidosCliente.length === 1 ? "pedido" : "pedidos"}
                            </td>
                            <td
                              className="py-3.5 px-5 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
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
        )}

        {/* PESTAÑA 2: CONSULTAS */}
        {activeTab === "consultas" && (
          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-200">
            {consultas.length > 0 ? (
              consultas.map((consulta) => (
                <div key={consulta.id} className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-slate-900">{consulta.clienteNombre}</span>
                      <span className="text-xs text-slate-500">({consulta.contacto})</span>
                      {!consulta.respondida && (
                        <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          Pendiente
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{consulta.fecha}</span>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-900">{consulta.asunto}</div>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {consulta.mensaje}
                    </p>
                  </div>

                  <div className="pt-2">
                    <AdminToggle
                      checked={consulta.respondida}
                      onChange={() => toggleConsultaRespondida(consulta.id)}
                      label="Marcar como respondida"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-sm text-slate-500">
                No hay consultas de clientes registradas.
              </div>
            )}
          </div>
        )}
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
                <span className="font-medium text-slate-900">{selectedCustomer.telefono}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Correo:</span>
                <span className="text-slate-800">{selectedCustomer.email}</span>
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
                    <div
                      key={ord.id}
                      className="py-3 flex items-center justify-between gap-4 text-sm"
                    >
                      <div>
                        <div className="font-medium text-slate-900">Pedido #{ord.numero}</div>
                        <div className="text-xs text-slate-500">
                          {ord.fecha} · {ord.estado}
                        </div>
                      </div>
                      <div className="font-semibold text-slate-900">{money(ord.total)}</div>
                    </div>
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
