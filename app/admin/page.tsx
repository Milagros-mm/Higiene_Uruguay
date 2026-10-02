'use client';

import React from 'react';
import Link from 'next/link';
import { featuredProducts } from '@/frontend/mock/mock-data';
import { 
  Package, 
  Tag, 
  HelpCircle,
  Image as ImageIcon,
  Store,
  Edit,
  ExternalLink,
  Clock
} from 'lucide-react';
import { Button } from '@/frontend/components/ui/Button';

export default function AdminDashboardPage() {
  const totalProducts = featuredProducts.length;
  const saleProducts = featuredProducts.filter(p => p.isOnSale || p.originalPrice).length;
  const inquiryProducts = featuredProducts.filter(p => p.isBulk || p.requiresStockInquiry).length;
  const withoutPhotoProducts = featuredProducts.filter(p => !p.images || p.images.length === 0).length;

  return (
    <div className="min-h-full pb-12 bg-slate-50/50">
      <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-8 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hola. ¿Qué querés hacer hoy?
            </h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-slate-400" />
              Precios y stock actualizados hoy a las 10:32. 
              <Link href="/admin/sincronizacion" className="text-brand-cyan hover:underline font-semibold ml-1">
                Ver detalles
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 max-w-7xl mx-auto space-y-10">
        
        {/* Accesos Directos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/productos" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group">
            <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Edit className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Editar productos</h3>
              <p className="text-sm text-slate-500 mt-1">Modificar fotos, descripciones y ofertas.</p>
            </div>
          </Link>

          <Link href="/admin/configuracion" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Editar información</h3>
              <p className="text-sm text-slate-500 mt-1">Actualizar horarios, contacto y nombre.</p>
            </div>
          </Link>

          <a href="/" target="_blank" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <ExternalLink className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Ver mi tienda online</h3>
              <p className="text-sm text-slate-500 mt-1">Abrir el catálogo público en otra pestaña.</p>
            </div>
          </a>
        </div>

        {/* Indicadores */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/productos" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-cyan transition-colors group">
            <div className="flex items-center gap-3 text-slate-600 mb-2">
              <Package className="w-5 h-5 group-hover:text-brand-cyan transition-colors" />
              <span className="text-sm font-semibold">Productos en la tienda</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{totalProducts}</div>
          </Link>

          <Link href="/admin/productos" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-500 transition-colors group">
            <div className="flex items-center gap-3 text-slate-600 mb-2">
              <Tag className="w-5 h-5 group-hover:text-amber-500 transition-colors" />
              <span className="text-sm font-semibold">Productos con oferta</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{saleProducts}</div>
          </Link>

          <Link href="/admin/productos" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 transition-colors group">
            <div className="flex items-center gap-3 text-slate-600 mb-2">
              <HelpCircle className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-semibold">Productos a consultar</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{inquiryProducts}</div>
          </Link>

          <Link href="/admin/productos" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-red-500 transition-colors group">
            <div className="flex items-center gap-3 text-slate-600 mb-2">
              <ImageIcon className="w-5 h-5 group-hover:text-red-500 transition-colors" />
              <span className="text-sm font-semibold">Productos sin foto</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{withoutPhotoProducts}</div>
          </Link>
        </div>

        {/* Tabla de Productos Recientes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900">
              Productos
            </h3>
            <Link href="/admin/productos">
              <Button size="sm" variant="outline" className="text-xs font-bold h-9 rounded-xl">
                Ver todos
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <th className="py-3 px-6">Foto</th>
                  <th className="py-3 px-6">Código</th>
                  <th className="py-3 px-6">Nombre</th>
                  <th className="py-3 px-6">Precio</th>
                  <th className="py-3 px-6 text-center">Estado</th>
                  <th className="py-3 px-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {featuredProducts.slice(0, 5).map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50">
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
                    <td className="py-3 px-6 font-semibold text-slate-900">
                      {product.name}
                    </td>
                    <td className="py-3 px-6 font-bold text-slate-700">
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
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-lg bg-white">
                          Editar
                        </Button>
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