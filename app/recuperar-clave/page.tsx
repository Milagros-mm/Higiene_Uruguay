'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/frontend/components/layout/Header';
import { Footer } from '@/frontend/components/layout/Footer';
import { Breadcrumbs } from '@/frontend/components/ui/Breadcrumbs';
import { Mail, CheckCircle2, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

export default function RecuperarClavePage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'No se pudo procesar la solicitud.');
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Error al recuperar clave:', err);
      setErrorMessage('Ocurrió un problema de conexión. Por favor, intentá nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: 'Inicio', href: '/' },
                { label: 'Mi Cuenta', href: '/cuenta' },
                { label: 'Recuperar Contraseña' },
              ]}
            />
          </div>

          <h1 className="text-3xl font-bold text-center text-brand-blue tracking-tight mb-2">
            Recuperar contraseña
          </h1>
          <p className="text-sm text-slate-500 text-center mb-8">
            Ingresá tu correo electrónico para recibir el enlace de restablecimiento.
          </p>

          {isSuccess ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">Revisá tu correo</h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Te enviamos un enlace a <strong className="text-slate-800">{email}</strong> para que puedas crear una nueva contraseña. Si no lo encontrás en unos minutos, revisá la carpeta de correo no deseado (spam).
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex w-full sm:w-auto px-8 py-3 rounded-full bg-brand-cyan text-white font-bold text-sm hover:bg-brand-cyan-dark transition-all text-center justify-center"
                >
                  Volver a iniciar sesión
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="recovery-email" className="block text-sm font-medium text-slate-700">
                  Email registrado
                </label>
                <div className="relative">
                  <input
                    id="recovery-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ej.: tunombre@email.com"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-full bg-brand-cyan hover:bg-brand-cyan-dark text-white font-bold tracking-wider text-sm transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>ENVIANDO...</span>
                  </>
                ) : (
                  <span>ENVIAR ENLACE</span>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-brand-cyan hover:text-brand-cyan-dark hover:underline font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Regresar a Iniciar sesión</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
