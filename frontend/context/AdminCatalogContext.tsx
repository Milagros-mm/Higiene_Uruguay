"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle2, AlertTriangle, X, Info, Package } from "lucide-react";
import { allProducts } from "@/frontend/mock/mock-data";
import { STORE } from "@/frontend/utils/store";

// ============================================================================
// Tipos de Datos del Panel Administrativo
// ============================================================================

export interface AdminRubro {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  orden: number;
  activo: boolean;
  cantidadProductos: number;
}

export interface AdminSubrubro {
  id: string;
  rubroId: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  orden: number;
  activo: boolean;
  cantidadProductos: number;
}

export interface AdminMarca {
  id: string;
  nombre: string;
  slug: string;
  logoUrl?: string;
  activo: boolean;
  cantidadProductos: number;
}

export interface AdminProduct {
  id: string;
  sku: string;
  barcode: string;
  nombreOriginalSistema: string;
  nombre: string;
  descripcion: string;
  modoDeUso?: string;
  advertencias?: string;
  superficiesAptas?: string;
  presentacion?: string;
  precioSistema: number;
  stock: number;
  stockSinDato?: boolean;
  esSuelto: boolean;
  rubroId: string;
  subrubroId?: string;
  marcaId?: string;
  imagenes: string[];
  activo: boolean;
  sincronizado: boolean;
  posibleDuplicadoSku?: string;
  ventas30d: number;
  consultas30d: number;
}

export interface AdminDiscount {
  id: string;
  nombre: string;
  aplicaA: "PRODUCTO" | "RUBRO";
  targetId: string;
  tipo: "PORCENTAJE" | "PRECIO_FIJO";
  valor: number;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

export type OrderStatus =
  | "Pendiente"
  | "Confirmado"
  | "En preparación"
  | "Listo para retirar o enviar"
  | "Entregado"
  | "Cancelado";

export type PaymentStatus = "Pendiente" | "Confirmado";

export interface AdminOrderItem {
  productId: string;
  nombre: string;
  presentacion?: string;
  cantidad: number;
  precioUnitario: number;
  descuentoAplicado?: number;
  esSuelto?: boolean;
}

export interface AdminOrder {
  id: string;
  numero: string;
  fecha: string;
  diasAtras: number;
  clienteId: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail?: string;
  modalidadEntrega: "Retiro en local" | "Envío a domicilio";
  direccionEntrega?: string;
  metodoPago: string;
  pagoEstado: PaymentStatus;
  notas?: string;
  notaAjusteInterno?: string;
  preferenciaSuelto?: "Consultar reemplazo" | "Quitar del pedido";
  items: AdminOrderItem[];
  subtotal: number;
  descuentoProductos: number;
  descuentoCarrito: number;
  total: number;
  estado: OrderStatus;
}

export interface AdminCustomer {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion?: string;
  fechaAlta: string;
}

export interface AdminInquiry {
  id: string;
  fecha: string;
  clienteNombre: string;
  contacto: string;
  asunto: string;
  mensaje: string;
  respondida: boolean;
}

export interface AdminSyncNotice {
  productId?: string;
  productName?: string;
  mensaje: string;
}

export interface AdminSyncLog {
  id: string;
  fecha: string;
  resultado: "Completada" | "Con avisos" | "No completada";
  nuevos: number;
  actualizados: number;
  conAviso: number;
  detalleAviso?: string;
  avisosProductos?: AdminSyncNotice[];
}

export interface AdminBankAccount {
  id: string;
  banco: string;
  titular: string;
  alias: string;
  cbu: string;
  activa: boolean;
}

export interface AdminPaymentMethodItem {
  id: string;
  nombre: string;
  habilitado: boolean;
}

export interface AdminPanelUser {
  id: string;
  nombre: string;
  email: string;
  rol: "Administrador" | "Operador";
  activo: boolean;
}

export interface AdminStoreConfig {
  nombre: string;
  logoUrl: string;
  telefono: string;
  whatsapp: string;
  email: string;
  direccion: string;
  horarios: string;
  instagram: string;
  facebook: string;
  envioDomicilioHabilitado: boolean;
  retiroLocalHabilitado: boolean;
  costoEnvioBase: number;
  envioGratisDesde: number;
  aclaracionEnvio: string;
  pagoTransferenciaHabilitado: boolean;
  pagoEfectivoHabilitado: boolean;
  mediosPago: AdminPaymentMethodItem[];
  aclaracionPago: string;
  cuentasBancarias: AdminBankAccount[];
  usuariosPanel: AdminPanelUser[];
}

interface ToastMessage {
  id: string;
  title: string;
  type: "success" | "info" | "warning";
  onUndo?: () => void;
}

interface AdminCatalogContextType {
  rubros: AdminRubro[];
  subrubros: AdminSubrubro[];
  marcas: AdminMarca[];
  productos: AdminProduct[];
  descuentos: AdminDiscount[];
  pedidos: AdminOrder[];
  clientes: AdminCustomer[];
  consultas: AdminInquiry[];
  syncLogs: AdminSyncLog[];
  isSyncing: boolean;
  storeConfig: AdminStoreConfig;

  // Rubros
  saveRubro: (
    data: Omit<AdminRubro, "id" | "slug" | "cantidadProductos"> & { id?: string },
  ) => Promise<void>;
  toggleRubroStatus: (id: string) => void;
  deleteRubro: (id: string) => Promise<void>;

  // Subrubros
  saveSubrubro: (
    data: Omit<AdminSubrubro, "id" | "slug" | "cantidadProductos"> & { id?: string },
  ) => Promise<void>;
  toggleSubrubroStatus: (id: string) => void;
  deleteSubrubro: (id: string) => Promise<void>;

  // Marcas
  saveMarca: (
    data: Omit<AdminMarca, "id" | "slug" | "cantidadProductos"> & { id?: string },
  ) => Promise<void>;
  toggleMarcaStatus: (id: string) => void;
  deleteMarca: (id: string) => Promise<void>;

  // Productos
  saveProducto: (
    data: Omit<AdminProduct, "id" | "ventas30d" | "consultas30d"> & { id?: string },
  ) => Promise<void>;
  deleteProducto: (id: string) => Promise<void>;
  markProductsAsSuelto: (productIds: string[]) => void;
  resolveDuplicateSync: (productId: string, action: "vincular" | "separar") => void;

  // Descuentos
  saveDescuento: (data: Omit<AdminDiscount, "id"> & { id?: string }) => Promise<void>;
  toggleDescuentoStatus: (id: string) => void;
  deleteDescuento: (id: string) => Promise<void>;

