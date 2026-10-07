'use client';

import React from 'react';
import { Store, Truck, Tags, ArrowDown } from 'lucide-react';

export function HeroBanner() {
  const benefits = [
    {
      icon: Store,
      title: 'Retiro en local',
      subtitle: '14 de Julio 14, en el acto',
    },
    {
      icon: Truck,
      title: 'Envíos en el día',
      subtitle: 'Reparto en toda la ciudad',
    },
    {
      icon: Tags,
      title: 'Minorista y mayorista',
      subtitle: 'Sin registro previo ni mínimos',
    },
  ];

  return (
    <section className="w-full bg-slate-50/60 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4">
        {/* Recuadro Fijo con Imagen de Fondo y Capa Azul Traslúcida */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 min-h-[500px] sm:min-h-[540px] md:min-h-[560px] flex flex-col justify-between">
          
          {/* 1. Imagen de Fondo de la Tienda (Hero 1) */}
          <img
            src="/banners/hero-1.jpg"
            alt="Fachada Higiene Uruguay"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* 2. Capa Transparente en Tono Azul con Desenfoque Suave */}
          <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-brand-blue/75 backdrop-blur-[1.5px]" />

          {/* Resplandor decorativo cian */}
          <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />

          {/* 3. Contenido en Primer Plano */}
          <div className="relative z-10 p-6 sm:p-8 md:p-12 lg:p-14 flex flex-col justify-between h-full flex-grow">
            
            {/* Sección Superior: Badge, Título, Bajada y Botón */}
            <div className="max-w-3xl space-y-4 sm:space-y-5">
              {/* Badge con el local oficial */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/20 backdrop-blur-md border border-cyan-300/35 text-cyan-200 text-xs font-semibold w-fit shadow-xs">
                <Store className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span>Local oficial en 14 de Julio 14 · Concepción del Uruguay</span>
              </div>

              {/* Título Principal */}
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-[1.16] drop-shadow-sm">
                Productos de limpieza, desinfección y aromatización
              </h1>

              {/* Subtítulo Descriptivo */}
              <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl drop-shadow-xs">
                Venta directa para hogares, comercios e instituciones en Concepción del Uruguay. Armá tu pedido online y coordiná entrega en el día o retiro en el local sin demoras.
              </p>

              {/* Botón de Acción Principal */}
              <div className="pt-2 sm:pt-3">
                <a
                  href="#destacados"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-brand-cyan hover:bg-brand-cyan-dark text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 group active:scale-95 w-full sm:w-auto cursor-pointer"
                >
                  <span>Ver catálogo disponible</span>
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Sección Inferior: Carteles de Beneficios con Transparencias */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 pt-8 md:pt-10 mt-auto">
              {benefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-cyan-300/50 transition-all duration-200 flex items-center gap-3.5 shadow-sm group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-cyan-400/20 border border-cyan-300/30 flex items-center justify-center text-cyan-200 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xs sm:text-sm font-bold text-white leading-snug truncate">
                        {b.title}
                      </h2>
                      <p className="text-[11px] sm:text-xs text-slate-300 leading-tight mt-0.5 truncate">
                        {b.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
