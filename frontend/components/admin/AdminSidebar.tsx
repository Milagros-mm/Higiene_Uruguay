"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  RefreshCw,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAdminCatalog } from "@/frontend/context/AdminCatalogContext";

interface AdminSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const navigationItems = [
  { name: "Inicio", href: "/admin", icon: LayoutDashboard },
  { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
  { name: "Clientes", href: "/admin/clientes", icon: Users },
  { name: "Productos", href: "/admin/productos", icon: Package },
  { name: "Sincronización", href: "/admin/sincronizacion", icon: RefreshCw },
  { name: "Configuración", href: "/admin/configuracion", icon: Settings },
];

export function AdminSidebar({ isOpenMobile = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { pedidos } = useAdminCatalog();
  const pedidosPendientesCount = pedidos.filter((p) => p.estado === "Pendiente").length;

  const isLinkActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    if (
      href === "/admin/productos" &&
      (pathname.startsWith("/admin/productos") ||
        pathname.startsWith("/admin/rubros") ||
        pathname.startsWith("/admin/subrubros") ||
        pathname.startsWith("/admin/marcas"))
    ) {
      return true;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const sidebarContent = (
    <aside className="w-60 bg-[#0f172a] text-slate-100 flex flex-col shrink-0 border-r border-slate-800 select-none h-full font-sans">
      {/* Logo y nombre del comercio */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
        <Link
          href="/admin"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 text-base font-semibold text-white tracking-tight"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logotipo.png"
            alt="Higiene Uruguay"
            className="w-8 h-8 rounded-md object-contain bg-white p-0.5 shrink-0"
          />
          <span>Higiene Uruguay</span>
        </Link>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Secciones del menú */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isLinkActive(item.href);
          const showBadge = item.href === "/admin/pedidos" && pedidosPendientesCount > 0;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#06b6d4] text-white font-semibold"
                  : "text-slate-300 hover:bg-[#1e293b] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
                />
                <span>{item.name}</span>
              </div>
              {showBadge && (
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                    isActive ? "bg-white/20 text-white" : "bg-amber-500 text-slate-950"
                  }`}
                >
                  {pedidosPendientesCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Cerrar sesión al pie */}
      <div className="p-3 border-t border-slate-800">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-slate-300 hover:text-white hover:bg-[#1e293b] text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:flex h-full">{sidebarContent}</div>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/50"
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
