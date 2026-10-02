import React from 'react';
import * as Icons from 'lucide-react';
import { Category } from '@/types';
import { Card } from '@/components/ui/Card';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = Icons[category.icon as keyof typeof Icons] as React.ElementType;

  return (
    <Card className="group cursor-pointer hover:border-brand-cyan/50 text-center flex flex-col items-center justify-center p-6 h-full transition-all duration-300 hover:-translate-y-1">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-brand-cyan group-hover:text-white transition-colors duration-300 text-brand-blue">
        {Icon ? <Icon className="w-8 h-8" /> : <Icons.Package className="w-8 h-8" />}
      </div>
      <h3 className="font-bold text-foreground mb-1">{category.name}</h3>
      <p className="text-sm text-muted-foreground">{category.itemCount} productos</p>
    </Card>
  );
}
