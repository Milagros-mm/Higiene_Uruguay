'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/frontend/types';
import { categories } from '@/frontend/mock/mock-data';
import { 
  Save, 
  ArrowLeft, 
  Package, 
  Droplet, 
  Tag, 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Button } from '@/frontend/components/ui/Button';

interface ProductFormProps {
  initialProduct?: Product;
  isNew?: boolean;
}

export function ProductForm({ initialProduct, isNew = false }: ProductFormProps) {
  const router = useRouter();

  // Estado de las pestañas
  const [activeTab, setActiveTab] = useState<'general' | 'tipo' | 'precios' | 'ficha' | 'fotos'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estados del formulario
  const [name, setName] = useState(initialProduct?.name || '');
  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [barcode, setBarcode] = useState(initialProduct?.barcode || '');
  const [brand, setBrand] = useState(initialProduct?.brand || 'Higiene Uruguay');
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || '1');
  const [description, setDescription] = useState(initialProduct?.description || '');

  // Tipo & Sueltos
  const [isBulk, setIsBulk] = useState(initialProduct?.isBulk ?? false);
  const [bulkUnit, setBulkUnit] = useState(initialProduct?.bulkUnit || 'Litros');
  const [bulkPresentation, setBulkPresentation] = useState(initialProduct?.bulkPresentation || 'Bidón 5 Litros');
  const [includesContainer, setIncludesContainer] = useState(initialProduct?.includesContainer ?? true);
  const [requiresStockInquiry, setRequiresStockInquiry] = useState(initialProduct?.requiresStockInquiry ?? false);
  const [stock, setStock] = useState(initialProduct?.stock ?? 10);

  // Precios & Ofertas
  const [price, setPrice] = useState<number>(initialProduct?.price || 0);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(initialProduct?.compareAtPrice || 0);
  const [isOnSale, setIsOnSale] = useState(initialProduct?.isOnSale || false);
  const [badges, setBadges] = useState<string[]>(initialProduct?.badges || []);
  const [volumeDiscounts, setVolumeDiscounts] = useState(initialProduct?.volumeDiscounts || []);

  // Ficha técnica
  const [fragrance, setFragrance] = useState(initialProduct?.fragrance || '');
  const [dilutionInstructions, setDilutionInstructions] = useState(initialProduct?.dilutionInstructions || '');
  const [suitableSurfaces, setSuitableSurfaces] = useState(initialProduct?.suitableSurfaces || '');
  const [yieldInfo, setYieldInfo] = useState(initialProduct?.yieldInfo || '');
  const [precautions, setPrecautions] = useState(initialProduct?.precautions || '');

  // Fotos
  const [images, setImages] = useState<string[]>(initialProduct?.images || ['/images/products/difusorAromanza.jpg']);

  // Cálculo del porcentaje de descuento
  const discountPercentage = compareAtPrice > price && compareAtPrice > 0
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // Toggle de badges
  const availableBadges = ['Más Vendido', 'Oferta', 'Nuevo', 'Suelto', 'Económico', 'Industrial', 'Rinde 50L'];
  const toggleBadge = (b: string) => {
    if (badges.includes(b)) {
      setBadges(badges.filter(item => item !== b));
    } else {
      setBadges([...badges, b]);
    }
  };

  // Agregar descuento por volumen
  const addVolumeDiscount = () => {
    setVolumeDiscounts([...volumeDiscounts, { minQty: 3, unitPrice: Math.round(price * 0.9) }]);
  };

  const removeVolumeDiscount = (index: number) => {
    setVolumeDiscounts(volumeDiscounts.filter((_, idx) => idx !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      router.push('/admin/productos');
    }, 1500);
  };

  return (
    <form onSubmit={handleSave} className="max-w-6xl mx-auto space-y-6">

      {/* Barra de Acciones Superior */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/admin/productos">
            <Button type="button" variant="outline" size="sm" className="h-9 gap-1.5 rounded-xl text-xs font-bold">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </Button>
          </Link>
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
              {isNew ? 'Nuevo Producto' : `Editar: ${name || 'Sin título'}`}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>SKU: <strong>{sku || 'Sin asignar'}</strong></span>
              <span>•</span>
              <span className={isBulk ? 'text-brand-cyan font-bold' : 'text-slate-600'}>
                {isBulk ? `Suelto (${bulkPresentation})` : 'Envasado'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>¡Guardado correctamente!</span>
            </div>
          )}
          <Button type="submit" className="gap-2 bg-brand-cyan hover:bg-brand-cyan-dark text-white font-bold rounded-xl h-10 px-6 shadow-sm w-full sm:w-auto">
            <Save className="w-4 h-4" />
            <span>Guardar Producto</span>
          </Button>
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'general' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>1. Datos Generales</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tipo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'tipo' ? 'bg-cyan-500 text-white shadow-xs' : 'text-cyan-800 hover:bg-cyan-50'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>2. Tipo & Presentación ({isBulk ? 'Suelto' : 'Envasado'})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('precios')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'precios' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-50'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>3. Precios & Ofertas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ficha')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'ficha' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>4. Ficha Técnica</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fotos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'fotos' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>5. Fotos ({images.length})</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* PESTAÑA 1: DATOS GENERALES                                    */}
      {/* ============================================================== */}
      {activeTab === 'general' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-display font-bold text-base text-slate-900">Identificación Comercial</h3>
            <p className="text-xs text-slate-500">Nombre público, categoría y códigos de integración con ApolloGesCom.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nombre Comercial en la Web *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Jabón Líquido Baja Espuma Blanco Dúo 2L"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all"
              />
              <p className="text-[11px] text-slate-400">Es el nombre que leerá el cliente en las tarjetas y buscador.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">SKU / Código Apollo *</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ej: 100155"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Código de Barras (EAN-13)</label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Ej: 7799175004441"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Categoría Web</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Marca Comercial</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej: Aromanza, Saphirus, Higiene Uruguay, Skip"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Descripción Comercial</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explicá las características principales del producto..."
                className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 2: TIPO & PRESENTACIÓN (ENVASADOS VS SUELTOS)           */}
      {/* ============================================================== */}
      {activeTab === 'tipo' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-display font-bold text-base text-slate-900">Modalidad de Venta y Stock</h3>
            <p className="text-xs text-slate-500">Definí si es un producto comercial envasado o si se vende suelto/a granel en unidades fijadas por la tienda.</p>
          </div>

          {/* Selector de Tipo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setIsBulk(false)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                !isBulk 
                  ? 'border-brand-blue bg-blue-50/40 text-brand-blue shadow-xs' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`p-3 rounded-xl ${!isBulk ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Producto Envasado de Fábrica</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Artículos de marca comercial con stock numérico controlado en la web (ej: Saphirus, Difusores, Jabones en caja).
                </p>
              </div>
            </div>

            <div
              onClick={() => setIsBulk(true)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                isBulk 
                  ? 'border-brand-cyan bg-cyan-50/40 text-cyan-900 shadow-xs' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`p-3 rounded-xl ${isBulk ? 'bg-brand-cyan text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Droplet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Producto Suelto / A Granel</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Químicos envasados por la tienda en presentaciones fijas (ej: Cloro Bidón 5L, Detergente 2L, Recarga).
                </p>
              </div>
            </div>
          </div>

          {/* Si es Suelto: Configuración Detallada */}
          {isBulk ? (
            <div className="bg-cyan-50/60 p-6 rounded-2xl border border-cyan-200/80 space-y-5">
              <div className="flex items-center gap-2 text-cyan-950 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                <span>Parámetros de Producto Suelto (Fijados por la Tienda)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Unidad de Medida</label>
                  <select
                    value={bulkUnit}
                    onChange={(e) => setBulkUnit(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  >
                    <option value="Litros">Litros (L)</option>
                    <option value="Kilogramos">Kilogramos (Kg)</option>
                    <option value="Unidades">Unidades / Bidón</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Presentación Específica Fijada *</label>
                  <input
                    type="text"
                    value={bulkPresentation}
                    onChange={(e) => setBulkPresentation(e.target.value)}
                    placeholder="Ej: Bidón 5 Litros, Botella 2L, Recarga (Traé tu envase)"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                  <p className="text-[11px] text-slate-500">Es la unidad fija en la que el cliente compra el producto suelto.</p>
                </div>
              </div>

              {/* Opciones de envase y WhatsApp */}
              <div className="pt-2 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includesContainer}
                    onChange={(e) => setIncludesContainer(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-cyan focus:ring-brand-cyan"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Incluye envase plástico nuevo descartable (si no está tildado, se indica *"Traé tu propio envase para recarga"*).
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requiresStockInquiry}
                    onChange={(e) => setRequiresStockInquiry(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-cyan focus:ring-brand-cyan"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Sujeto a confirmación de stock físico en local (Muestra botón *"Consultar disponibilidad en local por WhatsApp"*).
                  </span>
                </label>
              </div>
            </div>
          ) : (
            /* Si es Envasado: Control Numérico */
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-800">Control de Stock Numérico (Envasado)</h4>
              <div className="max-w-xs space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Cantidad en Stock Web</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                  <span className="text-xs font-bold text-slate-500">unidades</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 3: PRECIOS, OFERTAS Y VOLUMEN                         */}
      {/* ============================================================== */}
      {activeTab === 'precios' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-display font-bold text-base text-slate-900">Precios, Descuentos y Promociones</h3>
            <p className="text-xs text-slate-500">Configurá el precio de venta final, ofertas tachadas y descuentos por compra mayorista.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Precio de Venta Final ($ ARS) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 pl-8 pr-4 rounded-xl border border-slate-200 font-extrabold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>
              <p className="text-[11px] text-slate-400">Precio final con IVA incluido para el consumidor.</p>
            </div>

            {/* Módulo de Oferta / Precio Tachado */}
            <div className="space-y-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOnSale}
                    onChange={(e) => setIsOnSale(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Activar Precio de Oferta / Promoción</span>
                </label>
                {discountPercentage > 0 && isOnSale && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white">
                    -{discountPercentage}% OFF
                  </span>
                )}
              </div>

              {isOnSale && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-slate-700">Precio Original Anterior (Tachado)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      min={price}
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(parseFloat(e.target.value) || 0)}
                      placeholder="Ej: 4200"
                      className="w-full h-10 pl-8 pr-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Descuentos por Cantidad / Mayorista */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Descuentos por Cantidad (Venta Mayorista)</h4>
                <p className="text-xs text-slate-500">Permite establecer un precio más económico llevando por bulto cerrado o múltiples unidades.</p>
              </div>
              <Button type="button" onClick={addVolumeDiscount} variant="outline" size="sm" className="h-8 gap-1 rounded-xl text-xs font-bold">
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Escala</span>
              </Button>
            </div>

            {volumeDiscounts.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500 border border-dashed border-slate-200">
                No hay escalas de descuento mayorista configuradas para este producto.
              </div>
            ) : (
              <div className="space-y-2">
                {volumeDiscounts.map((disc, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-600">Llevando a partir de:</span>
                    <input
                      type="number"
                      min={2}
                      value={disc.minQty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 2;
                        const updated = [...volumeDiscounts];
                        updated[idx].minQty = val;
                        setVolumeDiscounts(updated);
                      }}
                      className="w-20 h-9 px-2 text-center rounded-lg border border-slate-200 bg-white text-xs font-bold"
                    />
                    <span className="text-xs font-semibold text-slate-600">unidades, precio unitario:</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        min={0}
                        value={disc.unitPrice}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const updated = [...volumeDiscounts];
                          updated[idx].unitPrice = val;
                          setVolumeDiscounts(updated);
                        }}
                        className="w-28 h-9 pl-6 pr-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVolumeDiscount(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg ml-auto"
                      title="Eliminar escala"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badges y Etiquetas Visuales */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-sm text-slate-900">Etiquetas Promocionales (Badges)</h4>
            <div className="flex flex-wrap gap-2">
              {availableBadges.map((b) => {
                const isSelected = badges.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBadge(b)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? `✓ ${b}` : `+ ${b}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 4: FICHA TÉCNICA & MODO DE USO                         */}
      {/* ============================================================== */}
      {activeTab === 'ficha' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-display font-bold text-base text-slate-900">Ficha Técnica e Instrucciones de Uso</h3>
            <p className="text-xs text-slate-500">Información esencial para que el cliente sepa cómo diluir, en qué superficies usarlo y qué precauciones tomar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Fragancia / Aroma</label>
              <input
                type="text"
                value={fragrance}
                onChange={(e) => setFragrance(e.target.value)}
                placeholder="Ej: Lavanda, Limón, Pino, Floral, Sin aroma"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Rendimiento Estimado</label>
              <input
                type="text"
                value={yieldInfo}
                onChange={(e) => setYieldInfo(e.target.value)}
                placeholder="Ej: Rinde hasta 50 baldes, Rinde 20 lavados"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Modo de Uso y Dilución Recomendada</label>
              <textarea
                rows={2}
                value={dilutionInstructions}
                onChange={(e) => setDilutionInstructions(e.target.value)}
                placeholder="Ej: 1 pocillo (100 ml) en 10 litros de agua para pisos. Para manchas rebeldes, aplicar puro."
                className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Superficies Aptas</label>
              <input
                type="text"
                value={suitableSurfaces}
                onChange={(e) => setSuitableSurfaces(e.target.value)}
                placeholder="Ej: Pisos cerámicos, porcelanatos, acero inoxidable, azulejos"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Precauciones y Advertencias</label>
              <input
                type="text"
                value={precautions}
                onChange={(e) => setPrecautions(e.target.value)}
                placeholder="Ej: Usar guantes de goma. No mezclar con lavandina ni ácidos."
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 5: FOTOS & GALERÍA                                     */}
      {/* ============================================================== */}
      {activeTab === 'fotos' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-display font-bold text-base text-slate-900">Galería de Imágenes</h3>
            <p className="text-xs text-slate-500">Fotografías del producto tomadas en el local o provistas por el fabricante.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl bg-slate-100 border-2 border-brand-cyan overflow-hidden group">
                <img src={img} alt="Foto producto" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-brand-cyan text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  Portada Principal
                </div>
              </div>
            ))}

            <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-cyan bg-slate-50 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors group">
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-cyan-50 flex items-center justify-center text-slate-500 group-hover:text-brand-cyan mb-2">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 group-hover:text-brand-cyan">Subir otra foto</span>
              <span className="text-[10px] text-slate-400 mt-0.5">JPG o PNG</span>
            </div>
          </div>
        </div>
      )}

    </form>
  );
}
