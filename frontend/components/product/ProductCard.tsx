'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Package, Check, Droplets } from 'lucide-react';
import { money } from '@/lib/store';
import { useCart } from '@/frontend/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden group bg-white border border-slate-200 hover:border-brand-cyan/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-white p-3">
        {product.images && product.images.length > 0 && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={`Imagen de ${product.name}`}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105 p-3"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300 rounded-lg">
            <Package className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-[10px] font-medium tracking-wide uppercase">Sin Imagen</span>
          </div>
        )}
        {/* Badges container (top left) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badges.map((badge, idx) => {
            const isOffer = badge.toLowerCase().includes('oferta');
            const isBulkBadge = badge.toLowerCase().includes('suelto') || badge.toLowerCase().includes('granel');
            return (
              <span
                key={idx}
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs ${
                  isOffer ? 'bg-amber-500' : isBulkBadge ? 'bg-emerald-600' : 'bg-brand-blue'
                }`}
              >
                {badge}
              </span>
            );
          })}
        </div>

        {/* Discount Badge on Image (top right) */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black bg-brand-cyan text-white shadow-md tracking-wide">
              {discountPercentage}% OFF
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-3.5 flex-grow flex flex-col">
        <h3 className="font-display font-semibold text-sm leading-snug mb-1 line-clamp-2 min-h-[3rem] text-brand-blue group-hover:text-brand-cyan transition-colors">
          {product.name}
        </h3>

        {/* Presentación fija / Unidad */}
        {(product.bulkPresentation || product.bulkUnit || product.isBulk) && (
          <div className="mb-1.5 flex items-center gap-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-1.5 py-0.2 rounded-md">
              <Droplets className="w-2.5 h-2.5 text-amber-600" />
              {product.bulkPresentation || product.bulkUnit || 'Fraccionado'}
            </span>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2.5 font-normal leading-normal">
          {product.description}
        </p>
        
        <div className="mt-auto pt-1">
          {discountPercentage > 0 && product.originalPrice ? (
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 line-through font-medium">
                  {money(product.originalPrice)}
                </span>
                <span className="text-xs font-extrabold text-brand-cyan bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200">
                  -{discountPercentage}%
                </span>
              </div>
              <div>
                <span className="font-sans font-black text-xl text-brand-blue tracking-tight">
                  {money(product.price)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-black text-xl text-brand-blue tracking-tight">
                {money(product.price)}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3.5 pt-0 mt-auto">
        <Button
          size="sm"
          onClick={handleAddToCart}
          className={`w-full gap-1.5 text-white font-semibold text-xs shadow-2xs hover:shadow-xs transition-all duration-200 rounded-lg h-8 ${
            isAdded
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-cyan-600 hover:bg-cyan-700'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 animate-in zoom-in-50 duration-200" />
              <span>¡Agregado!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Agregar</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}