  // Pedidos y Consultas
  updatePedidoStatus: (id: string, estado: OrderStatus) => void;
  updatePedidoPagoStatus: (id: string, pagoEstado: PaymentStatus) => void;
  updatePedidoAdjustment: (id: string, items: AdminOrderItem[], notaAjusteInterno: string) => void;
  toggleConsultaRespondida: (id: string) => void;

  // Sincronización
  runSyncNow: () => Promise<void>;

  // Configuración
  saveStoreConfig: (config: AdminStoreConfig) => Promise<void>;

  // Notificaciones
  showToast: (title: string, type?: "success" | "info" | "warning", onUndo?: () => void) => void;
}

// ============================================================================
// Datos Iniciales Realistas
// ============================================================================

const INITIAL_RUBROS: AdminRubro[] = [
  {
    id: "rub-01",
    nombre: "Limpieza y Químicos",
    slug: "limpieza-y-quimicos",
    descripcion: "Detergentes, desengrasantes, limpiadores multiuso y ceras.",
    orden: 1,
    activo: true,
    cantidadProductos: 5,
  },
  {
    id: "rub-02",
    nombre: "Desinfección",
    slug: "desinfeccion",
    descripcion: "Alcoholes, geles sanitizantes, lavandinas y amonios cuaternarios.",
    orden: 2,
    activo: true,
    cantidadProductos: 4,
  },
  {
    id: "rub-03",
    nombre: "Piscinas",
    slug: "piscinas",
    descripcion: "Cloro líquido, alguicidas, clarificadores y mantenimiento del agua.",
    orden: 3,
    activo: true,
    cantidadProductos: 4,
  },
  {
    id: "rub-04",
    nombre: "Institucional y Papelería",
    slug: "institucional-y-papeleria",
    descripcion: "Bobinas de papel, toallas intercaladas, jabones líquidos y dispensers.",
    orden: 4,
    activo: true,
    cantidadProductos: 2,
  },
  {
    id: "rub-05",
    nombre: "Accesorios y Herramientas",
    slug: "accesorios-y-herramientas",
    descripcion: "Mopas, cabos, baldes escurridores y paños de microfibra.",
    orden: 5,
    activo: true,
    cantidadProductos: 1,
  },
  {
    id: "rub-06",
    nombre: "Jardín y Exterior",
    slug: "jardin-y-exterior",
    descripcion: "Cuidado de espacios verdes y limpieza de veredas.",
    orden: 6,
    activo: false,
    cantidadProductos: 0,
  },
];

const INITIAL_SUBRUBROS: AdminSubrubro[] = [
  {
    id: "sub-01-01",
    rubroId: "rub-01",
    nombre: "Pisos y Superficies",
    slug: "pisos-y-superficies",
    orden: 1,
    activo: true,
    cantidadProductos: 3,
  },
  {
    id: "sub-01-02",
    rubroId: "rub-01",
    nombre: "Desengrasantes",
    slug: "desengrasantes",
    orden: 2,
    activo: true,
    cantidadProductos: 2,
  },
  {
    id: "sub-01-03",
    rubroId: "rub-01",
    nombre: "Lavandería",
    slug: "lavanderia",
    orden: 3,
    activo: true,
    cantidadProductos: 0,
  },
  {
    id: "sub-02-01",
    rubroId: "rub-02",
    nombre: "Alcoholes y Geles",
    slug: "alcoholes-y-geles",
    orden: 1,
    activo: true,
    cantidadProductos: 2,
  },
  {
    id: "sub-02-02",
    rubroId: "rub-02",
    nombre: "Amonios y Bactericidas",
    slug: "amonios-y-bactericidas",
    orden: 2,
    activo: true,
    cantidadProductos: 2,
  },
  {
    id: "sub-03-01",
    rubroId: "rub-03",
    nombre: "Cloros",
    slug: "cloros",
    orden: 1,
    activo: true,
    cantidadProductos: 2,
  },
  {
    id: "sub-03-02",
    rubroId: "rub-03",
    nombre: "Alguicidas y Clarificadores",
    slug: "alguicidas-y-clarificadores",
    orden: 2,
    activo: true,
    cantidadProductos: 2,
  },
  {
    id: "sub-04-01",
    rubroId: "rub-04",
    nombre: "Papel Higiénico y Toallas",
    slug: "papel-higienico-y-toallas",
    orden: 1,
    activo: true,
    cantidadProductos: 2,
  },
  {
    id: "sub-05-01",
    rubroId: "rub-05",
    nombre: "Mopas y Paños",
    slug: "mopas-y-panos",
    orden: 1,
    activo: true,
    cantidadProductos: 1,
  },
];

// Logos corregidos: solo Higiene Uruguay usa /logotipo.png; el resto queda vacío
// en lugar de las fotos erróneas de Unsplash que no correspondían a las marcas.
const INITIAL_MARCAS: AdminMarca[] = [
  {
    id: "mar-01",
    nombre: "Higiene Uruguay",
    slug: "higiene-uruguay",
    logoUrl: "/logotipo.png",
    activo: true,
    cantidadProductos: 4,
  },
  {
    id: "mar-02",
    nombre: "Spartan",
    slug: "spartan",
    logoUrl: "",
    activo: true,
    cantidadProductos: 4,
  },
  {
    id: "mar-03",
    nombre: "Diversey",
    slug: "diversey",
    logoUrl: "",
    activo: true,
    cantidadProductos: 2,
  },
  {
    id: "mar-04",
    nombre: "Ecolab",
    slug: "ecolab",
    logoUrl: "",
    activo: true,
    cantidadProductos: 2,
  },
  {
    id: "mar-05",
    nombre: "3M Profesional",
    slug: "3m-profesional",
    logoUrl: "",
    activo: true,
    cantidadProductos: 2,
  },
  {
    id: "mar-06",
    nombre: "Kimberly-Clark",
    slug: "kimberly-clark",
    logoUrl: "",
    activo: true,
    cantidadProductos: 1,
  },
  {
    id: "mar-07",
    nombre: "Elite Professional",
    slug: "elite-professional",
    logoUrl: "",
    activo: true,
    cantidadProductos: 1,
  },
];

const CATEGORY_TO_RUBRO: Record<string, { rubroId: string; subrubroId?: string }> = {
  "1": { rubroId: "rub-01", subrubroId: "sub-01-01" },
  "2": { rubroId: "rub-02", subrubroId: "sub-02-01" },
  "3": { rubroId: "rub-03", subrubroId: "sub-03-01" },
  "4": { rubroId: "rub-04", subrubroId: "sub-04-01" },
  "5": { rubroId: "rub-05", subrubroId: "sub-05-01" },
};

const BRAND_NAME_TO_ID: Record<string, string> = {
  "Higiene Uruguay": "mar-01",
  Spartan: "mar-02",
  Diversey: "mar-03",
  Ecolab: "mar-04",
  "3M Profesional": "mar-05",
  "Kimberly-Clark": "mar-06",
  "Elite Professional": "mar-07",
};

const INITIAL_PRODUCTOS: AdminProduct[] = [
  ...allProducts.map((p, idx) => {
    const mapped = CATEGORY_TO_RUBRO[p.categoryId] || { rubroId: "rub-01" };
    const stockValues = [24, 15, 8, 32, 18, 12, 0, 0, 14, 9, 3, 20, 6, 4, 0, 11];
    const ventasValues = [48, 31, 22, 19, 37, 42, 54, 29, 25, 14, 21, 33, 17, 12, 41, 16];
    const consultasValues = [120, 85, 64, 52, 95, 88, 142, 76, 68, 44, 59, 73, 51, 39, 110, 47];

    return {
      id: p.id,
      sku: p.sku || `0100${idx + 1}`,
      barcode: p.barcode || "",
      nombreOriginalSistema: p.name.toUpperCase(),
      nombre: p.name,
      descripcion: p.description,
      modoDeUso: p.dilutionInstructions || "",
      advertencias: p.precautions || "",
      superficiesAptas: p.suitableSurfaces || "",
      presentacion: p.bulkPresentation || "Unidad",
      precioSistema: p.originalPrice || p.price,
      stock: stockValues[idx % stockValues.length],
      stockSinDato: Boolean(p.isBulk),
      esSuelto: Boolean(p.isBulk),
      rubroId: mapped.rubroId,
      subrubroId: mapped.subrubroId,
      marcaId: p.brand ? BRAND_NAME_TO_ID[p.brand] : "mar-01",
      imagenes: p.images || [],
      activo: true,
      sincronizado: true,
      ventas30d: ventasValues[idx % ventasValues.length],
      consultas30d: consultasValues[idx % consultasValues.length],
    };
  }),
  // Producto recién sincronizado que genera alertas agrupadas (sin foto y sin rubro)
  {
    id: "p17",
    sku: "010017",
    barcode: "7791234560173",
    nombreOriginalSistema: "LAVANDINA PREMIUM POR 5 LTS",
    nombre: "Lavandina Premium 5L",
    descripcion: "Lavandina concentrada de uso doméstico e institucional.",
    presentacion: "Bidón 5 Litros",
    precioSistema: 4380,
    stock: 0,
    stockSinDato: true,
    esSuelto: false,
    rubroId: "",
    subrubroId: undefined,
    marcaId: "mar-01",
    imagenes: [],
    activo: true,
    sincronizado: true,
    ventas30d: 35,
    consultas30d: 92,
  },
];

const INITIAL_DESCUENTOS: AdminDiscount[] = [
  {
    id: "desc-01",
    nombre: "Temporada Piscinas",
    aplicaA: "RUBRO",
    targetId: "rub-03",
    tipo: "PORCENTAJE",
    valor: 15,
    fechaInicio: "2026-11-01",
    fechaFin: "2026-12-31",
    activo: true,
  },
  {
    id: "desc-02",
    nombre: "Promoción Cloro Líquido 10L",
    aplicaA: "PRODUCTO",
    targetId: "p1",
    tipo: "PRECIO_FIJO",
    valor: 3500,
    fechaInicio: "2026-11-10",
    fechaFin: "2026-11-30",
    activo: true,
  },
];

const INITIAL_CLIENTES: AdminCustomer[] = [
  {
    id: "cli-01",
    nombre: "Martín Rodríguez",
    telefono: "03442 15-412398",
    email: "martin.rodriguez@gmail.com",
    direccion: "9 de Julio 842, Concepción del Uruguay",
    fechaAlta: "12/08/2026",
  },
  {
    id: "cli-02",
    nombre: "Gastronomía Río Uruguay SRL",
    telefono: "03442 15-589120",
    email: "compras@riouruguay.com.ar",
    direccion: "Av. Paysandú 1240, Concepción del Uruguay",
    fechaAlta: "03/06/2026",
  },
  {
    id: "cli-03",
    nombre: "Lucía Fernández",
    telefono: "03442 15-623411",
    email: "luciafernandez.cdelu@hotmail.com",
    direccion: "Galarza 512, Concepción del Uruguay",
    fechaAlta: "21/09/2026",
  },
  {
    id: "cli-04",
    nombre: "Club Atlético Regatas",
    telefono: "03442 42-5510",
    email: "intendencia@clubregatas.org.ar",
    direccion: "Costanera Norte s/n, Concepción del Uruguay",
    fechaAlta: "15/05/2026",
  },
  {
    id: "cli-05",
    nombre: "Valeria Sosa",
    telefono: "03442 15-490877",
    email: "valesosa@gmail.com",
    direccion: "San Martín 1105, Concepción del Uruguay",
    fechaAlta: "02/11/2026",
  },
];

const INITIAL_PEDIDOS: AdminOrder[] = [
  {
    id: "ord-1045",
    numero: "1045",
    fecha: "23/11/2026 10:15",
    diasAtras: 1,
    clienteId: "cli-01",
    clienteNombre: "Martín Rodríguez",
    clienteTelefono: "03442 15-412398",
    clienteEmail: "martin.rodriguez@gmail.com",
    modalidadEntrega: "Envío a domicilio",
    direccionEntrega: "9 de Julio 842, Concepción del Uruguay",
    metodoPago: "Transferencia bancaria",
    pagoEstado: "Pendiente",
    notas: "Timbre 2B. Entregar por la tarde.",
    items: [
      {
        productId: "p1",
        nombre: "Cloro Líquido 10L",
        presentacion: "Bidón 10 Litros",
        cantidad: 2,
        precioUnitario: 3500,
      },
      {
        productId: "p9",
        nombre: "Alguicida Concentrado para Piscinas 5L",
        presentacion: "Bidón 5 Litros",
        cantidad: 1,
        precioUnitario: 6800,
        descuentoAplicado: 1020,
      },
    ],
    subtotal: 14820,
    descuentoProductos: 1020,
    descuentoCarrito: 0,
    total: 13800,
    estado: "Pendiente",
  },
  {
    id: "ord-1044",
    numero: "1044",
    fecha: "22/11/2026 17:40",
    diasAtras: 2,
    clienteId: "cli-02",
    clienteNombre: "Gastronomía Río Uruguay SRL",
    clienteTelefono: "03442 15-589120",
    clienteEmail: "compras@riouruguay.com.ar",
    modalidadEntrega: "Envío a domicilio",
    direccionEntrega: "Av. Paysandú 1240, Concepción del Uruguay",
    metodoPago: "Transferencia bancaria",
    pagoEstado: "Confirmado",
    notas: "Ingresar por portón lateral de proveedores.",
    items: [
      {
        productId: "p3",
        nombre: "Desengrasante Industrial 20L",
        presentacion: "Bidón 20 Litros",
        cantidad: 1,
        precioUnitario: 21000,
      },
      {
        productId: "p6",
        nombre: "Papel Higiénico Institucional x8",
        presentacion: "Bulto Cerrado x 8 Rollos",
        cantidad: 2,
        precioUnitario: 11500,
      },
    ],
    subtotal: 44000,
    descuentoProductos: 0,
    descuentoCarrito: 4400,
    total: 39600,
    estado: "Pendiente",
  },
  {
    id: "ord-1043",
    numero: "1043",
    fecha: "20/11/2026 11:20",
    diasAtras: 4,
    clienteId: "cli-03",
    clienteNombre: "Lucía Fernández",
    clienteTelefono: "03442 15-623411",
    clienteEmail: "luciafernandez.cdelu@hotmail.com",
    modalidadEntrega: "Retiro en local",
    metodoPago: "Efectivo",
    pagoEstado: "Pendiente",
    preferenciaSuelto: "Consultar reemplazo",
    items: [
      {
        productId: "p7",
        nombre: "Cloro Concentrado Suelto 5L",
        presentacion: "Bidón 5 Litros (Fraccionado)",
        cantidad: 2,
        precioUnitario: 3200,
        esSuelto: true,
      },
      {
        productId: "p15",
        nombre: "Desodorante de Pisos Lavanda Suelto 5L",
        presentacion: "Bidón 5 Litros (Fraccionado)",
        cantidad: 1,
        precioUnitario: 2400,
        esSuelto: true,
      },
    ],
    subtotal: 8800,
    descuentoProductos: 0,
    descuentoCarrito: 0,
    total: 8800,
    estado: "En preparación",
  },
  {
    id: "ord-1042",
    numero: "1042",
    fecha: "12/11/2026 09:50",
    diasAtras: 12,
    clienteId: "cli-04",
    clienteNombre: "Club Atlético Regatas",
    clienteTelefono: "03442 42-5510",
    clienteEmail: "intendencia@clubregatas.org.ar",
    modalidadEntrega: "Envío a domicilio",
    direccionEntrega: "Costanera Norte s/n, Concepción del Uruguay",
    metodoPago: "Transferencia bancaria",
    pagoEstado: "Confirmado",
    items: [
      {
        productId: "p1",
        nombre: "Cloro Líquido 10L",
        presentacion: "Bidón 10 Litros",
        cantidad: 6,
        precioUnitario: 3500,
      },
      {
        productId: "p12",
        nombre: "Toallas de Papel Intercaladas x 2500",
        presentacion: "Caja Cerrada x 2.500 toallas",
        cantidad: 3,
        precioUnitario: 8900,
      },
    ],
    subtotal: 47700,
    descuentoProductos: 0,
    descuentoCarrito: 0,
    total: 47700,
    estado: "Entregado",
  },
  {
    id: "ord-1041",
    numero: "1041",
    fecha: "05/10/2026 16:15",
    diasAtras: 48,
    clienteId: "cli-05",
    clienteNombre: "Valeria Sosa",
    clienteTelefono: "03442 15-490877",
    clienteEmail: "valesosa@gmail.com",
    modalidadEntrega: "Retiro en local",
    metodoPago: "Efectivo",
    pagoEstado: "Confirmado",
    items: [
      {
        productId: "p14",
        nombre: "Mopa de Microfibra Industrial con Cabo 1.40m",
        presentacion: "Kit Completo",
        cantidad: 1,
        precioUnitario: 14500,
      },
    ],
    subtotal: 14500,
    descuentoProductos: 0,
    descuentoCarrito: 0,
    total: 14500,
    estado: "Entregado",
  },
  {
    id: "ord-1040",
    numero: "1040",
    fecha: "28/09/2026 12:00",
    diasAtras: 55,
    clienteId: "cli-01",
    clienteNombre: "Martín Rodríguez",
    clienteTelefono: "03442 15-412398",
    modalidadEntrega: "Retiro en local",
    metodoPago: "Transferencia bancaria",
    pagoEstado: "Pendiente",
    items: [
      {
        productId: "p5",
        nombre: "Alcohol en Gel 70% 5L",
        presentacion: "Bidón 5 Litros",
        cantidad: 1,
        precioUnitario: 6900,
      },
    ],
    subtotal: 6900,
    descuentoProductos: 0,
    descuentoCarrito: 0,
    total: 6900,
    estado: "Cancelado",
  },
];

const INITIAL_CONSULTAS: AdminInquiry[] = [
  {
    id: "con-01",
    fecha: "23/11/2026 09:30",
    clienteNombre: "Club Atlético Regatas",
    contacto: "03442 42-5510",
    asunto: "Disponibilidad de cloro por 100 litros",
    mensaje:
      "Hola, necesitamos saber si tienen disponibilidad inmediata de 10 bidones de cloro de 10L para la pileta olímpica esta semana.",
    respondida: false,
  },
  {
    id: "con-02",
    fecha: "21/11/2026 18:10",
    clienteNombre: "Mariana Gómez",
    contacto: "03442 15-504321",
    asunto: "Envases para productos sueltos",
    mensaje:
      "Buenas tardes, si compro desengrasante y jabón líquido suelto por la web, ¿puedo llevar mis propios bidones al retirar en el local?",
    respondida: true,
  },
];

const INITIAL_SYNC_LOGS: AdminSyncLog[] = [
  {
    id: "sync-03",
    fecha: "23/11/2026 08:30",
    resultado: "Completada",
    nuevos: 1,
    actualizados: 16,
    conAviso: 0,
  },
  {
    id: "sync-02",
    fecha: "22/11/2026 08:30",
    resultado: "Con avisos",
    nuevos: 0,
    actualizados: 15,
    conAviso: 1,
    detalleAviso:
      "Lavandina Premium 5L llegó sin stock válido y se mantuvo como Sin stock hasta confirmarse si es suelto.",
    avisosProductos: [
      {
        productId: "p17",
        productName: "Lavandina Premium 5L",
        mensaje: "Llegó sin stock válido (nulo o negativo).",
      },
    ],
  },
  {
    id: "sync-01",
    fecha: "21/11/2026 08:30",
    resultado: "Completada",
    nuevos: 2,
    actualizados: 14,
    conAviso: 0,
  },
];

const INITIAL_STORE_CONFIG: AdminStoreConfig = {
  nombre: STORE.name,
  logoUrl: "/logotipo.png",
  telefono: STORE.phoneDisplay,
  whatsapp: STORE.whatsapp,
  email: "contacto@higieneuruguay.com.ar",
  direccion: STORE.address,
  horarios: `${STORE.hours.weekdays} | ${STORE.hours.saturday}`,
  instagram: "https://instagram.com/higieneuruguay",
  facebook: "https://facebook.com/higieneuruguay",
  envioDomicilioHabilitado: true,
  retiroLocalHabilitado: true,
  costoEnvioBase: 1500,
  envioGratisDesde: 25000,
  aclaracionEnvio: "Envíos sin cargo en Concepción del Uruguay superando los $ 25.000.",
  pagoTransferenciaHabilitado: true,
  pagoEfectivoHabilitado: true,
  mediosPago: [
    { id: "efectivo", nombre: "Efectivo", habilitado: true },
    { id: "transferencia", nombre: "Transferencia bancaria", habilitado: true },
    { id: "debito", nombre: "Tarjeta de débito (en local)", habilitado: false },
  ],
  aclaracionPago: "El pago se coordina directamente por WhatsApp una vez confirmado el pedido.",
  cuentasBancarias: [
    {
      id: "bank-01",
      banco: "Banco Entre Ríos",
      titular: "Higiene Uruguay",
      alias: "HIGIENE.URUGUAY.ER",
      cbu: "3860001001000012345678",
      activa: true,
    },
  ],
  usuariosPanel: [
    {
      id: "usr-01",
      nombre: "Administración Higiene Uruguay",
      email: "admin@higieneuruguay.com.ar",
      rol: "Administrador",
      activo: true,
    },
    {
      id: "usr-02",
      nombre: "Atención al Público y Pedidos",
      email: "ventas@higieneuruguay.com.ar",
      rol: "Operador",
      activo: true,
    },
  ],
};

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const STORAGE_KEY = "hu_admin_panel_v2";

const AdminCatalogContext = createContext<AdminCatalogContextType | undefined>(undefined);

function loadInitialState() {
  const defaults = {
    rubros: INITIAL_RUBROS,
    subrubros: INITIAL_SUBRUBROS,
    marcas: INITIAL_MARCAS,
    productos: INITIAL_PRODUCTOS,
    descuentos: INITIAL_DESCUENTOS,
    pedidos: INITIAL_PEDIDOS,
    clientes: INITIAL_CLIENTES,
    consultas: INITIAL_CONSULTAS,
    syncLogs: INITIAL_SYNC_LOGS,
    storeConfig: INITIAL_STORE_CONFIG,
  };

  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const migratedOrders: AdminOrder[] = Array.isArray(parsed.pedidos)
        ? parsed.pedidos.map((ord: Omit<AdminOrder, "estado"> & { estado: string }) => ({
            ...ord,
            estado: (ord.estado === "Nuevo" ? "Pendiente" : ord.estado) as OrderStatus,
            pagoEstado: ord.pagoEstado || "Pendiente",
            subtotal: typeof ord.subtotal === "number" ? ord.subtotal : ord.total,
            descuentoProductos: ord.descuentoProductos || 0,
            descuentoCarrito: ord.descuentoCarrito || 0,
          }))
        : defaults.pedidos;

      const migratedConfig: AdminStoreConfig = parsed.storeConfig
        ? {
            ...defaults.storeConfig,
            ...parsed.storeConfig,
            mediosPago: Array.isArray(parsed.storeConfig.mediosPago)
              ? parsed.storeConfig.mediosPago
              : defaults.storeConfig.mediosPago,
          }
        : defaults.storeConfig;

      return {
        rubros: Array.isArray(parsed.rubros) ? parsed.rubros : defaults.rubros,
        subrubros: Array.isArray(parsed.subrubros) ? parsed.subrubros : defaults.subrubros,
        marcas: Array.isArray(parsed.marcas) ? parsed.marcas : defaults.marcas,
        productos: Array.isArray(parsed.productos) ? parsed.productos : defaults.productos,
        descuentos: Array.isArray(parsed.descuentos) ? parsed.descuentos : defaults.descuentos,
        pedidos: migratedOrders,
        clientes: Array.isArray(parsed.clientes) ? parsed.clientes : defaults.clientes,
        consultas: Array.isArray(parsed.consultas) ? parsed.consultas : defaults.consultas,
        syncLogs: Array.isArray(parsed.syncLogs) ? parsed.syncLogs : defaults.syncLogs,
        storeConfig: migratedConfig,
      };
    }
  } catch {
    // Fallback a valores por defecto
  }
  return defaults;
}

