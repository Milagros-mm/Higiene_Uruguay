# Plan de Implementación: E-Commerce Higiene Uruguay

Este plan formaliza tu propuesta para inicializar el proyecto, con algunas correcciones y mejoras estratégicas para asegurar la calidad y escalabilidad.

## Resumen de Cambios sugeridos a tu plan:
1. **Modelo Product**: Se agregaron los campos opcionales `barcode1` y `barcode2` para dejar la estructura preparada para la decisión pendiente sobre los códigos de barra.
2. **Scripts de Seed**: Para ejecutar `tsx` con variables de entorno locales, utilizaremos el flag `--env-file=.env.local` nativo de Node.js, evitando instalar dependencias extra como `dotenv`.
3. **Estética y Diseño (Agregado)**: Según las directrices de calidad, agregué un paso (Paso 11) para configurar tokens de diseño premium en `globals.css` (colores, tipografía Inter, efectos de glassmorphism), ya que un MVP no debe verse "básico".
4. **TailwindCSS**: Confirmado su uso ya que lo solicitaste explícitamente en el comando de inicialización.

---

## Open Questions

> [!WARNING] 
> **Versión de TailwindCSS**: El comando `create-next-app` instalará por defecto Tailwind v3. ¿Estás de acuerdo con utilizar la versión 3 o prefieres forzar la versión 4 que es más reciente pero puede cambiar algunas configuraciones?
> 
> **Diseño**: ¿Tienes alguna paleta de colores de marca para "Higiene Uruguay" o prefieres que proponga una paleta moderna (ej. tonos azules limpios / dark mode elegante) para el MVP?

---

## Propuesta de Pasos de Ejecución

### Paso 1 — Inicializar proyecto Next.js 14+
Ejecutar `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm`.

### Paso 2 — Configurar Prettier
Instalar y configurar `prettier`, `eslint-config-prettier` y `eslint-plugin-prettier` con tus reglas preferidas en `.prettierrc`.

### Paso 3 — Instalar dependencias del stack
- Prisma & DB: `prisma`, `@prisma/client`
- Autenticación: `next-auth@beta`, `@auth/prisma-adapter`
- Utilidades: `zod`, `exceljs`, `clsx`, `tailwind-merge`, `lucide-react` (iconos)
- Desarrollo: `tsx`

### Paso 4 — Inicializar Prisma + Schema
Ejecutar `npx prisma init --datasource-provider postgresql`.
Crear el schema incluyendo:
- Modelos de Auth.js (`User`, `Account`, `Session`, `VerificationToken`).
- **Modelos de Negocio**: `Category`, `Product` (con `barcode1` y `barcode2` opcionales), `ProductImage`, `Coupon`, `BankAccount`, `Order`, `SiteConfig`.

### Paso 5 — Crear estructura completa de carpetas
Implementar la arquitectura N-Capas sugerida:
- `/app` (Rutas y vistas)
- `/lib/actions` (Server actions)
- `/lib/services` (Lógica de negocio)
- `/lib/repositories` (Acceso a datos y Prisma Singleton)
- `/lib/integrations` (Servicios externos como WhatsApp y Supabase Storage)
- `/lib/validations` (Esquemas Zod)
- `/components` (UI reutilizable, Layouts)

### Paso 6 — Variables de entorno
Crear plantillas `.env.local` y `.env.example` con las credenciales necesarias (PostgreSQL, Supabase, Auth.js).

### Paso 7 — Auth.js (NextAuth v5) básico
Configurar `route.ts` y `auth.ts` con el adaptador de Prisma y el proveedor de credenciales (para el administrador inicial).

### Paso 8 — Archivos semilla
Crear `scripts/seed-categories.ts` y `scripts/seed-products.ts` preparados para leer el Excel definitivo con `exceljs`.

### Paso 9 — Setup de Diseño y UI Premium
Configurar `globals.css` y `tailwind.config.ts` con una paleta de colores pulida, tipografía moderna (ej. Inter o Roboto), y utilidades para glassmorphism y micro-animaciones, asegurando que el catálogo se vea espectacular desde el día 1.

### Paso 10 — Documentación Inicial
Crear el `README.md` con las instrucciones de setup y las reglas de arquitectura.

---

## Verification Plan

### Automated Tests
- No se plantean pruebas unitarias automatizadas para la fase inicial del setup, pero se validará que el build de TypeScript y ESLint pasen sin errores (`npm run build` y `npm run lint`).

### Manual Verification
- Levantar el servidor local (`npm run dev`) y verificar que la página principal renderiza sin errores.
- Ejecutar una migración de prueba de Prisma (`npx prisma db push` sobre una DB local) para asegurar que el schema compila.
- Probar la ejecución de los scripts semilla (con un mock) para asegurar que compilan vía `tsx`.