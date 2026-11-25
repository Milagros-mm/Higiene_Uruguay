import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden animate-pulse">
      {/* Imagen cuadrada */}
      <div className="aspect-square w-full bg-slate-100 border-b border-slate-100" />

      {/* Contenido */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Categoría */}
          <div className="h-3 w-20 bg-slate-200 rounded" />
          {/* Nombre 2 líneas */}
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
          {/* Contenido / tamaño */}
          <div className="h-4 w-12 bg-slate-100 rounded" />
        </div>

        {/* Precios y Botón */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <div className="h-5 w-24 bg-slate-200 rounded" />
          <div className="h-9 w-full bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
