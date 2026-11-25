'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FrontendProduct } from '@/frontend/adapters/productAdapter';
import { LABELS } from '@/frontend/constants/labels';
import { ShoppingCart, Package, Check } from 'lucide-react';
import { money } from '@/lib/store';
import { useCart } from '@/frontend/context/CartContext';

interface ProductListItemProps {
  product: FrontendProduct;
}

export function ProductListItem({ product }: ProductListItemProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
    } as any);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-brand-cyan/60 shadow-xs hover:shadow-md transition-all group"
      aria-label={LABELS.viewProductAria(product.name)}
    >
      {/* 1. Imagen en miniatura */}
      <div className="relative w-full sm:w-28 sm:h-28 aspect-square sm:aspect-auto rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0 p-2">
        {product.images && product.images.length > 0 && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="120px"
            loading="lazy"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Package className="w-8 h-8 text-slate-300" />
        )}

        {product.discountPercentage && product.discountPercentage > 0 && (
          <span className="absolute top-2 right-2 sm:top-1 sm:right-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-brand-cyan text-white shadow-2xs">
            {product.discountPercentage}% OFF
          </span>
        )}

        {product.isIllustrativeImage && (
          <span className="absolute bottom-1 left-1 right-1 text-center text-[8px] bg-white/80 rounded text-slate-500">
            {LABELS.illustrativeImage}
          </span>
        )}
      </div>

      {/* 2. Información del Producto: Categoría, Nombre y Descripción */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* Categoría y Marca */}
        <div className="flex items-center gap-1.5 mb-1 text-xs">
          <span className="font-semibold uppercase tracking-wider text-brand-cyan text-[11px] truncate">
            {product.category.name}
          </span>
          {product.brand && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 font-medium text-[11px] truncate">
                {product.brand}
              </span>
            </>
          )}
        </div>

        {/* Nombre */}
        <h3 className="font-bold text-sm sm:text-base text-brand-blue group-hover:text-brand-cyan transition-colors truncate">
          {product.name}
        </h3>

        {/* Descripción breve */}
        <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-normal">
          {product.description}
        </p>

        {/* Contenido / Tamaño */}
        {product.content && (
          <div className="mt-1.5">
            <span className="inline-block text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {product.content}
            </span>
          </div>
        )}
      </div>

      {/* 3. Precio y Botón de Acción */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <div className="text-left sm:text-right space-y-0.5">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through block">
              {money(product.originalPrice)}
            </span>
          )}
          <span className="font-bold text-lg sm:text-xl text-brand-blue tracking-tight block">
            {money(product.price)}
          </span>
          {product.transferPrice && (
            <span className="text-[10px] font-medium text-emerald-700 block">
              {money(product.transferPrice)} {LABELS.transferDiscountText}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`h-9 px-4 rounded-full font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer ${
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
    </Link>
  );
}
