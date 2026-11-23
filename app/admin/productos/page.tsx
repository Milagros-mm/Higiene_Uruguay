"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Package, Plus, Upload, X } from "lucide-react";
import {
  useAdminCatalog,
  AdminPageHeader,
  AdminTabs,
  AdminDrawer,
  AdminToggle,
  StatusBadge,
  ConfirmDeleteModal,
  AdminRubro,
  AdminSubrubro,
  AdminMarca,
  AdminDiscount,
} from "@/frontend/context/AdminCatalogContext";
import {
  money,
  StorePromotionConfig,
  getStoredPromotionConfig,
  saveStoredPromotionConfig,
} from "@/frontend/utils/store";

type ProductTabId = "productos" | "rubros" | "marcas" | "descuentos";

function ProductosCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ProductTabId) || "productos";

  const {
    productos,
    rubros,
    subrubros,
    marcas,
    descuentos,
    saveRubro,
    deleteRubro,
    saveSubrubro,
    deleteSubrubro,
    saveMarca,
    deleteMarca,
    saveDescuento,
    deleteDescuento,
    showToast,
  } = useAdminCatalog();

  const [activeTab, setActiveTab] = useState<ProductTabId>(initialTab);

  // --- Estado Pestaña 1: Productos ---
  const [productQuery, setProductQuery] = useState("");
  const [productRubroFilter, setProductRubroFilter] = useState("TODOS");

  // --- Estado Pestaña 2: Rubros y Subrubros ---
  const [rubroDrawerOpen, setRubroDrawerOpen] = useState(false);
  const [editingRubro, setEditingRubro] = useState<AdminRubro | null>(null);
  const [rubroNombre, setRubroNombre] = useState("");
  const [rubroActivo, setRubroActivo] = useState(true);
  const [savingRubro, setSavingRubro] = useState(false);
  const [confirmDeleteRubro, setConfirmDeleteRubro] = useState(false);

  const [subrubroDrawerOpen, setSubrubroDrawerOpen] = useState(false);
  const [editingSubrubro, setEditingSubrubro] = useState<AdminSubrubro | null>(null);
  const [subrubroRubroId, setSubrubroRubroId] = useState("");
  const [subrubroNombre, setSubrubroNombre] = useState("");
  const [subrubroActivo, setSubrubroActivo] = useState(true);
  const [savingSubrubro, setSavingSubrubro] = useState(false);
  const [confirmDeleteSubrubro, setConfirmDeleteSubrubro] = useState(false);

  // --- Estado Pestaña 3: Marcas ---
  const [marcaDrawerOpen, setMarcaDrawerOpen] = useState(false);
  const [editingMarca, setEditingMarca] = useState<AdminMarca | null>(null);
  const [marcaNombre, setMarcaNombre] = useState("");
  const [marcaLogoUrl, setMarcaLogoUrl] = useState("");
  const [savingMarca, setSavingMarca] = useState(false);
  const [confirmDeleteMarca, setConfirmDeleteMarca] = useState(false);

  // --- Estado Pestaña 4: Descuentos + Promoción Carrito ---
  const [promoConfig, setPromoConfig] = useState<StorePromotionConfig>(() =>
    getStoredPromotionConfig(),
  );
  const [savingPromo, setSavingPromo] = useState(false);

  const [descuentoDrawerOpen, setDescuentoDrawerOpen] = useState(false);
  const [editingDescuento, setEditingDescuento] = useState<AdminDiscount | null>(null);
  const [descNombre, setDescNombre] = useState("");
  const [descAplicaA, setDescAplicaA] = useState<"PRODUCTO" | "RUBRO">("RUBRO");
  const [descTargetId, setDescTargetId] = useState("");
  const [descTipo, setDescTipo] = useState<"PORCENTAJE" | "PRECIO_FIJO">("PORCENTAJE");
  const [descValor, setDescValor] = useState<number>(10);
  const [descInicio, setDescInicio] = useState("2026-11-01");
  const [descFin, setDescFin] = useState("2026-12-31");
  const [descActivo, setDescActivo] = useState(true);
  const [savingDescuento, setSavingDescuento] = useState(false);
  const [confirmDeleteDescuento, setConfirmDeleteDescuento] = useState(false);

  // ==========================================================================
  // Handlers de Rubros y Subrubros
  // ==========================================================================
  const openCreateRubro = () => {
    setEditingRubro(null);
    setRubroNombre("");
    setRubroActivo(true);
    setRubroDrawerOpen(true);
  };

  const openEditRubro = (r: AdminRubro) => {
    setEditingRubro(r);
    setRubroNombre(r.nombre);
    setRubroActivo(r.activo);
    setRubroDrawerOpen(true);
  };

  const handleSaveRubroForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rubroNombre.trim()) return;
    setSavingRubro(true);
    try {
      await saveRubro({
        id: editingRubro?.id,
        nombre: rubroNombre,
        orden: editingRubro?.orden || rubros.length + 1,
        activo: rubroActivo,
      });
      setRubroDrawerOpen(false);
    } finally {
      setSavingRubro(false);
    }
  };

  const openCreateSubrubro = (defaultRubroId?: string) => {
    setEditingSubrubro(null);
    setSubrubroRubroId(defaultRubroId || rubros[0]?.id || "");
    setSubrubroNombre("");
    setSubrubroActivo(true);
    setSubrubroDrawerOpen(true);
  };

  const openEditSubrubro = (s: AdminSubrubro) => {
    setEditingSubrubro(s);
    setSubrubroRubroId(s.rubroId);
    setSubrubroNombre(s.nombre);
    setSubrubroActivo(s.activo);
    setSubrubroDrawerOpen(true);
  };

  const handleSaveSubrubroForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subrubroNombre.trim() || !subrubroRubroId) return;
    setSavingSubrubro(true);
    try {
      await saveSubrubro({
        id: editingSubrubro?.id,
        rubroId: subrubroRubroId,
        nombre: subrubroNombre,
        orden: editingSubrubro?.orden || subrubros.length + 1,
        activo: subrubroActivo,
      });
      setSubrubroDrawerOpen(false);
    } finally {
      setSavingSubrubro(false);
    }
  };

  // ==========================================================================
  // Handlers de Marcas
  // ==========================================================================
  const openCreateMarca = () => {
    setEditingMarca(null);
    setMarcaNombre("");
    setMarcaLogoUrl("");
    setMarcaDrawerOpen(true);
  };

  const openEditMarca = (m: AdminMarca) => {
    setEditingMarca(m);
    setMarcaNombre(m.nombre);
    setMarcaLogoUrl(m.logoUrl || "");
    setMarcaDrawerOpen(true);
  };

  const handleMarcaLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setMarcaLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMarcaForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marcaNombre.trim()) return;
    setSavingMarca(true);
    try {
      await saveMarca({
        id: editingMarca?.id,
        nombre: marcaNombre,
        logoUrl: marcaLogoUrl,
        activo: true,
      });
      setMarcaDrawerOpen(false);
    } finally {
      setSavingMarca(false);
    }
  };

  // ==========================================================================
  // Handlers de Descuentos y Promoción del Carrito
  // ==========================================================================
  const openCreateDescuento = () => {
    setEditingDescuento(null);
    setDescNombre("");
    setDescAplicaA("RUBRO");
    setDescTargetId(rubros[0]?.id || "");
    setDescTipo("PORCENTAJE");
    setDescValor(10);
    setDescInicio("2026-11-01");
    setDescFin("2026-12-31");
    setDescActivo(true);
    setDescuentoDrawerOpen(true);
  };

  const openEditDescuento = (d: AdminDiscount) => {
    setEditingDescuento(d);
    setDescNombre(d.nombre);
    setDescAplicaA(d.aplicaA);
    setDescTargetId(d.targetId);
    setDescTipo(d.tipo);
    setDescValor(d.valor);
    setDescInicio(d.fechaInicio);
    setDescFin(d.fechaFin);
    setDescActivo(d.activo);
    setDescuentoDrawerOpen(true);
  };

  const handleSaveDescuentoForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descNombre.trim() || !descTargetId) return;
    setSavingDescuento(true);
    try {
      await saveDescuento({
        id: editingDescuento?.id,
        nombre: descNombre.trim(),
        aplicaA: descAplicaA,
        targetId: descTargetId,
        tipo: descTipo,
        valor: Number(descValor) || 0,
        fechaInicio: descInicio,
        fechaFin: descFin,
        activo: descActivo,
      });
      setDescuentoDrawerOpen(false);
    } finally {
      setSavingDescuento(false);
    }
  };

  const handleSaveCartPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPromo(true);
    saveStoredPromotionConfig(promoConfig);
    setTimeout(() => {
      setSavingPromo(false);
      showToast("Promoción del carrito actualizada");
    }, 300);
  };

  // ==========================================================================
  // Filtrado de Productos y Utilidades
  // ==========================================================================
  const filteredProducts = productos.filter((p) => {
    const q = productQuery.toLowerCase().trim();
    const matchesSearch =
      !q || p.nombre.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const matchesRubro = productRubroFilter === "TODOS" || p.rubroId === productRubroFilter;
    return matchesSearch && matchesRubro;
  });

  const getRubroName = (id: string) => rubros.find((r) => r.id === id)?.nombre || "Sin rubro";

  const countProductsByRubro = (rubroId: string) =>
    productos.filter((p) => p.rubroId === rubroId).length;

  const countProductsBySubrubro = (subId: string) =>
    productos.filter((p) => p.subrubroId === subId).length;

  // Botón principal contextual de la pantalla
  const headerAction = () => {
    if (activeTab === "productos") {
      return (
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo producto</span>
        </Link>
      );
    }
    if (activeTab === "rubros") {
      return (
        <button
          type="button"
          onClick={openCreateRubro}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo rubro</span>
        </button>
      );
    }
    if (activeTab === "marcas") {
      return (
        <button
          type="button"
          onClick={openCreateMarca}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva marca</span>
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={openCreateDescuento}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Nuevo descuento</span>
      </button>
    );
  };

  return (
    <div className="min-h-full pb-16">
      <AdminPageHeader title="Productos" action={headerAction()} />

      <div className="px-6 sm:px-8 max-w-6xl mx-auto">
        <AdminTabs
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as ProductTabId)}
          tabs={[
            { id: "productos", label: "Productos", count: productos.length },
            { id: "rubros", label: "Rubros y subrubros", count: rubros.length },
            { id: "marcas", label: "Marcas", count: marcas.length },
            { id: "descuentos", label: "Descuentos", count: descuentos.length },
          ]}
        />

        {/* ================================================================ */}
        {/* PESTAÑA 1: PRODUCTOS                                             */}
        {/* ================================================================ */}
        {activeTab === "productos" && (
          <div className="space-y-4">
            {/* Buscador y filtro por rubro */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Buscar por nombre o código..."
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0f172a] outline-none"
                />
              </div>

              <select
                value={productRubroFilter}
                onChange={(e) => setProductRubroFilter(e.target.value)}
                aria-label="Filtrar por rubro"
                className="px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:border-[#0f172a] outline-none"
              >
                <option value="TODOS">Todos los rubros</option>
                {rubros.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabla de productos */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              {filteredProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                        <th className="py-3 px-4 w-16">Foto</th>
                        <th className="py-3 px-4">Producto</th>
                        <th className="py-3 px-4">Rubro</th>
                        <th className="py-3 px-4">Precio</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((prod) => {
                        const sinStock = !prod.esSuelto && prod.controlarStock && prod.stock <= 0;

                        return (
                          <tr
                            key={prod.id}
                            onClick={() => router.push(`/admin/productos/${prod.id}`)}
                            className="hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="w-11 h-11 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
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
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900">{prod.nombre}</span>
                                <StatusBadge active={prod.activo} />
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                Código: {prod.sku}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {prod.rubroId ? (
                                <span className="text-slate-700">{getRubroName(prod.rubroId)}</span>
                              ) : (
                                <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                  Sin rubro
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {prod.precioOferta ? (
                                <div>
                                  <span className="font-semibold text-slate-900">
                                    {money(prod.precioOferta)}
                                  </span>
                                  <span className="text-xs text-slate-400 line-through ml-1.5">
                                    {money(prod.precioSistema)}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-medium text-slate-900">
                                  {money(prod.precioSistema)}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {prod.esSuelto ? (
                                <span className="text-xs text-slate-600">Venta suelta</span>
                              ) : sinStock ? (
                                <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                  Sin stock
                                </span>
                              ) : (
                                <span className="text-slate-800">{prod.stock}</span>
                              )}
                            </td>
                            <td
                              className="py-3 px-4 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link
                                href={`/admin/productos/${prod.id}`}
                                className="px-3 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700 hover:text-slate-900"
                              >
                                Editar
                              </Link>
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
                    No se encontraron productos con esa búsqueda
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Probá buscando con otro nombre o código.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* PESTAÑA 2: RUBROS Y SUBRUBROS                                    */}
        {/* ================================================================ */}
        {activeTab === "rubros" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-200">
              {rubros.map((rubro) => {
                const hijos = subrubros.filter((s) => s.rubroId === rubro.id);
                const cantProd = countProductsByRubro(rubro.id);

                return (
                  <div key={rubro.id} className="p-5 space-y-3">
                    {/* Fila del Rubro */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-base font-semibold text-slate-900">
                          {rubro.nombre}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({cantProd} {cantProd === 1 ? "producto" : "productos"})
                        </span>
                        <StatusBadge active={rubro.activo} />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openCreateSubrubro(rubro.id)}
                          className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          + Agregar subrubro
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditRubro(rubro)}
                          className="px-3 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700 hover:text-slate-900"
                        >
                          Editar
                        </button>
                      </div>
                    </div>

                    {/* Lista de Subrubros hijos */}
                    {hijos.length > 0 && (
                      <div className="pl-4 border-l-2 border-slate-200 divide-y divide-slate-100">
                        {hijos.map((sub) => {
                          const cantSub = countProductsBySubrubro(sub.id);
                          return (
                            <div
                              key={sub.id}
                              onClick={() => openEditSubrubro(sub)}
                              className="py-2 px-3 rounded-md hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-sm text-slate-800">{sub.nombre}</span>
                                <span className="text-xs text-slate-500">
                                  ({cantSub} {cantSub === 1 ? "producto" : "productos"})
                                </span>
                                <StatusBadge active={sub.activo} />
                              </div>
                              <span className="text-xs font-medium text-slate-600 hover:text-slate-900">
                                Editar
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* PESTAÑA 3: MARCAS                                                */}
        {/* ================================================================ */}
        {activeTab === "marcas" && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-5 w-16">Logo</th>
                  <th className="py-3 px-5">Marca</th>
                  <th className="py-3 px-5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marcas.map((marca) => (
                  <tr
                    key={marca.id}
                    onClick={() => openEditMarca(marca)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-5">
                      <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {marca.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={marca.logoUrl}
                            alt={marca.nombre}
                            className="w-full h-full object-contain bg-white"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-slate-600">
                            {marca.nombre.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-5 font-medium text-slate-900">{marca.nombre}</td>
                    <td className="py-3 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => openEditMarca(marca)}
                        className="px-3 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700 hover:text-slate-900"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================================================================ */}
        {/* PESTAÑA 4: DESCUENTOS (POR PRODUCTO/RUBRO + PROMO DEL CARRITO)   */}
        {/* ================================================================ */}
        {activeTab === "descuentos" && (
          <div className="space-y-8">
            {/* Listado de descuentos por producto o rubro */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200">
                <h2 className="text-base font-semibold text-slate-900">
                  Descuentos por producto o rubro
                </h2>
              </div>

              {descuentos.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                        <th className="py-3 px-5">Nombre</th>
                        <th className="py-3 px-5">Aplica a</th>
                        <th className="py-3 px-5">Beneficio</th>
                        <th className="py-3 px-5">Vigencia</th>
                        <th className="py-3 px-5 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {descuentos.map((desc) => {
                        const targetLabel =
                          desc.aplicaA === "RUBRO"
                            ? `Rubro: ${getRubroName(desc.targetId)}`
                            : `Producto: ${
                                productos.find((p) => p.id === desc.targetId)?.nombre || "Producto"
                              }`;

                        return (
                          <tr
                            key={desc.id}
                            onClick={() => openEditDescuento(desc)}
                            className="hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900">{desc.nombre}</span>
                                <StatusBadge active={desc.activo} />
                              </div>
                            </td>
                            <td className="py-3.5 px-5 text-slate-700">{targetLabel}</td>
                            <td className="py-3.5 px-5 font-semibold text-slate-900">
                              {desc.tipo === "PORCENTAJE"
                                ? `${desc.valor}% de descuento`
                                : `Precio final ${money(desc.valor)}`}
                            </td>
                            <td className="py-3.5 px-5 text-xs text-slate-500">
                              {desc.fechaInicio} al {desc.fechaFin}
                            </td>
                            <td
                              className="py-3.5 px-5 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => openEditDescuento(desc)}
                                className="px-3 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700 hover:text-slate-900"
                              >
                                Editar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-slate-500">
                  No hay descuentos por producto o rubro configurados.
                </div>
              )}
            </div>

            {/* Promoción automática por monto del carrito (con vista previa conservada) */}
            <form
              onSubmit={handleSaveCartPromo}
              className="bg-white rounded-lg border border-slate-200 p-6 space-y-5"
            >
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-900">
                  Promoción por monto del carrito
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  El cliente ve una barra de progreso en su carrito y recibe el descuento al superar
                  el monto configurado.
                </p>
              </div>

              <AdminToggle
                checked={promoConfig.isActive}
                onChange={(checked) => setPromoConfig({ ...promoConfig, isActive: checked })}
                label="Activar promoción en el carrito"
                description="Muestra el progreso en el carrito lateral y descuenta el porcentaje automáticamente."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Monto mínimo a alcanzar ($ ARS)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={promoConfig.thresholdAmount}
                    onChange={(e) =>
                      setPromoConfig({
                        ...promoConfig,
                        thresholdAmount: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    El cliente debe sumar {money(promoConfig.thresholdAmount)} para obtener el
                    beneficio.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Porcentaje de descuento (%)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={promoConfig.discountPercent}
                    onChange={(e) =>
                      setPromoConfig({
                        ...promoConfig,
                        discountPercent: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Porcentaje que se restará del total del pedido.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Título corto del beneficio
                  </label>
                  <input
                    type="text"
                    value={promoConfig.benefitTitle}
                    onChange={(e) =>
                      setPromoConfig({ ...promoConfig, benefitTitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Mensaje en el banner superior
                  </label>
                  <input
                    type="text"
                    value={promoConfig.bannerText}
                    onChange={(e) => setPromoConfig({ ...promoConfig, bannerText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                  />
                </div>
              </div>

              {/* Vista previa en el carrito */}
              <div className="p-4 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-slate-900">Vista previa en el carrito:</div>
                <p>
                  Si un cliente agrega productos por $15.000, verá:{" "}
                  <strong className="text-slate-900">
                    &ldquo;Te faltan {money(Math.max(0, promoConfig.thresholdAmount - 15000))} para{" "}
                    {promoConfig.discountPercent}% OFF&rdquo;
                  </strong>
                  . Al superar {money(promoConfig.thresholdAmount)}, se aplicará el{" "}
                  {promoConfig.discountPercent}% de descuento automático.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingPromo}
                  className="px-4 py-2 rounded-md bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-medium transition-colors"
                >
                  {savingPromo ? "Guardando..." : "Guardar promoción del carrito"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* DRAWER: CREAR / EDITAR RUBRO                                         */}
      {/* ==================================================================== */}
      <AdminDrawer
        isOpen={rubroDrawerOpen}
        onClose={() => setRubroDrawerOpen(false)}
        title={editingRubro ? "Editar rubro" : "Nuevo rubro"}
      >
        <form onSubmit={handleSaveRubroForm} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre del rubro *
            </label>
            <input
              type="text"
              required
              value={rubroNombre}
              onChange={(e) => setRubroNombre(e.target.value)}
              placeholder="Ej: Limpieza y Químicos"
              className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
            />
          </div>

          <AdminToggle
            checked={rubroActivo}
            onChange={setRubroActivo}
            label="Visible en la tienda"
            description="Si lo desactivás, el rubro no se muestra en el menú público."
          />

          {editingRubro && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Eliminar rubro del catálogo</span>
              <button
                type="button"
                onClick={() => setConfirmDeleteRubro(true)}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Eliminar rubro
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setRubroDrawerOpen(false)}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={savingRubro}
              className="px-4 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium"
            >
              {savingRubro ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmDeleteModal
        isOpen={confirmDeleteRubro}
        onClose={() => setConfirmDeleteRubro(false)}
        onConfirm={async () => {
          if (!editingRubro) return;
          await deleteRubro(editingRubro.id);
          setConfirmDeleteRubro(false);
          setRubroDrawerOpen(false);
        }}
        title="Eliminar rubro"
        itemName={editingRubro?.nombre || ""}
        warningText="También se quitarán sus subrubros asociados. Si solo querés ocultarlo temporalmente, desactivá su visibilidad."
      />

      {/* ==================================================================== */}
      {/* DRAWER: CREAR / EDITAR SUBRUBRO                                      */}
      {/* ==================================================================== */}
      <AdminDrawer
        isOpen={subrubroDrawerOpen}
        onClose={() => setSubrubroDrawerOpen(false)}
        title={editingSubrubro ? "Editar subrubro" : "Nuevo subrubro"}
      >
        <form onSubmit={handleSaveSubrubroForm} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Rubro principal *
            </label>
            <select
              required
              value={subrubroRubroId}
              onChange={(e) => setSubrubroRubroId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 bg-white focus:border-[#0f172a] outline-none"
            >
              {rubros.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre del subrubro *
            </label>
            <input
              type="text"
              required
              value={subrubroNombre}
              onChange={(e) => setSubrubroNombre(e.target.value)}
              placeholder="Ej: Desengrasantes"
              className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
            />
          </div>

          <AdminToggle
            checked={subrubroActivo}
            onChange={setSubrubroActivo}
            label="Visible en la tienda"
          />

          {editingSubrubro && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Eliminar subrubro</span>
              <button
                type="button"
                onClick={() => setConfirmDeleteSubrubro(true)}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Eliminar subrubro
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSubrubroDrawerOpen(false)}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={savingSubrubro}
              className="px-4 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium"
            >
              {savingSubrubro ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmDeleteModal
        isOpen={confirmDeleteSubrubro}
        onClose={() => setConfirmDeleteSubrubro(false)}
        onConfirm={async () => {
          if (!editingSubrubro) return;
          await deleteSubrubro(editingSubrubro.id);
          setConfirmDeleteSubrubro(false);
          setSubrubroDrawerOpen(false);
        }}
        title="Eliminar subrubro"
        itemName={editingSubrubro?.nombre || ""}
      />

      {/* ==================================================================== */}
      {/* DRAWER: CREAR / EDITAR MARCA                                         */}
      {/* ==================================================================== */}
      <AdminDrawer
        isOpen={marcaDrawerOpen}
        onClose={() => setMarcaDrawerOpen(false)}
        title={editingMarca ? "Editar marca" : "Nueva marca"}
      >
        <form onSubmit={handleSaveMarcaForm} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre de la marca *
            </label>
            <input
              type="text"
              required
              value={marcaNombre}
              onChange={(e) => setMarcaNombre(e.target.value)}
              placeholder="Ej: Higiene Uruguay"
              className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Logo (opcional)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                {marcaLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={marcaLogoUrl}
                    alt="Vista previa"
                    className="w-full h-full object-contain bg-white"
                  />
                ) : (
                  <span className="text-xs font-semibold text-slate-500">
                    {(marcaNombre || "MA").slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMarcaLogoFile}
                    className="hidden"
                  />
                </label>
                {marcaLogoUrl && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setMarcaLogoUrl("")}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline"
                    >
                      <X className="w-3 h-3" />
                      <span>Quitar logo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {editingMarca && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Eliminar marca</span>
              <button
                type="button"
                onClick={() => setConfirmDeleteMarca(true)}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Eliminar marca
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setMarcaDrawerOpen(false)}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={savingMarca}
              className="px-4 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium"
            >
              {savingMarca ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmDeleteModal
        isOpen={confirmDeleteMarca}
        onClose={() => setConfirmDeleteMarca(false)}
        onConfirm={async () => {
          if (!editingMarca) return;
          await deleteMarca(editingMarca.id);
          setConfirmDeleteMarca(false);
          setMarcaDrawerOpen(false);
        }}
        title="Eliminar marca"
        itemName={editingMarca?.nombre || ""}
      />

      {/* ==================================================================== */}
      {/* DRAWER: CREAR / EDITAR DESCUENTO                                     */}
      {/* ==================================================================== */}
      <AdminDrawer
        isOpen={descuentoDrawerOpen}
        onClose={() => setDescuentoDrawerOpen(false)}
        title={editingDescuento ? "Editar descuento" : "Nuevo descuento"}
      >
        <form onSubmit={handleSaveDescuentoForm} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre del descuento *
            </label>
            <input
              type="text"
              required
              value={descNombre}
              onChange={(e) => setDescNombre(e.target.value)}
              placeholder="Ej: Descuento en Piscinas"
              className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Aplicar sobre
              </label>
              <select
                value={descAplicaA}
                onChange={(e) => {
                  const val = e.target.value as "PRODUCTO" | "RUBRO";
                  setDescAplicaA(val);
                  setDescTargetId(val === "RUBRO" ? rubros[0]?.id || "" : productos[0]?.id || "");
                }}
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 bg-white"
              >
                <option value="RUBRO">Un rubro completo</option>
                <option value="PRODUCTO">Un producto específico</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {descAplicaA === "RUBRO" ? "Rubro" : "Producto"}
              </label>
              <select
                value={descTargetId}
                onChange={(e) => setDescTargetId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 bg-white"
              >
                {descAplicaA === "RUBRO"
                  ? rubros.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre}
                      </option>
                    ))
                  : productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tipo de beneficio
              </label>
              <select
                value={descTipo}
                onChange={(e) => setDescTipo(e.target.value as "PORCENTAJE" | "PRECIO_FIJO")}
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 bg-white"
              >
                <option value="PORCENTAJE">Porcentaje (%)</option>
                <option value="PRECIO_FIJO">Precio fijo ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {descTipo === "PORCENTAJE" ? "Porcentaje (%)" : "Precio final ($)"}
              </label>
              <input
                type="number"
                min={1}
                required
                value={descValor}
                onChange={(e) => setDescValor(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Fecha de inicio
              </label>
              <input
                type="date"
                value={descInicio}
                onChange={(e) => setDescInicio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Fecha de fin
              </label>
              <input
                type="date"
                value={descFin}
                onChange={(e) => setDescFin(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900"
              />
            </div>
          </div>

          <AdminToggle checked={descActivo} onChange={setDescActivo} label="Descuento activo" />

          {editingDescuento && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Eliminar descuento</span>
              <button
                type="button"
                onClick={() => setConfirmDeleteDescuento(true)}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Eliminar descuento
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setDescuentoDrawerOpen(false)}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={savingDescuento}
              className="px-4 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium"
            >
              {savingDescuento ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmDeleteModal
        isOpen={confirmDeleteDescuento}
        onClose={() => setConfirmDeleteDescuento(false)}
        onConfirm={async () => {
          if (!editingDescuento) return;
          await deleteDescuento(editingDescuento.id);
          setConfirmDeleteDescuento(false);
          setDescuentoDrawerOpen(false);
        }}
        title="Eliminar descuento"
        itemName={editingDescuento?.nombre || ""}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Cargando productos...</div>}>
      <ProductosCatalogContent />
    </Suspense>
  );
}
