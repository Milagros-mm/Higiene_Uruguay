export const STORE = {
  name: "Higiene Uruguay",
  address: "14 de Julio 14, Concepción del Uruguay, Entre Ríos",
  postalCode: "E3260JIB",
  phoneDisplay: "03442 33-4343",
  phoneTel: "+543442334343",
  whatsapp: "5493442334343",
  instagram: "higieneuruguay",
  instagramUrl: "https://instagram.com/higieneuruguay",
  mapsUrl: "https://maps.app.goo.gl/CKugiZ3vtFDUKaSU9",
  hours: {
    weekdays: "Lun a Vie: 8:30–12:30 y 16:00–20:00 hs",
    saturday: "Sáb: 9:00–12:30 y 17:00–20:00 hs",
    sunday: "Dom: cerrado",
  },
  freeShippingThreshold: 25000,
  city: "Concepción del Uruguay",
};

export const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

import type { CartItem, CheckoutFormData } from "@/types";

export function buildWhatsAppOrderMessage(
  data: CheckoutFormData,
  items: CartItem[],
  subtotal: number
): string {
  const lines: string[] = [
    `🛒 *NUEVO PEDIDO - HIGIENE URUGUAY*`,
    `----------------------------------------`,
    `👤 *Cliente:* ${data.customerName.trim()}`,
    `📱 *Teléfono:* ${data.phone.trim()}`,
    `🚚 *Modalidad:* ${data.deliveryType === 'DELIVERY' ? 'Envío a domicilio' : 'Retiro en el local'}`,
  ];

  if (data.deliveryType === 'DELIVERY') {
    lines.push(`📍 *Dirección:* ${data.address?.trim() || 'A coordinar'}${data.cornerStreet ? ` (entre ${data.cornerStreet.trim()})` : ''}`);
    if (data.city) lines.push(`🏙️ *Localidad:* ${data.city.trim()}`);
  } else {
    lines.push(`🏪 *Punto de Retiro:* 14 de Julio 14, Concepción del Uruguay`);
  }

  lines.push(`💳 *Forma de Pago:* ${data.paymentMethod === 'TRANSFERENCIA' ? 'Transferencia Bancaria' : 'Efectivo'}`);
  lines.push(`----------------------------------------`);
  lines.push(`📦 *DETALLE DE ARTÍCULOS:*`);

  items.forEach((item) => {
    const unitText = item.selectedUnit ? ` (${item.selectedUnit})` : '';
    const bulkTag = item.product.isBulk ? ' [Suelto]' : '';
    lines.push(`• *${item.quantity}x* ${item.product.name}${unitText}${bulkTag} — ${money(item.totalPrice)}`);
  });

  lines.push(`----------------------------------------`);
  lines.push(`💰 *TOTAL ESTIMADO: ${money(subtotal)}*`);

  const hasInquiry = items.some((item) => item.product.requiresStockInquiry || item.product.isBulk);
  if (hasInquiry) {
    lines.push(`⚠️ *Aviso:* Contiene artículos sueltos sujetos a confirmación de stock en local.`);
  }

  if (data.notes && data.notes.trim()) {
    lines.push(`📝 *Observaciones:* ${data.notes.trim()}`);
  }

  lines.push(`----------------------------------------`);
  lines.push(`¡Hola! Quisiera confirmar este pedido realizado en la tienda online.`);

  return lines.join('\n');
}

export function getWhatsAppOrderUrl(
  data: CheckoutFormData,
  items: CartItem[],
  subtotal: number
): string {
  const text = buildWhatsAppOrderMessage(data, items, subtotal);
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;
}
