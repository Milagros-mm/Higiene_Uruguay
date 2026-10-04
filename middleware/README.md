# Middleware de Sincronización

Este módulo se encarga de leer los datos de MySQL local (Apollo) y sincronizarlos con PostgreSQL en la nube.

- **`scripts/sync-apollo.ts`**: Script principal que hace el UPSERT de los productos.
- **`start.bat`**: Ejecutable de un clic para que el personal de la tienda lo pueda usar sin abrir la terminal.