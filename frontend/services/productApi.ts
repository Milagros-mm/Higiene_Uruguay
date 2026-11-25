import {
  FrontendCatalogData,
  FrontendProduct,
  adaptBackendCatalogResponse,
  adaptBackendProduct,
} from '@/frontend/adapters/productAdapter';
import { BackendCatalogResponse, BackendProduct } from '@/backend/types/catalog';

export interface FrontendCatalogFilters {
  categoria?: string;
  subcategoria?: string;
  marcas?: string[];
  precio_min?: number | '';
  precio_max?: number | '';
  q?: string;
  orden?: string;
  pagina?: number;
  limite?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Consulta el catálogo de productos a través de la API y lo adapta al modelo del frontend.
 */
export async function getCatalogFromApi(
  filters: FrontendCatalogFilters = {}
): Promise<FrontendCatalogData> {
  const params = new URLSearchParams();

  if (filters.categoria && filters.categoria !== 'todas') {
    params.set('categoria', filters.categoria);
  }
  if (filters.subcategoria && filters.subcategoria !== 'todas') {
    params.set('subcategoria', filters.subcategoria);
  }
  if (filters.marcas && filters.marcas.length > 0) {
    params.set('marcas', filters.marcas.join(','));
  }
  if (typeof filters.precio_min === 'number') {
    params.set('precio_min', filters.precio_min.toString());
  }
  if (typeof filters.precio_max === 'number') {
    params.set('precio_max', filters.precio_max.toString());
  }
  if (filters.q && filters.q.trim() !== '') {
    params.set('q', filters.q.trim());
  }
  if (filters.orden) {
    params.set('orden', filters.orden);
  }
  if (filters.pagina) {
    params.set('pagina', filters.pagina.toString());
  }
  if (filters.limite) {
    params.set('limite', filters.limite.toString());
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/api/products${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Error al consultar catálogo: ${response.statusText}`);
  }

  const rawData: BackendCatalogResponse = await response.json();
  return adaptBackendCatalogResponse(rawData);
}

/**
 * Consulta el detalle de un producto por su slug y lo adapta al frontend.
 */
export async function getProductDetailFromApi(slug: string): Promise<{
  product: FrontendProduct;
  related: FrontendProduct[];
}> {
  const url = `${API_BASE_URL}/api/products/${encodeURIComponent(slug)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Producto no encontrado (${response.status})`);
  }

  const rawData: { producto: BackendProduct; relacionados: BackendProduct[] } =
    await response.json();

  return {
    product: adaptBackendProduct(rawData.producto),
    related: (rawData.relacionados || []).map(adaptBackendProduct),
  };
}
