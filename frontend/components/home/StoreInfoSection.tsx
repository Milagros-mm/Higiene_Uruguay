import React from 'react';
import { STORE } from '@/lib/store';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { ArrowRight, MapPin, Clock, Phone } from 'lucide-react';
import Link from 'next/link';

export function StoreInfoSection() {
  return (
    <section id="tienda" className="scroll-mt-32 pt-8 md:pt-12 pb-16 md:pb-24 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left: Image with badge */}
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] group border border-slate-100">
              <img
                src="/showroom/local.jpg"
                alt={`Sucursal ${STORE.name}`}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                <div>
                  <p className="font-display font-bold text-xl">{STORE.name}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: Informational text & CTA */}
          <div className="lg:w-1/2 w-full space-y-6">
            <div>
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-brand-cyan mb-2 block">
                Conocé Quiénes Somos
              </span>
              <SectionTitle 
                title="Nuestra Tienda" 
              />
            </div>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Somos tus aliados en limpieza, higiene y desinfección, orientados a comercios, industrias, residencias gerontológicas y hogares particulares. Visitanos y recibí asesoramiento especializado para encontrar la solución que mejor se adapte a tu espacio y necesidad.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100/60 flex items-center justify-center text-brand-cyan shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Ubicación</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{STORE.address}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100/60 flex items-center justify-center text-brand-cyan shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Horarios de Atención</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{STORE.hours.weekdays}</p>
                  <p className="text-xs text-slate-500">{STORE.hours.saturday}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a href={STORE.mapsUrl} target="_blank" rel="noopener noreferrer">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-brand-cyan hover:bg-brand-cyan-dark text-white font-semibold text-sm shadow-md hover:shadow-cyan-500/25 transition-all duration-200"
                >
                  <span>Cómo llegar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
              <a
                href={`tel:${STORE.phoneTel}`}
                className="inline-flex items-center gap-2 px-6 h-12 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-brand-cyan/40 hover:text-brand-cyan transition-all"
              >
                <Phone className="w-4 h-4 text-brand-cyan" />
                <span>{STORE.phoneDisplay}</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

