import React from 'react';
import { Truck } from 'lucide-react';

export function PromoTopBar() {
  return (
    <div className="bg-brand-cyan text-white py-1.5 md:py-2 px-3 sm:px-4 text-center text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 shadow-inner tracking-wide">
      <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
      <span className="hidden sm:inline">Envíos a todo Concepción del Uruguay en 24hs. ¡Consultá por envío gratis en compras mayores a $50.000!</span>
      <span className="sm:hidden text-[11px] font-medium leading-tight">Envíos 24hs en C. del Uruguay • Gratis &gt; $50.000</span>
    </div>
  );
}

