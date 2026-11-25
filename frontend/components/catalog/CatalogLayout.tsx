'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FrontendCatalogData } from '@/frontend/adapters/productAdapter';
import { getCatalogFromApi } from '@/frontend/services/productApi';
import { LABELS } from '@/frontend/constants/labels';
import { Breadcrumbs } from '@/frontend/components/ui/Breadcrumbs';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/product/ProductSkeleton';
import { CategoryFilterTree } from './CategoryFilterTree';
import { BrandFilterAccordion } from './BrandFilterAccordion';
import { PriceRangeFilter } from './PriceRangeFilter';
import { ActiveFilterChips } from './ActiveFilterChips';
import { CatalogDrawerMobile } from './CatalogDrawerMobile';
import {
  Filter,
  ArrowUpDown,
  ChevronDown,
  RotateCcw,
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface CatalogLayoutProps {
  initialCategorySlug?: string;
  initialSubcategorySlug?: string;
}

export function CatalogLayout({
  initialCategorySlug,
  initialSubcategorySlug,
}: CatalogLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gridTopRef = useRef<HTMLDivElement>(null);

  // 1. Lectura del estado desde la URL (Parámetros visibles)
  const categoryParam =
    searchParams.get('categoria') || initialCategorySlug || undefined;
  const subcategoryParam =
    searchParams.get('subcategoria') || initialSubcategorySlug || undefined;
  const marcasParam = searchParams.get('marca') || '';
  const selectedBrands = marcasParam
    ? marcasParam.split(',').map((b) => b.trim()).filter(Boolean)
    : [];
  const precioMinParam = searchParams.get('precio_min')
    ? Number(searchParams.get('precio_min'))
    : '';
  const precioMaxParam = searchParams.get('precio_max')
    ? Number(searchParams.get('precio_max'))
    : '';
  const qParam = searchParams.get('q') || '';
  const ordenParam = searchParams.get('orden') || 'destacado';
  const paginaParam = searchParams.get('pagina')
    ? Number(searchParams.get('pagina'))
    : 1;

  // 2. Estado de datos, carga y error
  const [catalogData, setCatalogData] = useState<FrontendCatalogData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // 3. Sincronización del estado con la URL
  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Al cambiar un filtro principal, reiniciamos a la página 1
    if (!('pagina' in updates)) {
      params.delete('pagina');
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'todas') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    const basePath = '/productos';
    router.push(queryString ? `${basePath}?${queryString}` : basePath, { scroll: false });
  };

  // 4. Carga de datos vía API ante cualquier cambio de la URL
  const loadCatalog = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getCatalogFromApi({
        categoria: categoryParam,
        subcategoria: subcategoryParam,
        marcas: selectedBrands,
        precio_min: precioMinParam,
        precio_max: precioMaxParam,
        q: qParam,
        orden: ordenParam,
        pagina: paginaParam,
        limite: 12,
      });

      setCatalogData(data);
    } catch (err: any) {
      console.error(err);
      setError(LABELS.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, [
    categoryParam,
    subcategoryParam,
    marcasParam,
    precioMinParam,
    precioMaxParam,
    qParam,
    ordenParam,
    paginaParam,
  ]);

  // Manejadores de interacción de filtros
  const handleSelectCategory = (catSlug?: string, subcatSlug?: string) => {
    updateUrl({
      categoria: catSlug || null,
      subcategoria: subcatSlug || null,
    });
  };

  const handleBrandsChange = (brands: string[]) => {
    updateUrl({
      marca: brands.length > 0 ? brands.join(',') : null,
    });
  };

  const handleApplyPrice = (min?: number, max?: number) => {
    updateUrl({
      precio_min: typeof min === 'number' ? min.toString() : null,
      precio_max: typeof max === 'number' ? max.toString() : null,
    });
  };

  const handleSortChange = (newOrder: string) => {
    updateUrl({
      orden: newOrder === 'destacado' ? null : newOrder,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({
      pagina: newPage > 1 ? newPage.toString() : null,
    });

    if (gridTopRef.current) {
      const yOffset = -120;
      const element = gridTopRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  const handleClearAllFilters = () => {
    router.push('/productos', { scroll: false });
  };

  // Datos derivados para títulos y breadcrumb
  const currentCategory = catalogData?.categories.find(
    (c) => c.slug === categoryParam
  );
  const currentSubcategory = currentCategory?.subcategories.find(
    (s) => s.slug === subcategoryParam
  );

  // Título visible de la página
  const pageTitle = currentSubcategory
    ? currentSubcategory.name
    : currentCategory
    ? currentCategory.name
    : qParam
    ? LABELS.resultsFor(qParam)
    : 'Catálogo de Productos';

  // Breadcrumbs según selección
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    {
      label: currentCategory ? 'Catálogo' : 'Catálogo de Productos',
      href: currentCategory ? '/productos' : undefined,
    },
    ...(currentCategory
      ? [
          {
            label: currentCategory.name,
            href: currentSubcategory
              ? `/productos?categoria=${currentCategory.slug}`
              : undefined,
          },
        ]
      : []),
    ...(currentSubcategory ? [{ label: currentSubcategory.name }] : []),
  ];

  return (
    <div className="w-full">
      {/* 1. Barra Superior Escritorio: Breadcrumb */}
      <div className="mb-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* 2. Cabecera: Título, Contador de Resultados y Selector de Orden */}
      <div
        ref={gridTopRef}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80 mb-6"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-blue tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {catalogData
              ? LABELS.productsCount(catalogData.total)
              : 'Cargando...'}
          </p>
        </div>

        {/* Controles Superiores: Botón Filtrar Móvil + Selector de Orden */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          {/* Botón Filtrar para Móviles */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-2xs transition-colors cursor-pointer"
            aria-label="Abrir panel de filtros"
          >
            <Filter className="w-4 h-4 text-brand-cyan" />
            <span>{LABELS.filter}</span>
            {selectedBrands.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand-cyan text-white text-[10px] font-bold flex items-center justify-center">
                {selectedBrands.length}
              </span>
            )}
          </button>

          {/* Selector de Orden */}
          <div className="relative flex-1 sm:flex-initial sm:w-60">
            <label htmlFor="sort-select" className="sr-only">
              {LABELS.sortBy}
            </label>
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="sort-select"
              value={ordenParam}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full h-10 pl-9 pr-8 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan cursor-pointer appearance-none shadow-2xs transition-colors"
            >
              {catalogData?.sortOptions && catalogData.sortOptions.length > 0 ? (
                catalogData.sortOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))
              ) : (
                <option value="destacado">Destacados</option>
              )}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Chips de Filtros Activos con opción de limpiar */}
      <ActiveFilterChips
        categoryName={currentCategory?.name}
        subcategoryName={currentSubcategory?.name}
        brands={selectedBrands}
        minPrice={precioMinParam}
        maxPrice={precioMaxParam}
        searchQuery={qParam}
        onRemoveCategory={() => handleSelectCategory(undefined, undefined)}
        onRemoveSubcategory={() => handleSelectCategory(categoryParam, undefined)}
        onRemoveBrand={(b) =>
          handleBrandsChange(selectedBrands.filter((brand) => brand !== b))
        }
        onRemovePrice={() => handleApplyPrice(undefined, undefined)}
        onRemoveSearchQuery={() => updateUrl({ q: null })}
        onClearAll={handleClearAllFilters}
      />

      {/* 4. Layout Principal: Barra Lateral (Escritorio) + Grilla de Productos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Barra Lateral de Filtros (Escritorio - 3 bloques) */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-6 sticky top-28">
          {/* Bloque 1: Categorías y Subcategorías */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {LABELS.categories}
            </h2>
            <CategoryFilterTree
              categories={catalogData?.categories || []}
              activeCategorySlug={categoryParam}
              activeSubcategorySlug={subcategoryParam}
              onSelect={handleSelectCategory}
            />
          </div>

          {/* Bloque 2: Marcas */}
          <BrandFilterAccordion
            availableBrands={catalogData?.availableBrands || []}
            selectedBrands={selectedBrands}
            onChange={handleBrandsChange}
          />

          {/* Bloque 3: Rango de Precio */}
          <PriceRangeFilter
            minPrice={catalogData?.minPrice || 0}
            maxPrice={catalogData?.maxPrice || 0}
            initialMin={precioMinParam}
            initialMax={precioMaxParam}
            onApply={handleApplyPrice}
          />
        </aside>

        {/* Grilla de Productos y Paginación */}
        <main className="lg:col-span-9 flex flex-col justify-between min-h-[450px]">
          {/* Estado de Error */}
          {error ? (
            <div className="bg-white rounded-2xl border border-red-200 p-8 text-center my-6">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 mb-4">{error}</p>
              <button
                type="button"
                onClick={loadCatalog}
                className="px-6 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
              >
                {LABELS.retry}
              </button>
            </div>
          ) : isLoading ? (
            /* Estado Cargando (Skeletons) */
            <ProductGridSkeleton count={8} />
          ) : catalogData && catalogData.products.length > 0 ? (
            /* Grilla Responsive (4 cols desktop, 2 tablet, 1-2 móvil) */
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {catalogData.products.map((product) => (
                  <div key={product.id} className="h-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Paginación real con scroll al inicio de la grilla */}
              {catalogData.totalPages > 1 && (
                <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handlePageChange(catalogData.page - 1)}
                    disabled={catalogData.page <= 1}
                    className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{LABELS.previousPage}</span>
                  </button>

                  <span className="text-xs font-semibold text-slate-500">
                    {LABELS.pageIndicator(catalogData.page, catalogData.totalPages)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handlePageChange(catalogData.page + 1)}
                    disabled={catalogData.page >= catalogData.totalPages}
                    className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>{LABELS.nextPage}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Estado Sin Resultados */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-100 text-brand-cyan mx-auto flex items-center justify-center mb-4">
                <Package className="w-8 h-8 opacity-70" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1.5">
                {LABELS.noResultsTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                {LABELS.noResultsMessage}
              </p>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-full bg-brand-cyan hover:bg-brand-cyan-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{LABELS.clearFilters}</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 5. Drawer Accesible para Móviles */}
      <CatalogDrawerMobile
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        categories={catalogData?.categories || []}
        activeCategorySlug={categoryParam}
        activeSubcategorySlug={subcategoryParam}
        onSelectCategory={(cat, subcat) => {
          handleSelectCategory(cat, subcat);
        }}
        availableBrands={catalogData?.availableBrands || []}
        selectedBrands={selectedBrands}
        onChangeBrands={handleBrandsChange}
        minPrice={catalogData?.minPrice || 0}
        maxPrice={catalogData?.maxPrice || 0}
        selectedMinPrice={precioMinParam}
        selectedMaxPrice={precioMaxParam}
        onApplyPrice={handleApplyPrice}
        totalResults={catalogData?.total || 0}
        onClearAll={handleClearAllFilters}
      />
    </div>
  );
}
