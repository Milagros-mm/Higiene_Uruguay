"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/frontend/components/admin/AdminSidebar";
import { AdminCatalogProvider } from "@/frontend/context/AdminCatalogContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AdminCatalogProvider>
      <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-[#0f172a]">
        <AdminSidebar
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Barra superior solo en móvil para abrir el menú */}
          <header className="lg:hidden h-14 bg-[#0f172a] text-white px-4 flex items-center gap-3 border-b border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-[#1e293b] transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-sm">Higiene Uruguay</span>
          </header>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AdminCatalogProvider>
  );
}