export function AdminCatalogProvider({ children }: { children: React.ReactNode }) {
  const [rubros, setRubros] = useState<AdminRubro[]>(INITIAL_RUBROS);
  const [subrubros, setSubrubros] = useState<AdminSubrubro[]>(INITIAL_SUBRUBROS);
  const [marcas, setMarcas] = useState<AdminMarca[]>(INITIAL_MARCAS);
  const [productos, setProductos] = useState<AdminProduct[]>(INITIAL_PRODUCTOS);
  const [descuentos, setDescuentos] = useState<AdminDiscount[]>(INITIAL_DESCUENTOS);
  const [pedidos, setPedidos] = useState<AdminOrder[]>(INITIAL_PEDIDOS);
  const [clientes, setClientes] = useState<AdminCustomer[]>(INITIAL_CLIENTES);
  const [consultas, setConsultas] = useState<AdminInquiry[]>(INITIAL_CONSULTAS);
  const [syncLogs, setSyncLogs] = useState<AdminSyncLog[]>(INITIAL_SYNC_LOGS);
  const [storeConfig, setStoreConfig] = useState<AdminStoreConfig>(INITIAL_STORE_CONFIG);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const lastToastRef = useRef<{ title: string; time: number } | null>(null);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const loaded = loadInitialState();
      setRubros(loaded.rubros);
      setSubrubros(loaded.subrubros);
      setMarcas(loaded.marcas);
      setProductos(loaded.productos);
      setDescuentos(loaded.descuentos);
      setPedidos(loaded.pedidos);
      setClientes(loaded.clientes);
      setConsultas(loaded.consultas);
      setSyncLogs(loaded.syncLogs);
      setStoreConfig(loaded.storeConfig);
      setIsHydrated(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          rubros,
          subrubros,
          marcas,
          productos,
          descuentos,
          pedidos,
          clientes,
          consultas,
          syncLogs,
          storeConfig,
        }),
      );
    } catch {
      // Ignorar errores de cuota de almacenamiento
    }
  }, [
    isHydrated,
    rubros,
    subrubros,
    marcas,
    productos,
    descuentos,
    pedidos,
    clientes,
    consultas,
    syncLogs,
    storeConfig,
  ]);

  const showToast = useCallback(
    (title: string, type: "success" | "info" | "warning" = "success", onUndo?: () => void) => {
      const now = Date.now();
      if (
        lastToastRef.current &&
        lastToastRef.current.title === title &&
        now - lastToastRef.current.time < 600
      ) {
        return;
      }
      lastToastRef.current = { title, time: now };

      const id = `${now}-${Math.random()}`;
      setToasts((prev) => {
        if (prev.some((t) => t.title === title)) return prev;
        return [...prev, { id, title, type, onUndo }];
      });
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    [],
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Rubros ---
  const saveRubro = async (
    data: Omit<AdminRubro, "id" | "slug" | "cantidadProductos"> & { id?: string },
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const slug = slugify(data.nombre);

    if (data.id) {
      setRubros((prev) =>
        prev.map((r) =>
          r.id === data.id
            ? {
                ...r,
                nombre: data.nombre.trim(),
                slug,
                descripcion: data.descripcion?.trim() || "",
                activo: data.activo,
              }
            : r,
        ),
      );
      showToast("Rubro guardado");
    } else {
      const newRubro: AdminRubro = {
        id: `rub-${Date.now()}`,
        nombre: data.nombre.trim(),
        slug,
        descripcion: data.descripcion?.trim() || "",
        orden: rubros.length + 1,
        activo: data.activo,
        cantidadProductos: 0,
      };
      setRubros((prev) => [...prev, newRubro]);
      showToast("Rubro creado");
    }
  };

  const toggleRubroStatus = (id: string) => {
    const target = rubros.find((r) => r.id === id);
    if (!target) return;
    const nextState = !target.activo;
    setRubros((prev) => prev.map((r) => (r.id === id ? { ...r, activo: nextState } : r)));
    showToast(
      nextState ? `Rubro "${target.nombre}" visible` : `Rubro "${target.nombre}" oculto`,
      "info",
    );
  };

  const deleteRubro = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const previousRubros = [...rubros];
    const previousSubrubros = [...subrubros];
    const target = rubros.find((r) => r.id === id);
    setRubros((prev) => prev.filter((r) => r.id !== id));
    setSubrubros((prev) => prev.filter((s) => s.rubroId !== id));
    showToast(target ? `Rubro "${target.nombre}" eliminado` : "Rubro eliminado", "warning", () => {
      setRubros(previousRubros);
      setSubrubros(previousSubrubros);
    });
  };

  // --- Subrubros ---
  const saveSubrubro = async (
    data: Omit<AdminSubrubro, "id" | "slug" | "cantidadProductos"> & { id?: string },
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const slug = slugify(data.nombre);

    if (data.id) {
      setSubrubros((prev) =>
        prev.map((s) =>
          s.id === data.id
            ? {
                ...s,
                rubroId: data.rubroId,
                nombre: data.nombre.trim(),
                slug,
                descripcion: data.descripcion?.trim() || "",
                activo: data.activo,
              }
            : s,
        ),
      );
      showToast("Subrubro guardado");
    } else {
      const newSubrubro: AdminSubrubro = {
        id: `sub-${Date.now()}`,
        rubroId: data.rubroId,
        nombre: data.nombre.trim(),
        slug,
        descripcion: data.descripcion?.trim() || "",
        orden: subrubros.length + 1,
        activo: data.activo,
        cantidadProductos: 0,
      };
      setSubrubros((prev) => [...prev, newSubrubro]);
      showToast("Subrubro creado");
    }
  };

  const toggleSubrubroStatus = (id: string) => {
    const target = subrubros.find((s) => s.id === id);
    if (!target) return;
    const nextState = !target.activo;
    setSubrubros((prev) => prev.map((s) => (s.id === id ? { ...s, activo: nextState } : s)));
    showToast(
      nextState ? `Subrubro "${target.nombre}" visible` : `Subrubro "${target.nombre}" oculto`,
      "info",
    );
  };

  const deleteSubrubro = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const previousSubrubros = [...subrubros];
    const target = subrubros.find((s) => s.id === id);
    setSubrubros((prev) => prev.filter((s) => s.id !== id));
    showToast(
      target ? `Subrubro "${target.nombre}" eliminado` : "Subrubro eliminado",
      "warning",
      () => setSubrubros(previousSubrubros),
    );
  };

  // --- Marcas ---
  const saveMarca = async (
    data: Omit<AdminMarca, "id" | "slug" | "cantidadProductos"> & { id?: string },
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const slug = slugify(data.nombre);

    if (data.id) {
      setMarcas((prev) =>
        prev.map((m) =>
          m.id === data.id
            ? {
                ...m,
                nombre: data.nombre.trim(),
                slug,
                logoUrl: data.logoUrl?.trim() || "",
                activo: data.activo,
              }
            : m,
        ),
      );
      showToast("Marca guardada");
    } else {
      const newMarca: AdminMarca = {
        id: `mar-${Date.now()}`,
        nombre: data.nombre.trim(),
        slug,
        logoUrl: data.logoUrl?.trim() || "",
        activo: data.activo,
        cantidadProductos: 0,
      };
      setMarcas((prev) => [newMarca, ...prev]);
      showToast("Marca creada");
    }
  };

  const toggleMarcaStatus = (id: string) => {
    const target = marcas.find((m) => m.id === id);
    if (!target) return;
    const nextState = !target.activo;
    setMarcas((prev) => prev.map((m) => (m.id === id ? { ...m, activo: nextState } : m)));
  };

  const deleteMarca = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const previousMarcas = [...marcas];
    const target = marcas.find((m) => m.id === id);
    setMarcas((prev) => prev.filter((m) => m.id !== id));
    showToast(target ? `Marca "${target.nombre}" eliminada` : "Marca eliminada", "warning", () =>
      setMarcas(previousMarcas),
    );
  };

  // --- Productos ---
  const saveProducto = async (
    data: Omit<AdminProduct, "id" | "ventas30d" | "consultas30d"> & { id?: string },
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const hasValidPrice = Number(data.precioSistema) > 0;
    const finalActivo = hasValidPrice ? data.activo : false;
    const normalizedStock = data.esSuelto ? 0 : Math.max(0, Number(data.stock) || 0);

    if (data.id) {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === data.id
            ? {
                ...p,
                ...data,
                stock: normalizedStock,
                stockSinDato: data.esSuelto ? false : data.stockSinDato,
                activo: finalActivo,
                id: p.id,
                ventas30d: p.ventas30d,
                consultas30d: p.consultas30d,
              }
            : p,
        ),
      );
      showToast(
        hasValidPrice
          ? "Producto guardado"
          : "Producto guardado como oculto porque no tiene precio válido",
        hasValidPrice ? "success" : "warning",
      );
    } else {
      const newProd: AdminProduct = {
        ...data,
        stock: normalizedStock,
        stockSinDato: false,
        activo: finalActivo,
        id: `prod-${Date.now()}`,
        ventas30d: 0,
        consultas30d: 0,
      };
      setProductos((prev) => [newProd, ...prev]);
      showToast(
        hasValidPrice ? "Producto creado" : "Producto guardado como oculto hasta que tenga precio",
        hasValidPrice ? "success" : "warning",
      );
    }
  };

  const deleteProducto = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const previous = [...productos];
    const target = productos.find((p) => p.id === id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
    showToast(
      target ? `Producto "${target.nombre}" eliminado` : "Producto eliminado",
      "warning",
      () => setProductos(previous),
    );
  };

  const markProductsAsSuelto = (productIds: string[]) => {
    if (productIds.length === 0) return;
    setProductos((prev) =>
      prev.map((p) =>
        productIds.includes(p.id) ? { ...p, esSuelto: true, stock: 0, stockSinDato: false } : p,
      ),
    );
    showToast(
      productIds.length === 1
        ? "Producto marcado como suelto"
        : `${productIds.length} productos marcados como sueltos`,
    );
  };

  const resolveDuplicateSync = (productId: string, action: "vincular" | "separar") => {
    setProductos((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        if (action === "vincular") {
          return {
            ...p,
            sincronizado: true,
            sku: p.posibleDuplicadoSku || p.sku,
            posibleDuplicadoSku: undefined,
          };
        }
        return { ...p, posibleDuplicadoSku: undefined };
      }),
    );
    showToast(
      action === "vincular"
        ? "Producto vinculado con el sistema del local"
        : "Los productos se mantendrán separados",
    );
  };

  // --- Descuentos ---
  const saveDescuento = async (data: Omit<AdminDiscount, "id"> & { id?: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (data.id) {
      setDescuentos((prev) => prev.map((d) => (d.id === data.id ? { ...data, id: data.id } : d)));
      showToast("Descuento guardado");
    } else {
      setDescuentos((prev) => [{ ...data, id: `desc-${Date.now()}` }, ...prev]);
      showToast("Descuento creado");
    }
  };

  const toggleDescuentoStatus = (id: string) => {
    setDescuentos((prev) => prev.map((d) => (d.id === id ? { ...d, activo: !d.activo } : d)));
    showToast("Estado del descuento actualizado", "info");
  };

  const deleteDescuento = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const previous = [...descuentos];
    setDescuentos((prev) => prev.filter((d) => d.id !== id));
    showToast("Descuento eliminado", "warning", () => setDescuentos(previous));
  };

  // --- Pedidos y Consultas ---
  const updatePedidoStatus = (id: string, estado: OrderStatus) => {
    setPedidos((prev) => prev.map((o) => (o.id === id ? { ...o, estado } : o)));
    showToast(`Estado del pedido actualizado a "${estado}"`);
  };

  const updatePedidoPagoStatus = (id: string, pagoEstado: PaymentStatus) => {
    setPedidos((prev) => prev.map((o) => (o.id === id ? { ...o, pagoEstado } : o)));
    showToast(`Pago marcado como "${pagoEstado}"`);
  };

  const updatePedidoAdjustment = (
    id: string,
    items: AdminOrderItem[],
    notaAjusteInterno: string,
  ) => {
    setPedidos((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const nuevoSubtotal = items.reduce(
          (acc, item) => acc + item.cantidad * item.precioUnitario,
          0,
        );
        const nuevoDescuentoProd = items.reduce(
          (acc, item) => acc + (item.descuentoAplicado || 0),
          0,
        );
        const nuevoTotal = Math.max(0, nuevoSubtotal - nuevoDescuentoProd - o.descuentoCarrito);
        return {
          ...o,
          items,
          subtotal: nuevoSubtotal,
          descuentoProductos: nuevoDescuentoProd,
          total: nuevoTotal,
          notaAjusteInterno,
        };
      }),
    );
    showToast("Pedido actualizado correctamente");
  };

  const toggleConsultaRespondida = (id: string) => {
    setConsultas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, respondida: !c.respondida } : c)),
    );
    showToast("Estado de la consulta actualizado", "info");
  };

  // --- Sincronización ---
  const runSyncNow = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const formattedDate = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(
      now.getHours(),
    )}:${pad(now.getMinutes())}`;

    const sinStockValido = productos.filter((p) => !p.esSuelto && p.stockSinDato);
    const avisosProductos: AdminSyncNotice[] = sinStockValido.map((p) => ({
      productId: p.id,
      productName: p.nombre,
      mensaje: "Llegó sin stock válido (nulo o negativo).",
    }));

    const newLog: AdminSyncLog = {
      id: `sync-${Date.now()}`,
      fecha: formattedDate,
      resultado: avisosProductos.length > 0 ? "Con avisos" : "Completada",
      nuevos: 0,
      actualizados: productos.length,
      conAviso: avisosProductos.length,
      detalleAviso:
        avisosProductos.length > 0
          ? `${avisosProductos.length} ${
              avisosProductos.length === 1
                ? "producto llegó sin stock válido."
                : "productos llegaron sin stock válido."
            }`
          : undefined,
      avisosProductos,
    };

    setSyncLogs((prev) => [newLog, ...prev].slice(0, 20));
    setIsSyncing(false);
    showToast("Sincronización completada correctamente");
  };

  // --- Configuración ---
  const saveStoreConfig = async (config: AdminStoreConfig) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    setStoreConfig(config);
    showToast("Cambios guardados");
  };

  return (
    <AdminCatalogContext.Provider
      value={{
        rubros,
        subrubros,
        marcas,
        productos,
        descuentos,
        pedidos,
        clientes,
        consultas,
        syncLogs,
        isSyncing,
        storeConfig,
        saveRubro,
        toggleRubroStatus,
        deleteRubro,
        saveSubrubro,
        toggleSubrubroStatus,
        deleteSubrubro,
        saveMarca,
        toggleMarcaStatus,
        deleteMarca,
        saveProducto,
        deleteProducto,
        markProductsAsSuelto,
        resolveDuplicateSync,
        saveDescuento,
        toggleDescuentoStatus,
        deleteDescuento,
        updatePedidoStatus,
        updatePedidoPagoStatus,
        updatePedidoAdjustment,
        toggleConsultaRespondida,
        runSyncNow,
        saveStoreConfig,
        showToast,
      }}
    >
      {children}

      {/* Notificaciones breves con opción de Deshacer */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-[#0f172a] text-white border border-slate-800 shadow-sm"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === "success" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {toast.type === "info" && <Info className="w-4 h-4 text-[#06b6d4] shrink-0" />}
              {toast.type === "warning" && (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className="text-sm font-medium leading-snug">{toast.title}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {toast.onUndo && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onUndo?.();
                    dismissToast(toast.id);
                  }}
                  className="text-xs font-semibold text-[#22d3ee] hover:underline px-1.5 py-0.5"
                >
                  Deshacer
                </button>
              )}
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminCatalogContext.Provider>
  );
}

export function useAdminCatalog() {
  const ctx = useContext(AdminCatalogContext);
  if (!ctx) {
    throw new Error("useAdminCatalog debe utilizarse dentro de AdminCatalogProvider");
  }
  return ctx;
}

// ============================================================================
// Componentes del Sistema de Diseño Administrativo (Sobrios, radio máx 8px)
// ============================================================================

export function AdminPageHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-5 mb-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#0f172a] tracking-tight">{title}</h1>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export function AdminTabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="border-b border-slate-200 mb-6 overflow-x-auto overflow-y-hidden no-scrollbar">
      <nav className="flex items-center gap-6" aria-label="Pestañas de sección">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`py-3 px-1 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "border-[#0f172a] text-[#0f172a] font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/**
 * Devuelve el estado calculado de un descuento: Vigente, Programado, Vencido u Oculto.
 */
