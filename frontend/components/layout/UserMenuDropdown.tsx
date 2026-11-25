'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, Package, UserPlus, LogIn, ChevronDown } from 'lucide-react';

export function UserMenuDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const isAuthenticated = status === 'authenticated' && !!user;

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href="/cuenta"
        onClick={() => setIsOpen(false)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-slate hover:text-brand-blue hover:bg-slate-100 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <User className="h-5 w-5 text-brand-blue" />
        <div className="text-left leading-tight hidden lg:block">
          <span className="text-[11px] text-muted-foreground block truncate max-w-[110px]">
            {isAuthenticated && user?.name ? `Hola, ${user.name.split(' ')[0]}` : 'Bienvenido'}
          </span>
          <span className="text-xs font-bold text-brand-blue flex items-center gap-1">
            Mi Cuenta
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </span>
        </div>
      </Link>

      {/* Menú Desplegable con Paleta Oficial (Fondo Blanco, Bordes Slate, Acentos Cian) */}
      {isOpen && (
        <div className="absolute right-0 top-full pt-2 z-[60] w-56 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-200/90 p-2 text-slate-800">
            {/* Triángulo apuntador superior */}
            <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45" />

            {!isAuthenticated ? (
              <div className="space-y-1.5 py-1">
                <div className="px-2.5 py-1.5 text-center border-b border-slate-100 mb-1">
                  <span className="text-xs font-bold text-brand-blue block">Acceso a Mi Cuenta</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Seguí tus pedidos y comprá más rápido</span>
                </div>

                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold text-white bg-brand-cyan hover:bg-brand-cyan-dark rounded-xl transition-all shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>INICIAR SESIÓN</span>
                </Link>

                <Link
                  href="/registro"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-brand-blue hover:text-brand-cyan hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-brand-cyan" />
                  <span>Crear cuenta</span>
                </Link>
              </div>
            ) : (
              <div className="py-1 space-y-1">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <span className="text-[11px] text-slate-400 block">Conectado como</span>
                  <span className="text-xs font-bold text-brand-blue truncate block">
                    {user?.name || 'Cliente'}
                  </span>
                </div>

                <Link
                  href="/cuenta"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-blue hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-brand-cyan" />
                  <span>Mi Perfil y Pedidos</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
