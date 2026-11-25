/**
 * Tipos del sistema de origen para Catálogo, Rubros y Subrubros.
 * Se preserva estrictamente la nomenclatura de origen: rubro y subrubro.
 */

export interface BackendSubrubro {
  id: string;
  codigo?: string;
  slug: string;
  nombre: string;
  rubroId: string;
  cantidadProductos?: number;
}

export interface BackendRubro {
  id: string;
  codigo?: string;
  slug: string;
  nombre: string;
  subrubros: BackendSubrubro[];
  cantidadProductos?: number;
}

export interface BackendProductVariant {
  id: string;
  tipo: 'tamaño' | 'fragancia' | 'presentacion';
  nombre: string;
  precio?: number;
  enStock: boolean;
}

export interface BackendProductReview {
  id: string;
  autor: string;
  calificacion: number; // 1 a 5
  comentario: string;
  fecha: string;
}

export interface BackendProduct {
  id: string;
  sku: string;
  codigoBarras?: string;
  slug: string;
  nombre: string;
  marca?: string;
  contenido?: string; // ej. "5 L", "10 L", "500 ml", "x 2500 hojas"
  descripcion: string;
  modoDeUso?: string;
  advertencias?: string;
  superficiesAptas?: string;
  
  // Nomenclatura del sistema de origen
  rubroId: string;
  rubroNombre: string;
  rubroSlug: string;
  subrubroId?: string;
  subrubroNombre?: string;
  subrubroSlug?: string;

  // Precios reales
  precio: number;
  precioAnterior?: number;
  descuentoPorcentaje?: number;
  precioTransferencia?: number;
  precioMayorista?: number;
  cantidadMinimaMayorista?: number;

  // Stock e imágenes
  enStock: boolean;
  stockCantidad?: number;
  imagenes: string[];
  imagenEsIlustrativa?: boolean;

  // Insignias reales del sistema
  insignia?: 'oferta' | 'nuevo' | 'sin_stock';

  // Variantes y reseñas reales
  variantes?: BackendProductVariant[];
  reseñas?: BackendProductReview[];

  fechaCreacion?: string;
}

export interface BackendCatalogFilters {
  rubroSlug?: string;
  subrubroSlug?: string;
  marcas?: string[];
  precioMin?: number;
  precioMax?: number;
  q?: string;
  orden?: 'precio_asc' | 'precio_desc' | 'nombre_asc' | 'nombre_desc' | 'mas_nuevo' | 'mas_viejo' | 'destacado' | 'mas_vendidos';
  pagina?: number;
  limite?: number;
}

export interface BackendCatalogResponse {
  productos: BackendProduct[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
  rubros: BackendRubro[];
  marcasDisponibles: string[];
  precioMinimo: number;
  precioMaximo: number;
  ordenesDisponibles: Array<{
    clave: string;
    etiqueta: string;
  }>;
}
