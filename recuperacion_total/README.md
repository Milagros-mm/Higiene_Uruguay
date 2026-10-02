# E-Commerce Higiene Uruguay

Proyecto de Práctica Supervisada. Plataforma de e-commerce de insumos de higiene con entrega a domicilio.

## Tecnologías Principales (Fase 1 - MVP)

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4 + UI Premium (Glassmorphism, animaciones fluidas)
- **Base de Datos & ORM**: PostgreSQL + Prisma
- **Autenticación**: Auth.js (NextAuth)

## Estructura del Proyecto

- `app/`: Rutas, Layouts, Pages y API handlers (Next.js App Router).
- `components/`: Componentes de UI modulares y reutilizables (`ui/`, `layout/`, `product/`).
- `lib/`: Utilidades, servicios, validaciones y repositorios (`actions/`, `services/`, `utils/`, etc.).
- `prisma/`: Esquema de la base de datos y migraciones.
- `scripts/`: Scripts de utilidad (ej. `seed.ts` para carga inicial desde Excel).
- `types/`: Definiciones de tipos globales.

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