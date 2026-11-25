import {
  BackendRubro,
  BackendProduct,
  BackendCatalogFilters,
  BackendCatalogResponse,
} from '@/backend/types/catalog';

export const rubrosOriginales: BackendRubro[] = [
  {
    id: 'rub-01',
    codigo: '01',
    slug: 'limpieza-y-quimicos',
    nombre: 'Limpieza y Químicos',
    subrubros: [
      { id: 'sub-01-01', codigo: '0101', slug: 'pisos-y-superficies', nombre: 'Pisos y Superficies', rubroId: 'rub-01' },
      { id: 'sub-01-02', codigo: '0102', slug: 'desengrasantes', nombre: 'Desengrasantes', rubroId: 'rub-01' },
      { id: 'sub-01-03', codigo: '0103', slug: 'lavanderia', nombre: 'Lavandería', rubroId: 'rub-01' },
    ],
  },
  {
    id: 'rub-02',
    codigo: '02',
    slug: 'desinfeccion',
    nombre: 'Desinfección',
    subrubros: [
      { id: 'sub-02-01', codigo: '0201', slug: 'alcoholes-y-geles', nombre: 'Alcoholes y Geles', rubroId: 'rub-02' },
      { id: 'sub-02-02', codigo: '0202', slug: 'amonios-y-virucidas', nombre: 'Amonios y Virucidas', rubroId: 'rub-02' },
    ],
  },
  {
    id: 'rub-03',
    codigo: '03',
    slug: 'piscinas',
    nombre: 'Piscinas',
    subrubros: [
      { id: 'sub-03-01', codigo: '0301', slug: 'cloros', nombre: 'Cloros', rubroId: 'rub-03' },
      { id: 'sub-03-02', codigo: '0302', slug: 'alguicidas-y-clarificadores', nombre: 'Alguicidas y Clarificadores', rubroId: 'rub-03' },
    ],
  },
  {
    id: 'rub-04',
    codigo: '04',
    slug: 'institucional-y-papeleria',
    nombre: 'Institucional y Papelería',
    subrubros: [
      { id: 'sub-04-01', codigo: '0401', slug: 'papel-higienico-y-toallas', nombre: 'Papel Higiénico y Toallas', rubroId: 'rub-04' },
      { id: 'sub-04-02', codigo: '0402', slug: 'jabones-y-dispensers', nombre: 'Jabones y Dispensers', rubroId: 'rub-04' },
    ],
  },
  {
    id: 'rub-05',
    codigo: '05',
    slug: 'accesorios-y-herramientas',
    nombre: 'Accesorios y Herramientas',
    subrubros: [
      { id: 'sub-05-01', codigo: '0501', slug: 'mopas-y-panos', nombre: 'Mopas y Paños', rubroId: 'rub-05' },
    ],
  },
];

