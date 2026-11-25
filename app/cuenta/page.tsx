'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Header } from '@/frontend/components/layout/Header';
import { Footer } from '@/frontend/components/layout/Footer';
import { Breadcrumbs } from '@/frontend/components/ui/Breadcrumbs';
import { 
  User, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function MiCuentaPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'perfil' | 'pedidos'>('perfil');

  const user = session?.user;
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!user;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
        {/* Migas de Pan (Breadcrumbs) */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Mi Cuenta' },
            ]}
          />
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-cyan border-r-transparent" />
            <p className="mt-4 text-sm text-slate-500">Cargando información de tu cuenta...</p>
          </div>
        ) : !isAuthenticated ? (
          /* ESTADO: NO AUTENTICADO */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs text-center space-y-8">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-brand-blue tracking-tight">
                Mi Cuenta
              </h1>
              <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-md mx-auto">
                Iniciá sesión para gestionar tus pedidos y agilizar tus compras en Higiene Uruguay.
              </p>
            </div>

            {/* Botones principales de acceso */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link
                href="/login"
                className="flex-1 h-12 rounded-full bg-brand-cyan hover:bg-brand-cyan-dark text-white font-bold tracking-wider text-sm transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2"
              >
                <span>INICIAR SESIÓN</span>
              </Link>

              <Link
                href="/registro"
                className="flex-1 h-12 rounded-full border-2 border-brand-cyan text-brand-cyan hover:bg-brand-cyan/10 font-bold tracking-wider text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>CREAR CUENTA</span>
              </Link>
            </div>

            {/* Beneficios de tener cuenta */}
            <div className="pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-brand-cyan font-bold text-sm">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Compras rápidas</span>
                </div>
                <p className="text-xs text-slate-500">
                  Tus datos de entrega quedan guardados para comprar en un solo clic.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-brand-cyan font-bold text-sm">
                  <Package className="w-4 h-4" />
                  <span>Historial de pedidos</span>
                </div>
                <p className="text-xs text-slate-500">
                  Consultá el estado y detalle de tus compras anteriores en todo momento.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-brand-cyan font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Beneficios</span>
                </div>
                <p className="text-xs text-slate-500">
                  Acceso a promociones y cupones de descuento exclusivos.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ESTADO: AUTENTICADO */
          <div className="space-y-8">
            {/* Header del Perfil */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white flex items-center justify-center text-2xl font-bold shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {user?.name || 'Mi Perfil'}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Cliente Activo
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            </div>

            {/* Pestañas de Navegación del Panel */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <button
                onClick={() => setActiveTab('perfil')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'perfil'
                    ? 'bg-brand-cyan text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Datos de Contacto</span>
              </button>

              <button
                onClick={() => setActiveTab('pedidos')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'pedidos'
                    ? 'bg-brand-cyan text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Mis Pedidos</span>
              </button>
            </div>

            {/* Contenido de la pestaña */}
            {activeTab === 'perfil' ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Información Personal y de Envío</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Estos datos se utilizan para autocompletar tus compras y coordinar entregas por WhatsApp.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                      Nombre y Apellido
                    </span>
                    <span className="text-base font-bold text-slate-800 block">
                      {user?.name || 'No especificado'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                      Correo Electrónico
                    </span>
                    <span className="text-base font-bold text-slate-800 block">
                      {user?.email}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                      Teléfono / WhatsApp
                    </span>
                    <span className="text-base font-bold text-slate-800 block">
                      {(user as { phone?: string | null })?.phone || 'Sin registrar aún'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                      Ciudad
                    </span>
                    <span className="text-base font-bold text-slate-800 block">
                      Concepción del Uruguay, Entre Ríos
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Link
                    href="/carrito"
                    className="px-6 py-3 rounded-full bg-brand-cyan hover:bg-brand-cyan-dark text-white font-bold text-sm transition-all shadow-xs flex items-center gap-2"
                  >
                    <span>Ir a comprar al Carrito</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Aún no registrás pedidos en la tienda</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                    Cuando realices una compra desde el carrito, vas a poder ver el seguimiento y el detalle de tus productos aquí.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-cyan hover:bg-brand-cyan-dark text-white font-bold text-sm transition-all shadow-xs"
                  >
                    <span>Explorar Catálogo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
