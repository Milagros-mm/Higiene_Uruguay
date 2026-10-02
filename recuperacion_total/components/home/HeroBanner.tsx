import React from 'react';
import { Button } from '@/components/ui/Button';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 md:pt-24 pb-20 lg:pt-32 lg:pb-28">
      {/* Background decoration */}
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand-cyan-light/20 to-transparent rounded-l-full transform translate-x-1/3 -translate-y-1/4 -z-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-brand-blue-light/10 to-transparent rounded-tr-full -z-10" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Limpieza Profesional Directo a <span className="text-gradient">Tu Puerta</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Soluciones de higiene y desinfección de máxima calidad para tu hogar, piscina y negocio.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" className="w-full sm:w-auto text-base">
                Ver Productos
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base bg-white">
                Cotizar para Empresas
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video lg:aspect-square max-w-lg mx-auto">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop"
                alt="Productos de limpieza profesional"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
