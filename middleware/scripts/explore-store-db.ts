import mysql from 'mysql2/promise';

const MYSQL_CONFIG = {
  host: process.env.STORE_DB_HOST || 'localhost',
  port: parseInt(process.env.STORE_DB_PORT || '3306', 10),
  user: process.env.STORE_DB_USER || 'agc_guest',
  password: process.env.STORE_DB_PASSWORD || 'guest',
  database: process.env.STORE_DB_NAME || 'agc_sql_datosges',
};

async function exploreDatabase() {
  console.log('🔍 Iniciando exploración de la base de datos MySQL local...');
  let conn: mysql.Connection | null = null;

  try {
    conn = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Conectado exitosamente a agc_sql_datosges');

    // Explorar Tablas
    const [tables] = await conn.execute('SHOW TABLES');
    console.log('\n📋 Tablas encontradas:');
    console.log(tables);

    // Explorar estructura de Stock_Articulo
    console.log('\n📐 Estructura de Stock_Articulo:');
    const [columns] = await conn.execute('DESCRIBE Stock_Articulo');
    console.log(columns);

  } catch (error) {
    console.error('❌ Error explorando la base de datos:', error);
  } finally {
    if (conn) await conn.end();
  }
}

exploreDatabase();
