import { Product, Category } from '@/types';
import { allProducts, categories as mockCategories } from '@/frontend/mock/mock-data';

export interface ProductFilterOptions {
  query?: string;
  category?: string;
  brand?: string | string[];
  isBulk?: boolean;
  onSale?: boolean;
  inStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  limit?: number;
  offset?: number;
}

export interface BrandFilterItem {
  name: string;
  count: number;
}

export interface CategoryFilterItem {
  id: string;
  slug: string;
  name: string;
  count: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  categories: CategoryFilterItem[];
  brands: BrandFilterItem[];
  priceBounds: {
    min: number;
    max: number;
  };
}

/**
 * Enriquecer producto con datos de categoría legibles y sanitizar
 * para asegurar que nunca se expongan campos internos o sensibles.
 */
function enrichAndSanitize(product: Product): Product {
  const cat = mockCategories.find((c) => c.id === product.categoryId || c.slug === product.categoryId);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    compareAtPrice: product.compareAtPrice,
    categoryId: product.categoryId,
    categoryName: cat ? cat.name : 'General',
    categorySlug: cat ? cat.slug : 'general',
    images: product.images || [],
    inStock: product.inStock,
    badges: product.badges || [],
    sku: product.sku,
    brand: product.brand,
    isBulk: product.isBulk,
    bulkUnit: product.bulkUnit,
    bulkPresentation: product.bulkPresentation,
    dilutionInstructions: product.dilutionInstructions,
    suitableSurfaces: product.suitableSurfaces,
    yieldInfo: product.yieldInfo,
    precautions: product.precautions,
  };
}

/**
 * Servicio de productos backend que centraliza la búsqueda y filtrado.
 */
export async function getProducts(options: ProductFilterOptions = {}): Promise<ProductsResponse> {
  const {
    query,
    category,
    brand,
    isBulk,
    onSale,
    inStockOnly,
    minPrice,
    maxPrice,
    sortBy = 'relevance',
    limit,
    offset = 0,
  } = options;

  let filtered = allProducts.map(enrichAndSanitize);

  // 1. Filtro por categoría (id o slug)
  if (category && category.trim() !== '' && category.toLowerCase() !== 'todas') {
    const catLower = category.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.categoryId.toLowerCase() === catLower ||
        (p.categorySlug && p.categorySlug.toLowerCase() === catLower)
    );
  }

  // 2. Filtro por búsqueda textual (nombre, descripción, marca, categoría)
  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter((product) => {
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchBrand = product.brand ? product.brand.toLowerCase().includes(q) : false;
      const matchCategory = product.categoryName ? product.categoryName.toLowerCase().includes(q) : false;
      const matchSku = product.sku ? product.sku.toLowerCase().includes(q) : false;
      const matchBadges = product.badges.some((b) => b.toLowerCase().includes(q));
      return matchName || matchDesc || matchBrand || matchCategory || matchSku || matchBadges;
    });
  }

  // 3. Filtro por Marca
  if (brand) {
    const selectedBrands = Array.isArray(brand) ? brand : [brand];
    if (selectedBrands.length > 0 && !selectedBrands.includes('todas')) {
      filtered = filtered.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }
  }

  // 4. Filtro por Tipo de producto: Suelto vs Envasado
  if (typeof isBulk === 'boolean') {
    filtered = filtered.filter((p) => (isBulk ? !!p.isBulk : !p.isBulk));
  }

  // 5. Filtro por Ofertas
  if (onSale) {
    filtered = filtered.filter((p) => p.originalPrice && p.originalPrice > p.price);
  }

  // 6. Filtro por Disponibilidad
  if (inStockOnly) {
    filtered = filtered.filter((p) => p.inStock);
  }

  // 7. Filtro por Rango de Precio
  if (typeof minPrice === 'number' && !isNaN(minPrice)) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }
  if (typeof maxPrice === 'number' && !isNaN(maxPrice)) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  // 8. Ordenamiento
  switch (sortBy) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name_asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      break;
    case 'name_desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name, 'es'));
      break;
    case 'relevance':
    default:
      break;
  }

  // Categorías con conteos
  const enrichedAll = allProducts.map(enrichAndSanitize);
  const categoriesList: CategoryFilterItem[] = mockCategories.map((c) => {
    const count = enrichedAll.filter(
      (p) => p.categoryId === c.id || p.categorySlug === c.slug
    ).length;
    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      count,
    };
  });

  // Marcas con sus conteos
  const brandCountMap = new Map<string, number>();
  enrichedAll.forEach((p) => {
    if (p.brand) {
      brandCountMap.set(p.brand, (brandCountMap.get(p.brand) || 0) + 1);
    }
  });

  const brandsList: BrandFilterItem[] = Array.from(brandCountMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Límites de precio
  const allPrices = enrichedAll.map((p) => p.price);
  const priceBounds = {
    min: Math.min(...allPrices),
    max: Math.max(...allPrices),
  };

  const total = filtered.length;
  const paginated = typeof limit === 'number' ? filtered.slice(offset, offset + limit) : filtered;

  return {
    products: paginated,
    total,
    categories: categoriesList,
    brands: brandsList,
    priceBounds,
  };
}

/**
 * Obtener un producto por su slug o ID sanitizado
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
  const product = allProducts.find(
    (p) => p.slug.toLowerCase() === cleanSlug || p.id.toLowerCase() === cleanSlug
  );
  if (!product) return null;
  return enrichAndSanitize(product);
}

/**
 * Obtener productos relacionados
 */
export async function getRelatedProducts(currentProductId: string, limit: number = 4): Promise<Product[]> {
  const current = allProducts.find((p) => p.id === currentProductId);
  if (!current) return allProducts.slice(0, limit).map(enrichAndSanitize);

  const related = allProducts.filter((p) => {
    if (p.id === currentProductId) return false;
    return p.categoryId === current.categoryId || (current.brand && p.brand === current.brand);
  });

  if (related.length < limit) {
    const remaining = allProducts.filter((p) => p.id !== currentProductId && !related.includes(p));
    return [...related, ...remaining].slice(0, limit).map(enrichAndSanitize);
  }

  return related.slice(0, limit).map(enrichAndSanitize);
}

/**
 * Obtener todas las categorías públicas
 */
export async function getAllCategories(): Promise<Category[]> {
  return mockCategories;
}
