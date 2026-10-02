import React from 'react';
import { storeInfo } from '@/lib/mock-data';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function StoreInfoSection() {
  return (
    <section id="tienda" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] group">
              <img
                src={storeInfo.imageUrl}
                alt={`Sucursal ${storeInfo.name}`}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="font-semibold text-lg">{storeInfo.name}</p>
                <p className="text-sm opacity-90">{storeInfo.address}</p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <SectionTitle 
              title="Sobre Nuestra Tienda" 
              subtitle="Visitanos y conocé toda nuestra línea de productos con asesoramiento experto."
            />
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {storeInfo.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">📍</span>
                  Ubicación
                </h4>
                <p className="text-sm text-muted-foreground">{storeInfo.address}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">🕒</span>
                  Horarios
                </h4>
                <p className="text-sm text-muted-foreground">{storeInfo.businessHours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
