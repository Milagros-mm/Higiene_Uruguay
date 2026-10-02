'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Bell, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/frontend/components/ui/Button';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { name: string; href?: string }[];
}

export function AdminHeader({ title, subtitle, breadcrumbs }: AdminHeaderProps) {
  return (
    <header className="h-18 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/90">
      {/* Title & Breadcrumbs */}
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {b.href ? (
                  <Link href={b.href} className="hover:text-brand-cyan transition-colors">
                    {b.name}
                  </Link>
                ) : (
                  <span className="text-slate-700 font-semibold">{b.name}</span>
                )}
                {idx < breadcrumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="font-display font-bold text-lg sm:text-xl text-brand-blue tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-muted-foreground hidden sm:block">{subtitle}</p>}
      </div>

      {/* Right Side: Quick Action & Profile */}
      <div className="flex items-center gap-3">
        <Link href="/admin/productos/nuevo">
          <Button size="sm" className="gap-1.5 bg-brand-cyan hover:bg-brand-cyan-dark text-white font-semibold shadow-sm rounded-xl h-9">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Producto</span>
          </Button>
        </Link>

        {/* Admin User Chip */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-brand-blue font-bold text-xs shadow-2xs">
            HU
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-none flex items-center gap-1">
              <span>Higiene Uruguay</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">Administrador</span>
          </div>
        </div>
      </div>
    </header>
  );
}
