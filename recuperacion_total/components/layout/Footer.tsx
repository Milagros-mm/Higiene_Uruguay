import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { storeInfo } from '@/lib/mock-data';

export function Footer() {
  return (
    <footer className="bg-brand-blue-dark text-white/90">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Info */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <span className="text-2xl font-bold text-white">Higiene Uruguay</span>
            </Link>
            <p className="text-sm text-white/70 mb-6">
              Tu aliado estratégico en productos de limpieza profesional, desinfección y mantenimiento.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">Limpieza Hogar</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Desinfección</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Piscinas</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Institucional</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contacto Rápidos</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <span className="block font-medium text-white">Dirección:</span>
                {storeInfo.address}
              </li>
              <li>
                <span className="block font-medium text-white">Teléfono:</span>
                {storeInfo.phone}
              </li>
              <li>
                <span className="block font-medium text-white">Horario:</span>
                {storeInfo.businessHours}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} Higiene Uruguay. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0">Diseñado con ❤️ en Uruguay</p>
        </div>
      </div>
    </footer>
  );
}
