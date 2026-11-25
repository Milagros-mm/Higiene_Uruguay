"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useAdminCatalog,
  AdminProduct,
  AdminToggle,
  ConfirmDeleteModal,
  AutoResizeTextarea,
  getProductActiveDiscount,
} from "@/frontend/context/AdminCatalogContext";
import { money } from "@/frontend/utils/store";

interface ProductFormProps {
  initialProduct?: AdminProduct;
  isNew?: boolean;
}

export function ProductForm({ initialProduct, isNew = false }: ProductFormProps) {
  const router = useRouter();
  const { rubros, subrubros, marcas, descuentos, saveProducto, deleteProducto } = useAdminCatalog();

  const sincronizado = initialProduct ? initialProduct.sincronizado : false;

  // 1. Datos básicos
  const [barcode, setBarcode] = useState(initialProduct?.barcode || "");
  const [nombre, setNombre] = useState(initialProduct?.nombre || "");
  const [presentacion, setPresentacion] = useState(initialProduct?.presentacion || "");
  const [descripcion, setDescripcion] = useState(initialProduct?.descripcion || "");
  const [modoDeUso, setModoDeUso] = useState(initialProduct?.modoDeUso || "");
  const [superficiesAptas, setSuperficiesAptas] = useState(initialProduct?.superficiesAptas || "");
  const [advertencias, setAdvertencias] = useState(initialProduct?.advertencias || "");

  // 2. Fotos
  const [imagenes, setImagenes] = useState<string[]>(initialProduct?.imagenes || []);
  const [nuevaImagenUrl, setNuevaImagenUrl] = useState("");

  // 3. Precio y stock (D.11: vacíos por defecto en un producto nuevo)
  const [precioInput, setPrecioInput] = useState<string>(
    initialProduct && initialProduct.precioSistema > 0 ? String(initialProduct.precioSistema) : "",
  );
  const [stockInput, setStockInput] = useState<string>(
    initialProduct && !initialProduct.esSuelto && !initialProduct.stockSinDato
      ? String(initialProduct.stock)
      : "",
  );
  const [esSuelto, setEsSuelto] = useState<boolean>(initialProduct?.esSuelto ?? false);

  // 4. Rubro y marca
  const [rubroId, setRubroId] = useState(initialProduct?.rubroId || "");
  const [subrubroId, setSubrubroId] = useState(initialProduct?.subrubroId || "");
  const [marcaId, setMarcaId] = useState(initialProduct?.marcaId || "");

  // 5. Visibilidad
  const [activo, setActivo] = useState<boolean>(initialProduct?.activo ?? true);

  // Control de cambios sin guardar y confirmación
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const subrubrosDisponibles = subrubros.filter((s) => s.rubroId === rubroId);
  const parsedPrice = Number(precioInput) || 0;

  const activeDiscount = initialProduct
    ? getProductActiveDiscount(
        { id: initialProduct.id, rubroId, precioSistema: parsedPrice },
        descuentos,
      )
    : null;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagenes((prev) => [...prev, reader.result as string]);
        markDirty();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    if (!nuevaImagenUrl.trim()) return;
    setImagenes((prev) => [...prev, nuevaImagenUrl.trim()]);
    setNuevaImagenUrl("");
    markDirty();
  };

  const handleRemoveImage = (index: number) => {
    setImagenes((prev) => prev.filter((_, idx) => idx !== index));
    markDirty();
  };

  const handleMoveImage = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= imagenes.length) return;
    setImagenes((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[nextIndex];
      updated[nextIndex] = temp;
      return updated;
    });
    markDirty();
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      router.push("/admin/productos");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setIsSaving(true);
    try {
      await saveProducto({
        id: initialProduct?.id,
        sku: initialProduct?.sku || "",
        barcode: barcode.trim(),
        nombreOriginalSistema: initialProduct?.nombreOriginalSistema || "",
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        modoDeUso: modoDeUso.trim(),
        advertencias: advertencias.trim(),
        superficiesAptas: superficiesAptas.trim(),
        presentacion: presentacion.trim(),
        precioSistema: parsedPrice,
        stock: esSuelto ? 0 : Math.max(0, Number(stockInput) || 0),
        stockSinDato: false,
        esSuelto,
        rubroId,
        subrubroId: subrubroId || undefined,
        marcaId: marcaId || undefined,
        imagenes,
        activo: parsedPrice > 0 ? activo : false,
        sincronizado,
      });
      setIsDirty(false);
      router.push("/admin/productos");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!initialProduct) return;
    setIsDeleting(true);
    try {
      await deleteProducto(initialProduct.id);
      setShowDeleteConfirm(false);
      router.push("/admin/productos");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-full pb-28">
      {/* Encabezado simple */}
      <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-5 mb-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancelClick}
              className="p-2 rounded-md border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              aria-label="Volver a productos"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">
              {isNew ? "Nuevo producto" : nombre || "Editar producto"}
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 sm:px-8 max-w-4xl mx-auto space-y-6">
        {/* Nota de una línea en productos sincronizados */}
        {sincronizado && (
          <div className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-700 flex items-center gap-2.5">
            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>El código, el precio base y el stock vienen del sistema del local.</span>
          </div>
        )}

        {/* SECCIÓN 1: DATOS BÁSICOS */}
        <section className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
            Datos básicos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* D.6: Solo mostrar SKU y Nombre original cuando el producto proviene de sincronización */}
            {!isNew && sincronizado && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Código (SKU)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={initialProduct?.sku || ""}
                      readOnly
                      className="w-full pl-3.5 pr-9 py-2 rounded-md border border-slate-200 bg-slate-100 text-sm text-slate-600 cursor-not-allowed"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nombre original en el sistema
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={initialProduct?.nombreOriginalSistema || nombre}
                      readOnly
                      className="w-full pl-3.5 pr-9 py-2 rounded-md border border-slate-200 bg-slate-100 text-sm text-slate-600 cursor-not-allowed"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre visible en la tienda *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  markDirty();
                }}
                placeholder="Ej: Cloro Líquido Concentrado 10L"
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
              />
              {sincronizado && (
                <p className="text-xs text-slate-500 mt-1">
                  Podés mejorar el nombre para tus clientes; la sincronización no lo sobrescribe.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Presentación / Envase
              </label>
              <input
                type="text"
                value={presentacion}
                onChange={(e) => {
                  setPresentacion(e.target.value);
                  markDirty();
                }}
                placeholder="Ej: Bidón 5 Litros"
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Código de barras (opcional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={barcode}
                  readOnly={sincronizado}
                  onChange={(e) => {
                    setBarcode(e.target.value);
                    markDirty();
                  }}
                  placeholder="Ej: 7791234560012"
                  className={`w-full px-3.5 py-2 rounded-md border text-sm ${
                    sincronizado
                      ? "pr-9 bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed"
                      : "bg-white border-slate-300 text-slate-900 focus:border-[#0f172a] outline-none"
                  }`}
                />
                {sincronizado && (
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
              <AutoResizeTextarea
                rows={3}
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value);
                  markDirty();
                }}
                placeholder="Características principales y usos del producto..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Modo de uso y dilución (opcional)
              </label>
              <AutoResizeTextarea
                rows={2}
                value={modoDeUso}
                onChange={(e) => {
                  setModoDeUso(e.target.value);
                  markDirty();
                }}
                placeholder="Indicación breve de cómo aplicarlo o diluirlo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Superficies recomendadas (opcional)
              </label>
              <AutoResizeTextarea
                rows={2}
                value={superficiesAptas}
                onChange={(e) => {
                  setSuperficiesAptas(e.target.value);
                  markDirty();
                }}
                placeholder="Ej: Pisos cerámicos, piletas, azulejos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Precauciones (opcional)
              </label>
              <AutoResizeTextarea
                rows={2}
                value={advertencias}
                onChange={(e) => {
                  setAdvertencias(e.target.value);
                  markDirty();
                }}
                placeholder="Ej: No mezclar con ácidos ni amoníaco"
              />
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: FOTOS (Principal indicada + Reordenar + Enlace avanzado) */}
        <section className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Fotos</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Formato JPG, PNG o WebP. Tamaño recomendado: 800 × 800 px (máximo 2 MB).
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-1">
            {imagenes.map((img, idx) => (
              <div key={`${img}-${idx}`} className="flex flex-col items-center gap-1.5">
                <div className="relative w-24 h-24 rounded-md border border-slate-200 bg-slate-50 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={nombre} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#0f172a]/85 text-white text-[10px] font-medium">
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-md bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
                    aria-label="Quitar foto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {imagenes.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveImage(idx, -1)}
                      className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                      title="Mover a la izquierda"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === imagenes.length - 1}
                      onClick={() => handleMoveImage(idx, 1)}
                      className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                      title="Mover a la derecha"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            <label className="w-24 h-24 rounded-md border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 flex flex-col items-center justify-center gap-1.5 text-xs font-medium text-slate-600 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Subir foto</span>
              <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
            </label>
          </div>

          <details className="pt-2 text-xs text-slate-600">
            <summary className="cursor-pointer font-medium text-slate-700 hover:text-slate-900 select-none">
              Agregar foto desde enlace (avanzado)
            </summary>
            <div className="flex items-center gap-2 max-w-md mt-2.5">
              <input
                type="text"
                value={nuevaImagenUrl}
                onChange={(e) => setNuevaImagenUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-800 focus:border-[#0f172a] outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3.5 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700"
              >
                Agregar
              </button>
            </div>
          </details>
        </section>

        {/* SECCIÓN 3: PRECIO Y STOCK */}
        <section className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
            Precio y stock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Precio de venta
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  value={precioInput}
                  readOnly={sincronizado}
                  placeholder="Ingresá el precio"
                  onChange={(e) => {
                    setPrecioInput(e.target.value);
                    markDirty();
                  }}
                  className={`w-full pl-7 py-2 rounded-md border text-sm font-medium ${
                    sincronizado
                      ? "pr-9 bg-slate-100 border-slate-200 text-slate-700 cursor-not-allowed"
                      : "pr-3.5 bg-white border-slate-300 text-slate-900 focus:border-[#0f172a] outline-none"
                  }`}
                />
                {sincronizado && (
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              {parsedPrice <= 0 && (
                <p className="text-xs text-amber-700 mt-1">
                  Sin un precio mayor a $ 0, el producto queda oculto en la tienda.
                </p>
              )}
            </div>

            {!esSuelto && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Stock físico
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={stockInput}
                    readOnly={sincronizado}
                    placeholder="Sin stock cargado"
                    onChange={(e) => {
                      setStockInput(e.target.value);
                      markDirty();
                    }}
                    className={`w-full px-3.5 py-2 rounded-md border text-sm ${
                      sincronizado
                        ? "pr-9 bg-slate-100 border-slate-200 text-slate-700 cursor-not-allowed"
                        : "bg-white border-slate-300 text-slate-900 focus:border-[#0f172a] outline-none"
                    }`}
                  />
                  {sincronizado && (
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {initialProduct?.stockSinDato && (
                  <p className="text-xs text-amber-700 mt-1">
                    Llegó sin dato válido de stock desde el local (se trata como Sin stock).
                  </p>
                )}
              </div>
            )}
          </div>

          {/* D.5: Descuento vigente informativo (sin campo de oferta individual) */}
          {activeDiscount && (
            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs">
              <div className="text-slate-700">
                <span className="font-semibold text-slate-900">Descuento vigente:</span>{" "}
                {activeDiscount.discount.nombre} — Precio final en tienda:{" "}
                <strong className="text-slate-900">{money(activeDiscount.finalPrice)}</strong>
              </div>
              <Link
                href="/admin/productos?tab=descuentos"
                className="font-medium text-[#0f172a] hover:underline shrink-0"
              >
                Administrar descuentos
              </Link>
            </div>
          )}

          {/* D.3: Único toggle para producto suelto */}
          <div className="pt-3 border-t border-slate-100">
            <AdminToggle
              checked={esSuelto}
              onChange={(val) => {
                setEsSuelto(val);
                markDirty();
              }}
              label="Es producto suelto"
              description="Se prepara según disponibilidad en el local; no se controla stock en la tienda online."
            />
          </div>
        </section>

        {/* SECCIÓN 4: RUBRO Y MARCA */}
        <section className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
            Rubro y marca
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Rubro</label>
              <select
                value={rubroId}
                onChange={(e) => {
                  setRubroId(e.target.value);
                  setSubrubroId("");
                  markDirty();
                }}
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 bg-white focus:border-[#0f172a] outline-none"
              >
                <option value="">Sin rubro asignado</option>
                {rubros.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subrubro</label>
              <select
                value={subrubroId}
                onChange={(e) => {
                  setSubrubroId(e.target.value);
                  markDirty();
                }}
                disabled={!rubroId || subrubrosDisponibles.length === 0}
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 bg-white focus:border-[#0f172a] outline-none disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">Sin subrubro</option>
                {subrubrosDisponibles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Marca</label>
              <select
                value={marcaId}
                onChange={(e) => {
                  setMarcaId(e.target.value);
                  markDirty();
                }}
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 bg-white focus:border-[#0f172a] outline-none"
              >
                <option value="">Sin marca</option>
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* SECCIÓN 5: VISIBILIDAD Y ELIMINACIÓN */}
        <section className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
            Visibilidad
          </h2>

          <AdminToggle
            checked={parsedPrice > 0 ? activo : false}
            onChange={(val) => {
              setActivo(val);
              markDirty();
            }}
            label="Mostrar producto en la tienda"
            description="Si lo desactivás, queda oculto para los clientes pero sigue recibiendo actualizaciones de precio."
          />

          {!isNew && initialProduct && !sincronizado && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3.5 py-2 rounded-md border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium transition-colors"
              >
                Eliminar producto
              </button>
            </div>
          )}

          {!isNew && sincronizado && (
            <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">
              Los productos sincronizados desde el sistema del local no se eliminan: podés
              ocultarlos con el interruptor superior.
            </p>
          )}
        </section>

        {/* Barra inferior fija de guardado */}
        <div className="fixed bottom-0 left-0 lg:left-60 right-0 bg-white border-t border-slate-200 px-6 sm:px-8 py-3.5 z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              {isSaving ? "Guardando..." : isNew ? "Guardar producto" : "Guardar cambios"}
            </button>
          </div>
        </div>
      </form>

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar producto"
        itemName={initialProduct?.nombre || ""}
        isDeleting={isDeleting}
        warningText="Si solo querés que no aparezca temporalmente en el catálogo, te recomendamos ocultarlo con el interruptor de visibilidad."
      />

      {/* Confirmación al cancelar con cambios sin guardar */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowCancelConfirm(false)}
            className="fixed inset-0 bg-slate-950/40"
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-lg border border-slate-200 max-w-md w-full p-6 z-10">
            <h3 className="text-lg font-semibold text-slate-900">Cambios sin guardar</h3>
            <p className="text-sm text-slate-600 mt-2">
              Tenés modificaciones sin guardar. ¿Seguro que querés salir sin guardar?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium"
              >
                Seguir editando
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/productos")}
                className="px-4 py-2 rounded-md bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-medium"
              >
                Salir sin guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
