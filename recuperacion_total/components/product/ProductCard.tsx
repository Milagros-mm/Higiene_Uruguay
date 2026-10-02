import React from 'react';
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.badges.map((badge, idx) => (
            <Badge 
              key={idx} 
              variant={badge.toLowerCase() === 'oferta' ? 'warning' : 'success'}
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>
      
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2" variant="primary">
          <ShoppingCart className="w-4 h-4" />
          Agregar
        </Button>
      </CardFooter>
    </Card>
  );
}
