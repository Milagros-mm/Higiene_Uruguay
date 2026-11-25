import {
  BackendProduct,
  BackendRubro,
  BackendSubrubro,
  BackendCatalogResponse,
} from '@/backend/types/catalog';

export interface FrontendSubcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  productCount?: number;
}

export interface FrontendCategory {
  id: string;
  name: string;
  slug: string;
  subcategories: FrontendSubcategory[];
  productCount?: number;
}

export interface FrontendProductVariant {
  id: string;
  type: 'tamaño' | 'fragancia' | 'presentacion';
  name: string;
  price?: number;
  inStock: boolean;
}

export interface FrontendProductReview {
  id: string;
  author: string;
  rating: number; // 1 a 5
  comment: string;
  date: string;
}

export interface FrontendProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand?: string;
  content?: string; // ej. "5 L", "10 L", "500 ml"
  description: string;
  instructions?: string;
  warnings?: string;
  suitableSurfaces?: string;

  // Categorías y Subcategorías mapeadas desde el adapter
  category: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };

  // Precios reales
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  transferPrice?: number;
  wholesalePrice?: number;
  wholesaleMinQty?: number;

  // Disponibilidad e imágenes
  inStock: boolean;
  stockQuantity?: number;
  images: string[];
  isIllustrativeImage?: boolean;
  badge?: 'oferta' | 'nuevo' | 'sin_stock';

  // Variantes y reseñas reales
  variants?: FrontendProductVariant[];
  reviews?: FrontendProductReview[];
}

export interface FrontendCatalogData {
  products: FrontendProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  categories: FrontendCategory[];
  availableBrands: string[];
  minPrice: number;
  maxPrice: number;
  sortOptions: Array<{
    key: string;
    label: string;
  }>;
}

/**
 * Adaptador único: Convierte un producto del sistema de origen (rubro/subrubro)
 * al modelo agnóstico del frontend (category/subcategory).
 */
export function adaptBackendProduct(prod: BackendProduct): FrontendProduct {
  return {
    id: prod.id,
    sku: prod.sku,
    slug: prod.slug,
    name: prod.nombre,
    brand: prod.marca,
    content: prod.contenido,
    description: prod.descripcion,
    instructions: prod.modoDeUso,
    warnings: prod.advertencias,
    suitableSurfaces: prod.superficiesAptas,

    category: {
      id: prod.rubroId,
      name: prod.rubroNombre,
      slug: prod.rubroSlug,
    },
    subcategory: prod.subrubroId
      ? {
          id: prod.subrubroId,
          name: prod.subrubroNombre || '',
          slug: prod.subrubroSlug || '',
        }
      : undefined,

    price: prod.precio,
    originalPrice: prod.precioAnterior,
    discountPercentage: prod.descuentoPorcentaje,
    transferPrice: prod.precioTransferencia,
    wholesalePrice: prod.precioMayorista,
    wholesaleMinQty: prod.cantidadMinimaMayorista,

    inStock: prod.enStock,
    stockQuantity: prod.stockCantidad,
    images: prod.imagenes && prod.imagenes.length > 0 ? prod.imagenes : [],
    isIllustrativeImage: prod.imagenEsIlustrativa,
    badge: prod.insignia,

    variants: prod.variantes?.map((v) => ({
      id: v.id,
      type: v.tipo,
      name: v.nombre,
      price: v.precio,
      inStock: v.enStock,
    })),
    reviews: prod.reseñas?.map((r) => ({
      id: r.id,
      author: r.autor,
      rating: r.calificacion,
      comment: r.comentario,
      date: r.fecha,
    })),
  };
}

/**
 * Adaptador: Convierte un rubro del sistema de origen en una categoría visible para el frontend.
 */
export function adaptBackendRubro(rubro: BackendRubro): FrontendCategory {
  return {
    id: rubro.id,
    name: rubro.nombre,
    slug: rubro.slug,
    productCount: rubro.cantidadProductos,
    subcategories: (rubro.subrubros || []).map((sub: BackendSubrubro) => ({
      id: sub.id,
      name: sub.nombre,
      slug: sub.slug,
      categoryId: sub.rubroId,
      productCount: sub.cantidadProductos,
    })),
  };
}

/**
 * Adaptador: Convierte la respuesta completa del catálogo backend al formato de frontend.
 */
export function adaptBackendCatalogResponse(data: BackendCatalogResponse): FrontendCatalogData {
  return {
    products: (data.productos || []).map(adaptBackendProduct),
    total: data.total,
    page: data.pagina,
    pageSize: data.limite,
    totalPages: data.totalPaginas,
    categories: (data.rubros || []).map(adaptBackendRubro),
    availableBrands: data.marcasDisponibles || [],
    minPrice: data.precioMinimo || 0,
    maxPrice: data.precioMaximo || 0,
    sortOptions: (data.ordenesDisponibles || []).map((o) => ({
      key: o.clave,
      label: o.etiqueta,
    })),
  };
}
