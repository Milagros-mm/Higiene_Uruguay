import { Category, Product, Benefit, StoreInfo } from '@/types';

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
    originalPrice: 420,
    categoryId: '3',
    images: ['/images/media_1790969893970.png'],
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
    images: ['/images/media_1790970022481.png'],
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
    images: ['/images/media_1790970041386.png'],
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
    images: ['/images/media_1790970057378.png'],
    inStock: true,
    badges: ['Nuevo'],
  },
  {
    id: 'p5',
    slug: 'alcohol-en-gel-5l',
    name: 'Alcohol en Gel 70% 5L',
    description: 'Antiséptico de rápida absorción con glicerina hidratante.',
    price: 690,
    originalPrice: 780,
    categoryId: '2',
    images: ['/images/media_1790970449715.png'],
    inStock: true,
    badges: ['Oferta'],
  },
  {
    id: 'p6',
    slug: 'papel-higienico-industrial',
    name: 'Papel Higiénico Institucional x8',
    description: 'Bobinas de doble hoja 300m para dispensers de alto tránsito.',
    price: 1150,
    categoryId: '4',
    images: ['/images/media_1790970463819.png'],
    inStock: true,
    badges: ['Más Vendido'],
  },
];

export const benefits: Benefit[] = [
  { id: 'b1', title: 'Envío a todo el país', description: 'Entregas rápidas y seguras', icon: 'Truck' },
  { id: 'b2', title: 'Precios de fábrica', description: 'Mejor relación calidad-precio', icon: 'Tag' },
  { id: 'b4', title: 'Atención personalizada', description: 'Asesoramiento para tu negocio', icon: 'Headphones' },
];

export const storeInfo: StoreInfo = {
  name: 'Higiene Uruguay',
  description: 'Somos tu aliado estratégico en productos de limpieza profesional, desinfección y mantenimiento de piscinas. Con años de experiencia en el mercado uruguayo, brindamos soluciones tanto para el hogar como para la industria con la máxima calidad y asesoramiento.',
  imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop',
  address: 'Montevideo, Uruguay',
  businessHours: 'Lunes a Viernes: 08:30 a 18:00hs | Sábados: 09:00 a 13:00hs',
  phone: '+598 99 123 456',
};

export const brands = [
  { id: 'b1', name: 'Diversey', logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=60' },
  { id: 'b2', name: 'Ecolab', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=60' },
  { id: 'b3', name: 'Kimberly-Clark', logoUrl: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=300&auto=format&fit=crop&q=60' },
  { id: 'b4', name: 'Spartan', logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=300&auto=format&fit=crop&q=60' },
  { id: 'b5', name: '3M Profesional', logoUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&auto=format&fit=crop&q=60' },
  { id: 'b6', name: 'Elite Professional', logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&auto=format&fit=crop&q=60' },
];

export const heroSlides = [
  {
    id: 's1',
    badge: 'Líder en Higiene Profesional',
    title: 'Desinfección y Limpieza de Alto Rendimiento',
    subtitle: 'Abastecemos a empresas, instituciones y hogares con los mejores productos químicos e insumos de Uruguay.',
    ctaText: 'Ver Productos Destacados',
    ctaLink: '#destacados',
    imageUrl: '/images/media_1790969435891.png',
  },
  {
    id: 's2',
    badge: 'Temporada Piscinas',
    title: 'Mantené el Agua Cristalina Todo el Año',
    subtitle: 'Cloros, alguicidas, clarificadores y kits de medición con entrega rápida a todo el país.',
    ctaText: 'Explorar Piscinas',
    ctaLink: '#categorias',
    imageUrl: '/images/media_1790969453761.png',
  },
  {
    id: 's3',
    badge: 'Institucional & Empresas',
    title: 'Soluciones Integrales para Empresas',
    subtitle: 'Precios mayoristas, dispensadores en comodato y atención personalizada para tu negocio.',
    ctaText: 'Conocer Nuestra Tienda',
    ctaLink: '#tienda',
    imageUrl: '/images/media_1790969488805.png',
  },
];

