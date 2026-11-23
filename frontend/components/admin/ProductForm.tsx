"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Lock } from "lucide-react";
import {
  useAdminCatalog,
  AdminProduct,
  AdminToggle,
  ConfirmDeleteModal,
} from "@/frontend/context/AdminCatalogContext";
import { money } from "@/frontend/utils/store";

interface ProductFormProps {
  initialProduct?: AdminProduct;
  isNew?: boolean;
}

export function ProductForm({ initialProduct, isNew = false }: ProductFormProps) {
  const router = useRouter();
  const { rubros, subrubros, marcas, saveProducto, deleteProducto } = useAdminCatalog();

  const sincronizado = initialProduct ? initialProduct.sincronizado : false;

  // 1. Datos básicos
  const [sku, setSku] = useState(initialProduct?.sku || "");
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

  // 3. Precio y stock
  const [precioSistema, setPrecioSistema] = useState<number>(initialProduct?.precioSistema || 0);
  const [precioOferta, setPrecioOferta] = useState<string>(
    initialProduct?.precioOferta ? String(initialProduct.precioOferta) : "",
  );
  const [stock, setStock] = useState<number>(initialProduct?.stock ?? 0);
  const [esSuelto, setEsSuelto] = useState<boolean>(initialProduct?.esSuelto ?? false);
  const [controlarStock, setControlarStock] = useState<boolean>(
    initialProduct?.controlarStock ?? true,
  );

  // 4. Rubro y marca
  const [rubroId, setRubroId] = useState(initialProduct?.rubroId || "");
  const [subrubroId, setSubrubroId] = useState(initialProduct?.subrubroId || "");
  const [marcaId, setMarcaId] = useState(initialProduct?.marcaId || "");

  // 5. Visibilidad
  const [activo, setActivo] = useState<boolean>(initialProduct?.activo ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const subrubrosDisponibles = subrubros.filter((s) => s.rubroId === rubroId);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagenes((prev) => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    if (!nuevaImagenUrl.trim()) return;
    setImagenes((prev) => [...prev, nuevaImagenUrl.trim()]);
    setNuevaImagenUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImagenes((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setIsSaving(true);
    try {
      await saveProducto({
        id: initialProduct?.id,
        sku: sku.trim() || "SIN-CODIGO",
        barcode: barcode.trim(),
        nombreOriginalSistema: initialProduct?.nombreOriginalSistema || nombre.toUpperCase(),
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        modoDeUso: modoDeUso.trim(),
        advertencias: advertencias.trim(),
        superficiesAptas: superficiesAptas.trim(),
        presentacion: presentacion.trim(),
        precioSistema: Number(precioSistema) || 0,
        precioOferta: precioOferta ? Number(precioOferta) : undefined,
        stock: Number(stock) || 0,
        esSuelto,
        controlarStock: esSuelto ? false : controlarStock,
        rubroId,
        subrubroId: subrubroId || undefined,
        marcaId: marcaId || undefined,
        imagenes,
        activo,
        sincronizado,
      });
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
            <Link
              href="/admin/productos"
              className="p-2 rounded-md border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              aria-label="Volver a productos"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">
              {isNew ? "Nuevo producto" : nombre || "Editar producto"}
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 sm:px-8 max-w-4xl mx-auto space-y-6">
        {/* Aviso claro sobre campos sincronizados vs editables */}
        {sincronizado && (
          <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 flex items-start gap-3">
            <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">
                Producto vinculado con el sistema del local:
              </span>{" "}
              el código, el precio base y el stock físico se actualizan automáticamente en cada
              sincronización (solo lectura). Todos los demás datos (nombre comercial, fotos, rubro,
              marca, precio de oferta, venta suelta y visibilidad) se conservan en la tienda sin
              pisarse.
            </div>
          </div>
        )}

        {/* SECCIÓN 1: DATOS BÁSICOS */}
        <section className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
            Datos básicos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Código (SKU){" "}
                {sincronizado && <span className="text-xs text-slate-500">(Sincronizado)</span>}
              </label>
              <input
                type="text"
                value={sku}
                readOnly={sincronizado}
                onChange={(e) => setSku(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-md border text-sm ${
                  sincronizado
                    ? "bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed"
                    : "bg-white border-slate-300 text-slate-900 focus:border-[#0f172a] outline-none"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre original en el sistema{" "}
                {sincronizado && <span className="text-xs text-slate-500">(Solo lectura)</span>}
              </label>
              <input
                type="text"
                value={initialProduct?.nombreOriginalSistema || nombre}
                readOnly
                className="w-full px-3.5 py-2 rounded-md border border-slate-200 bg-slate-100 text-sm text-slate-600 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre visible en la tienda *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Cloro Líquido Concentrado 10L"
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Podés mejorar el nombre para tus clientes; la sincronización no lo sobrescribe.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Presentación / Envase
              </label>
              <input
                type="text"
                value={presentacion}
                onChange={(e) => setPresentacion(e.target.value)}
                placeholder="Ej: Bidón 5 Litros"
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Código de barras
              </label>
              <input
                type="text"
                value={barcode}
                readOnly={sincronizado}
                onChange={(e) => setBarcode(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-md border text-sm ${
                  sincronizado
                    ? "bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed"
                    : "bg-white border-slate-300 text-slate-900 focus:border-[#0f172a] outline-none"
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Características principales y usos del producto..."
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Modo de uso y dilución (opcional)
              </label>
              <textarea
                rows={2}
                value={modoDeUso}
                onChange={(e) => setModoDeUso(e.target.value)}
                placeholder="Indicación breve de cómo aplicarlo o diluirlo..."
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Superficies recomendadas (opcional)
              </label>
              <input
                type="text"
                value={superficiesAptas}
                onChange={(e) => setSuperficiesAptas(e.target.value)}
                placeholder="Ej: Pisos cerámicos, piletas, azulejos"
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Precauciones (opcional)
              </label>
              <input
                type="text"
                value={advertencias}
                onChange={(e) => setAdvertencias(e.target.value)}
                placeholder="Ej: No mezclar con ácidos ni amoníaco"
                className="w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
              />
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: FOTOS */}
        <section className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
            Fotos
          </h2>

          <div className="flex flex-wrap gap-4">
            {imagenes.map((img, idx) => (
              <div
                key={idx}
                className="relative w-24 h-24 rounded-md border border-slate-200 bg-slate-50 overflow-hidden group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={nombre} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
                  aria-label="Quitar foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <label className="w-24 h-24 rounded-md border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 flex flex-col items-center justify-center gap-1.5 text-xs font-medium text-slate-600 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Subir foto</span>
              <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
            </label>
          </div>

          <div className="flex items-center gap-2 max-w-md pt-2">
            <input
              type="text"
              value={nuevaImagenUrl}
              onChange={(e) => setNuevaImagenUrl(e.target.value)}
              placeholder="O pegá el enlace de una imagen..."
              className="flex-1 px-3 py-2 rounded-md border border-slate-300 text-xs text-slate-800 focus:border-[#0f172a] outline-none"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-3 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
            >
              Agregar
            </button>
          </div>
        </section>

        {/* SECCIÓN 3: PRECIO Y STOCK */}
        <section className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
            Precio y stock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Precio de venta{" "}
                {sincronizado && <span className="text-xs text-slate-500">(Sincronizado)</span>}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  value={precioSistema}
                  readOnly={sincronizado}
                  onChange={(e) => setPrecioSistema(Number(e.target.value))}
                  className={`w-full pl-7 pr-3.5 py-2 rounded-md border text-sm font-medium ${
                    sincronizado
                      ? "bg-slate-100 border-slate-200 text-slate-700 cursor-not-allowed"
                      : "bg-white border-slate-300 text-slate-900 focus:border-[#0f172a] outline-none"
                  }`}
                />
              </div>
              {sincronizado && (
                <p className="text-xs text-slate-500 mt-1">
                  Valor actual: {money(precioSistema)} (viene del sistema local).
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Precio promocional en web
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  value={precioOferta}
                  onChange={(e) => setPrecioOferta(e.target.value)}
                  placeholder="Sin oferta"
                  className="w-full pl-7 pr-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Dejalo vacío para cobrar el precio normal.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Stock físico{" "}
                {sincronizado && <span className="text-xs text-slate-500">(Sincronizado)</span>}
              </label>
              <input
                type="number"
                value={stock}
                readOnly={sincronizado}
                onChange={(e) => setStock(Number(e.target.value))}
                className={`w-full px-3.5 py-2 rounded-md border text-sm ${
                  sincronizado
                    ? "bg-slate-100 border-slate-200 text-slate-700 cursor-not-allowed"
                    : "bg-white border-slate-300 text-slate-900 focus:border-[#0f172a] outline-none"
                }`}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-4">
            <AdminToggle
              checked={esSuelto}
              onChange={(val) => {
                setEsSuelto(val);
                if (val) setControlarStock(false);
              }}
              label="Venta a granel / producto suelto"
              description="Si está activo, el cliente puede comprarlo aunque el stock del sistema sea 0."
            />

            {!esSuelto && (
              <AdminToggle
                checked={controlarStock}
                onChange={setControlarStock}
                label="Frenar ventas cuando el stock llegue a 0"
                description="Desactivalo si querés seguir recibiendo pedidos de este artículo aunque figure sin stock."
              />
            )}
          </div>
        </section>

        {/* SECCIÓN 4: RUBRO Y MARCA */}
        <section className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
            Rubro y marca
          </h2>
          <p className="text-xs text-slate-500 -mt-2">
            Esta clasificación se administra en la tienda y no se modifica al sincronizar.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Rubro</label>
              <select
                value={rubroId}
                onChange={(e) => {
                  setRubroId(e.target.value);
                  setSubrubroId("");
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
                onChange={(e) => setSubrubroId(e.target.value)}
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
                onChange={(e) => setMarcaId(e.target.value)}
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
            checked={activo}
            onChange={setActivo}
            label="Mostrar producto en la tienda"
            description="Si lo desactivás, el producto queda oculto para los clientes pero sigue recibiendo actualizaciones de precio."
          />

          {!isNew && initialProduct && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-slate-900">Eliminar producto</div>
                <div className="text-xs text-slate-500">
                  Quita el producto del catálogo de la tienda.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3.5 py-2 rounded-md border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium transition-colors"
              >
                Eliminar producto
              </button>
            </div>
          )}
        </section>

        {/* Barra inferior fija de guardado */}
        <div className="fixed bottom-0 left-0 lg:left-60 right-0 bg-white border-t border-slate-200 px-6 sm:px-8 py-3.5 z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
            <Link
              href="/admin/productos"
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              Cancelar
            </Link>
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

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar producto"
        itemName={initialProduct?.nombre || ""}
        isDeleting={isDeleting}
        warningText="Si solo querés que no aparezca temporalmente en el catálogo, te recomendamos ocultarlo con el interruptor de visibilidad."
      />
    </div>
  );
}
