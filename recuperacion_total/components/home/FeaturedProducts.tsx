import React from 'react';
import { featuredProducts } from '@/lib/mock-data';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function FeaturedProducts() {
  return (
    <section id="productos" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Productos Destacados" 
          subtitle="Descubrí los productos más elegidos por nuestros clientes para mantener la higiene perfecta."
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
