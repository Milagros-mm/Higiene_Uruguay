'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Header } from '@/frontend/components/layout/Header';
import { Footer } from '@/frontend/components/layout/Footer';
import { Breadcrumbs } from '@/frontend/components/ui/Breadcrumbs';
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/cuenta';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Ocurrió un error al registrarse.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('¡Cuenta creada con éxito! Iniciando sesión...');

      // Iniciar sesión automáticamente
      const loginRes = await signIn('credentials', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        redirect: false,
      });

      if (loginRes?.ok) {
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 1000);
      } else {
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
    } catch (err) {
      console.error('Error registrando usuario:', err);
      setErrorMessage('Ocurrió un error inesperado de conexión. Por favor, intentá nuevamente.');
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
            { label: 'Crear Cuenta' },
          ]}
        />
      </div>

      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-blue tracking-tight">
          Crear cuenta
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500 font-normal">
          Comprá más rápido y llevá el control de tus pedidos, ¡en un solo lugar!
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. Nombre y apellido */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Nombre y apellido
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="ej.: María Perez"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
          />
        </div>

        {/* 2. Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="ej.: tunombre@email.com"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
          />
        </div>

        {/* 3. Teléfono (opcional) */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            Teléfono (opcional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="ej.: 1123445567"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
          />
        </div>

        {/* 4. Contraseña */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
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
        </div>

        {/* 5. Confirmar contraseña */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full h-12 pl-4 pr-11 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Ver confirmación'}
            >
              {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Botón Crear Cuenta (Estilo Cápsula Oficial) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-brand-cyan hover:bg-brand-cyan-dark text-white font-bold tracking-wider text-sm transition-all shadow-xs hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>CREANDO CUENTA...</span>
              </>
            ) : (
              <span>CREAR CUENTA</span>
            )}
          </button>
        </div>

        {/* Enlace a Iniciar Sesión */}
        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            ¿Ya tenés una cuenta?{' '}
            <Link
              href={`/login${callbackUrl !== '/cuenta' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
              className="text-brand-cyan font-bold hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
        <Suspense fallback={<div className="text-center py-12 text-slate-400">Cargando...</div>}>
          <RegisterFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
