/**
 * Archivo centralizado de etiquetas de texto visibles para el cliente.
 * 
 * Regla de Oro:
 * - En el backend y la API se mantiene 'rubro' y 'subrubro'.
 * - En TODO texto visible para el cliente (títulos, breadcrumbs, chips de filtros,
 *   mensajes, aria-labels y metadatos) se utiliza estrictamente "Categoría" y "Subcategoría".
 */

export const LABELS = {
  // Nomenclatura visible
  category: 'Categoría',
  categories: 'Categorías',
  subcategory: 'Subcategoría',
  subcategories: 'Subcategorías',
  allCategories: 'Todas las categorías',
  allSubcategories: 'Todas',

  // Filtros
  brand: 'Marca',
  brands: 'Marcas',
  searchBrandsPlaceholder: 'Buscar marcas...',
  price: 'Precio',
  priceFrom: 'Desde',
  priceTo: 'Hasta',
  apply: 'Aplicar',
  filter: 'Filtrar',
  filters: 'Filtros',
  clearFilters: 'Limpiar filtros',
  activeFilters: 'Filtros aplicados:',

  // Ordenamiento
  sortBy: 'Ordenar por',
  defaultSort: 'Destacados',

  // Búsqueda y Resultados
  resultsFor: (term: string) => `Resultados para: "${term}"`,
  productsCount: (count: number) => `${count} ${count === 1 ? 'producto' : 'productos'}`,
  viewResults: (count: number) => `Ver ${count} ${count === 1 ? 'resultado' : 'resultados'}`,
  noResultsTitle: 'No encontramos productos',
  noResultsMessage: 'Probá ajustando o limpiando los filtros seleccionados para ver más resultados.',

  // Tarjeta de Producto
  addToCart: 'Agregar',
  addedToCart: '¡Agregado!',
  addingToCart: 'Agregando...',
  outOfStock: 'Sin stock',
  illustrativeImage: 'Imagen ilustrativa',
  transferDiscountText: 'con transferencia',
  viewProductAria: (name: string) => `Ver detalle de ${name}`,

  // Ficha de Producto (PDP)
  quantity: 'Cantidad',
  decreaseQuantity: 'Disminuir cantidad',
  increaseQuantity: 'Aumentar cantidad',
  addToCartButton: (totalPriceText: string) => `AGREGAR AL CARRITO • ${totalPriceText}`,
  wholesalePriceNotice: (minQty: number) => `Precio mayorista llevando a partir de ${minQty} unidades:`,
  wholesaleTitle: 'Venta Mayorista',
  retailPrice: 'Precio minorista',
  wholesalePrice: 'Precio mayorista',

  // Secciones / Acordeones PDP
  description: 'Descripción',
  instructions: 'Modo de uso y dilución',
  warnings: 'Advertencias y seguridad',
  surfaces: 'Superficies recomendadas',

  // Entrega
  deliveryBlockTitle: 'Entrega y Retiro',
  storePickupTitle: 'Retiro gratis en nuestro local',
  storePickupAddress: '14 de Julio 14, Concepción del Uruguay',
  homeDeliveryTitle: 'Envío en Concepción del Uruguay',
  homeDeliveryDesc: 'Coordinación directa de entrega a domicilio',

  // Contacto / WhatsApp
  whatsappInquiry: 'CONSULTAR POR WHATSAPP',
  whatsappMessage: (productName: string, priceText: string) =>
    `Hola Higiene Uruguay! Quiero consultar disponibilidad del producto: *${productName}* (${priceText})`,

  // Relacionados
  relatedProductsTitle: 'Productos Relacionados',
  viewAllCatalog: 'Ver todo el catálogo →',

  // Paginación
  previousPage: 'Anterior',
  nextPage: 'Siguiente',
  pageIndicator: (current: number, total: number) => `Página ${current} de ${total}`,
  retry: 'Reintentar',
  errorMessage: 'Ocurrió un error al cargar el catálogo. Por favor intentá nuevamente.',
};
