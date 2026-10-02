import React from 'react';
import { AdminHeader } from '@/frontend/components/admin/AdminHeader';
import { ProductForm } from '@/frontend/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="min-h-full pb-16">
      <AdminHeader
        title="Crear Nuevo Producto"
        subtitle="Configurá los datos comerciales, modalidad de venta (envasado o suelto) y precios"
        breadcrumbs={[
          { name: 'Dashboard', href: '/admin' },
          { name: 'Catálogo', href: '/admin/productos' },
          { name: 'Nuevo' }
        ]}
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <ProductForm isNew={true} />
      </div>
    </div>
  );
}
