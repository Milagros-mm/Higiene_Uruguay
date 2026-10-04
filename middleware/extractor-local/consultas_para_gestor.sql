-- ====================================================================
-- EXPLORACIÓN DE BASE DE DATOS LOCAL - HIGIENE URUGUAY
-- Base de datos: agc_sql_datosges
-- Usuario: agc_guest
-- ====================================================================

-- 1. VER TODAS LAS TABLAS DISPONIBLES EN LA BASE DE DATOS
SHOW TABLES;

-- 2. VER SI EXISTEN TABLAS RELACIONADAS A RUBROS, PRECIOS O STOCK
SHOW TABLES LIKE '%articulo%';
SHOW TABLES LIKE '%stock%';
SHOW TABLES LIKE '%precio%';
SHOW TABLES LIKE '%rubro%';
SHOW TABLES LIKE '%familia%';
SHOW TABLES LIKE '%categoria%';
SHOW TABLES LIKE '%marca%';

-- 3. VER LA CANTIDAD TOTAL DE ARTÍCULOS EN LA TIENDA
SELECT COUNT(*) AS total_articulos FROM Stock_Articulo;

-- 4. VER LA ESTRUCTURA COMPLETA DE LA TABLA Stock_Articulo (COLUMNAS Y TIPOS)
DESCRIBE Stock_Articulo;

-- 5. VER 10 ARTÍCULOS DE MUESTRA PARA REVISAR LOS DATOS REALES
SELECT * FROM Stock_Articulo LIMIT 10;