export const productosBackend: BackendProduct[] = [
  {
    id: 'prod-001',
    sku: '010001',
    codigoBarras: '7791234560012',
    slug: 'cloro-liquido-concentrado-10l',
    nombre: 'Cloro Líquido Concentrado',
    marca: 'Higiene Uruguay',
    contenido: '10 L',
    descripcion: 'Cloro líquido de alta pureza (100 g/L de cloro activo). Formulado especialmente para la desinfección profunda y mantenimiento higiénico del agua de piscinas.',
    modoDeUso: 'Mantenimiento de piscinas: 1 litro cada 20.000 litros de agua. Desinfección de pisos: diluir 200 ml en 10 litros de agua.',
    advertencias: 'Usar guantes de goma y protección ocular. No mezclar con ácidos, lavandinas aditivadas ni amoníacos. Almacenar en lugar ventilado y oscuro.',
    superficiesAptas: 'Piletas de lona, fibra u hormigón, baldosas exteriores, cordones y desagües.',
    rubroId: 'rub-03',
    rubroNombre: 'Piscinas',
    rubroSlug: 'piscinas',
    subrubroId: 'sub-03-01',
    subrubroNombre: 'Cloros',
    subrubroSlug: 'cloros',
    precio: 3500,
    precioAnterior: 4200,
    descuentoPorcentaje: 17,
    precioTransferencia: 3150,
    precioMayorista: 2900,
    cantidadMinimaMayorista: 5,
    enStock: true,
    stockCantidad: 42,
    imagenes: ['/images/media_1790969893970.png'],
    imagenEsIlustrativa: false,
    insignia: 'oferta',
    fechaCreacion: '2026-01-10T10:00:00Z',
  },
  {
    id: 'prod-002',
    sku: '010002',
    codigoBarras: '7791234560029',
    slug: 'detergente-enzimatico-industrial-5l',
    nombre: 'Detergente Enzimático Industrial',
    marca: 'Diversey',
    contenido: '5 L',
    descripcion: 'Detergente concentrado con enzimas activas proteolíticas. Remueve restos orgánicos persistentes, aceites y almidones sin agredir superficies metálicas.',
    modoDeUso: 'Dosificar 50 ml a 100 ml en 10 litros de agua tibia (45°C). Dejar actuar por inmersión durante 15 minutos y enjuagar.',
    advertencias: 'Evitar el contacto prolongado con la piel. Mantener alejado de fuentes directas de calor para no inactivar las enzimas.',
    superficiesAptas: 'Vajilla industrial, instrumental clínico, mesadas de acero inoxidable y bandejas gastronómicas.',
    rubroId: 'rub-01',
    rubroNombre: 'Limpieza y Químicos',
    rubroSlug: 'limpieza-y-quimicos',
    subrubroId: 'sub-01-03',
    subrubroNombre: 'Lavandería',
    subrubroSlug: 'lavanderia',
    precio: 8500,
    precioAnterior: 9900,
    descuentoPorcentaje: 14,
    precioTransferencia: 7650,
    precioMayorista: 7200,
    cantidadMinimaMayorista: 3,
    enStock: true,
    stockCantidad: 18,
    imagenes: ['/images/media_1790970022481.png'],
    imagenEsIlustrativa: false,
    insignia: 'oferta',
    fechaCreacion: '2026-01-15T12:00:00Z',
  },
  {
    id: 'prod-003',
    sku: '010003',
    codigoBarras: '7791234560036',
    slug: 'desengrasante-pesado-cocinas-20l',
    nombre: 'Desengrasante Alcalino Pesado',
    marca: 'Spartan',
    contenido: '20 L',
    descripcion: 'Desengrasante cáustico de alta densidad para disolver grasas carbonizadas, aceites quemados y hollín en campanas y planchas industriales.',
    modoDeUso: 'Uso puro para grasa extrema. Para mantenimiento general de pisos, diluir 1:20 en agua caliente. Enjuagar con agua abundante.',
    advertencias: 'Uso exclusivo profesional. Obligatorio el uso de guantes de nitrilo, delantal y protección ocular. No aplicar sobre aluminio puro.',
    superficiesAptas: 'Hornos de panadería, campanas de extracción, freidoras de acero y pisos de cemento alisado.',
    rubroId: 'rub-01',
    rubroNombre: 'Limpieza y Químicos',
    rubroSlug: 'limpieza-y-quimicos',
    subrubroId: 'sub-01-02',
    subrubroNombre: 'Desengrasantes',
    subrubroSlug: 'desengrasantes',
    precio: 21000,
    precioTransferencia: 18900,
    enStock: true,
    stockCantidad: 9,
    imagenes: ['/images/media_1790970041386.png'],
    imagenEsIlustrativa: false,
    fechaCreacion: '2026-01-18T09:00:00Z',
  },
  {
    id: 'prod-004',
    sku: '010004',
    codigoBarras: '7791234560043',
    slug: 'limpiavidrios-antiestatico-gatillo-500ml',
    nombre: 'Limpiavidrios Antiestático con Gatillo',
    marca: '3M Profesional',
    contenido: '500 ml',
    descripcion: 'Limpiavidrios con evaporación rápida y efecto repelente de polvo. Deja vidrios, espejos y superficies acristaladas transparentes y sin marcas.',
    modoDeUso: 'Rociar a 20 cm de la superficie y frotar con paño de microfibra seco en movimientos circulares.',
    advertencias: 'Líquido inflamable. Mantener fuera del alcance de los niños. No fumar durante su manipulación.',
    superficiesAptas: 'Ventanas, espejos, vidrieras, cristales de automóviles y pantallas protegidas.',
    rubroId: 'rub-01',
    rubroNombre: 'Limpieza y Químicos',
    rubroSlug: 'limpieza-y-quimicos',
    subrubroId: 'sub-01-01',
    subrubroNombre: 'Pisos y Superficies',
    subrubroSlug: 'pisos-y-superficies',
    precio: 1200,
    precioTransferencia: 1100,
    enStock: true,
    stockCantidad: 65,
    imagenes: ['/images/media_1790970057378.png'],
    imagenEsIlustrativa: false,
    insignia: 'nuevo',
    fechaCreacion: '2026-02-01T15:00:00Z',
  },
  {
    id: 'prod-005',
    sku: '010005',
    codigoBarras: '7791234560050',
    slug: 'alcohol-en-gel-70-bidon-5l',
    nombre: 'Alcohol en Gel Sanitizante 70%',
    marca: 'Ecolab',
    contenido: '5 L',
    descripcion: 'Gel antiséptico para manos con emolientes protectores. Elimina el 99,9% de patógenos sin resecar la dermis en usos repetitivos.',
    modoDeUso: 'Aplicar 3 ml sobre manos limpias y secas. Friccionar durante 20 a 30 segundos cubriendo palmas, dorso y entre los dedos.',
    advertencias: 'Solo para uso externo. Producto inflamable. No exponer a llamas ni almacenar a más de 35°C.',
    superficiesAptas: 'Piel de manos en oficinas, comercios, plantas elaboradoras e instituciones de salud.',
    rubroId: 'rub-02',
    rubroNombre: 'Desinfección',
    rubroSlug: 'desinfeccion',
    subrubroId: 'sub-02-01',
    subrubroNombre: 'Alcoholes y Geles',
    subrubroSlug: 'alcoholes-y-geles',
    precio: 6900,
    precioAnterior: 7800,
    descuentoPorcentaje: 12,
    precioTransferencia: 6200,
    enStock: true,
    stockCantidad: 24,
    imagenes: ['/images/media_1790970449715.png'],
    imagenEsIlustrativa: false,
    insignia: 'oferta',
    fechaCreacion: '2026-01-22T11:00:00Z',
  },
  {
    id: 'prod-006',
    sku: '010006',
    codigoBarras: '7791234560067',
    slug: 'papel-higienico-industrial-bobina-x8',
    nombre: 'Papel Higiénico Institucional Doble Hoja',
    marca: 'Elite Professional',
    contenido: 'Pack x 8 rollos (300m c/u)',
    descripcion: 'Bobinas de papel blanco puro 100% fibra virgen de alto rendimiento para dispensers de pared en sanitarios de alto tránsito.',
    modoDeUso: 'Colocar dentro de portarrollos estándar de cono de 45 o 75 mm.',
    advertencias: 'Mantener almacenado sobre tarimas en lugar seco y libre de humedad.',
    superficiesAptas: 'Baños de centros comerciales, sanatorios, clubes y empresas.',
    rubroId: 'rub-04',
    rubroNombre: 'Institucional y Papelería',
    rubroSlug: 'institucional-y-papeleria',
    subrubroId: 'sub-04-01',
    subrubroNombre: 'Papel Higiénico y Toallas',
    subrubroSlug: 'papel-higienico-y-toallas',
    precio: 11500,
    precioTransferencia: 10500,
    precioMayorista: 9800,
    cantidadMinimaMayorista: 4,
    enStock: true,
    stockCantidad: 30,
    imagenes: ['/images/media_1790970463819.png'],
    imagenEsIlustrativa: false,
    fechaCreacion: '2026-01-05T08:00:00Z',
  },
  {
    id: 'prod-007',
    sku: '010007',
    codigoBarras: '7791234560074',
    slug: 'alguicida-concentrado-piscinas-5l',
    nombre: 'Alguicida Mantenimiento para Piscinas',
    marca: 'Spartan',
    contenido: '5 L',
    descripcion: 'Compuesto cuaternario microbicida no espumígeno. Previene la formación de algas verdes y hongos en el fondo y paredes de la piscina.',
    modoDeUso: 'Dosis inicial: 200 ml cada 10.000 litros. Mantenimiento semanal: 50 ml cada 10.000 litros tras la puesta del sol con filtro activo.',
    advertencias: 'No verter directamente cerca de los skimmers sin diluir. Mantener fuera del alcance de menores.',
    superficiesAptas: 'Aguas de piletas familiares y de natatorios comerciales.',
    rubroId: 'rub-03',
    rubroNombre: 'Piscinas',
    rubroSlug: 'piscinas',
    subrubroId: 'sub-03-02',
    subrubroNombre: 'Alguicidas y Clarificadores',
    subrubroSlug: 'alguicidas-y-clarificadores',
    precio: 6800,
    precioAnterior: 7900,
    descuentoPorcentaje: 14,
    precioTransferencia: 6100,
    enStock: true,
    stockCantidad: 15,
    imagenes: ['/images/media_1790969893970.png'],
    imagenEsIlustrativa: true,
    insignia: 'oferta',
    fechaCreacion: '2026-02-05T14:00:00Z',
  },
  {
    id: 'prod-008',
    sku: '010008',
    codigoBarras: '7791234560081',
    slug: 'clarificador-decantador-rapido-5l',
    nombre: 'Clarificador y Decantador de Agua',
    marca: 'Spartan',
    contenido: '5 L',
    descripcion: 'Agente floculante de acción ultra rápida. Agrupa la turbidez en flóculos pesados que decantan al piso para su fácil aspiración.',
    modoDeUso: 'Agregar 100 ml cada 10.000 litros en agua con pH regulado. Dejar reposar durante la noche y pasar el barrefondo al desagote.',
    advertencias: 'No recircular el filtro mientras actúe el clarificador para evitar que se saturen las arenas.',
    superficiesAptas: 'Piscinas de cualquier revestimiento con barrefondo con desagote directo.',
    rubroId: 'rub-03',
    rubroNombre: 'Piscinas',
    rubroSlug: 'piscinas',
    subrubroId: 'sub-03-02',
    subrubroNombre: 'Alguicidas y Clarificadores',
    subrubroSlug: 'alguicidas-y-clarificadores',
    precio: 5400,
    precioTransferencia: 4900,
    enStock: true,
    stockCantidad: 22,
    imagenes: ['/images/media_1790969453761.png'],
    imagenEsIlustrativa: true,
    fechaCreacion: '2026-02-06T10:00:00Z',
  },
  {
    id: 'prod-009',
    sku: '010009',
    codigoBarras: '7791234560098',
    slug: 'jabon-liquido-antibacterial-manos-5l',
    nombre: 'Jabón Líquido Antibacterial para Manos',
    marca: 'Diversey',
    contenido: '5 L',
    descripcion: 'Jabón líquido cremoso formulado con tensioactivos biodegradables y bactericida de amplio espectro. Fragancia suave.',
    modoDeUso: 'Cargar directamente en dosificadores recargables. Emulsionar con agua durante 20 segundos y enjuagar.',
    advertencias: 'En caso de contacto con los ojos enjuagar con agua corriente durante 15 minutos.',
    superficiesAptas: 'Higiene de manos en consultorios, empresas y hogares.',
    rubroId: 'rub-04',
    rubroNombre: 'Institucional y Papelería',
    rubroSlug: 'institucional-y-papeleria',
    subrubroId: 'sub-04-02',
    subrubroNombre: 'Jabones y Dispensers',
    subrubroSlug: 'jabones-y-dispensers',
    precio: 5800,
    precioTransferencia: 5200,
    enStock: true,
    stockCantidad: 38,
    imagenes: ['/images/media_1790970476339.png'],
    imagenEsIlustrativa: false,
    fechaCreacion: '2026-01-25T16:00:00Z',
  },
  {
    id: 'prod-010',
    sku: '010010',
    codigoBarras: '7791234560104',
    slug: 'desinfectante-amonio-cuaternario-5ta-gen-5l',
    nombre: 'Desinfectante Amonio Cuaternario 5ª Gen',
    marca: 'Ecolab',
    contenido: '5 L',
    descripcion: 'Desinfectante de grado hospitalario libre de cloro con acción fungicida, virucida y bactericida. No corroe metales ni mancha pisos.',
    modoDeUso: 'Desinfección profunda: dilución 1:50 en agua fría. Rociar o pasar con mopa y dejar secar al aire sin enjuague.',
    advertencias: 'No mezclar con jabones aniónicos ni detergentes comunes ya que neutralizan el principio activo.',
    superficiesAptas: 'Pisos vinílicos, camillas, equipamiento médico, gimnasios y salas de espera.',
    rubroId: 'rub-02',
    rubroNombre: 'Desinfección',
    rubroSlug: 'desinfeccion',
    subrubroId: 'sub-02-02',
    subrubroNombre: 'Amonios y Virucidas',
    subrubroSlug: 'amonios-y-virucidas',
    precio: 9800,
    precioAnterior: 11200,
    descuentoPorcentaje: 13,
    precioTransferencia: 8800,
    enStock: true,
    stockCantidad: 14,
    imagenes: ['/images/media_1790970022481.png'],
    imagenEsIlustrativa: false,
    insignia: 'oferta',
    fechaCreacion: '2026-02-08T09:30:00Z',
  },
  {
    id: 'prod-011',
    sku: '010011',
    codigoBarras: '7791234560111',
    slug: 'mopa-microfibra-industrial-cabo-140',
    nombre: 'Mopa de Microfibra Industrial con Cabo',
    marca: '3M Profesional',
    contenido: 'Kit Cabo + Cabezal + 2 Paños',
    descripcion: 'Sistema de limpieza profesional con cabezal basculante 360° y mango de aluminio anodizado telescópico de 1.40 m. Paño lavable hasta 300 veces.',
    modoDeUso: 'Utilizar húmeda para fregado o seca para barrido electrostático de polvo fino.',
    advertencias: 'Lavar el paño sin suavizantes ni lavandina pura para no cerrar la fibra.',
    superficiesAptas: 'Porcelanato, madera plastificada, mármol y pisos cerámicos.',
    rubroId: 'rub-05',
    rubroNombre: 'Accesorios y Herramientas',
    rubroSlug: 'accesorios-y-herramientas',
    subrubroId: 'sub-05-01',
    subrubroNombre: 'Mopas y Paños',
    subrubroSlug: 'mopas-y-panos',
    precio: 14500,
    precioTransferencia: 13000,
    enStock: false,
    stockCantidad: 0,
    imagenes: ['/images/media_1790971761739.png'],
    imagenEsIlustrativa: false,
    insignia: 'sin_stock',
    fechaCreacion: '2026-01-12T13:00:00Z',
  },
  {
    id: 'prod-012',
    sku: '010012',
    codigoBarras: '7791234560128',
    slug: 'toallas-de-papel-intercaladas-x2500',
    nombre: 'Toallas de Papel Intercaladas',
    marca: 'Kimberly-Clark',
    contenido: 'Caja x 2500 hojas',
    descripcion: 'Toallas descartables de celulosa blanca puro en pliegue en V. Gran poder de absorción en húmedo que evita la rotura al secar.',
    modoDeUso: 'Cargar en dispensadores estándar para toallas de mano intercaladas.',
    advertencias: 'No arrojar las toallas al inodoro.',
    superficiesAptas: 'Secado de manos higiénico en cocinas gastronómicas, baños públicos y clínicas.',
    rubroId: 'rub-04',
    rubroNombre: 'Institucional y Papelería',
    rubroSlug: 'institucional-y-papeleria',
    subrubroId: 'sub-04-01',
    subrubroNombre: 'Papel Higiénico y Toallas',
    subrubroSlug: 'papel-higienico-y-toallas',
    precio: 8900,
    precioTransferencia: 8100,
    enStock: true,
    stockCantidad: 40,
    imagenes: ['/images/media_1790970463819.png'],
    imagenEsIlustrativa: false,
    fechaCreacion: '2026-01-20T17:00:00Z',
  },
  {
    id: 'prod-013',
    sku: '010013',
    codigoBarras: '7791234560135',
    slug: 'cera-autobrillo-acrilica-5l',
    nombre: 'Cera Autobrillo Acrílica Incolora',
    marca: 'Spartan',
    contenido: '5 L',
    descripcion: 'Emulsión acrílica antideslizante que otorga brillo espejo instantáneo y alta resistencia al tránsito peatonal continuo.',
    modoDeUso: 'Aplicar puro sobre piso limpio y seco con pasacera uniforme. Dejar secar 40 minutos entre manos. Aplicar 2 manos cruzadas.',
    advertencias: 'No transitar sobre la película fresca. No mezclar con solventes ni ceras al solvente.',
    superficiesAptas: 'Baldosas calcáreas, granito, cemento alisado y mosaicos.',
    rubroId: 'rub-01',
    rubroNombre: 'Limpieza y Químicos',
    rubroSlug: 'limpieza-y-quimicos',
    subrubroId: 'sub-01-01',
    subrubroNombre: 'Pisos y Superficies',
    subrubroSlug: 'pisos-y-superficies',
    precio: 7600,
    precioTransferencia: 6850,
    enStock: true,
    stockCantidad: 19,
    imagenes: ['/images/media_1790970041386.png'],
    imagenEsIlustrativa: true,
    fechaCreacion: '2026-01-28T10:00:00Z',
  },
  {
    id: 'prod-014',
    sku: '010014',
    codigoBarras: '7791234560142',
    slug: 'desodorante-de-pisos-lavanda-granel-5l',
    nombre: 'Desodorante de Pisos Lavanda Silvestre',
    marca: 'Higiene Uruguay',
    contenido: '5 L (Fraccionado)',
    descripcion: 'Limpiador perfumante concentrado con fragancia de larga persistencia formulado a granel en nuestro local. Permite recarga de envase.',
    modoDeUso: '100 ml en un balde con 5 litros de agua. Pasar con mopa escurrida sin enjuague.',
    advertencias: 'Mantener fuera del alcance de niños y mascotas.',
    superficiesAptas: 'Todo tipo de pisos lavables de interiores.',
    rubroId: 'rub-01',
    rubroNombre: 'Limpieza y Químicos',
    rubroSlug: 'limpieza-y-quimicos',
    subrubroId: 'sub-01-01',
    subrubroNombre: 'Pisos y Superficies',
    subrubroSlug: 'pisos-y-superficies',
    precio: 2400,
    precioTransferencia: 2200,
    enStock: true,
    stockCantidad: 50,
    imagenes: ['/images/media_1790970057378.png'],
    imagenEsIlustrativa: true,
    insignia: 'oferta',
    fechaCreacion: '2026-02-10T12:00:00Z',
  },
];

