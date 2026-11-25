import React, { Suspense } from 'react';
import { Header } from '@/frontend/components/layout/Header';
import { Footer } from '@/frontend/components/layout/Footer';
import { CatalogLayout } from '@/frontend/components/catalog/CatalogLayout';
import { WhatsAppFloatingBtn } from '@/frontend/components/layout/WhatsAppFloatingBtn';
import { Loader2 } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const categorySlug = slug?.[0] || '';
  const subcategorySlug = slug?.[1] || '';

  const cleanName = (text: string) =>
    text
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const title = subcategorySlug
    ? `${cleanName(subcategorySlug)} - ${cleanName(categorySlug)} | Higiene Uruguay`
    : `${cleanName(categorySlug)} | Higiene Uruguay`;

  return {
    title,
    description: `Catálogo oficial de ${cleanName(subcategorySlug || categorySlug)} en Higiene Uruguay.`,
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const initialCategorySlug = slug?.[0];
  const initialSubcategorySlug = slug?.[1];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40">
      {/* 1. Header Oficial de la Tienda */}
      <Header />

      {/* 2. Contenido del Catálogo según Categoría / Subcategoría de la URL */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-10 max-w-7xl">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-cyan" />
              <p className="text-xs font-semibold text-slate-500">Cargando categoría...</p>
            </div>
          }
        >
          <CatalogLayout
            initialCategorySlug={initialCategorySlug}
            initialSubcategorySlug={initialSubcategorySlug}
          />
        </Suspense>
      </main>

      {/* 3. Footer Oficial */}
      <Footer />
      <WhatsAppFloatingBtn />
    </div>
  );
}
