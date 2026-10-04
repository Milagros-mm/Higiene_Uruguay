import React from 'react';
import Link from 'next/link';
import { STORE } from '@/lib/store';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand & Info */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <span className="font-display text-2xl font-bold text-white tracking-tight">Higiene Uruguay</span>
            </Link>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Tu aliado estratégico en productos de limpieza profesional, desinfección y mantenimiento en Concepción del Uruguay.
            </p>
            <div className="flex gap-4">
              <a href={STORE.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-brand-cyan hover:scale-110 transition-all" aria-label="Instagram">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#25D366] hover:scale-110 transition-all" aria-label="WhatsApp">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.012 2C6.486 2 2 6.486 2 12.012c0 1.764.462 3.486 1.326 5L2 22l5.127-1.309A9.972 9.972 0 0 0 12.012 22c5.526 0 10.012-4.486 10.012-10.012C22.024 6.486 17.538 2 12.012 2zm.006 18.397c-1.492 0-2.953-.396-4.237-1.157l-.304-.18-3.14.802.817-3.056-.196-.312A8.347 8.347 0 0 1 3.654 12c0-4.606 3.748-8.354 8.364-8.354 4.615 0 8.363 3.748 8.363 8.354 0 4.607-3.748 8.355-8.363 8.355l-.006.042zm4.595-6.284c-.251-.126-1.492-.738-1.724-.823-.232-.084-.402-.126-.571.126-.169.252-.65 823-.798.992-.148.169-.296.19-.547.064-.251-.126-1.066-.393-2.03-1.254-.75-.67-1.256-1.5-1.404-1.752-.148-.252-.016-.388.11-.514.113-.113.251-.295.377-.442.126-.148.169-.253.252-.422.084-.169.042-.317-.021-.443-.064-.127-.571-1.378-.782-1.888-.206-.497-.417-.43-.571-.437-.148-.007-.318-.007-.487-.007-.17 0-.444.064-.676.317-.233.253-.889.866-.889 2.112 0 1.246.91 2.45 1.037 2.62.127.169 1.787 2.727 4.331 3.824 2.052.887 2.45.711 2.915.669.465-.042 1.492-.612 1.703-1.203.211-.591.211-1.097.148-1.203-.064-.106-.233-.169-.485-.295z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="#" className="hover:text-brand-cyan transition-colors">Limpieza Hogar</Link></li>
              <li><Link href="#" className="hover:text-brand-cyan transition-colors">Desinfección</Link></li>
              <li><Link href="#" className="hover:text-brand-cyan transition-colors">Piscinas</Link></li>
              <li><Link href="#" className="hover:text-brand-cyan transition-colors">Institucional</Link></li>
              <li><Link href="#" className="hover:text-brand-cyan transition-colors">Accesorios</Link></li>
              <li><Link href="#" className="hover:text-brand-cyan transition-colors">Jardín</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="#" className="hover:text-brand-cyan transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="#" className="hover:text-brand-cyan transition-colors">Contacto</Link></li>
              <li><Link href="#" className="hover:text-brand-cyan transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="#" className="hover:text-brand-cyan transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800/80 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} {STORE.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}