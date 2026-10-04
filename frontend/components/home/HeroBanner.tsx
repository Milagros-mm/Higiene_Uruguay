'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const HERO_SLIDES = [
  { id: '1', src: '/banners/hero-1.jpg', alt: 'Banner 1', title: 'Calidad Profesional en Higiene', subtitle: 'Todo para el mantenimiento y limpieza institucional', badge: 'Novedad' },
  { id: '2', src: '/banners/hero-2.jpg', alt: 'Banner 2', title: 'Productos para Piscinas', subtitle: 'Mantené el agua cristalina todo el año', badge: 'Temporada' },
  { id: '3', src: '/banners/hero-3.jpg', alt: 'Banner 3', title: 'Venta Mayorista', subtitle: 'Atención especializada para comercios y empresas', badge: 'Destacado' }
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (id: string) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section className="relative w-full bg-slate-900 overflow-hidden">
      {/* Slider Container */}
      <div className="relative h-[380px] sm:h-[420px] md:h-[460px] lg:h-[500px] w-full">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === current;
          if (!isActive) return null;

          return (
            <div
              key={slide.id}
              className="absolute inset-0 z-10 animate-fadeIn"
            >
              {/* Image with dark gradient overlay or Fallback */}
              {!imgErrors[slide.id] ? (
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  onError={() => handleImgError(slide.id)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-cyan-100 flex items-center justify-center">
                  <ImageIcon className="w-24 h-24 text-slate-400/50" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-slate-950/10 to-transparent" />

              {/* Content Box */}
              <div className="container mx-auto px-4 h-full flex items-center relative z-20 pb-12">
                <div className="max-w-2xl text-white space-y-3.5">
                  {slide.badge && (
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider bg-brand-cyan text-white shadow-sm">
                      {slide.badge}
                    </span>
                  )}
                  <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight tracking-tight drop-shadow-sm">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-xl font-normal drop-shadow-sm">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Anterior diapositiva"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-xs transition-all duration-200 hover:scale-105"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Siguiente diapositiva"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-xs transition-all duration-200 hover:scale-105"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Ir al slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'w-7 bg-brand-cyan' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
