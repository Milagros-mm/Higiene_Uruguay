'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Droplet, 
  RefreshCw, 
  ShoppingCart, 
  Settings, 
  ExternalLink,
  Store,
  ChevronRight
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Todos los Productos', href: '/admin/productos', icon: Package },
  { name: 'Productos Sueltos', href: '/admin/productos?tipo=sueltos', icon: Droplet },
  { name: 'Sincronización Apollo', href: '/admin/sincronizacion', icon: RefreshCw },
  { name: 'Pedidos WhatsApp', href: '/admin/pedidos', icon: ShoppingCart },
  { name: 'Configuración Tienda', href: '/admin/configuracion', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-18 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-cyan to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-base text-white tracking-tight block">Higiene Uruguay</span>
            <span className="text-[11px] font-semibold text-brand-cyan tracking-wider uppercase">Panel Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Gestión del Catálogo
        </div>

        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href) && !item.href.includes('?'));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-cyan text-white shadow-md shadow-cyan-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-cyan'}`} />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Store Link */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-all duration-200 group"
        >
          <div className="flex items-center gap-2.5">
            <ExternalLink className="w-4 h-4 text-brand-cyan group-hover:rotate-45 transition-transform" />
            <span>Ver Tienda Pública</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Tienda online" />
        </Link>
      </div>
    </aside>
  );
}