export function getDiscountStatus(
  discount: AdminDiscount,
): "Vigente" | "Programado" | "Vencido" | "Oculto" {
  if (!discount.activo) return "Oculto";
  const today = new Date().toISOString().slice(0, 10);
  if (discount.fechaInicio && discount.fechaInicio > today) return "Programado";
  if (discount.fechaFin && discount.fechaFin < today) return "Vencido";
  return "Vigente";
}

/**
 * Busca si un producto tiene algún descuento vigente aplicado (directo o por rubro).
 */
export function getProductActiveDiscount(
  product: Pick<AdminProduct, "id" | "rubroId" | "precioSistema">,
  descuentos: AdminDiscount[],
): { discount: AdminDiscount; finalPrice: number } | null {
  const vigentes = descuentos.filter((d) => getDiscountStatus(d) === "Vigente");
  const directo = vigentes.find((d) => d.aplicaA === "PRODUCTO" && d.targetId === product.id);
  const porRubro = vigentes.find((d) => d.aplicaA === "RUBRO" && d.targetId === product.rubroId);
  const chosen = directo || porRubro;
  if (!chosen) return null;

  const finalPrice =
    chosen.tipo === "PORCENTAJE"
      ? Math.max(0, Math.round(product.precioSistema * (1 - chosen.valor / 100)))
      : Math.max(0, chosen.valor);

  return { discount: chosen, finalPrice };
}

