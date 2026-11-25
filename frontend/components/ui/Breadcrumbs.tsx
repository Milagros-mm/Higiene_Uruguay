'use client';

import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Ruta de navegación" className={`flex items-center text-xs sm:text-sm text-slate-500 ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-slate-500 hover:text-brand-cyan hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-brand-cyan rounded-xs"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-brand-cyan font-semibold' : 'text-slate-600'}>
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="text-slate-400 select-none text-xs" aria-hidden="true">
                  &gt;
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
