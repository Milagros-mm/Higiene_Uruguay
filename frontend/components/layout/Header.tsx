'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [cartCount] = useState(2); // Example dynamic counter

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="container mx-auto px-4 h-18 md:h-20 flex items-center justify-between gap-4 md:gap-8">

        {/* Left: Official Logo */}
        <Link href="/" className="flex items-center shrink-0 group py-1">
          <img
            src="/Logotipo.jpeg"
            alt="Higiene Uruguay"
            className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto max-w-[220px] md:max-w-[280px] object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Center: Prominent Search Bar */}
        <div className="flex-1 max-w-md mx-auto">
          <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                placeholder="¿Qué producto de limpieza estás buscando? (ej. Cloro, Desinfectante, Papel...)"
                className="w-full h-11 md:h-12 pl-12 pr-28 rounded-full border-2 border-slate-200 bg-slate-50 text-brand-slate text-sm placeholder:text-muted-foreground focus:bg-white focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 transition-all shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-brand-cyan hover:bg-brand-cyan-dark text-white rounded-full text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Right: Account & Cart with Badge */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <Link href="/cuenta" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-brand-slate hover:text-brand-blue hover:bg-slate-100 transition-colors">
            <User className="h-5 w-5 text-brand-blue" />
            <div className="text-left leading-tight hidden lg:block">
              <span className="text-[11px] text-muted-foreground block">Bienvenido</span>
              <span className="text-xs font-bold text-brand-blue">Mi Cuenta</span>
            </div>
          </Link>

          <Button variant="ghost" size="icon" className="sm:hidden text-brand-blue">
            <User className="h-5 w-5" />
          </Button>

          <Link
            href="/carrito"
            className="relative p-2.5 rounded-xl text-brand-blue hover:bg-slate-100 transition-colors flex items-center justify-center"
            aria-label="Carrito de compra"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-cyan text-[11px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}

