'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FrontendProduct } from '@/frontend/adapters/productAdapter';
import { LABELS } from '@/frontend/constants/labels';
import { Breadcrumbs } from '@/frontend/components/ui/Breadcrumbs';
import { ProductCard } from '@/components/product/ProductCard';
import { STORE, money } from '@/lib/store';
import { useCart } from '@/frontend/context/CartContext';
import {
  ShoppingCart,
  Check,
  Plus,
  Minus,
  MessageCircle,
  Truck,
  Store,
  CreditCard,
  Package,
  ChevronDown,
  Star,
  Users,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: FrontendProduct;
  relatedProducts: FrontendProduct[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0
      ? product.variants[0].id
      : null
  );

  // Estados de acordeones
  const [openAccordion, setOpenAccordion] = useState<{
    description: boolean;
    instructions: boolean;
    warnings: boolean;
    surfaces: boolean;
  }>({
    description: true,
    instructions: true,
    warnings: false,
    surfaces: false,
  });

  const toggleAccordion = (key: keyof typeof openAccordion) => {
    setOpenAccordion((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[selectedImageIndex] || null;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!product.inStock) return;

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      categoryId: product.category.id,
      images: product.images,
      inStock: product.inStock,
      badges: product.badge ? [product.badge] : [],
      sku: product.sku,
      brand: product.brand,
      bulkPresentation: product.content,
    } as any, quantity);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const whatsappUrl = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(
    LABELS.whatsappMessage(product.name, money(product.price))
  )}`;

  // Breadcrumbs oficiales con categoría y subcategoría
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: LABELS.categories, href: '/productos' },
    {
      label: product.category.name,
      href: `/categoria/${product.category.slug}`,
    },
    ...(product.subcategory
      ? [
          {
            label: product.subcategory.name,
            href: `/categoria/${product.category.slug}/${product.subcategory.slug}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  // Reseñas reales
  const hasReviews = product.reviews && product.reviews.length > 0;
  const averageRating = hasReviews
    ? (
        product.reviews!.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) /
        product.reviews!.length
      ).toFixed(1)
    : null;

  return (
    <div className="w-full">
      {/* 1. Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* 2. Tarjeta Principal Tipo Tienda Nube */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 md:p-10 shadow-xs mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Columna Izquierda: Galería con miniaturas y zoom */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-6 group">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300">
                  <Package className="w-16 h-16 mb-2 opacity-50" />
                  <span className="text-xs uppercase font-medium">Sin imagen</span>
                </div>
              )}

              {/* Insignia de Oferta o % OFF real */}
              {product.discountPercentage && product.discountPercentage > 0 && product.inStock && (
                <span className="absolute top-4 right-4 px-2.5 py-1 rounded-md text-xs font-black bg-brand-cyan text-white shadow-2xs">
                  {product.discountPercentage}% OFF
                </span>
              )}

              {/* Leyenda Imagen Ilustrativa */}
              {product.isIllustrativeImage && (
                <div className="absolute bottom-3 left-4 right-4 text-center pointer-events-none">
                  <span className="text-[10px] font-medium text-slate-500 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-2xs">
                    {LABELS.illustrativeImage}
                  </span>
                </div>
              )}
            </div>

            {/* Miniaturas navegables */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl bg-slate-50 border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-brand-cyan shadow-xs ring-1 ring-brand-cyan/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    aria-label={`Ver imagen ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha: Información Comercial y Compra */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <div>
              {/* Categoría y Marca */}
              <div className="flex items-center gap-2 mb-2 text-xs">
                <Link
                  href={`/categoria/${product.category.slug}`}
                  className="font-bold uppercase tracking-wider text-brand-cyan hover:underline"
                >
                  {product.category.name}
                </Link>
                {product.subcategory && (
                  <>
                    <span className="text-slate-300">/</span>
                    <Link
                      href={`/categoria/${product.category.slug}/${product.subcategory.slug}`}
                      className="font-medium text-slate-500 hover:text-brand-cyan hover:underline"
                    >
                      {product.subcategory.name}
                    </Link>
                  </>
                )}
                {product.brand && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-slate-400">{product.brand}</span>
                  </>
                )}
              </div>

              {/* Nombre del Producto */}
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-blue tracking-tight leading-snug mb-2">
                {product.name}
              </h1>

              {/* Contenido / Tamaño visible */}
              {product.content && (
                <div className="mb-4">
                  <span className="inline-block text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                    Presentación: {product.content}
                  </span>
                </div>
              )}

              {/* Reseñas Reales (Solo si la API las provee) */}
              {hasReviews && (
                <div className="flex items-center gap-1.5 mb-4 text-xs text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-700">{averageRating}</span>
                  <span className="text-slate-400">({product.reviews!.length} valoraciones)</span>
                </div>
              )}

              {/* Bloque de Precios */}
              <div className="mb-6 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400 line-through">
                      {money(product.originalPrice)}
                    </span>
                    {product.discountPercentage && (
                      <span className="text-xs font-bold text-brand-cyan bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                        -{product.discountPercentage}%
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-baseline gap-2">
                  <div className="text-3xl sm:text-4xl font-bold text-brand-blue tracking-tight">
                    {money(product.price)}
                  </div>
                  {product.wholesalePrice && (
                    <span className="text-xs text-slate-400 font-normal">
                      ({LABELS.retailPrice})
                    </span>
                  )}
                </div>

                {/* Precio por transferencia si la API lo informa */}
                {product.transferPrice && (
                  <p className="text-xs font-semibold text-emerald-700 pt-0.5">
                    {money(product.transferPrice)} {LABELS.transferDiscountText}
                  </p>
                )}
              </div>

              {/* Precio Mayorista Diferenciado (Solo si la API lo entrega) */}
              {product.wholesalePrice && product.wholesaleMinQty && (
                <div className="mb-6 p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200/80 flex items-start gap-3">
                  <Users className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-cyan-950 block">
                      {LABELS.wholesaleTitle}
                    </strong>
                    <p className="text-cyan-900 mt-0.5">
                      {LABELS.wholesalePriceNotice(product.wholesaleMinQty)}{' '}
                      <strong className="text-brand-blue">{money(product.wholesalePrice)}</strong> c/u.
                    </p>
                  </div>
                </div>
              )}

              {/* Selector de Variantes (Solo si existen en la API) */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Seleccionar variante:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          selectedVariantId === variant.id
                            ? 'border-brand-cyan bg-cyan-50 text-brand-blue ring-1 ring-brand-cyan'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {variant.name}
                        {variant.price ? ` (${money(variant.price)})` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de Cantidad y Botón Agregar */}
              <div className="space-y-3.5 pt-1">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Selector - 1 + */}
                  <div className="flex items-center justify-between border border-slate-200 rounded-xl p-1 bg-white sm:w-36 shrink-0 h-12">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={quantity <= 1 || !product.inStock}
                      className="w-10 h-full rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label={LABELS.decreaseQuantity}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-base font-bold text-slate-800 text-center w-12">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={!product.inStock}
                      className="w-10 h-full rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label={LABELS.increaseQuantity}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Botón Agregar al Carrito */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 h-12 rounded-full font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer ${
                      !product.inStock
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : isAdded
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-brand-cyan hover:bg-brand-cyan-dark active:scale-[0.99]'
                    }`}
                  >
                    {!product.inStock ? (
                      <span>{LABELS.outOfStock}</span>
                    ) : isAdded ? (
                      <>
                        <Check className="w-4 h-4 animate-in zoom-in-50 duration-200" />
                        <span>{LABELS.addedToCart}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>{LABELS.addToCartButton(money(product.price * quantity))}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Botón WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 px-4 rounded-full font-bold text-xs uppercase tracking-wider text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{LABELS.whatsappInquiry}</span>
                </a>
              </div>

              {/* Bloque Entrega */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {LABELS.deliveryBlockTitle}
                </span>

                <div className="flex items-start gap-3 text-xs text-slate-600">
                  <Store className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">
                      {LABELS.storePickupTitle}
                    </strong>
                    <span>{LABELS.storePickupAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-600">
                  <Truck className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">
                      {LABELS.homeDeliveryTitle}
                    </strong>
                    <span>{LABELS.homeDeliveryDesc}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Secciones Tipo Acordeón (Descripción, Modo de Uso, Advertencias, Superficies) */}
        <div className="mt-10 pt-8 border-t border-slate-200 space-y-4">
          {/* Acordeón: Descripción */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => toggleAccordion('description')}
              className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-brand-blue hover:text-brand-cyan transition-colors cursor-pointer bg-slate-50/50"
              aria-expanded={openAccordion.description}
            >
              <span>{LABELS.description}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  openAccordion.description ? 'rotate-180 text-brand-cyan' : ''
                }`}
              />
            </button>
            {openAccordion.description && (
              <div className="p-4 sm:p-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                <p>{product.description}</p>
              </div>
            )}
          </div>

          {/* Acordeón: Modo de Uso y Dilución */}
          {product.instructions && (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggleAccordion('instructions')}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-brand-blue hover:text-brand-cyan transition-colors cursor-pointer bg-slate-50/50"
                aria-expanded={openAccordion.instructions}
              >
                <span>{LABELS.instructions}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openAccordion.instructions ? 'rotate-180 text-brand-cyan' : ''
                  }`}
                />
              </button>
              {openAccordion.instructions && (
                <div className="p-4 sm:p-5 text-sm text-slate-700 leading-relaxed border-t border-slate-100 font-mono text-xs sm:text-sm bg-slate-50/30">
                  <p>{product.instructions}</p>
                </div>
              )}
            </div>
          )}

          {/* Acordeón: Advertencias y Seguridad */}
          {product.warnings && (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggleAccordion('warnings')}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-red-700 hover:text-red-800 transition-colors cursor-pointer bg-red-50/30"
                aria-expanded={openAccordion.warnings}
              >
                <span>{LABELS.warnings}</span>
                <ChevronDown
                  className={`w-4 h-4 text-red-400 transition-transform ${
                    openAccordion.warnings ? 'rotate-180 text-red-600' : ''
                  }`}
                />
              </button>
              {openAccordion.warnings && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm text-red-900 leading-relaxed border-t border-red-100 bg-red-50/20">
                  <p>{product.warnings}</p>
                </div>
              )}
            </div>
          )}

          {/* Acordeón: Superficies Recomendadas */}
          {product.suitableSurfaces && (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggleAccordion('surfaces')}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-brand-blue hover:text-brand-cyan transition-colors cursor-pointer bg-slate-50/50"
                aria-expanded={openAccordion.surfaces}
              >
                <span>{LABELS.surfaces}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openAccordion.surfaces ? 'rotate-180 text-brand-cyan' : ''
                  }`}
                />
              </button>
              {openAccordion.surfaces && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  <p>{product.suitableSurfaces}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-blue tracking-tight">
              {LABELS.relatedProductsTitle}
            </h2>
            <Link
              href="/productos"
              className="text-xs sm:text-sm font-bold text-brand-cyan hover:underline"
            >
              {LABELS.viewAllCatalog}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {relatedProducts.map((relProduct) => (
              <div key={relProduct.id} className="h-full">
                <ProductCard product={relProduct} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
