export type Category = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  itemCount: number;
  featured: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  compareAtPrice?: number;
  categoryId: string;
  images: string[];
  inStock: boolean;
  badges: string[];
  sku?: string;
  barcode?: string;
  brand?: string;
  isBulk?: boolean;
  bulkUnit?: string;
  bulkPresentation?: string;
  includesContainer?: boolean;
  requiresStockInquiry?: boolean;
  stock?: number;
  isOnSale?: boolean;
  volumeDiscounts?: Array<{ minQty: number; unitPrice: number }>;
  fragrance?: string;
  dilutionInstructions?: string;
  suitableSurfaces?: string;
  yieldInfo?: string;
  precautions?: string;
};

export type Benefit = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type StoreInfo = {
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  businessHours: string;
  phone: string;
  email?: string;
};

export type Brand = {
  id: string;
  name: string;
  logoUrl: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  imageUrl: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedUnit: string;
  price: number;
  totalPrice: number;
};

export type CheckoutFormData = {
  customerName: string;
  phone: string;
  deliveryType: 'PICKUP' | 'BUYER_SHIPPING' | 'DELIVERY';
  pickupTimeSlot?: string;
  address?: string;
  cornerStreet?: string;
  city?: string;
  notes?: string;
  paymentMethod: 'TRANSFERENCIA' | 'EFECTIVO';
  couponCode?: string;
  couponDiscount?: number;
  spendDiscount?: number;
  finalTotal?: number;
};
