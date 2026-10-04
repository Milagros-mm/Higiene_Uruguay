import React from 'react';
import * as Icons from 'lucide-react';
import { Category } from '@/types';
import Link from 'next/link';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = Icons[category.icon as keyof typeof Icons] as React.ElementType;

  return (
    <Link href={`#categoria-${category.slug}`} className="group flex flex-col items-center justify-center text-center p-2">
      {/* Circular Avatar with subtle border */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] bg-white border border-slate-200 group-hover:border-brand-cyan group-hover:shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-[1.03] shadow-sm">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-50 to-blue-50 group-hover:from-cyan-100 group-hover:to-blue-100 flex items-center justify-center text-brand-blue group-hover:text-brand-cyan transition-all duration-300">
          {Icon ? <Icon className="w-6 h-6 transition-transform group-hover:scale-110" /> : <Icons.Package className="w-6 h-6 transition-transform group-hover:scale-110" />}
        </div>
      </div>
      
      {/* Centered Small Text Below */}
      <span className="mt-2.5 font-display font-semibold text-xs sm:text-sm text-brand-slate group-hover:text-brand-cyan transition-colors line-clamp-1 max-w-[110px]">
        {category.name}
      </span>
      <span className="text-[11px] text-muted-foreground font-normal">
        {category.itemCount} items
      </span>
    </Link>
  );
}


