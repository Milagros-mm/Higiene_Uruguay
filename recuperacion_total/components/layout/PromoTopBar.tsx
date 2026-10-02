import React from 'react';
import { Truck } from 'lucide-react';

export function PromoTopBar() {
  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2">
      <Truck className="h-4 w-4" />
      <span>🚚 Envíos a todo el país en 24hs. ¡Consultá por envío gratis en compras mayores a $2000!</span>
    </div>
  );
}
