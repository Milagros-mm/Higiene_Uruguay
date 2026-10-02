import React from 'react';
import { categories } from '@/lib/mock-data';
import { CategoryCard } from '@/components/product/CategoryCard';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function CategoryGrid() {
  const featuredCategories = categories.filter(c => c.featured);
  
  return (
    <section id="categorias" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Nuestras Categorías" 
          subtitle="Explorá nuestra amplia gama de productos por sector y encontrá lo que necesitás."
          centered
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-12">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
          {categories.filter(c => !c.featured).slice(0, 4 - (featuredCategories.length % 4)).map((category) => (
             <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
