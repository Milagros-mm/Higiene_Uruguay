'use client';

import React from 'react';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden group bg-white border border-slate-200 hover:border-brand-cyan/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100/50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges container (top left) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badges.map((badge, idx) => {
            const isOffer = badge.toLowerCase().includes('oferta');
            return (
              <span
                key={idx}
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs ${
                  isOffer ? 'bg-amber-500' : 'bg-brand-blue'
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
        <h3 className="font-display font-semibold text-sm leading-snug mb-1 line-clamp-2 text-brand-blue group-hover:text-brand-cyan transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] text-muted-foreground line-clamp-1 mb-2.5 font-normal leading-normal">
          {product.description}
        </p>
        
        <div className="mt-auto pt-1">
          {discountPercentage > 0 ? (
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 line-through font-medium">
                  ${product.originalPrice}
                </span>
                <span className="text-xs font-extrabold text-brand-cyan bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200">
                  -{discountPercentage}%
                </span>
              </div>
              <div>
                <span className="font-sans font-black text-xl text-brand-blue tracking-tight">
                  ${product.price}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-black text-xl text-brand-blue tracking-tight">
                ${product.price}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3.5 pt-0">
        <Button
          size="sm"
          className="w-full gap-1.5 bg-brand-cyan hover:bg-brand-cyan-dark text-white font-semibold text-xs shadow-2xs hover:shadow-xs transition-all duration-200 rounded-lg h-8"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Agregar
        </Button>
      </CardFooter>
    </Card>
  );
}


