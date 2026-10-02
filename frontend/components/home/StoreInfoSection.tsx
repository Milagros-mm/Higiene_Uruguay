import React from 'react';
import { storeInfo } from '@/lib/mock-data';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { ArrowRight, MapPin, Clock, Phone } from 'lucide-react';
import Link from 'next/link';

export function StoreInfoSection() {
  return (
    <section id="tienda" className="py-16 md:py-24 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left: Image with badge */}
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] group border border-slate-100">
              <img
                src={storeInfo.imageUrl}
                alt={`Sucursal ${storeInfo.name}`}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-cyan text-white uppercase tracking-wider mb-2">
                    Casa Central
                  </span>
                  <p className="font-display font-bold text-xl">{storeInfo.name}</p>
                  <p className="text-sm text-slate-200">{storeInfo.address}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: Informational text & CTA */}
          <div className="lg:w-1/2 w-full space-y-6">
            <div>
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-cyan mb-2 block">
                Conocé Quiénes Somos
              </span>
              <SectionTitle 
                title="Nuestra Tienda & Showroom" 
                subtitle="Visitanos y recibí asesoramiento técnico especializado en limpieza institucional y mantenimiento."
              />
            </div>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {storeInfo.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-slate">Ubicación</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{storeInfo.address}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-slate">Horarios de Atención</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{storeInfo.businessHours}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/tienda">
                <Button
                  size="lg"
                  className="bg-brand-cyan hover:bg-brand-cyan-dark text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 gap-2"
                >
                  <span>Conocer toda la información de la tienda</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a
                href={`tel:${storeInfo.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-brand-slate font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-blue" />
                <span>{storeInfo.phone}</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

