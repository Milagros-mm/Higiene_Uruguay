'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Search } from 'lucide-react';
import { STORE } from '@/lib/store';
import { useCart } from '@/frontend/context/CartContext';

export function Header() {
  const { totalItems, openCart, isLoaded } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="container mx-auto px-4 py-2 md:py-0 md:h-20 flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-8">

        {/* Top Row on Mobile (Logo & User Actions) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Official Logo */}
          <Link href="/" className="flex items-center shrink-0 group py-0.5">
            <img
              src="/logotipo.png"
              alt={STORE.name}
              className="h-10 sm:h-12 md:h-14 lg:h-15 w-auto max-w-[160px] sm:max-w-[180px] md:max-w-[220px] object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Account & Cart - Mobile View */}
          <div className="flex items-center gap-1.5 md:hidden">
            <Link
              href="/cuenta"
              className="p-2 rounded-xl text-brand-blue hover:bg-slate-100 transition-colors flex items-center justify-center"
              aria-label="Mi Cuenta"
            >
              <User className="h-5 w-5 text-brand-blue" />
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative p-2 rounded-xl text-brand-blue hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Carrito de compra"
            >
              <ShoppingCart className="h-5 w-5" />
              {isLoaded && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-cyan text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Full Width on Mobile, Centered Inline on Desktop */}
        <div className="w-full md:flex-1 md:max-w-2xl mx-auto">
          <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 md:left-4 h-4 w-4 md:h-5 md:w-5 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                placeholder="¿Qué producto estás buscando?"
                className="w-full h-10 md:h-12 pl-10 md:pl-12 pr-24 md:pr-28 rounded-full border border-slate-200 md:border-2 bg-slate-50 text-brand-slate text-xs md:text-sm placeholder:text-muted-foreground focus:bg-white focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 transition-all shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 md:right-1.5 md:top-1.5 md:bottom-1.5 px-3 md:px-4 bg-brand-cyan hover:bg-brand-cyan-dark text-white rounded-full text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Account & Cart - Desktop View */}
        <div className="hidden md:flex items-center gap-2 md:gap-3 shrink-0">
          <Link href="/cuenta" className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-slate hover:text-brand-blue hover:bg-slate-100 transition-colors">
            <User className="h-5 w-5 text-brand-blue" />
            <div className="text-left leading-tight hidden lg:block">
              <span className="text-[11px] text-muted-foreground block">Bienvenido</span>
              <span className="text-xs font-bold text-brand-blue">Mi Cuenta</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="relative p-2.5 rounded-xl text-brand-blue hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Carrito de compra"
          >
            <ShoppingCart className="h-6 w-6" />
            {isLoaded && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-cyan text-[11px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}

