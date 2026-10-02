'use client';

import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { storeInfo } from '@/lib/mock-data';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contacto" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-cyan-light/5 -z-10 rounded-l-[100px]" />

      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Contactanos" 
          subtitle="¿Tenés dudas o necesitás un presupuesto a medida? Escribinos y te responderemos a la brevedad."
          centered
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-border shadow-sm h-full">
              <h3 className="text-2xl font-bold text-brand-blue-dark mb-6">Información de Contacto</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-brand-cyan/10 p-3 rounded-full text-brand-cyan">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Dirección</p>
                    <p className="text-muted-foreground">{storeInfo.address}</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="bg-brand-cyan/10 p-3 rounded-full text-brand-cyan">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Teléfono / WhatsApp</p>
                    <p className="text-muted-foreground">{storeInfo.phone}</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="bg-brand-cyan/10 p-3 rounded-full text-brand-cyan">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground">contacto@higieneuruguay.com.uy</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="bg-brand-cyan/10 p-3 rounded-full text-brand-cyan">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Horario de Atención</p>
                    <p className="text-muted-foreground">{storeInfo.businessHours}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-border/50">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Nombre completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Tu nombre" 
                    className="w-full h-11 px-4 rounded-xl border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">Teléfono</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    placeholder="Tu teléfono" 
                    className="w-full h-11 px-4 rounded-xl border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className="w-full h-11 px-4 rounded-xl border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">Mensaje</label>
                <textarea 
                  id="message" 
                  placeholder="¿En qué podemos ayudarte?" 
                  rows={4}
                  className="w-full p-4 rounded-xl border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none"
                />
              </div>
              
              <Button type="submit" className="w-full h-12 rounded-xl bg-brand-cyan hover:bg-brand-cyan-dark text-white font-bold gap-2">
                <Send className="w-4 h-4" />
                Enviar Mensaje
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}