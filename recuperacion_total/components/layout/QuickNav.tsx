import React from 'react';
import Link from 'next/link';
import { LayoutGrid, Award, Sparkles, Store } from 'lucide-react';

export function QuickNav() {
  const navItems = [
    { label: 'Categorías', href: '#categorias', icon: LayoutGrid },
    { label: 'Marcas', href: '#marcas', icon: Award },
    { label: 'Destacados', href: '#destacados', icon: Sparkles },
    { label: 'Nuestra Tienda', href: '#tienda', icon: Store },
  ];

  return (
    <nav className="w-full bg-white border-b border-border shadow-2xs">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start md:justify-center gap-2 md:gap-6 py-2.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-brand-slate hover:text-brand-cyan hover:bg-slate-50 transition-all duration-200 shrink-0 border border-transparent hover:border-slate-200"
              >
                <Icon className="h-4 w-4 text-brand-cyan shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
