'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Search, Image as ImageIcon } from 'lucide-react';
import { featuredProducts } from '@/frontend/mock/mock-data';

export default function ProductsPage() {
  return (
    <div className="min-h-full pb-12 bg-slate-50/50">
      
      <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-8 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Productos
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Buscá y editá la información de tus productos en la tienda.
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-6 sm:px-8 max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por código o nombre..." 
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-cyan outline-none text-sm text-slate-800"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <th className="py-3 px-6">Foto</th>
                  <th className="py-3 px-6">Código</th>
                  <th className="py-3 px-6">Nombre</th>
                  <th className="py-3 px-6">Precio</th>
                  <th className="py-3 px-6 text-center">Estado</th>
                  <th className="py-3 px-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {featuredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 group">
                    <td className="py-3 px-6">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 font-mono font-bold text-xs text-slate-600">
                      {product.sku || 'N/A'}
                    </td>
                    <td className="py-3 px-6">
                      <div className="font-semibold text-slate-900 group-hover:text-brand-cyan transition-colors">
                        {product.name}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-slate-700 font-bold">
                      ${product.price.toLocaleString('es-AR')}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {product.isOnSale ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          Con oferta
                        </span>
                      ) : product.isBulk || product.requiresStockInquiry ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                          A consultar
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <Link href={`/admin/productos/${product.id}`}>
                        <button className="inline-flex items-center justify-center h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition-colors">
                          Editar
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}