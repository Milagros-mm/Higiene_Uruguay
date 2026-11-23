"use client";

import React, { useState } from "react";
import { Upload, Plus } from "lucide-react";
import {
  useAdminCatalog,
  AdminPageHeader,
  AdminTabs,
  AdminToggle,
  AdminDrawer,
  AdminStoreConfig,
  AdminPanelUser,
} from "@/frontend/context/AdminCatalogContext";

type ConfigTabId = "tienda" | "envios-pagos" | "usuarios";

export default function TiendaConfigPage() {
  const { storeConfig, saveStoreConfig } = useAdminCatalog();

  const [activeTab, setActiveTab] = useState<ConfigTabId>("tienda");
  const [formData, setFormData] = useState<AdminStoreConfig>(() => storeConfig);
  const [isSaving, setIsSaving] = useState(false);

  // Modal para agregar usuario del panel
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRol, setNewUserRol] = useState<"Administrador" | "Operador">("Operador");

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBankChange = (
    index: number,
    field: "banco" | "titular" | "alias" | "cbu",
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = [...prev.cuentasBancarias];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, cuentasBancarias: updated };
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const newUser: AdminPanelUser = {
      id: `usr-${Date.now()}`,
      nombre: newUserName.trim(),
      email: newUserEmail.trim(),
      rol: newUserRol,
      activo: true,
    };
    setFormData((prev) => ({
      ...prev,
      usuariosPanel: [...prev.usuariosPanel, newUser],
    }));
    setNewUserName("");
    setNewUserEmail("");
    setUserDrawerOpen(false);
  };

  const handleToggleUserStatus = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      usuariosPanel: prev.usuariosPanel.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)),
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await saveStoreConfig(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-full pb-28">
      <AdminPageHeader
        title="Configuración"
        action={
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSaving}
            className="px-4 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        }
      />

      <div className="px-6 sm:px-8 max-w-4xl mx-auto">
        <AdminTabs
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as ConfigTabId)}
          tabs={[
            { id: "tienda", label: "Datos de la tienda" },
            { id: "envios-pagos", label: "Envíos y pagos" },
            {
              id: "usuarios",
              label: "Usuarios del panel",
              count: formData.usuariosPanel.length,
            },
          ]}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ============================================================== */}
          {/* PESTAÑA 1: DATOS DE LA TIENDA                                  */}
          {/* ============================================================== */}
          {activeTab === "tienda" && (
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
              {/* Nombre y Logo */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-slate-100">
                <div className="w-20 h-20 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  {formData.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.logoUrl}
                      alt={formData.nombre}
                      className="w-full h-full object-contain bg-white"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-slate-500">HU</span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-900">Logo de la tienda</div>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Cambiar imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nombre de la tienda
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Correo electrónico de contacto
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Teléfono visible
                  </label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    WhatsApp para recibir pedidos
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Incluí código de país y área sin espacios (ej: 5493442334343).
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Dirección del local
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Horarios de atención
                  </label>
                  <input
                    type="text"
                    value={formData.horarios}
                    onChange={(e) => setFormData({ ...formData, horarios: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="https://instagram.com/higieneuruguay"
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    placeholder="https://facebook.com/higieneuruguay"
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PESTAÑA 2: ENVÍOS Y PAGOS                                      */}
          {/* ============================================================== */}
          {activeTab === "envios-pagos" && (
            <div className="space-y-6">
              {/* Modalidades de entrega */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
                <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
                  Modalidades de entrega
                </h2>

                <AdminToggle
                  checked={formData.retiroLocalHabilitado}
                  onChange={(val) => setFormData({ ...formData, retiroLocalHabilitado: val })}
                  label="Retiro en el local"
                  description="Permite que el cliente retire su compra sin costo en 14 de Julio 14."
                />

                <div className="pt-3 border-t border-slate-100">
                  <AdminToggle
                    checked={formData.envioDomicilioHabilitado}
                    onChange={(val) => setFormData({ ...formData, envioDomicilioHabilitado: val })}
                    label="Envío a domicilio en Concepción del Uruguay"
                    description="Habilita el campo de dirección de entrega durante la compra."
                  />
                </div>

                {formData.envioDomicilioHabilitado && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Costo de envío estándar ($ ARS)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={formData.costoEnvioBase}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            costoEnvioBase: Number(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Aclaración visible sobre envíos
                      </label>
                      <input
                        type="text"
                        value={formData.aclaracionEnvio}
                        onChange={(e) =>
                          setFormData({ ...formData, aclaracionEnvio: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Medios de pago */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
                <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
                  Medios de pago
                </h2>

                <AdminToggle
                  checked={formData.pagoEfectivoHabilitado}
                  onChange={(val) => setFormData({ ...formData, pagoEfectivoHabilitado: val })}
                  label="Pago en efectivo"
                  description="Disponible al retirar en el local o al recibir el pedido."
                />

                <div className="pt-3 border-t border-slate-100">
                  <AdminToggle
                    checked={formData.pagoTransferenciaHabilitado}
                    onChange={(val) =>
                      setFormData({ ...formData, pagoTransferenciaHabilitado: val })
                    }
                    label="Transferencia bancaria"
                    description="Muestra los datos de cuenta bancaria al finalizar el pedido."
                  />
                </div>

                {formData.pagoTransferenciaHabilitado &&
                  formData.cuentasBancarias.map((cuenta, idx) => (
                    <div
                      key={cuenta.id}
                      className="p-4 rounded-md bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Banco o entidad
                        </label>
                        <input
                          type="text"
                          value={cuenta.banco}
                          onChange={(e) => handleBankChange(idx, "banco", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Titular de la cuenta
                        </label>
                        <input
                          type="text"
                          value={cuenta.titular}
                          onChange={(e) => handleBankChange(idx, "titular", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Alias
                        </label>
                        <input
                          type="text"
                          value={cuenta.alias}
                          onChange={(e) => handleBankChange(idx, "alias", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          CBU / CVU
                        </label>
                        <input
                          type="text"
                          value={cuenta.cbu}
                          onChange={(e) => handleBankChange(idx, "cbu", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm text-slate-900"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PESTAÑA 3: USUARIOS DEL PANEL                                  */}
          {/* ============================================================== */}
          {activeTab === "usuarios" && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  Personas con acceso al panel
                </h2>
                <button
                  type="button"
                  onClick={() => setUserDrawerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar usuario</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {formData.usuariosPanel.map((user) => (
                  <div key={user.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{user.nombre}</div>
                      <div className="text-xs text-slate-500">
                        {user.email} · {user.rol}
                      </div>
                    </div>
                    <AdminToggle
                      checked={user.activo}
                      onChange={() => handleToggleUserStatus(user.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barra fija inferior con Guardar cambios */}
          <div className="fixed bottom-0 left-0 lg:left-60 right-0 bg-white border-t border-slate-200 px-6 sm:px-8 py-3.5 z-30">
            <div className="max-w-4xl mx-auto flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium transition-colors disabled:opacity-60"
              >
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Drawer para agregar usuario del panel */}
      <AdminDrawer
        isOpen={userDrawerOpen}
        onClose={() => setUserDrawerOpen(false)}
        title="Agregar usuario al panel"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre y apellido *
            </label>
            <input
              type="text"
              required
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Correo electrónico *
            </label>
            <input
              type="email"
              required
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Rol</label>
            <select
              value={newUserRol}
              onChange={(e) => setNewUserRol(e.target.value as "Administrador" | "Operador")}
              className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 bg-white"
            >
              <option value="Operador">Operador (Pedidos y catálogo)</option>
              <option value="Administrador">Administrador (Acceso total)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setUserDrawerOpen(false)}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium"
            >
              Agregar
            </button>
          </div>
        </form>
      </AdminDrawer>
    </div>
  );
}
