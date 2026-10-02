import { Category, Product, Benefit, StoreInfo } from '../types';

export const categories: Category[] = [
  { id: '1', slug: 'limpieza-hogar', name: 'Limpieza Hogar', icon: 'Home', itemCount: 45, featured: true },
  { id: '2', slug: 'desinfeccion', name: 'Desinfección', icon: 'ShieldCheck', itemCount: 23, featured: true },
  { id: '3', slug: 'piscinas', name: 'Piscinas', icon: 'Waves', itemCount: 18, featured: true },
  { id: '4', slug: 'institucional', name: 'Institucional', icon: 'Building2', itemCount: 56, featured: false },
  { id: '5', slug: 'accesorios', name: 'Accesorios', icon: 'Wrench', itemCount: 34, featured: false },
  { id: '6', slug: 'jardin', name: 'Jardín', icon: 'Leaf', itemCount: 12, featured: false },
];

export const featuredProducts: Product[] = [
  {
    id: 'p1',
    slug: 'cloro-liquido-10l',
    name: 'Cloro Líquido 10L',
    description: 'Cloro líquido de alta concentración, ideal para desinfección profunda de superficies y piscinas.',
    price: 350,
    categoryId: '3',
    images: ['https://images.unsplash.com/photo-1584820927498-cafe4c23ba04?q=80&w=600&auto=format&fit=crop'],
    inStock: true,
    badges: ['Más Vendido'],
  },
  {
    id: 'p2',
    slug: 'detergente-enzimatico',
    name: 'Detergente Enzimático 5L',
    description: 'Detergente con enzimas activas para remover manchas orgánicas persistentes.',
    price: 850,
    originalPrice: 990,
    categoryId: '2',
    images: ['https://images.unsplash.com/photo-1585675100414-22cb2758178a?q=80&w=600&auto=format&fit=crop'],
    inStock: true,
    badges: ['Oferta'],
  },
  {
    id: 'p3',
    slug: 'desengrasante-industrial',
    name: 'Desengrasante Industrial 20L',
    description: 'Fórmula potente para cocinas industriales y talleres.',
    price: 2100,
    categoryId: '4',
    images: ['https://images.unsplash.com/photo-1628148810757-0a44733ebfb0?q=80&w=600&auto=format&fit=crop'],
    inStock: true,
    badges: [],
  },
  {
    id: 'p4',
    slug: 'limpiavidrios-gatillo',
    name: 'Limpiavidrios con Gatillo 500ml',
    description: 'Brillo sin vetas para todo tipo de cristales y espejos.',
    price: 120,
    categoryId: '1',
    images: ['https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?q=80&w=600&auto=format&fit=crop'],
    inStock: true,
    badges: ['Nuevo'],
  },
];

export const benefits: Benefit[] = [
  { id: 'b1', title: 'Envío a todo el país', description: 'Entregas rápidas y seguras', icon: 'Truck' },
  { id: 'b2', title: 'Precios de fábrica', description: 'Mejor relación calidad-precio', icon: 'Tag' },
  { id: 'b3', title: 'Calidad certificada', description: 'Productos aprobados por el MSP', icon: 'Award' },
  { id: 'b4', title: 'Atención personalizada', description: 'Asesoramiento para tu negocio', icon: 'Headphones' },
];

export const storeInfo: StoreInfo = {
  name: 'Higiene Uruguay',
  description: 'Somos tu aliado estratégico en productos de limpieza profesional, desinfección y mantenimiento de piscinas. Con años de experiencia en el mercado uruguayo, brindamos soluciones tanto para el hogar como para la industria.',
  imageUrl: 'https://images.unsplash.com/photo-1555529771-835f59bfc50c?q=80&w=800&auto=format&fit=crop',
  address: 'Montevideo, Uruguay',
  businessHours: 'Lunes a Viernes: 08:30 a 18:00hs | Sábados: 09:00 a 13:00hs',
  phone: '+598 99 123 456',
};
