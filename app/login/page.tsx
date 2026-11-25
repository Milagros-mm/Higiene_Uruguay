'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Header } from '@/frontend/components/layout/Header';
import { Footer } from '@/frontend/components/layout/Footer';
import { Breadcrumbs } from '@/frontend/components/ui/Breadcrumbs';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/cuenta';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage('El correo o la contraseña son incorrectos. Por favor, verificá tus datos.');
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setErrorMessage('Ocurrió un error inesperado. Por favor, intentá nuevamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Migas de Pan (Breadcrumbs) */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Mi Cuenta', href: '/cuenta' },
            { label: 'Login' },
          ]}
        />
      </div>

      {/* Título de la sección */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-blue tracking-tight mb-8">
        Iniciá sesión
      </h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ej.: tunombre@email.com"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
          />
        </div>

        {/* Contraseña */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 pl-4 pr-11 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex justify-end pt-1">
            <Link
              href="/recuperar-clave"
              className="text-xs text-brand-cyan hover:text-brand-cyan-dark hover:underline transition-colors font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {/* Botón Iniciar Sesión (Estilo Cápsula Oficial) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-brand-cyan hover:bg-brand-cyan-dark text-white font-bold tracking-wider text-sm transition-all shadow-xs hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>INICIANDO SESIÓN...</span>
              </>
            ) : (
              <span>INICIAR SESIÓN</span>
            )}
          </button>
        </div>

        {/* Enlace a Registro */}
        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            ¿No tenés cuenta aún?{' '}
            <Link
              href={`/registro${callbackUrl !== '/cuenta' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
              className="text-brand-cyan font-bold hover:underline"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
        <Suspense fallback={<div className="text-center py-12 text-slate-400">Cargando...</div>}>
          <LoginFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
