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

export interface StorePromotionConfig {
  thresholdAmount: number; // Monto para acceder al beneficio (ej: 25000)
  discountPercent: number; // Porcentaje de descuento (ej: 10)
  benefitTitle: string; // Título promocional
  isActive: boolean; // Si está activa la promo
  bannerText: string; // Texto mostrado en barra/carrito
}

export const DEFAULT_PROMOTION_CONFIG: StorePromotionConfig = {
  thresholdAmount: 25000,
  discountPercent: 10,
  benefitTitle: "10% OFF en el total de tu compra",
  isActive: true,
  bannerText: "¡Superando los $25.000 obtenés un 10% de DESCUENTO automático!",
};

export const PROMO_STORAGE_KEY = 'higiene_uruguay_promo_config';

export function getStoredPromotionConfig(): StorePromotionConfig {
  if (typeof window === 'undefined') return DEFAULT_PROMOTION_CONFIG;
  try {
    const raw = localStorage.getItem(PROMO_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error leyendo config promocional', e);
  }
  return DEFAULT_PROMOTION_CONFIG;
}

export function saveStoredPromotionConfig(config: StorePromotionConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('promo-config-updated'));
  } catch (e) {
    console.error('Error guardando config promocional', e);
  }
}

export interface CouponItem {
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  description: string;
}

export const VALID_COUPONS: Record<string, CouponItem> = {
  HIGIENE10: { code: 'HIGIENE10', type: 'PERCENT', value: 10, description: '10% OFF adicional' },
  PROMO15: { code: 'PROMO15', type: 'PERCENT', value: 15, description: '15% OFF especial' },
  BIENVENIDA: { code: 'BIENVENIDA', type: 'FIXED', value: 2000, description: '$2.000 de descuento' },
};

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
  ];

  if (data.deliveryType === 'PICKUP') {
    lines.push(`🏪 *Modalidad:* Retiro en el local (14 de Julio 14)`);
    if (data.pickupTimeSlot) {
      lines.push(`⏰ *Horario estimado de retiro:* ${data.pickupTimeSlot}`);
    }
  } else if (data.deliveryType === 'BUYER_SHIPPING') {
    lines.push(`🛵 *Modalidad:* Envío a coordinar (a cargo del comprador / cadetería)`);
    if (data.address?.trim()) {
      lines.push(`📍 *Dirección de entrega:* ${data.address.trim()}${data.cornerStreet ? ` (${data.cornerStreet.trim()})` : ''}`);
    }
  } else {
    lines.push(`🚚 *Modalidad:* Envío a domicilio`);
    lines.push(`📍 *Dirección:* ${data.address?.trim() || 'A coordinar'}${data.cornerStreet ? ` (${data.cornerStreet.trim()})` : ''}`);
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
  lines.push(`Subtotal: ${money(subtotal)}`);

  if (data.spendDiscount && data.spendDiscount > 0) {
    lines.push(`🎁 *Descuento por Monto:* -${money(data.spendDiscount)}`);
  }

  if (data.couponDiscount && data.couponDiscount > 0) {
    lines.push(`🏷️ *Cupón (${data.couponCode}):* -${money(data.couponDiscount)}`);
  }

  const final = data.finalTotal !== undefined ? data.finalTotal : subtotal;
  lines.push(`💰 *TOTAL ESTIMADO: ${money(final)}*`);

  const hasInquiry = items.some((item) => item.product.requiresStockInquiry || item.product.isBulk);
  if (hasInquiry) {
    lines.push(`⚠️ *Aviso:* Contiene artículos sueltos sujetos a confirmación de stock físico en local.`);
  }

  if (data.notes && data.notes.trim()) {
    lines.push(`📝 *Observaciones:* ${data.notes.trim()}`);
  }

  lines.push(`----------------------------------------`);
  lines.push(`¡Hola! Quiero confirmar este pedido realizado en la tienda online.`);

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
