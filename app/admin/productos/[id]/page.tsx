"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAdminCatalog } from "@/frontend/context/AdminCatalogContext";
import { ProductForm } from "@/frontend/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const { productos } = useAdminCatalog();

  const product = productos.find((p) => p.id === params?.id);

  if (!product) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">Producto no encontrado</h1>
        <p className="text-sm text-slate-500">
          El producto que buscás no existe o fue eliminado del catálogo.
        </p>
        <Link
          href="/admin/productos"
          className="inline-flex px-4 py-2 rounded-md bg-[#0f172a] text-white text-sm font-medium"
        >
          Volver a productos
        </Link>
      </div>
    );
  }

  return <ProductForm initialProduct={product} />;
}
