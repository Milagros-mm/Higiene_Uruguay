import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';

// 1. Inicializar cliente de Prisma (PostgreSQL / Supabase)
const prisma = new PrismaClient();

// 2. Configuración de conexión a Apollo GesCom (MySQL Local)
const MYSQL_CONFIG = {
  host: process.env.STORE_DB_HOST || 'localhost',
  port: parseInt(process.env.STORE_DB_PORT || '3306', 10),
  user: process.env.STORE_DB_USER || 'agc_guest',
  password: process.env.STORE_DB_PASSWORD || 'guest',
  database: process.env.STORE_DB_NAME || 'agc_sql_datosges',
};

/**
 * Función auxiliar para crear URLs amigables (slugs)
 * Ej: "ALCOHOL EN GEL 250CC" -> "alcohol-en-gel-250cc"
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Elimina tildes y acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '') // Borra caracteres especiales
    .replace(/\s+/g, '-') // Reemplaza espacios por guiones
    .replace(/-+/g, '-'); // Evita guiones múltiples
}

async function syncApolloToEcommerce() {
  console.log('🔄 Iniciando sincronización desde Apollo GesCom...');
  let mysqlConn: mysql.Connection | null = null;

  try {
    // Conectar a MySQL
    mysqlConn = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Conectado a la base de datos local (MySQL).');

    // Extraer productos activos
    // Excluimos aquellos con ADESACT = 1 (desactivados) o ANOVENTA = 1
    const query = `
      SELECT 
        TRIM(ACOD) as sku, 
        TRIM(ADES) as name, 
        TRIM(ASHORTDES) as shortDesc, 
        AVENTA as price, 
        AEXIS as stock,
        TRIM(ABARRA) as barcode,
        TRIM(ARUB) as rubroCode,
        TRIM(AMAR) as marcaCode
      FROM Stock_Articulo
      WHERE ADESACT = 0 
        AND ANOVENTA = 0 
        AND TRIM(ACOD) != '' 
        AND TRIM(ADES) != ''
    `;

    console.log('📥 Obteniendo artículos desde MySQL...');
    const [rows] = await mysqlConn.execute(query);
    const articles = rows as any[];
    console.log(`📦 Se encontraron ${articles.length} artículos activos para sincronizar.`);

    let createdCount = 0;
    let updatedCount = 0;

    // Procesar e insertar/actualizar en PostgreSQL
    for (const article of articles) {
      // 1. Limpieza básica de datos
      const sku = article.sku;
      const name = article.name;
      const price = parseFloat(article.price) || 0;
      
      // Control de stock: Si es negativo, lo ponemos en 0. 
      // (Más adelante podemos usar 'trackStock = false' para productos a granel)
      const rawStock = parseFloat(article.stock) || 0;
      const stock = Math.max(0, Math.floor(rawStock)); 

      // Generar slug único combinando el nombre limpio y el SKU para evitar duplicados
      const slug = `${slugify(name)}-${sku}`;

      // 2. Operación UPSERT en Prisma
      // Upsert significa: Update (si existe) o Insert (si no existe)
      const upsertedProduct = await prisma.product.upsert({
        where: { sku: sku },
        update: {
          name: name,
          price: price,
          stock: stock,
          barcode: article.barcode || null,
        },
        create: {
          name: name,
          slug: slug,
          price: price,
          sku: sku,
          stock: stock,
          barcode: article.barcode || null,
          description: article.shortDesc || null,
          isActive: true,
          trackStock: false,
        },
      });

      if (upsertedProduct.createdAt.getTime() === upsertedProduct.updatedAt.getTime()) {
        createdCount++;
      } else {
        updatedCount++;
      }
    }

    console.log('✅ Sincronización finalizada con éxito.');
    console.log(`📊 Resultados: ${createdCount} creados, ${updatedCount} actualizados.`);

  } catch (error) {
    console.error('❌ Error durante la sincronización:', error);
  } finally {
    if (mysqlConn) {
      await mysqlConn.end();
    }
    await prisma.$disconnect();
  }
}

// Ejecutar el script
syncApolloToEcommerce();