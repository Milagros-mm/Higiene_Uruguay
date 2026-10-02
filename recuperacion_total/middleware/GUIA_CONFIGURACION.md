# Guía de Configuración - Middleware Apollo a E-commerce

Esta guía detalla cómo configurar la conexión entre el sistema local Apollo GesCom y la base de datos web.

## Requisitos
1. Node.js instalado.
2. Acceso a la base de datos MySQL local (`agc_sql_datosges`).
3. Credenciales de la base de datos de producción (Supabase / Prisma).

## Pasos de Instalación
1. Abrir la terminal en esta carpeta (`middleware`).
2. Ejecutar `npm install` para descargar las dependencias.
3. Crear un archivo `.env` en la raíz de tu proyecto basándote en la configuración necesaria para conectarse a MySQL y PostgreSQL.
4. Ejecutar el script usando el archivo `start.bat` o el comando `npm run sync`.