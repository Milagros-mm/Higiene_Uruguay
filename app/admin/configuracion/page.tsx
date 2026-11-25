"use client";

import React, { useState } from "react";
import { Upload, Plus } from "lucide-react";
import {
  useAdminCatalog,
  AdminPageHeader,
  AdminTabs,
  AdminToggle,
  AdminDrawer,
  AutoResizeTextarea,
  ConfirmDeleteModal,
  AdminStoreConfig,
  AdminPanelUser,
} from "@/frontend/context/AdminCatalogContext";
import { money } from "@/frontend/utils/store";

type ConfigTabId = "tienda" | "envios-pagos" | "usuarios";

// Formatea número local argentino quitando 549 para mostrarlo limpio al usuario
function toLocalWhatsAppInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("549")) return digits.slice(3);
  if (digits.startsWith("54")) return digits.slice(2);
  return digits;
}

function toFullWhatsAppDigits(localInput: string): string {
  const clean = localInput.replace(/\D/g, "").replace(/^0+/, "");
  if (!clean) return "";
  return clean.startsWith("549") ? clean : `549${clean}`;
}

export default function TiendaConfigPage() {
  const { storeConfig, saveStoreConfig, showToast } = useAdminCatalog();

  const [activeTab, setActiveTab] = useState<ConfigTabId>("tienda");
  const [formData, setFormData] = useState<AdminStoreConfig>(() => storeConfig);
  const [whatsappLocal, setWhatsappLocal] = useState<string>(() =>
    toLocalWhatsAppInput(storeConfig.whatsapp),
  );
  const [whatsappError, setWhatsappError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Gestión de usuarios del panel (G.6)
  const currentUserId = formData.usuariosPanel[0]?.id;
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminPanelUser | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRol, setUserRol] = useState<"Administrador" | "Operador">("Operador");
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(false);

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

  const handleWhatsappChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    setWhatsappLocal(digitsOnly);
    if (digitsOnly.length < 8) {
      setWhatsappError("Ingresá un número válido con código de área (ej: 3442334343).");
    } else {
      setWhatsappError("");
    }
    setFormData((prev) => ({ ...prev, whatsapp: toFullWhatsAppDigits(digitsOnly) }));
  };

  const handleTogglePaymentMethod = (id: string, habilitado: boolean) => {
    setFormData((prev) => ({
      ...prev,
      mediosPago: prev.mediosPago.map((m) => (m.id === id ? { ...m, habilitado } : m)),
    }));
  };

  const openCreateUser = () => {
    setEditingUser(null);
    setUserName("");
    setUserEmail("");
    setUserRol("Operador");
    setUserDrawerOpen(true);
  };

  const openEditUser = (user: AdminPanelUser) => {
    setEditingUser(user);
    setUserName(user.nombre);
    setUserEmail(user.email);
    setUserRol(user.rol);
    setUserDrawerOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    if (editingUser) {
      setFormData((prev) => ({
        ...prev,
        usuariosPanel: prev.usuariosPanel.map((u) =>
          u.id === editingUser.id
            ? { ...u, nombre: userName.trim(), email: userEmail.trim(), rol: userRol }
            : u,
        ),
      }));
      showToast("Usuario actualizado");
    } else {
      const newUser: AdminPanelUser = {
        id: `usr-${Date.now()}`,
        nombre: userName.trim(),
        email: userEmail.trim(),
        rol: userRol,
        activo: true,
      };
      setFormData((prev) => ({
        ...prev,
        usuariosPanel: [...prev.usuariosPanel, newUser],
      }));
      showToast("Usuario agregado. Se enviará un correo con su enlace de acceso.");
    }
    setUserDrawerOpen(false);
  };

  const activeAdminsCount = formData.usuariosPanel.filter(
    (u) => u.rol === "Administrador" && u.activo,
  ).length;

  const canDeactivateOrDeleteUser = (user: AdminPanelUser) => {
    if (user.id === currentUserId) return false;
    if (user.rol === "Administrador" && user.activo && activeAdminsCount <= 1) return false;
    return true;
  };

  const handleToggleUserStatus = (user: AdminPanelUser) => {
    if (user.activo && !canDeactivateOrDeleteUser(user)) {
      showToast("No podés desactivar tu propia cuenta ni al último administrador.", "warning");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      usuariosPanel: prev.usuariosPanel.map((u) =>
        u.id === user.id ? { ...u, activo: !u.activo } : u,
      ),
    }));
  };

  const handleDeleteUser = () => {
    if (!editingUser) return;
    if (!canDeactivateOrDeleteUser(editingUser)) {
      showToast("No podés eliminar tu propia cuenta ni al último administrador.", "warning");
      setConfirmDeleteUser(false);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      usuariosPanel: prev.usuariosPanel.filter((u) => u.id !== editingUser.id),
    }));
    setConfirmDeleteUser(false);
    setUserDrawerOpen(false);
    showToast("Usuario eliminado");
  };

  const handleResetPassword = (user: AdminPanelUser) => {
    showToast(`Se envió un enlace para restablecer la clave a ${user.email}`, "info");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (whatsappLocal.length < 8) {
      setWhatsappError("Ingresá un número válido de WhatsApp para recibir los pedidos.");
      setActiveTab("tienda");
      return;
    }
    setIsSaving(true);
    try {
      await saveStoreConfig(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-full pb-28">
      <AdminPageHeader title="Configuración" />

      <div className="px-6 sm:px-8 max-w-4xl mx-auto">
        <AdminTabs
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as ConfigTabId)}
          tabs={[
            { id: "tienda", label: "Datos de la tienda" },
            { id: "envios-pagos", label: "Envíos y pagos" },
            { id: "usuarios", label: "Usuarios del panel" },
          ]}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ============================================================== */}
          {/* PESTAÑA 1: DATOS DE LA TIENDA                                  */}
          {/* ============================================================== */}
          {activeTab === "tienda" && (
            <div className="space-y-6">
              {/* Destacado: WhatsApp para recibir pedidos (G.2) */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-3">
                <label className="block text-sm font-semibold text-slate-900">
                  WhatsApp para recibir los pedidos *
                </label>
                <div className="flex items-stretch max-w-md">
                  <span className="inline-flex items-center px-3.5 rounded-l-md border border-r-0 border-slate-300 bg-slate-100 text-sm font-medium text-slate-600 select-none">
                    +54 9
                  </span>
                  <input
                    type="tel"
                    value={whatsappLocal}
                    onChange={(e) => handleWhatsappChange(e.target.value)}
                    placeholder="3442334343"
                    className="flex-1 px-3.5 py-2 rounded-r-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                </div>
                {whatsappError ? (
                  <p className="text-xs text-red-600">{whatsappError}</p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Ingresá código de área sin el 0 y el número sin el 15 (ej: 3442334343). Aquí
                    llegan los pedidos de los clientes.
                  </p>
                )}
              </div>

              {/* Datos generales del local */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="w-20 h-20 rounded-md bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 p-1">
                    {formData.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.logoUrl}
                        alt={formData.nombre}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-slate-500">HU</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-900">Logo de la tienda</div>
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer">
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
                    <AutoResizeTextarea
                      rows={2}
                      value={formData.horarios}
                      onChange={(e) => setFormData({ ...formData, horarios: e.target.value })}
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
            </div>
          )}

          {/* ============================================================== */}
          {/* PESTAÑA 2: ENVÍOS Y PAGOS (G.3, G.4, G.5)                      */}
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
                  description={`Retiro sin costo en ${formData.direccion || "el local"}.`}
                />

                <div className="pt-3 border-t border-slate-100">
                  <AdminToggle
                    checked={formData.envioDomicilioHabilitado}
                    onChange={(val) => setFormData({ ...formData, envioDomicilioHabilitado: val })}
                    label="Envío a domicilio"
                    description="Habilita el campo de dirección durante el pedido."
                  />
                </div>

                {formData.envioDomicilioHabilitado && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                          Envío gratis desde ($ ARS)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={500}
                          value={formData.envioGratisDesde}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              envioGratisDesde: Number(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                        />
                      </div>
                    </div>

                    {formData.envioGratisDesde > 0 && (
                      <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        Mensaje automático en la tienda:{" "}
                        <strong className="text-slate-900">
                          &ldquo;Envío gratis en compras desde {money(formData.envioGratisDesde)}
                          &rdquo;
                        </strong>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Medios de pago informativos (G.5: sin datos bancarios ni CBU) */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-base font-semibold text-slate-900">
                    Medios de pago aceptados
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Se muestran en la tienda solo como información. El pago se coordina por
                    WhatsApp.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {formData.mediosPago.map((medio) => (
                    <div key={medio.id} className="py-3 first:pt-0 last:pb-0">
                      <AdminToggle
                        checked={medio.habilitado}
                        onChange={(val) => handleTogglePaymentMethod(medio.id, val)}
                        label={medio.nombre}
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Aclaración opcional para el cliente
                  </label>
                  <AutoResizeTextarea
                    rows={2}
                    value={formData.aclaracionPago}
                    onChange={(e) => setFormData({ ...formData, aclaracionPago: e.target.value })}
                    placeholder="Ej: Los datos de pago se envían por WhatsApp al confirmar el pedido."
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PESTAÑA 3: USUARIOS DEL PANEL (G.6)                            */}
          {/* ============================================================== */}
          {activeTab === "usuarios" && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  Personas con acceso al panel
                </h2>
                <button
                  type="button"
                  onClick={openCreateUser}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar usuario</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {formData.usuariosPanel.map((user) => {
                  const isCurrent = user.id === currentUserId;
                  return (
                    <div
                      key={user.id}
                      className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">{user.nombre}</span>
                          {isCurrent && (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                              Tu cuenta
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {user.email} · {user.rol}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600">
                            {user.activo ? "Activo" : "Inactivo"}
                          </span>
                          <AdminToggle
                            checked={user.activo}
                            onChange={() => handleToggleUserStatus(user)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => openEditUser(user)}
                          className="px-3 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Barra fija inferior única con Guardar cambios */}
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

      {/* Drawer para agregar o editar usuario del panel */}
      <AdminDrawer
        isOpen={userDrawerOpen}
        onClose={() => setUserDrawerOpen(false)}
        title={editingUser ? "Editar usuario" : "Agregar usuario al panel"}
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          {!editingUser && (
            <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md p-3">
              La persona recibirá un correo electrónico con un enlace para crear su contraseña e
              ingresar al panel.
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre y apellido *
            </label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Rol</label>
            <select
              value={userRol}
              onChange={(e) => setUserRol(e.target.value as "Administrador" | "Operador")}
              className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 bg-white"
            >
              <option value="Operador">Operador (Pedidos y catálogo)</option>
              <option value="Administrador">Administrador (Acceso total)</option>
            </select>
          </div>

          {editingUser && (
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleResetPassword(editingUser)}
                className="px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                Restablecer contraseña
              </button>

              {canDeactivateOrDeleteUser(editingUser) && (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteUser(true)}
                  className="px-3 py-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium"
                >
                  Eliminar usuario
                </button>
              )}
            </div>
          )}

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
              {editingUser ? "Guardar" : "Agregar"}
            </button>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmDeleteModal
        isOpen={confirmDeleteUser}
        onClose={() => setConfirmDeleteUser(false)}
        onConfirm={handleDeleteUser}
        title="Eliminar usuario"
        itemName={editingUser?.nombre || ""}
      />
    </div>
  );
}
