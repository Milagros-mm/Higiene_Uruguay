"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Printer, MessageCircle, Trash2 } from "lucide-react";
import {
  useAdminCatalog,
  AdminPageHeader,
  AdminDrawer,
  OrderStatusBadge,
  AutoResizeTextarea,
  AdminOrder,
  AdminOrderItem,
  OrderStatus,
  PaymentStatus,
} from "@/frontend/context/AdminCatalogContext";
import { money } from "@/frontend/utils/store";

const ESTADOS_PEDIDO: OrderStatus[] = [
  "Pendiente",
  "Confirmado",
  "En preparación",
  "Listo para retirar o enviar",
  "Entregado",
  "Cancelado",
];

function formatWhatsAppLink(phone: string, text?: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("54") ? digits : `549${digits.replace(/^0+/, "")}`;
  return text
    ? `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${normalized}`;
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  return status === "Confirmado" ? (
    <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      Pago confirmado
    </span>
  ) : (
    <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      Pago pendiente
    </span>
  );
}

function PedidosContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("pedido");

  const { pedidos, updatePedidoStatus, updatePedidoPagoStatus, updatePedidoAdjustment } =
    useAdminCatalog();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"TODOS" | OrderStatus>("TODOS");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(initialOrderId);

  // Confirmación antes de cancelar un pedido
  const [pendingCancelOrderId, setPendingCancelOrderId] = useState<string | null>(null);

  // Modo edición simple para registrar reemplazos/ajustes acordados por WhatsApp
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [draftItems, setDraftItems] = useState<AdminOrderItem[]>([]);
  const [draftNote, setDraftNote] = useState("");

  const selectedOrder: AdminOrder | undefined = pedidos.find((o) => o.id === selectedOrderId);

  const openOrderDrawer = (order: AdminOrder) => {
    setSelectedOrderId(order.id);
    setIsEditingOrder(false);
  };

  const startEditAdjustment = (order: AdminOrder) => {
    setDraftItems(order.items.map((item) => ({ ...item })));
    setDraftNote(order.notaAjusteInterno || "");
    setIsEditingOrder(true);
  };

  const handleSaveAdjustment = (orderId: string) => {
    const validItems = draftItems.filter((item) => item.cantidad > 0);
    updatePedidoAdjustment(orderId, validItems, draftNote.trim());
    setIsEditingOrder(false);
  };

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    if (nextStatus === "Cancelado") {
      setPendingCancelOrderId(orderId);
      return;
    }
    updatePedidoStatus(orderId, nextStatus);
  };

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
                    <th className="py-3 px-4">Número</th>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Pago</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPedidos.map((pedido) => (
                    <tr
                      key={pedido.id}
                      onClick={() => openOrderDrawer(pedido)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900">#{pedido.numero}</td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {pedido.fecha}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{pedido.clienteNombre}</div>
                        <div className="text-xs text-slate-500">{pedido.modalidadEntrega}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {money(pedido.total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <OrderStatusBadge status={pedido.estado} />
                      </td>
                      <td className="py-3.5 px-4">
                        <PaymentBadge status={pedido.pagoEstado} />
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => openOrderDrawer(pedido)}
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

      {/* Detalle completo del pedido */}
      <AdminDrawer
        isOpen={Boolean(selectedOrder)}
        onClose={() => {
          setSelectedOrderId(null);
          setIsEditingOrder(false);
        }}
        title={selectedOrder ? `Pedido #${selectedOrder.numero}` : "Detalle de pedido"}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Acciones rápidas: Imprimir y Escribir al cliente por WhatsApp */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={formatWhatsAppLink(
                  selectedOrder.clienteTelefono,
                  `Hola ${selectedOrder.clienteNombre}, te escribimos de Higiene Uruguay por tu pedido #${selectedOrder.numero}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-xs font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Escribir al cliente por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>
            </div>

            {/* Estado del pedido y Estado de pago independientes */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Estado del pedido</label>
                  <OrderStatusBadge status={selectedOrder.estado} />
                </div>
                <select
                  value={selectedOrder.estado}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
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

              <div className="pt-3 border-t border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Estado del pago</label>
                  <PaymentBadge status={selectedOrder.pagoEstado} />
                </div>
                <select
                  value={selectedOrder.pagoEstado}
                  onChange={(e) =>
                    updatePedidoPagoStatus(selectedOrder.id, e.target.value as PaymentStatus)
                  }
                  className="w-full px-3.5 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:border-[#0f172a] outline-none"
                >
                  <option value="Pendiente">Pendiente (a confirmar)</option>
                  <option value="Confirmado">Confirmado</option>
                </select>
              </div>
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
                <a
                  href={`tel:${selectedOrder.clienteTelefono.replace(/\s+/g, "")}`}
                  className="font-medium text-[#0f172a] hover:underline"
                >
                  {selectedOrder.clienteTelefono}
                </a>
              </div>
              {selectedOrder.clienteEmail && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Correo:</span>
                  <a
                    href={`mailto:${selectedOrder.clienteEmail}`}
                    className="text-[#0f172a] hover:underline"
                  >
                    {selectedOrder.clienteEmail}
                  </a>
                </div>
              )}
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
                <span className="text-slate-500">Medio de pago informado:</span>
                <span className="text-slate-800">{selectedOrder.metodoPago}</span>
              </div>
              {selectedOrder.preferenciaSuelto && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Si falta un suelto:</span>
                  <span className="font-medium text-amber-800">
                    {selectedOrder.preferenciaSuelto}
                  </span>
                </div>
              )}
              {selectedOrder.notas && (
                <div className="pt-2">
                  <span className="text-xs text-slate-500 block mb-1">Notas del cliente:</span>
                  <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    {selectedOrder.notas}
                  </div>
                </div>
              )}
            </div>

            {/* Productos, descuentos y ajustes por reemplazo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Productos</h3>
                {!isEditingOrder && (
                  <button
                    type="button"
                    onClick={() => startEditAdjustment(selectedOrder)}
                    className="text-xs font-medium text-[#0f172a] hover:underline"
                  >
                    Registrar reemplazo o ajuste
                  </button>
                )}
              </div>

              {!isEditingOrder ? (
                <div className="divide-y divide-slate-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-2.5 flex items-start justify-between gap-4 text-sm"
                    >
                      <div>
                        <div className="font-medium text-slate-900">
                          {item.cantidad}x {item.nombre}
                        </div>
                        {item.presentacion && (
                          <div className="text-xs text-slate-500">{item.presentacion}</div>
                        )}
                        {item.esSuelto && (
                          <div className="text-xs font-medium text-amber-800 mt-0.5">
                            Suelto: confirmar disponibilidad
                          </div>
                        )}
                        {item.descuentoAplicado && item.descuentoAplicado > 0 ? (
                          <div className="text-xs text-emerald-700 mt-0.5">
                            Descuento aplicado: -{money(item.descuentoAplicado)}
                          </div>
                        ) : null}
                      </div>
                      <div className="font-medium text-slate-900 shrink-0">
                        {money(item.cantidad * item.precioUnitario)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 p-3 rounded-md bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-600">
                    Ajustá cantidades o quitá ítems acordados con el cliente por WhatsApp. No
                    modifica el stock del sistema.
                  </p>
                  <div className="space-y-2">
                    {draftItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 bg-white p-2 rounded border border-slate-200 text-xs"
                      >
                        <span className="font-medium text-slate-800 flex-1 truncate">
                          {item.nombre}
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={item.cantidad}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value) || 0);
                            setDraftItems((prev) =>
                              prev.map((it, i) => (i === idx ? { ...it, cantidad: val } : it)),
                            );
                          }}
                          className="w-16 px-2 py-1 rounded border border-slate-300 text-center"
                        />
                        <button
                          type="button"
                          onClick={() => setDraftItems((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Quitar ítem"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nota interna del ajuste
                    </label>
                    <AutoResizeTextarea
                      rows={2}
                      value={draftNote}
                      onChange={(e) => setDraftNote(e.target.value)}
                      placeholder="Ej: Se reemplazó cloro suelto por bidón cerrado 5L"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingOrder(false)}
                      className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-xs font-medium text-slate-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveAdjustment(selectedOrder.id)}
                      className="px-3 py-1.5 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-xs font-medium"
                    >
                      Guardar ajuste
                    </button>
                  </div>
                </div>
              )}

              {selectedOrder.notaAjusteInterno && !isEditingOrder && (
                <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Nota del ajuste:</span>{" "}
                  {selectedOrder.notaAjusteInterno}
                </div>
              )}

              {/* Totales y descuentos detallados */}
              <div className="pt-3 border-t border-slate-200 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{money(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.descuentoProductos > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Descuentos por producto/rubro</span>
                    <span>-{money(selectedOrder.descuentoProductos)}</span>
                  </div>
                )}
                {selectedOrder.descuentoCarrito > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Promoción por monto del carrito</span>
                    <span>-{money(selectedOrder.descuentoCarrito)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span>{money(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* Confirmación antes de cancelar un pedido */}
      {pendingCancelOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setPendingCancelOrderId(null)}
            className="fixed inset-0 bg-slate-950/40"
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-lg border border-slate-200 max-w-md w-full p-6 z-10">
            <h3 className="text-lg font-semibold text-slate-900">Cancelar pedido</h3>
            <p className="text-sm text-slate-600 mt-2">
              ¿Seguro que querés marcar este pedido como cancelado?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingCancelOrderId(null)}
                className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm font-medium"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => {
                  updatePedidoStatus(pendingCancelOrderId, "Cancelado");
                  setPendingCancelOrderId(null);
                }}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
              >
                Confirmar cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPedidosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Cargando pedidos...</div>}>
      <PedidosContent />
    </Suspense>
  );
}