/**
 * Formatea una fecha ISO (YYYY-MM-DD) o texto a formato día/mes/año (dd/mm/yyyy).
 */
export function formatDateAR(value: string): string {
  if (!value) return "";
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }
  return value;
}

/**
 * Miniatura de producto con marcador neutro cuando falta foto o falla la carga.
 */
export function ProductThumbnail({
  src,
  alt,
  size = "md",
}: {
  src?: string;
  alt: string;
  size?: "sm" | "md";
}) {
  const [hasError, setHasError] = useState(false);
  const dim = size === "sm" ? "w-10 h-10" : "w-11 h-11";

  return (
    <div
      className={`${dim} rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0`}
    >
      {src && !hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <Package className="w-4 h-4 text-slate-400" />
      )}
    </div>
  );
}

/**
 * Etiqueta uniforme para el estado de un pedido en listado, detalle e historial.
 */
export function OrderStatusBadge({ status }: { status: string }) {
  if (status === "Entregado") {
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        Entregado
      </span>
    );
  }
  if (status === "Nuevo" || status === "Pendiente") {
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
        {status}
      </span>
    );
  }
  if (
    status === "En preparación" ||
    status === "Confirmado" ||
    status === "Listo para retirar o enviar"
  ) {
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
        {status}
      </span>
    );
  }
  if (status === "Cancelado") {
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        Cancelado
      </span>
    );
  }
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {status}
    </span>
  );
}

