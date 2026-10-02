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
  return (
    <Card className="flex flex-col h-full overflow-hidden group bg-white border border-slate-200 hover:border-brand-cyan hover:shadow-md transition-all duration-300 rounded-xl">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badges.map((badge, idx) => {
            const isOffer = badge.toLowerCase().includes('oferta');
            return (
              <span
                key={idx}
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs ${
                  isOffer ? 'bg-brand-cyan' : 'bg-brand-blue'
                }`}
              >
                {badge}
              </span>
            );
          })}
        </div>
      </div>
      
      <CardContent className="p-3.5 flex-grow flex flex-col">
        <h3 className="font-display font-bold text-sm leading-snug mb-1 line-clamp-2 text-brand-blue group-hover:text-brand-cyan transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] text-muted-foreground line-clamp-1 mb-2.5 font-normal leading-normal">
          {product.description}
        </p>
        
        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-bold text-lg text-brand-slate">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through font-normal">
                ${product.originalPrice}
              </span>
            )}
          </div>
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