/**
 * Consulta del catálogo en el backend con filtros reales y paginación.
 * Respeta la nomenclatura de rubro y subrubro.
 */
export async function getBackendCatalog(filters: BackendCatalogFilters = {}): Promise<BackendCatalogResponse> {
  const {
    rubroSlug,
    subrubroSlug,
    marcas = [],
    precioMin,
    precioMax,
    q,
    orden = 'destacado',
    pagina = 1,
    limite = 12,
  } = filters;

  let filtrados = [...productosBackend];

  // 1. Filtro por Rubro
  if (rubroSlug && rubroSlug.trim() !== '' && rubroSlug !== 'todas') {
    filtrados = filtrados.filter((p) => p.rubroSlug === rubroSlug);
  }

  // 2. Filtro por Subrubro (solo una subcategoría activa a la vez)
  if (subrubroSlug && subrubroSlug.trim() !== '' && subrubroSlug !== 'todas') {
    filtrados = filtrados.filter((p) => p.subrubroSlug === subrubroSlug);
  }

  // 3. Búsqueda por término (?q=)
  if (q && q.trim() !== '') {
    const term = q.toLowerCase().trim();
    filtrados = filtrados.filter((p) => {
      const matchNom = p.nombre.toLowerCase().includes(term);
      const matchDesc = p.descripcion.toLowerCase().includes(term);
      const matchMarca = p.marca ? p.marca.toLowerCase().includes(term) : false;
      const matchRubro = p.rubroNombre.toLowerCase().includes(term);
      const matchSubrubro = p.subrubroNombre ? p.subrubroNombre.toLowerCase().includes(term) : false;
      return matchNom || matchDesc || matchMarca || matchRubro || matchSubrubro;
    });
  }

  // 4. Marcas disponibles dentro del contexto actual de rubro/subrubro
  const marcasSet = new Set<string>();
  filtrados.forEach((p) => {
    if (p.marca) marcasSet.add(p.marca);
  });
  const marcasDisponibles = Array.from(marcasSet).sort();

  // 5. Filtro por Marcas seleccionadas
  if (marcas.length > 0) {
    filtrados = filtrados.filter((p) => p.marca && marcas.includes(p.marca));
  }

  // 6. Precios mínimos y máximos reales del conjunto actual
  const precios = filtrados.length > 0 ? filtrados.map((p) => p.precio) : [0];
  const precioMinimo = Math.min(...precios);
  const precioMaximo = Math.max(...precios);

  // 7. Filtro por Rango de Precio
  if (typeof precioMin === 'number' && !isNaN(precioMin)) {
    filtrados = filtrados.filter((p) => p.precio >= precioMin);
  }
  if (typeof precioMax === 'number' && !isNaN(precioMax)) {
    filtrados = filtrados.filter((p) => p.precio <= precioMax);
  }

  // 8. Opciones de ordenamiento realmente soportadas por el backend
  switch (orden) {
    case 'precio_asc':
      filtrados.sort((a, b) => a.precio - b.precio);
      break;
    case 'precio_desc':
      filtrados.sort((a, b) => b.precio - a.precio);
      break;
    case 'nombre_asc':
      filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
      break;
    case 'nombre_desc':
      filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'));
      break;
    case 'mas_nuevo':
      filtrados.sort((a, b) => new Date(b.fechaCreacion || 0).getTime() - new Date(a.fechaCreacion || 0).getTime());
      break;
    case 'mas_viejo':
      filtrados.sort((a, b) => new Date(a.fechaCreacion || 0).getTime() - new Date(b.fechaCreacion || 0).getTime());
      break;
    case 'destacado':
    default:
      // Conserva el orden de catálogo definido por el negocio
      break;
  }

  // Conteo real por rubro y subrubro entregado por la API
  const rubrosConConteo: BackendRubro[] = rubrosOriginales.map((rubro) => {
    const cantRubro = productosBackend.filter((p) => p.rubroId === rubro.id).length;
    const subrubrosConConteo = rubro.subrubros.map((sub) => {
      const cantSub = productosBackend.filter((p) => p.subrubroId === sub.id).length;
      return {
        ...sub,
        cantidadProductos: cantSub,
      };
    });

    return {
      ...rubro,
      cantidadProductos: cantRubro,
      subrubros: subrubrosConConteo,
    };
  });

  // Paginación real
  const total = filtrados.length;
  const totalPaginas = Math.ceil(total / limite) || 1;
  const paginadaOffset = (pagina - 1) * limite;
  const productosPaginados = filtrados.slice(paginadaOffset, paginadaOffset + limite);

  // Opciones de orden realmente soportadas
  const ordenesDisponibles = [
    { clave: 'destacado', etiqueta: 'Destacados' },
    { clave: 'precio_asc', etiqueta: 'Precio: menor a mayor' },
    { clave: 'precio_desc', etiqueta: 'Precio: mayor a menor' },
    { clave: 'nombre_asc', etiqueta: 'A - Z' },
    { clave: 'nombre_desc', etiqueta: 'Z - A' },
    { clave: 'mas_nuevo', etiqueta: 'Más nuevo al más viejo' },
    { clave: 'mas_viejo', etiqueta: 'Más viejo al más nuevo' },
  ];

  return {
    productos: productosPaginados,
    total,
    pagina,
    limite,
    totalPaginas,
    rubros: rubrosConConteo,
    marcasDisponibles,
    precioMinimo,
    precioMaximo,
    ordenesDisponibles,
  };
}

/**
 * Obtener producto individual por slug
 */
export async function getBackendProductBySlug(slug: string): Promise<BackendProduct | null> {
  const clean = decodeURIComponent(slug).toLowerCase().trim();
  const prod = productosBackend.find((p) => p.slug === clean || p.id === clean);
  return prod || null;
}

/**
 * Obtener productos relacionados
 */
export async function getBackendRelatedProducts(productId: string, limit = 4): Promise<BackendProduct[]> {
  const current = productosBackend.find((p) => p.id === productId);
  if (!current) return productosBackend.slice(0, limit);

  const related = productosBackend.filter((p) => {
    if (p.id === productId) return false;
    return p.rubroId === current.rubroId || p.subrubroId === current.subrubroId || p.marca === current.marca;
  });

  if (related.length < limit) {
    const diff = productosBackend.filter((p) => p.id !== productId && !related.includes(p));
    return [...related, ...diff].slice(0, limit);
  }

  return related.slice(0, limit);
}