/**
 * Área de texto que crece automáticamente según el contenido para evitar texto cortado.
 */
export function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  rows = 2,
  className = "",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={rows}
      value={value}
      onChange={(e) => {
        const el = e.currentTarget;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
        onChange(e);
      }}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:border-[#0f172a] outline-none resize-none overflow-hidden ${className}`}
    />
  );
}

export function AdminToggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div>
          {label && <div className="text-sm font-medium text-slate-900">{label}</div>}
          {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 focus:outline-none ${
          checked ? "bg-[#0f172a]" : "bg-slate-300"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white transition duration-150 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

/**
 * Etiqueta de estado no redundante: solo se muestra cuando algo está oculto.
 */
export function StatusBadge({ active }: { active: boolean }) {
  if (active) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      Oculto
    </span>
  );
}

export function AdminDrawer({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-slate-200 flex flex-col justify-between">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  warningText,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  warningText?: string;
  isDeleting?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/40" aria-hidden="true" />
      <div className="relative bg-white rounded-lg border border-slate-200 max-w-md w-full p-6 z-10">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 mt-2">
          ¿Seguro que querés eliminar{" "}
          <span className="font-semibold text-slate-900">&ldquo;{itemName}&rdquo;</span>?
        </p>
        {warningText && (
          <div className="mt-3 p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            {warningText}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
