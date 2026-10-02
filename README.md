# E-Commerce Higiene Uruguay

Proyecto de Práctica Supervisada. Plataforma de e-commerce de insumos de higiene con entrega a domicilio.

## Tecnologías Principales (Fase 1 - MVP)

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4 + UI Premium (Glassmorphism, animaciones fluidas)
- **Base de Datos & ORM**: PostgreSQL + Prisma
- **Autenticación**: Auth.js (NextAuth)

## Estructura del Proyecto

El código se encuentra organizado de forma modular y auto-explicativa en carpetas de propósito único:

- `frontend/`: Componentes de interfaz de usuario (`components/ui`, `layout`, `home`, `product`), datos de demostración (`mock/`), estilos globales (`styles/`), tipos de vista (`types/`) y funciones utilitarias (`utils/`).
- `backend/`: Capa de servidor y datos: cliente y esquemas Prisma (`db/`, `prisma/`), autenticación Auth.js (`auth/`), servicios de negocio (`services/`), acceso a datos (`repositories/`) y esquemas de validación Zod (`validations/`).
- `middleware/`: Capa de integración y sincronización con el sistema de gestión local de Higiene Uruguay. Aloja los archivos de datos (`data/`), parsers de Excel (`parsers/`) y scripts de sincronización/seed (`scripts/`).
- `docs/`: Documentación académica y de negocio del proyecto (Plan de Trabajo y Propuesta de Proyecto).
- `app/`: Enrutador mínimo de Next.js App Router (Layouts, Páginas y API handlers).
- `public/`: Recursos estáticos (Logotipos de la tienda, banners de ambientación y logos de marcas).

## Configuración y Ejecución Local

1. Instalar dependencias:
   ```bash
   pnpm install
   ```

2. Configurar variables de entorno:
   Copiar o editar el archivo `.env` en la raíz y configurar la conexión a la base de datos PostgreSQL (`DATABASE_URL`) y el secreto de autenticación (`AUTH_SECRET`).

3. Migrar base de datos:
   ```bash
   pnpm dlx prisma migrate dev
   ```

4. Ejecutar el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

El servidor estará disponible en [http://localhost:3000](http://localhost:3000).

## Carga Inicial de Datos (Semilla)

Para cargar los productos desde el archivo Excel definitivo, utiliza el comando:
```bash
pnpm db:seed
```
*(Nota: El script definitivo de lectura de Excel está pendiente de la recepción del archivo único).*
