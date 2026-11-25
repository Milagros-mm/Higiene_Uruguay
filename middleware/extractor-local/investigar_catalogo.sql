-- ====================================================================
-- INVESTIGACIÓN DE CATÁLOGO: RUBROS, SUBRUBROS Y MARCAS
-- ====================================================================

-- 1. Permisos del usuario actual (verificar si 'agc_guest' tiene acceso a rubros y marcas)
SHOW GRANTS FOR CURRENT_USER();

-- 2. Tablas relacionadas en la base de datos
SELECT TABLE_NAME, TABLE_ROWS 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE()
  AND (TABLE_NAME LIKE '%rub%' 
    OR TABLE_NAME LIKE '%mar%' 
    OR TABLE_NAME LIKE '%sub%' 
    OR TABLE_NAME LIKE '%art%')
ORDER BY TABLE_NAME;

-- 3. Inspección de tablas maestras
-- Rubros (Categorías principales)
SELECT * FROM Stock_Rubros ORDER BY RCod LIMIT 20;

-- Subrubros (Subcategorías)
SELECT * FROM Stock_SubRubro ORDER BY SCod LIMIT 20;

-- Marcas
SELECT * FROM Stock_Marcas ORDER BY MCod LIMIT 20;

-- 4. Estadísticas en Stock_Articulo (cuántos productos tienen código asignado)
SELECT 
  COUNT(*) AS TotalArticulos,
  SUM(CASE WHEN ARub IS NOT NULL AND TRIM(ARub) != '' THEN 1 ELSE 0 END) AS ConRubro,
  SUM(CASE WHEN ASub IS NOT NULL AND TRIM(ASub) != '' THEN 1 ELSE 0 END) AS ConSubrubro,
  SUM(CASE WHEN AMar IS NOT NULL AND TRIM(AMar) != '' THEN 1 ELSE 0 END) AS ConMarca
FROM Stock_Articulo;

-- 5. Consulta de cruce (Artículos con nombres de Rubro, Subrubro y Marca)
SELECT 
  sa.ACod AS Sku,
  sa.ADes AS Producto,
  sa.ARub AS CodigoRubro,
  sr.RDes AS NombreRubro,
  sa.ASub AS CodigoSubrubro,
  ss.SDes AS NombreSubrubro,
  sa.AMar AS CodigoMarca,
  sm.MDes AS NombreMarca,
  sa.AExis AS Stock,
  sa.AVenta AS PrecioBase,
  CASE WHEN (sa.ANOVENTA = 1 OR sa.ADESACT = 1) THEN 0 ELSE 1 END AS EstaActivo
FROM Stock_Articulo sa
LEFT JOIN Stock_Rubros sr ON sa.ARub = sr.RCod
LEFT JOIN Stock_SubRubro ss ON sa.ASub = ss.SCod
LEFT JOIN Stock_Marcas sm ON sa.AMar = sm.MCod
WHERE (sa.ARub IS NOT NULL AND TRIM(sa.ARub) != '') 
   OR (sa.AMar IS NOT NULL AND TRIM(sa.AMar) != '')
ORDER BY sa.KeyID ASC
LIMIT 30;
