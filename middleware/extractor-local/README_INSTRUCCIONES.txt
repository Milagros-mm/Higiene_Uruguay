========================================================================
  INSTRUCCIONES PARA EXPLORAR LA BASE DE DATOS EN LA MÁQUINA DEL LOCAL
========================================================================

Este paquete te permite extraer la estructura y una muestra de los productos
de la base de datos MySQL directamente desde la computadora del negocio.

------------------------------------------------------------------------
OPCIÓN 1: Ejecutar el script automático (La más rápida)
------------------------------------------------------------------------
1. Copiá esta carpeta "extractor-local" a un pendrive o descargala en la 
   máquina del local comercial.
2. Hacé DOBLE CLIC en el archivo:
   "ejecutar_exploracion.bat"
3. El script se conectará automáticamente con:
   - Usuario: agc_guest
   - Contraseña: guest
   - Base de Datos: agc_sql_datosges
4. Al finalizar, verás un mensaje de ÉXITO y se creará automáticamente
   un archivo llamado:
   "reporte_base_de_datos.txt"
5. Copiá ese archivo "reporte_base_de_datos.txt" a tu pendrive o envíatelo 
   por WhatsApp/Email. ¡Listo! Ahí tendremos todas las tablas y columnas.

------------------------------------------------------------------------
OPCIÓN 2: Si la máquina tiene un gestor visual (HeidiSQL / Workbench / DBeaver)
------------------------------------------------------------------------
1. Abrí el gestor de base de datos que usen en el local.
2. Conectate con:
   - Servidor / Host: localhost
   - Usuario: agc_guest
   - Contraseña: guest
   - Base de Datos: agc_sql_datosges
3. Abrí el archivo "consultas_para_gestor.sql" y ejecutá las consultas.
4. Exportá o copiá los resultados de la consulta "DESCRIBE Stock_Articulo;"
   y "SELECT * FROM Stock_Articulo LIMIT 10;".
