import React from 'react';
import { AdminSidebar } from '@/frontend/components/admin/AdminSidebar';

export const metadata = {
  title: 'Panel de Administración | Higiene Uruguay',
  description: 'Gestión de productos, stock, precios y sincronización de Higiene Uruguay',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-100/70 overflow-hidden font-sans text-slate-800">
      {/* Sidebar fijo */}
      <AdminSidebar />

      {/* Área de Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
