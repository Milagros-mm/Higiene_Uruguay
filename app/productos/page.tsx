import React, { Suspense } from 'react';
import { Header } from '@/frontend/components/layout/Header';
import { Footer } from '@/frontend/components/layout/Footer';
import { CatalogLayout } from '@/frontend/components/catalog/CatalogLayout';
import { WhatsAppFloatingBtn } from '@/frontend/components/layout/WhatsAppFloatingBtn';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Catálogo de Productos | Higiene Uruguay',
  description: 'Insumos de limpieza profesional, tratamiento de piscinas, químicos y productos fraccionados a granel en Concepción del Uruguay.',
};

export default function ProductosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40">
      {/* 1. Header Oficial de la Tienda */}
      <Header />

      {/* 2. Contenido del Catálogo */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-10 max-w-7xl">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-cyan" />
              <p className="text-xs font-semibold text-slate-500">Cargando catálogo...</p>
            </div>
          }
        >
          <CatalogLayout />
        </Suspense>
      </main>

      {/* 3. Footer Oficial */}
      <Footer />
      <WhatsAppFloatingBtn />
    </div>
  );
}
