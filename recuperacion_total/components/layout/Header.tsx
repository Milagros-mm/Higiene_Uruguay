import React from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Menu className="h-6 w-6 md:hidden text-foreground cursor-pointer" />
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient">Higiene Uruguay</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#categorias" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Categorías
          </Link>
          <Link href="#productos" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Destacados
          </Link>
          <Link href="#tienda" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Nuestra Tienda
          </Link>
          <Link href="#contacto" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Contacto
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar productos..."
              className="h-9 rounded-md border border-input bg-background px-8 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-[200px] lg:w-[250px]"
            />
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              0
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
