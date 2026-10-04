import React from 'react';
import { MessageCircle } from 'lucide-react';
import { STORE } from '@/lib/store';

export function WhatsAppFloatingBtn() {
  const message = encodeURIComponent("Hola, quiero consultar por un producto");
  
  return (
    <a
      href={`https://wa.me/${STORE.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
