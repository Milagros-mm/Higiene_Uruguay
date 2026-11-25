'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FrontendProduct } from '@/frontend/adapters/productAdapter';
import { LABELS } from '@/frontend/constants/labels';
import { money } from '@/lib/store';
import { useCart } from '@/frontend/context/CartContext';
import { ShoppingCart, Check, Package, Star } from 'lucide-react';

interface ProductCardProps {
  product: FrontendProduct | any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const categoryDisplay =
    typeof product.category === 'object' && product.category?.name
      ? product.category.name
      : product.categoryName || 'General';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.inStock === false) return;

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      categoryId: product.category?.id || product.categoryId || '',
      images: product.images,
      inStock: product.inStock,
      badges: product.badge ? [product.badge] : product.badges || [],
      sku: product.sku,
      brand: product.brand,
      bulkPresentation: product.content || product.bulkPresentation,
    } as any);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const hasReviews = product.reviews && product.reviews.length > 0;
  const averageRating = hasReviews
    ? (
        product.reviews!.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) /
        product.reviews!.length
      ).toFixed(1)
    : null;

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 hover:border-brand-cyan/60 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden relative"
      aria-label={LABELS.viewProductAria(product.name)}
    >
      {/* 1. Contenedor de Imagen Cuadrada Protagonista */}
      <div className="relative aspect-square w-full bg-slate-50/50 p-3 overflow-hidden flex items-center justify-center border-b border-slate-100">
        {product.images && product.images.length > 0 && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300">
            <Package className="w-12 h-12 mb-1 opacity-50" />
            <span className="text-[10px] uppercase font-semibold">Sin imagen</span>
          </div>
        )}

        {/* Insignias reales provistas por la API */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {!product.inStock && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-slate-700 shadow-2xs">
              {LABELS.outOfStock}
            </span>
          )}
          {product.badge === 'oferta' && product.inStock && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-amber-500 shadow-2xs">
              Oferta
            </span>
          )}
          {product.badge === 'nuevo' && product.inStock && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-brand-blue shadow-2xs">
              Nuevo
            </span>
          )}
        </div>

        {/* Porcentaje de Descuento Real */}
        {product.discountPercentage && product.discountPercentage > 0 && product.inStock && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black bg-brand-cyan text-white shadow-2xs">
              {product.discountPercentage}% OFF
            </span>
          </div>
        )}

        {/* Leyenda de Imagen Ilustrativa */}
        {product.isIllustrativeImage && (
          <div className="absolute bottom-1.5 left-2 right-2 text-center pointer-events-none">
            <span className="text-[9px] font-medium text-slate-500 bg-white/80 backdrop-blur-2xs px-2 py-0.5 rounded-md">
              {LABELS.illustrativeImage}
            </span>
          </div>
        )}
      </div>

      {/* 2. Cuerpo de la Tarjeta */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Categoría y Marca */}
          <div className="flex items-center gap-1.5 text-[11px] mb-1">
            <span className="font-semibold uppercase tracking-wider text-brand-cyan truncate">
              {categoryDisplay}
            </span>
            {product.brand && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 font-medium truncate">
                  {product.brand}
                </span>
              </>
            )}
          </div>

          {/* Nombre (Máx 2 líneas) */}
          <h3 className="font-bold text-sm text-brand-blue leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-brand-cyan transition-colors mb-1">
            {product.name}
          </h3>

          {/* Contenido / Tamaño visible */}
          {product.content && (
            <div className="mb-2">
              <span className="inline-block text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {product.content}
              </span>
            </div>
          )}

          {/* Reseñas Reales (Solo si la API las provee) */}
          {hasReviews && (
            <div className="flex items-center gap-1 mb-2 text-xs text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700">{averageRating}</span>
              <span className="text-slate-400">({product.reviews!.length})</span>
            </div>
          )}
        </div>

        {/* 3. Bloque de Precios */}
        <div className="mt-3 pt-2 border-t border-slate-100">
          <div className="space-y-0.5">
            {/* Precio anterior tachado */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 line-through">
                  {money(product.originalPrice)}
                </span>
                {product.discountPercentage && (
                  <span className="text-[10px] font-bold text-brand-cyan bg-cyan-50 px-1.5 rounded">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>
            )}

            {/* Precio principal */}
            <div className="text-lg sm:text-xl font-bold text-brand-blue tracking-tight">
              {money(product.price)}
            </div>

            {/* Precio por transferencia si la API lo informa */}
            {product.transferPrice && (
              <div className="text-[11px] font-medium text-emerald-700">
                {money(product.transferPrice)} {LABELS.transferDiscountText}
              </div>
            )}
          </div>

          {/* 4. Botón Agregar */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full h-9 rounded-full font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer ${
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
                  <Check className="w-3.5 h-3.5 animate-in zoom-in-50 duration-200" />
                  <span>{LABELS.addedToCart}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{LABELS.addToCart}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
