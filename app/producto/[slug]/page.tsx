import React from 'react';
import { notFound } from 'next/navigation';
import { getProductDetailFromApi } from '@/frontend/services/productApi';
import { Header } from '@/frontend/components/layout/Header';
import { Footer } from '@/frontend/components/layout/Footer';
import { WhatsAppFloatingBtn } from '@/frontend/components/layout/WhatsAppFloatingBtn';
import { ProductDetailClient } from '@/frontend/components/product/ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const { product } = await getProductDetailFromApi(slug);

    if (!product) {
      return {
        title: 'Producto no encontrado | Higiene Uruguay',
      };
    }

    return {
      title: `${product.name} | Higiene Uruguay`,
      description: product.description.slice(0, 160),
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images && product.images.length > 0 ? [product.images[0]] : [],
      },
    };
  } catch {
    return {
      title: 'Producto | Higiene Uruguay',
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  let productData: { product: any; related: any[] } | null = null;
  try {
    productData = await getProductDetailFromApi(slug);
  } catch {
    notFound();
  }

  if (!productData || !productData.product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40">
      {/* 1. Header Oficial de la Tienda */}
      <Header />

      {/* 2. Cuerpo Principal */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-10 max-w-7xl">
        <ProductDetailClient
          product={productData.product}
          relatedProducts={productData.related || []}
        />
      </main>

      {/* 3. Footer Oficial */}
      <Footer />
      <WhatsAppFloatingBtn />
    </div>
  );
}
